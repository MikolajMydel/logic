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

        if (this.state.parentPin){ 

        // usun polaczenie ze starym rodzicem
        this.props.removeWire(this.state.parentPin.state.ref, this.state.ref,

            // przekazuje rysowanie polaczenia jako callback, poniewaz w przeciwnym wypadku
            // zostalby powielony dawny stan (ze starym polaczeniem)
            () => this.props.drawWire ( newParent.state.ref, this.state.ref )
        );

        this.state.parentPin.disconnect(this);

        } else this.props.drawWire ( newParent, this );

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
        return <button ref={this.state.ref} className={ this.style.LogicGateInput } 
            onClick={ this.handleOnClick } ></button>;
    }
}

export default InputPin;
