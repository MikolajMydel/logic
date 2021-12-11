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
    // TODO Bramki powinny móc mieć różną ilość inputów
    constructor( {...props} ) {
        super();
        this.gateType = basicFunctions[props.gateType];
        this.state = {
            inputs: props.inputs,
        }
    }

    getValue = function () {
        const inputs = this.state.inputs;

        // jezeli brakuje ktoregos inputa, nie da sie okreslic wyjscia (chyba ze OR)
        if ( !inputs[0] || !inputs[1] ) return undefined;

        let output = this.gateType([inputs[0].getValue(), inputs[1].getValue()]);
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
