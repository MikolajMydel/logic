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


        // w tablicy trzymamy tylko piny input
        // zwracamy falsz, gdy ktorys z pinow input wskaze aktualna bramke
        // BFS
        const inputPins = [].concat( this.state.childPins );

        while (inputPins.length !== 0){
            let newInputPins = [];

            let i = inputPins.length - 1;

            while (i > -1){
                if ( inputPins[i].gate === this.gate ){
                    console.log ("rec");
                    return true;
                }

                console.log ( inputPins[i].gate, this.gate );

                const outputPins = inputPins.pop().gate.outputs;

                // dodaj wszystkie input piny nalezace do nastepnych bramek
                for (let x = 0; x < outputPins.length; x++){
                    newInputPins.concat ( outputPins[x].childPins );
                }

                i--;
            }

            inputPins.concat( newInputPins );
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
                        console.log ("rec");
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
