import React from "react";
import styles from "./Wire.module.scss";
import calculatePath from "./pathFunctions";
import { findParentGate, findParentNode } from "../../../functions";

const stateClasses = {
    true: styles.WireHighState,
    false: styles.WireLowState,
    undefined: styles.WireUndefinedState,
};

class Wire extends React.Component {
    constructor(props) {
        super(props);

        this.firstPin = props.firstPin;
        this.secondPin = props.secondPin;

        // jezeli pin jest wezlem startowym, to on jest uznawany za bramke
        this.gates = [this.firstPin, this.secondPin].map((pin) => {
          return pin.gate
            ? findParentGate(pin.state.ref.current) // bramka
            : findParentNode(pin.state.ref.current); // node
        });

        this.attachEventListeners();

        this.state = {
            // pozycje pinow w momencie tworzenia polaczenia
            firstPinPosition:
                props.firstPin.state.ref.current.getBoundingClientRect(),
            secondPinPosition:
                props.secondPin.state.ref.current.getBoundingClientRect(),

            stateClass: this.getStateClass(),
            render: true,
        };

        // przyda sie do lepszego zaginania polaczen -
        // [ odleglosc od gornej granicy bramki, odleglosc od dolnej granicy bramki ]
        {
            const gateBoundingClientRect =
                this.gates[0].getBoundingClientRect();

            this.firstPinPaddings = [
                gateBoundingClientRect.top - this.state.firstPinPosition.top,
                gateBoundingClientRect.bottom - this.state.firstPinPosition.bottom,
            ];
        }

        {
            const gateBoundingClientRect =
                this.gates[1].getBoundingClientRect();

            this.secondPinPaddings = [
                gateBoundingClientRect.top - this.state.secondPinPosition.top,
                gateBoundingClientRect.bottom - this.state.secondPinPosition.bottom,
            ];
        }
    }

    attachEventListeners = () => {
        window.addEventListener(
            "resize",
            this.updatePosition
        );

        for (let gate of this.gates) {
            gate.addEventListener(
                "move",    // zmiana na move
                this.updatePosition
            );

            gate.addEventListener(
                "remove",
                this.removeConnection
            );
        }

        this.firstPin.state.ref.current.addEventListener(
            "signalChange",
            this.updateStateClass
        );

        this.secondPin.state.ref.current.addEventListener(
            "parentChange",
            this.examineWireVisibility
        );
    }

    detachEventListeners = () => {
        window.removeEventListener(
            "resize",
            this.updatePosition
        );

        // usuwam event listenery z obu pinow
        for (let gate of this.gates) {
            gate.removeEventListener(
                "move",
                this.updatePosition
            );

            gate.removeEventListener(
                "remove",
                this.removeConnection
            );
        }

        this.firstPin.state.ref.current.removeEventListener(
            "signalChange",
            this.updateStateClass
        );

        // zapobieganie "powracaniu" dawnych przewodow podczas przywracania dawnego polaczenia
        this.secondPin.state.ref.current.removeEventListener(
            "parentChange",
            this.examineWireVisibility
        );
    }

    handleOnClick = () => this.removeConnection();

    removeConnection = () => {
        this.detachEventListeners();

        // usuwam polaczenie z perspektywy dziecka i rodzica
        this.secondPin.disconnect();

        // usuwam graficzny przewod
        this.setState({
            render: false,
        });
    };

    examineWireVisibility = () => {
        this.setState({
            // render tylko, gdy oba piny sa polaczone
            render: this.firstPin === this.secondPin.state.parentPin,
        });
    };

    getStateClass = () => stateClasses[this.firstPin.state.value];

    updateStateClass = () => {
        this.setState({
            stateClass: this.getStateClass(),
        })
    };

    // funkcja powodujaca aktualizacje pozycji pinow w stanie
    updatePosition = () => {
        this.setState({
            firstPinPosition:
                this.firstPin.state.ref.current.getBoundingClientRect(),
            secondPinPosition:
                this.secondPin.state.ref.current.getBoundingClientRect(),
        });
    };

    render() {
        if (!this.state.render) return null;
        return (
            <path
                d={calculatePath(
                    this.state.firstPinPosition,
                    this.state.secondPinPosition,
                    [this.firstPinPaddings, this.secondPinPaddings]
                ).replace(/(\r\n|\n|\r| {2})/gm, "")}
		className={`${styles.Wire} ${this.state.stateClass}`}
		onClick={this.handleOnClick}
            />
        );
    }
}

export default Wire;
