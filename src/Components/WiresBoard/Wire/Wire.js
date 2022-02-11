import React from 'react';
import styles from './Wire.module.scss';

function calculatePathRight(firstPinCoordinates, secondPinCoordinates) {
    const verticalDistance = secondPinCoordinates[1] - firstPinCoordinates[1];
    const horizontalDistance = secondPinCoordinates[0] - firstPinCoordinates[0];

    // jezeli docelowy punkt jest nizej:
    // ostatnie 3 wartosci a1: 1 12,12
    // jezeli jest wyzej:
    // ostatnie 3 wartosci a1: 0 12,-12
    let a1, a2, roundings;
    if (verticalDistance < -25) {
        a1 = "a20,20 0 0 0 12,-12"
        a2 = "a20,20 0 0 1 12 -12"
    } else if (verticalDistance > 25) {
        a1 = "a20,20 0 0 1 12 12";
        a2 = "a20,20 0 0 0 12 12"
    }

    if (a1) {
        roundings =
            `
                l ${[horizontalDistance / 2, 0]}
                ${a1} 
                l ${[ 0, verticalDistance < 0 ? verticalDistance + 25 : verticalDistance - 25 ]} 
                ${a2}
                `
    } else {
        roundings = "";
    }

    return `M ${firstPinCoordinates} 
            ${roundings}
        L ${secondPinCoordinates}
        `
}

function calculatePathLeft(firstPinCoordinates, secondPinCoordinates, paddings) {
    const verticalDistance = secondPinCoordinates[1] - firstPinCoordinates[1];
    const horizontalDistance = secondPinCoordinates[0] - firstPinCoordinates[0];

    const isAbove = verticalDistance > 0;

    let middleRoute = "";
    const spaceSize = 75;
    let minVerticalDistance;

    if (isAbove) minVerticalDistance = paddings[0][1] + paddings[1][0] + spaceSize;
    else minVerticalDistance = paddings[0][0] + paddings[1][1] + spaceSize;

    // zmiesci sie pomiedzy
    if (Math.abs(verticalDistance) > minVerticalDistance) {

        // pierwszy jest na gorze
        if (isAbove) {
            middleRoute =
                `
                a20,20 0 0 1 12,12
                l 0,${ (verticalDistance / 2) - 25 }

                a20,20 0 0 1 -12,12

                l ${horizontalDistance - 50}, 0

                a20,20 0 0 0 -12,12

                L ${ secondPinCoordinates[0] - 35}, ${secondPinCoordinates[1] - 15}

                a20,20 0 0 0 12,12

                `

        } else {
            middleRoute =
                `   
                    a20,20 0 0 0 12,-12
                    l 0,${ (verticalDistance / 2) + 25 }

                    a20,20 0 0 0 -12,-12

                    l ${horizontalDistance - 50}, 0

                    a20,20 0 0 1 -12,-12

                    L ${ secondPinCoordinates[0] - 35}, ${secondPinCoordinates[1] + 15}

                    a20,20 0 0 1 12,-12

                `
        }

        // nie zmiesci sie pomiedzy
    } else {

        if (isAbove) {
            middleRoute =
                `
                    a20,20 0 0 0 12,-12

                    l 0, ${ 2 * paddings[0][0] }

                    a20,20 0 0 0 -12,-12

                    l ${horizontalDistance - 35}, 0

                    a20,20 0 0 0 -12,12

                    L ${ secondPinCoordinates[0] - 25}, ${secondPinCoordinates[1] - 10}

                    a20,20 0 0 0 12, 12
                `
        } else {

            middleRoute =
                `
                    a20,20 0 0 1 12,12

                    l 0, ${ -2 * paddings[0][0] }

                    a20,20 0 0 1 -12,12

                    l ${horizontalDistance - 35}, 0

                    a20,20 0 0 1 -12,-12

                    L ${ secondPinCoordinates[0] - 25}, ${secondPinCoordinates[1] + 15}

                    a20,20 0 0 1 12, -12
                `
        }
    }

    // zawsze wychodzi 25 w prawo i o 
    // jezeli sie zmiesci
    return `
        M ${firstPinCoordinates}
        l 25, 0
        ${middleRoute}
        
        L ${secondPinCoordinates}
    `
}

