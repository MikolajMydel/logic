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
        console.log(this.state.inputs.length);
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
        const inputs = this.state.inputs;
        inputs[index] = this.props.readFocus();

        this.setState({'inputs': inputs});
    }

    render () {
        let value = this.getValue();

        if ( value === undefined ) value = "undefined";

        const style = gateClass[ this.props.gateType ];

        return (
            <div className={`${styles.LogicGate} ${style}`} >
                <button className={ styles.LogicGateInput } onClick={ () => this.changeInput(0) } ></button>
                <button className={ styles.LogicGateInput } onClick={ () => this.changeInput(1) }></button>
                <h5> { value.toString() } </h5>
                <button className={ styles.LogicGateOutput } onClick={ () => this.props.getFocus (this) }> </button>
            </div>
        )
    }
}

export default LogicGate;
