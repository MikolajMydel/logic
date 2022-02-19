import React from "react";
import OutputPin from "../LogicGate/Pin/OutputPin";
import InputPin from "../LogicGate/Pin/InputPin";
import styles from "../LogicGate/LogicGate.module.scss";

class DummyGate extends React.Component {
    style = {backgroundColor: this.props.color}
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
            <div className={`${styles.LogicGate} ${styles.LogicGateDummy}`}
                style={this.style}
                onMouseDown={(e) => this.props.addGate(e, {
                    gateName: this.props.gateName,
                    function: this.props.function,
                    style: this.style,
                    inputCount: this.props.inputs,
                    outputCount: this.props.outputs,
                })} >
                <div className={styles.LogicGateInputs} style={{pointerEvents: 'none'}} >
                    { inputFields }
                </div>
                <h5 className={styles.LogicGateValue}> { this.props.gateName.replace('f_', '') } </h5>
                <div className={styles.LogicGateOutputs} style={{pointerEvents: 'none'}} >
                    { outputFields }
                </div>
            </div>
        )
    }
}

export default DummyGate;