function calculatePath(firstPinBoundingClient, secondPinBoundingClient, paddings) {

    //const firstPinBoundingClient = firstPin.getBoundingClientRect();
    const firstPinCoordinates = [firstPinBoundingClient.left, firstPinBoundingClient.top];

    //const secondPinBoundingClient = secondPin.getBoundingClientRect();
    const secondPinCoordinates = [secondPinBoundingClient.left, secondPinBoundingClient.top];

    // pozycje rowno w srodku pinu
    firstPinCoordinates[1] += firstPinBoundingClient.height / 2;
    firstPinCoordinates[0] += firstPinBoundingClient.width / 2;
    secondPinCoordinates[1] += secondPinBoundingClient.height / 2;
    secondPinCoordinates[0] += secondPinBoundingClient.width / 2;

    // M - MOVE TO (WEDLUG POZYCJI BEWZGLEDNEJ)
    // L - LINE TO (WEDLUG POZYCJI BEZWZGLEDNEJ)
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path
    // przewod idzie od wyjscia do wejscia

    // jezeli docelowy punkt jest prawo
    if (secondPinCoordinates[0] > firstPinCoordinates[0] + 30)
        return calculatePathRight(firstPinCoordinates, secondPinCoordinates, paddings)
    else
        // punkt docelowy jest na lewo / mniej niz 30px na prawo
        return calculatePathLeft(firstPinCoordinates, secondPinCoordinates, paddings)


}

// na wypadek jakby HTML ulegl zmianie
function findParentGate(pin) {

    let currentParent = pin.parentElement;

    while (!(currentParent.classList.contains("LogicGate"))) {
        currentParent = currentParent.parentElement;
    }

    return currentParent;
}
class Wire extends React.Component {

    constructor(props) {

        super(props);

        this.firstPin = props.firstPin;
        this.secondPin = props.secondPin;

        // jezeli pin jest wezlem startowym, to on jest uznawany za bramke
        const gates = [this.firstPin, this.secondPin].map(pin => {
            return (pin.gate ? findParentGate(pin.state.ref.current) : pin.state.ref.current)
        })

        // pozycje pinow zostaja zaktualizowane, gdy przejezdzamy mysza po bramce / wezle
        for (let gate of gates) {
            gate.addEventListener('mousemove', this.updatePosition);
        }

        this.firstPin.state.ref.current.addEventListener("signalChange", () => {
            this.setState({
                "stateClass": this.getStateClass(),
            });

        })

        this.secondPin.state.ref.current.addEventListener("click", () => {
            this.setState({
                // render tylko, gdy oba piny sa polaczone
                "render": this.firstPin === this.secondPin.state.parentPin,
            })
        })

        this.state = {
            // pozycje pinow w momencie tworzenia polaczenia
            "firstPinPosition": props.firstPin.state.ref.current.getBoundingClientRect(),
            "secondPinPosition": props.secondPin.state.ref.current.getBoundingClientRect(),

            "stateClass": this.getStateClass(),
            "render": true,

        };

        // przyda sie do lepszego zaginania polaczen -
        // [ odleglosc od gornej granicy bramki, odleglosc od dolnej granicy bramki ]
        {
            const gateBoundingClientRect = gates[0].getBoundingClientRect();

            this.firstPinPaddings = [

                gateBoundingClientRect.top - this.state.firstPinPosition.top,
                gateBoundingClientRect.bottom - this.state.firstPinPosition.bottom
            ]
        }

        {
            const gateBoundingClientRect = gates[1].getBoundingClientRect();

            this.secondPinPaddings = [
                gateBoundingClientRect.top - this.state.secondPinPosition.top,
                gateBoundingClientRect.bottom - this.state.secondPinPosition.bottom
            ]
        }

    }

    getStateClass = () => {
        if (this.firstPin.state.value) return styles.WireHighState;
        else return styles.WireLowState;
    }

    // funkcja powodujaca aktualizacje pozycji pinow w stanie
    updatePosition = () => {
        this.setState({
            "firstPinPosition": this.firstPin.state.ref.current.getBoundingClientRect(),
            "secondPinPosition": this.secondPin.state.ref.current.getBoundingClientRect(),
        });
    }

    render() {
        if ( !this.state.render ) return null;

        return <path d = {
            calculatePath(this.state.firstPinPosition, this.state.secondPinPosition,
                [this.firstPinPaddings, this.secondPinPaddings])
        }
        className = {
            `
                ${styles.Wire}
                ${this.state.stateClass}
            `

        }
        />
    }
}

export default Wire;