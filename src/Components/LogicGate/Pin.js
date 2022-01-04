import React from "react";
import styles from "./LogicGate.module.scss";

class Pin extends React.Component {
    constructor(props) {
        super();
        if(props.pinType === 'output' || props.pinType === 'input') {
            this.index = props.index;
            this.pinType = props.pinType;
            this.gate = props.gate
            this.state = {
                parentPin: undefined, // w sumie to tylko dla input pinów
                childPins: [], // w sumie to tylko dla output pinów
                // mogłaby to być jedna zmienna

                value: undefined,
            }
        }
        props.mount(this.pinType, this, this.index); // dodaj siebie do tablicy pinów swojej bramki
    }

    handleOnClickInput = () => {
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
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() { // setState() nie zmienia state
            // od razu więc resztę kodu dodaję do funkcji callback, inaczej state
            // pozostałby taki jak wcześniej
            if (this.pinType === 'input') {
                this.gate.processOutput();
            } else { // output
                for (let i = 0; i < this.state.childPins.length; i++) {
                    this.state.childPins[i].receiveSignal(signal);
                }
            }
        });
	}

    // przylaczanie innego pina jako dziecko
    connect(target) {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    render(){
        if (this.pinType === 'input')
            return <button className={ styles.LogicGateInput } onClick={ this.handleOnClickInput } ></button>;
        // output
        return <button className={ styles.LogicGateOutput } onClick={ () => this.props.setFocusedElement(this) }> </button>;
    }
}

export default Pin;
