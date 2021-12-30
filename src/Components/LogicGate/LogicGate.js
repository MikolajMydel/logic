import React from "react";
import OutputPin from "./OutputPin";
import InputPin from "./InputPin";
import styles from "./LogicGate.module.scss";

const gateClass = {
    'AND': styles.LogicGateAND,
    'OR': styles.LogicGateOR,
    'NOT': styles.LogicGateNOT,
}
const basicFunctions = {
    'AND': (i) => (i[0] && i[1]),
    'OR':  (i) => (i[0] || i[1]),
    'NOT': (i) => !(i[0]),
}

class LogicGate extends React.Component {
    constructor( {...props} ) {
        super();
        this.func = basicFunctions[props.gateType];
        this.state = {
            value: undefined, // tymczasowo
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
        let inputs = [];
        for (let i = 0; i < this.inputs.length; i++){
            let inp = this.inputs[i].state.value; // true or false

            // jezeli brakuje ktoregos inputa, nie da sie okreslic wyjscia, zwracamy undefined na każdy output
            inputs.push(inp);
            if (inputs[i] === undefined){
                for (let j = 0; j < this.outputs.length; j++)
                    this.outputs[j].receiveSignal(undefined);
                return;
            }
        }
        let output = this.func(inputs);
        // na razie używamy tylko bramek z jednym outputem więc whatever
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
            inputFields.push((<InputPin index={ i } gate={ this } getFocusedElement={ this.props.getFocusedElement } mount={ this.mountPin } />));
        }
        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++){
            outputFields.push((<OutputPin index={ i } gate={ this } getFocusedElement={ this.props.getFocusedElement } setFocusedElement={ this.props.setFocusedElement } mount={ this.mountPin } />));
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
