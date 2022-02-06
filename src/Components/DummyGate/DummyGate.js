import React from "react";
import OutputPin from "../LogicGate/OutputPin";
import InputPin from "../LogicGate/InputPin";
import styles from "../LogicGate/LogicGate.module.scss";

const gateClass = {
    'AND': styles.LogicGateAND,
    'OR': styles.LogicGateOR,
    'NOT': styles.LogicGateNOT,
}
class DummyGate extends React.Component {
    style = gateClass[ this.props.gateName ];
    render () {
        let inputFields = [];
        for (let i = 0; i < this.props.inputs; i++){
            inputFields.push((
                <InputPin />
            ));
        }
        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++){
            outputFields.push((
                <OutputPin />
            ));
        }
        return (
            <div className={`${styles.LogicGate} ${this.style} ${styles.LogicGateDummy}`}
                onMouseDown={(e) => this.props.addGate(e, {
                    gateName: this.props.gateName,
                    function: this.props.function,
                    inputCount: this.props.inputs,
                    outputCount: this.props.outputs,
                })} >
                <div className={styles.LogicGateInputs} style={{pointerEvents: 'none'}} >
                    { inputFields }
                </div>
                <h5 className={styles.LogicGateValue}> { this.props.gateName } </h5>
                <div className={styles.LogicGateOutputs} style={{pointerEvents: 'none'}} >
                    { outputFields }
                </div>
            </div>
        ) // styl LogicGateOutputs jeszcze nie istnieje
    }
}

export default DummyGate;
