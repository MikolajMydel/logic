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

    disconnect() {
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {
        if (this.state.parentPin) this.state.parentPin.disconnect(this);
        newParent.connect(this);
        this.setState({'parentPin': newParent});

        this.props.drawWire ( newParent.ref, this.ref );

        this.receiveSignal(newParent.state.value);
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
        return <button ref={this.ref} className={ this.style.LogicGateInput } 
            onClick={ this.handleOnClick } ></button>;
    }
}

export default InputPin;
