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
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {

        if (this.state.parentPin){ 

        // usun polaczenie ze starym rodzicem
        this.props.removeWire(this.state.parentPin.state.ref, this.state.ref,

            // przekazuje rysowanie polaczenia jako callback, poniewaz w przeciwnym wypadku
            // zostalby powielony dawny stan (ze starym polaczeniem)
            () => this.props.drawWire ( newParent, this )
        );

        this.state.parentPin.disconnect(this);

        } else this.props.drawWire ( newParent, this );

        newParent.connect(this);
        this.setState({'parentPin': newParent});

        

        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        // najwyraźniej najlepszy sposób na zapobiegniecie zapętlania
        // omg
        if (signal === this.state.value) return;

        this.setState({'value': signal}, function() {
            this.gate.processOutput();
        });
	}

    render(){
        return (
            <button ref={this.state.ref} 
                className={ this.style.LogicGateInput } onMouseDown={ this.handleOnClick }>
            </button>
        )
    }
}

export default InputPin;
