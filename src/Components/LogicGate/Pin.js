import React from "react";
import styles from "./LogicGate.module.scss";
import StartingNode from "../StartingNode/StartingNode"

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
                recursion: undefined,
            }
        }
        props.mount(this.pinType, this, this.index); // dodaj siebie do tablicy pinów swojej bramki
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin = () => {

        const newParent = this.props.getFocusedElement();

        // StartingNode nigdy nie bedzie mialo rekurencji, ale nie ma
        // funkcji searchForRecursion
        if ( !(newParent instanceof StartingNode) &&
            newParent.searchForRecursion(this)) return;

        newParent.connect(this);
        this.setState({'parentPin': newParent});
        this.receiveSignal(newParent.state.value);

    }

    searchForRecursion = (childPin) => {

        const gates = [childPin.gate];

        while ( gates.length !== 0 ){
            const gate = gates.pop();

            // bramka bedaca inicjatorem funkcji powtarza sie - jest rekurencja
            if ( this.gate === gate ) return true;

            const gateOutputs = gate.outputs;

            // przechodzimy przez wszystkie wyjscia aktualnej bramki
            for (let i = 0; i < gateOutputs.length; i++){
                // kazdy output moze miec kilka child pinow
                // w tablicy child pins trzymamy piny typu input, nalezace do kolejnych bramek

                const childPins = gateOutputs[i].state.childPins;

                // dodaje bramke kazdego child pinu do tablicy
                for (let j = 0; j < childPins.length; j++){
                    gates.push( childPins[j].gate );
                }
            }

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
                    this.state.childPins[i].receiveSignal(signal);
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
