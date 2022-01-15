import React from 'react';
import styles from './Wire.scss';

function calculatePath (firstPin, secondPin){

    const firstPinBoundingClient = firstPin.getBoundingClientRect();
    const firstPinCoordinates = [ firstPinBoundingClient.left, firstPinBoundingClient.top ];

    const secondPinBoundingClient = secondPin.getBoundingClientRect();
    const secondPinCoordinates = [ secondPinBoundingClient.left, secondPinBoundingClient.top ];

    // pozycje rowno w srodku pinu
    firstPinCoordinates[1] += firstPinBoundingClient.height / 2;
    firstPinCoordinates[0] += firstPinBoundingClient.width / 2;
    secondPinCoordinates[1] += secondPinBoundingClient.height / 2;
    secondPinCoordinates[0] += secondPinBoundingClient.width / 2;


    // M - MOVE TO (WEDLUG POZYCJI BEWZGLEDNEJ)
    // L - LINE TO (WEDLUG POZYCJI BEZWZGLEDNEJ)
    // przewod idzie od wyjscia do wejscia
    return `M ${firstPinCoordinates} 
    l 25, 0 
    L ${[secondPinCoordinates[0] - 25, secondPinCoordinates[1]]}
    L ${secondPinCoordinates}
    `

}

class Wire extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            "firstPin": props.firstPin.current,
            "secondPin": props.secondPin.current,

        };
    }

    render() {
        return <path d={calculatePath(this.state.firstPin, this.state.secondPin )} className={styles.Wire} stroke-width="3" stroke="#000" fill="#fff"/>
    }
}

export default Wire;