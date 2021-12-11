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

        if ( !inputs [0] || !inputs [1] ) return false;

        switch ( gateType ) {
    
            case "AND":
                return inputs [0] && inputs [1];

                return inputs[0].value && inputs [1].value;
                
            default:
                return inputs [0] && inputs [1];

                return inputs [0].getValue() || inputs [1].getValue();
        }
    
        
    
    }

    changeInput = ( index ) => {

        const inputs = this.state.inputs;
        inputs [index] = this.props.readFocus();

        this.setState({'inputs': inputs});
    }

    render = () => {
        
        const value = this.getValue();

        const style = gateClass [ this.props.gateType ];

        return ( 
            <div className={`${styles.LogicGate} ${style}`} >  
                <button className={styles.LogicGateInput} onClick={ () => this.changeInput(0) } >

                </button>

                <button className={styles.LogicGateInput} onClick={ () => this.changeInput(1) }>
                </button>

                <h2> { value.toString() } </h2>
            </div>
        )
    }
}

export default LogicGate;