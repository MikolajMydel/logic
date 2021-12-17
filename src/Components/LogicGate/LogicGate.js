import React from "react";
import Pin from "./Pin";
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
    mountPin = (type, pin, index) => {
        if(type === "input"){
            //let inputs = this.inputs;
            //inputs[index] = pin;
            //this.setState({'inputs': inputs})
            this.inputs[index] = pin;
        } else {
            //let outputs = this.outputs;
            //outputs[index] = pin;
            //this.setState({'outputs': outputs})
            this.outputs[index] = pin;
        }
    }
    processOutput = () => {
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

        this.setState({value: output}) //tymczasowo
        // niby powinno być
        // this.setState({value: this.outputs[0].state.value});
        // ale setState w receiveSignal nie zmienia state od razu ...
    }
    render () {
        // na razie używamy wartości logicznej bramki, żeby ułatwić sprawdzanie czy działają ( i tak korzystamy tylko z bramek 1-outputowych ), później powinny mieć po prostu nazwy danej bramki
        let value = this.state.value;
        if(value === undefined) value = "undefined"
        const style = gateClass[ this.props.gateType ];

        let inputFields = [];
        for (let i = 0; i < this.props.inputs; i++){
            inputFields.push((<Pin pinType="input" index={ i } gate={ this } getFocusedElement={ this.props.getFocusedElement } mount={ this.mountPin } />));
        }
        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++){
            outputFields.push((<Pin pinType="output" index={ i } gate={ this } getFocusedElement={ this.props.getFocusedElement } setFocusedElement={ this.props.setFocusedElement } mount={ this.mountPin } />));
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
