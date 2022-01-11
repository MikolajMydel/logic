import React from 'react';
import styles from './Wire.scss';

function calculatePath (firstPin, secondPin){

    const firstPinBoundingClient = firstPin.getBoundingClientRect();
    const firstPinCoordinates = [ firstPinBoundingClient.left, firstPinBoundingClient.top ];

    const secondPinBoundingClient = secondPin.getBoundingClientRect();
    const secondPinCoordinates = [ secondPinBoundingClient.left, secondPinBoundingClient.top ];

    // M - MOVE TO (WEDLUG POZYCJI BEWZGLEDNEJ)
    // L - LINE TO (WEDLUG POZYCJI BEZWZGLEDNEJ)
    return `M ${firstPinCoordinates} L ${secondPinCoordinates}`

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