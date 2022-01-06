import Pin from "./Pin";

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

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {
        // musimy usunac pin z listy dzieci starego rodzica...
        const oldParent = this.state.parentPin;
        // ... o ile ten istnial (nie jest undefined)
        if (oldParent){
            const oldParentChildren = oldParent.state.childPins;
            const pinIndex = oldParentChildren.indexOf (this);

            // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
            const updatedOldParentChildren = [...oldParentChildren];
            // usuwamy z niej aktualny pin
            updatedOldParentChildren.splice (pinIndex, 1);

            // ustawiamy nowa tablice dzieci jako stan starego rodzica
            oldParent.setState({"childPins": updatedOldParentChildren });

        }
        newParent.connect(this);
        this.setState({'parentPin': newParent});
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            if (this.gate.state.recursion) return;

            // zmieniamy parent pin, wiec sprawdzamy czy wystepuje rekurencja
            if (this.searchForRecursion()){
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
