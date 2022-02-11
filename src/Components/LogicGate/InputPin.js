import React from "react";
import Pin from "./Pin";

class InputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            parentPin: undefined,
            value: undefined,

            ref: React.createRef(),

        }
    }

    handleOnClick = (e) => {
        if (e.button === 0) { // lewy
            const newParent = this.props.getFocusedElement();
            if (newParent)
                this.changeParentPin(newParent);
        } else if (e.button === 1) { // srodkowy
            this.disconnect();
        }
    }

    disconnect() {
        if (!this.state.parentPin) return;
        this.state.parentPin.disconnect(this);
        this.setState({
            'parentPin': undefined
        });
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {

        if (this.state.parentPin !== newParent) {

            if (this.state.parentPin) this.state.parentPin.disconnect(this);
            
            newParent.connect(this);
            this.setState({
                'parentPin': newParent
            });

            this.receiveSignal(newParent.state.value);
            this.props.drawWire(newParent, this);
        } 

    }

    receiveSignal(signal) {
        // najwyraźniej najlepszy sposób na zapobiegniecie zapętlania
        // omg
        if (signal === this.state.value) return;

        this.setState({
            'value': signal
        }, function () {
            this.gate.processOutput();
        });
    }

    render() {
        return ( <button ref = {
                this.state.ref
            }
            className = {
                this.style.LogicGateInput
            }
            onMouseDown = {
                this.handleOnClick
            } >

            </button>
        )
    }
}

export default InputPin;