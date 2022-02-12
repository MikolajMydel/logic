import React from "react";
import OutputPin from "./OutputPin";
import InputPin from "./InputPin";
import styles from "./LogicGate.module.scss";

class LogicGate extends React.Component {
    constructor(props) {
        super();
        this.name = props.gateName;
        this.func = props.function;
        this.state = {
            value: undefined, // tymczasowo
            render: true,
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

    selfDestruct() {
        // usuń wszystkie połączenia
        this.inputs.forEach((i) => i.disconnect());
        this.outputs.forEach((o) => {
            o.state.childPins.forEach((i) => i.disconnect());
        });
        this.setState({render: false});
    }

    processOutput() {
        let inputs = Array.from(
            this.inputs.map ( (input) => input.state.value )
        );

        let output = this.func(inputs);
        for(let i=0; i<output.length; i++)
            this.outputs[i].receiveSignal(output[i]);
        this.setState({value: output[0]});
    }

    render () {
        if(this.state.render === false) return null;
        // na razie używamy wartości logicznej bramki, żeby ułatwić sprawdzanie czy działają ( i tak korzystamy tylko z bramek 1-outputowych ), później powinny mieć po prostu nazwy danej bramki
        let value = this.state.value;
        if(value === undefined) value = "undefined"

        let inputFields = [];

        for (let i = 0; i < this.props.inputs; i++){
            inputFields.push((
                <InputPin
                    drawWire={ this.props.drawWire }

                    index={ i }
                    gate={ this }
                    getFocusedElement={ this.props.getFocusedElement }
                    mount={ this.mountPin } />
            ));
        }

        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++){
            outputFields.push((
                <OutputPin
                    index={ i }
                    gate={ this }
                    getFocusedElement={ this.props.getFocusedElement }
                    setFocusedElement={ this.props.setFocusedElement }
                    mount={ this.mountPin } />
            ));
        }
        return (
            <div className={`LogicGate ${styles.LogicGate}`}
                style={this.props.style}
                ref={this.props.reference}
            >
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
