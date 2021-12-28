import React from "react";
import styles from "./LogicGate.module.scss";

class Pin extends React.Component {
    constructor( {...props} ) {
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

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin = () => {

        const newParent = this.props.getFocusedElement();
        newParent.connect(this);
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
        
    }

    searchForRecursion = () => {

        // BFS
        const childPins = [].concat (this.state.childPins);

        while (childPins.length !== 0){

            let newChildPins = [];
            let i = childPins.length - 1;

            while (i >= 0){

                if ( childPins[i].state.gate === this.state.gate ) return true;

                newChildPins.concat ( childPins.pop().childPins );
                i--;
            }

            childPins.concat ( newChildPins );
        }

        return false;

    }

    receiveSignal = (signal) => {

        this.setState({'value': signal}, function() { // setState() nie zmienia state
            // od razu więc resztę kodu dodaję do funkcji callback, inaczej state
            // pozostałby taki jak wcześniej
            if (this.pinType === 'input') {
                this.gate.processOutput();
            } else { // output
                for (let i = 0; i < this.state.childPins.length; i++) {

                    const childPin = this.state.childPins[i];

                    // wyjscie bramki logicznej stanowi jej wejscie
                    if ( this.gate === childPin.gate || this.searchForRecursion() ) {
                        // zapobiegniecie rekurencji
                        continue;
                    }

                    // tylko jezeli nie ma rekurencji
                    childPin.receiveSignal(signal);

                }
            }
        });
	}

    // przylaczanie innego pina jako dziecko
    connect = (target) => {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    render(){
        if (this.pinType === 'input')
            return <button className={ styles.LogicGateInput } onClick={ () => this.changeParentPin() } ></button>;
        // output
        return <button className={ styles.LogicGateOutput } onClick={ () => this.props.setFocusedElement(this) }> </button>;
    }
}

export default Pin;
