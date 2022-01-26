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
    render () {
        const style = gateClass[ this.props.gateType ];

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
            <div className={`${styles.LogicGate} ${style} ${styles.LogicGateDummy}`} >
                <div className={styles.LogicGateInputs} style={{pointerEvents: 'none'}} >
                    { inputFields }
                </div>
                <h5 className={styles.LogicGateValue}> { this.props.gateType } </h5>
                <div className={styles.LogicGateOutputs} style={{pointerEvents: 'none'}} >
                    { outputFields }
                </div>
            </div>
        ) // styl LogicGateOutputs jeszcze nie istnieje
    }
}

export default DummyGate;
