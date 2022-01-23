import Pin from "./Pin";

class InputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            parentPin: undefined,
            value: false,
        }
    }

    handleOnClick = (e) => {
        if(e.button === 0) { // lewy
            const newParent = this.props.getFocusedElement();
            if(newParent)
                this.changeParentPin(newParent);
        } else if(e.button === 1) { // srodkowy
            this.disconnect();
        }
    }

    disconnect() {
        if(!this.state.parentPin) return;
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(false);
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
        return <button className={ this.style.LogicGateInput } onMouseDown={ this.handleOnClick } ></button>;
    }
}

export default InputPin;
