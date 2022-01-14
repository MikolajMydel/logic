import Pin from "./Pin";
import EndNode from "../Node/EndNode";

function checkForCycle(gate) {
    // algorytm DFS
    // https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph
    const gates = collectGates(gate);
    let visited  = new Array(gates.length);
    let recStack = new Array(gates.length);
    for(let i=0;i<gates.length;i++) {
        visited[i]  = false;
        recStack[i] = false;
    }

    for (let i = 0; i < gates.length; i++)
        if (DFSutil(i, visited, recStack, getChildGates(gates[i]))){
            return true;
        }
    return false;
}

function DFSutil(i, visited, recStack, children) {
// Mark the current node as visited and
    // part of recursion stack
    if (recStack[i])
        return true;

    if (visited[i])
        return false;

    visited[i] = true;
    recStack[i] = true;

    for (let c=0;c< children.length;c++)
        if (DFSutil(children, visited, recStack, children)){
            return true;
        }

    recStack[i] = false;

    return false;
}
function collectGates(gate) {
    let gates = [gate];
    const loop = (g) => {
        getChildGates(g).forEach((child) => {
            // bramka nie ma jeszcze na liście
            if(!gates.includes(child)) {
                gates.push(child);
                loop(child);
            }
        });
    }
    loop(gate);

    return gates;
}
function getChildGates(gate) {
    let childGates = [];
    for (let i = 0; i < gate.outputs.length; i++) {
        // dodaje wszystkie piny, ktore pobieraja sygnal z aktualnej bramki
        const childPins = gate.outputs[i].state.childPins;
        for (let j = 0; j < childPins.length; j++){
            // pomijamy EndNody
            if (childPins[j] instanceof EndNode) continue;
            childGates.push( childPins[j].gate );
        }
    }
    return childGates;
}
class InputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            parentPin: undefined,
            value: undefined,
        }
    }

    handleOnClick = () => {
        const newParent = this.props.getFocusedElement();
        if(newParent)
            this.changeParentPin(newParent);
    }

    disconnect() {
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {
        if (this.state.parentPin)
            this.state.parentPin.disconnect(this);
        newParent.connect(this);
        this.setState({'parentPin': newParent});
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            // sprawdzanie pętli wykonuje się dla każdej bramki, raczej
            // niepotrzebnie, ale jak próbuję to naprawić to się psuje :/
            if (this.gate.state.recursion) return;
            if (checkForCycle(this.gate)){
                this.gate.setState({"recursion": true},
                    () => setTimeout(
                        () => { this.gate.setState({"recursion": false})}, 500)
                );
            }
            this.gate.processOutput();
        });
	}

    render(){
        return <button className={ this.style.LogicGateInput } onClick={ this.handleOnClick } ></button>;
    }
}

export default InputPin;
