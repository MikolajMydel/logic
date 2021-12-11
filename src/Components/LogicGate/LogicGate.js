import React, { useState } from "react";
import styles from "./LogicGate.module.scss";

const gateClass = {
    'AND': styles.LogicGateAND,
    'OR': styles.LogicGateOR,


}


class LogicGate extends React.Component {

    constructor( {...props} ) {

        super();

        this.gateType = props.gateType;

        this.state = {
            inputs: props.inputs,
        }
    }

    getValue = function () {

        const gateType = this.gateType;
        const inputs = this.state.inputs;

        // jezeli brakuje ktoregos inputa, nie da sie okreslic wyjscia (chyba ze OR)
        if ( !inputs [0] || !inputs [1] ) return undefined;

        switch ( gateType ) {

            case "AND":
                return inputs [0].getValue() && inputs [1].getValue();

            case "OR":
                return inputs [0].getValue() || inputs [1].getValue();

            default:
                return inputs [0].getValue() || inputs [1].getValue();

        }



    }

    changeInput = ( index ) => {

        const inputs = this.state.inputs;
        inputs [index] = this.props.readFocus();

        this.setState({'inputs': inputs});

    }

    render () {

        let value = this.getValue();

        if ( value == undefined ) value = "undefined";

        const style = gateClass [ this.props.gateType ];

        return (
            <div className={`${styles.LogicGate} ${style}`} >
                <button className={styles.LogicGateInput} onClick={ () => this.changeInput(0) } >

                </button>

                <button className={styles.LogicGateInput} onClick={ () => this.changeInput(1) }>
                </button>

                <h2> { value.toString() } </h2>

                <button className={styles.LogicGateOutput} onClick={ () => this.props.getFocus (this) }> </button>
            </div>
        )
    }
}

export default LogicGate;
