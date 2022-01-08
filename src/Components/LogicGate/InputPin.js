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

    removeFromOldParent() {
        // musimy usunac pin z listy dzieci starego rodzica...
        const oldParent = this.state.parentPin;
        if (oldParent){
            const oldParentChildren = oldParent.state.childPins;
            const pinIndex = oldParentChildren.indexOf (this);

            // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
            let updatedOldParentChildren = [...oldParentChildren];
            updatedOldParentChildren.splice (pinIndex, 1);

            // ustawiamy nowa tablice dzieci jako stan starego rodzica
            oldParent.setState({"childPins": updatedOldParentChildren });
        }
    }

    disconnect() {
        this.removeFromOldParent();
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {
        if (newParent){
            newParent.connect(this);
            this.removeFromOldParent();
            this.setState({'parentPin': newParent});
            this.receiveSignal(newParent.state.value);
        }
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            // zmieniamy parent pin, wiec sprawdzamy czy wystepuje rekurencja
            if (this.gate.state.recursion) return;
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
