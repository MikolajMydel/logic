import React from "react";
import Pin from "./Pin";

class OutputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            childPins: [],
            value: undefined,

            ref: React.createRef(),

        }
    }

    // przylaczanie innego pina jako dziecko
    connect(target) {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    disconnect(target) {
        const oldChildren = this.state.childPins;
        const pinIndex = oldChildren.indexOf(target);

        // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
        let updatedChildren = [...oldChildren];
        updatedChildren.splice (pinIndex, 1);

        // ustawiamy nowa tablice dzieci jako stan
        this.setState({"childPins": updatedChildren });
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            for (let i = 0; i < this.state.childPins.length; i++) {
                this.state.childPins[i].receiveSignal(signal);
            }
        });
	}

    render(){
        return <button ref={ this.state.ref } className={ this.style.LogicGateOutput } 
            onClick={ () => this.props.setFocusedElement(this) }> </button>;
    }
}

export default OutputPin;
