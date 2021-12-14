import React, { useState } from "react";
import styles from "./LogicGate.module.scss";

const gateClass = {
    'AND': styles.LogicGateAND,
    'OR': styles.LogicGateOR,
}
const basicFunctions = {
    "AND": (i) => (i[0] && i[1]),
    "OR":  (i) => (i[0] || i[1]),
    "NOT": (i) => !(i[0]),
}

class LogicGate extends React.Component {
    constructor( {...props} ) {
        super();
        this.gateType = basicFunctions[props.gateType];
        this.state = {
            inputs: new Array(props.inputs).fill(undefined), // pusta tabela (undefined) o podanej długości
        }
    }

    getValue = function () {
        let inputs = [];
        for (let i = 0; i < this.state.inputs.length; i++){
            let inp = this.state.inputs[i];

            // jezeli brakuje ktoregos inputa, nie da sie okreslic wyjscia (chyba ze OR)
            if (!inp) return undefined;
            inputs.push(inp.getValue());
        }
        let output = this.gateType(inputs);
        return output;
    }

    changeInput = ( index ) => {
        let inputs = this.state.inputs;
        inputs[index] = this.props.getFocusedElement();
        this.setState({'inputs': inputs});
    }

    render () {
        let value = this.getValue();
        if ( value === undefined ) value = "undefined";
        const style = gateClass[ this.props.gateType ];

        let inputFields = [];
        for (let i = 0; i < this.props.inputs; i++){
            inputFields.push((<button className={ styles.LogicGateInput } onClick={ () => this.changeInput(i) } ></button>));
        }
        // nie widać ale są
        // TODO trzeba coś ze stylami zmienić, żeby widać było wszystkie przyciski

        return (
            <div className={`LogicGate ${styles.LogicGate} ${style}`} >
                { inputFields }
                <h5> { value.toString() } </h5>
                <button className={ styles.LogicGateOutput } onClick={ () => this.props.setFocusedElement(this) }> </button>
            </div>
        )
    }
}

export default LogicGate;
