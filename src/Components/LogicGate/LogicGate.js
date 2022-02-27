import React from "react";
import OutputPin from "./Pin/OutputPin";
import InputPin from "./Pin/InputPin";
import styles from "./LogicGate.module.scss";

class LogicGate extends React.Component {
    constructor(props) {
        super();
        this.name = props.gateName;
        this.func = props.function;
        this.state = {
            value: undefined, // tymczasowo
            render: true,
        };
        this.inputs = [];
        this.outputs = [];
    }

    // dzięki tej funkcji piny dodają się do tablicy pinów output lub input
    mountPin = (pin) => {
        if (pin instanceof InputPin) {
            this.inputs[pin.index] = pin;
        } else if (pin instanceof OutputPin) {
            this.outputs[pin.index] = pin;
        }
    };

    componentDidMount(){
        // bramki constant nigdy nie przetwarzałyby swoich wartości
        this.processOutput();
    }

    selfDestruct() {
        // usuń wszystkie połączenia
        this.inputs.forEach((i) => i.disconnect());
        this.outputs.forEach((o) => {
            o.state.childPins.forEach((i) => i.disconnect());
        });
        this.setState({ render: false });
    }

    processOutput() {
        let inputs = Array.from(this.inputs.map((input) => input.state.value));

        let output = this.func(inputs);
        for (let i = 0; i < output.length; i++)
            this.outputs[i].receiveSignal(output[i]);
        this.setState({ value: output[0] });
    }

    render() {
        if (this.state.render === false) return null;

        let inputFields = [];
        for (let i = 0; i < this.props.inputs; i++) {
            inputFields.push(
                <InputPin
                    drawWire={this.props.drawWire}
                    index={i}
                    gate={this}
                    getFocusedElement={this.props.getFocusedElement}
                    mount={this.mountPin}
                />
            );
        }

        let outputFields = [];
        for (let i = 0; i < this.props.outputs; i++) {
            outputFields.push(
                <OutputPin
                    index={i}
                    gate={this}
                    getFocusedElement={this.props.getFocusedElement}
                    setFocusedElement={this.props.setFocusedElement}
                    mount={this.mountPin}
                />
            );
        }

        return (
            <div
                className={`LogicGate ${styles.LogicGate}`}
                style={this.props.style}
                ref={this.props.reference}
                data-element="LogicGate"
            >
                <div className={styles.LogicGateInputs}>{inputFields}</div>
                <h5 className={styles.LogicGateValue}> {this.name.replace('f_', '')} </h5>
                <div className={styles.LogicGateOutputs}>{outputFields}</div>
            </div>
        ); // styl LogicGateOutputs jeszcze nie istnieje
    }
}

export default LogicGate;
