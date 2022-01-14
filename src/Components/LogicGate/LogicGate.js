import React from "react";
import OutputPin from "./OutputPin";
import InputPin from "./InputPin";
import styles from "./LogicGate.module.scss";

import {AND, OR} from './LogicalFunctions.js';

const gateClass = {
    'AND': styles.LogicGateAND,
    'OR': styles.LogicGateOR,
    'NOT': styles.LogicGateNOT,
}
const basicFunctions = {
    'AND': (i) => AND(i),
    'OR':  (i) => OR(i),
    'NOT': (i) => !(i[0]),
}

class LogicGate extends React.Component {
    constructor( {...props} ) {
        super();
        this.func = basicFunctions[props.gateType];
        this.state = {
            value: undefined, // tymczasowo
            recursion: false,

        }
        this.inputs = [];
        this.outputs = [];
    }

    // dzięki tej funkcji piny dodają się do tablicy pinów output lub input
    mountPin = (pin) => {
        if(pin instanceof InputPin){
            this.inputs[pin.index] = pin;
        } else if(pin instanceof OutputPin){
            this.outputs[pin.index] = pin;
        }
    }
    processOutput() {
        /*
            nawet jezeli brakuje ktoregos inputa, to w przypadku bramek AND i OR mozna okreslic wyjscie na podstawie
            jednej wartosci (np. AND na pewno bedzie falszywe jezeli jedno wejscie jest falszywe lub OR na pewno jest
            prawdziwe jezeli chociaz jedna wartosc jest prawdziwa )

            Dzieki temu mozna robic uklady zapamietujace stan
        */

        let inputs = Array.from(
            this.inputs.map ( (input) => input.state.value )
        );

        // na razie używamy tylko bramek z jednym outputem więc whatever
        let output = this.func(inputs);
        this.outputs[0].receiveSignal(output);
        this.setState({value: output});
    }

    render () {
        // na razie używamy wartości logicznej bramki, żeby ułatwić sprawdzanie czy działają ( i tak korzystamy tylko z bramek 1-outputowych ), później powinny mieć po prostu nazwy danej bramki
        let value = this.state.value;
        if(value === undefined) value = "undefined"
        const style = gateClass[ this.props.gateType ];

        let inputFields = [];
        for (let i = 0; i < this.props.inputs; i++){
            inputFields.push((
                <InputPin
                    index={ i }
                    gate={ this }
                    getFocusedElement={ this.props.getFocusedElement }
                    mount={ this.mountPin } />
            ));
        }
        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++){
            outputFields.push((
                <OutputPin
                    index={ i }
                    gate={ this }
                    getFocusedElement={ this.props.getFocusedElement }
                    setFocusedElement={ this.props.setFocusedElement }
                    mount={ this.mountPin } />
            ));
        }
        return (
            <div className={`LogicGate ${styles.LogicGate} ${style}`} >
                <div className={styles.LogicGateInputs}>
                    { inputFields }
                </div>
                <h5 className={styles.LogicGateValue}> { value.toString() } </h5>
                <div className={styles.LogicGateOutputs}>
                    { outputFields }
                </div>
            </div>
        ) // styl LogicGateOutputs jeszcze nie istnieje
    }
}

export default LogicGate;
