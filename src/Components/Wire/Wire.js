import React from 'react';
import styles from './Wire.scss';

function calculatePath (firstPin, secondPin){

    const firstPinBoundingClient = firstPin.current.getBoundingClientRect();
    const firstPinCoordinates = [ firstPinBoundingClient.top, firstPinBoundingClient.left ];

    const secondPinBoundingClient = secondPin.current.getBoundingClientRect();
    const secondPinCoordinates = [ secondPinBoundingClient.top, secondPinBoundingClient.left ];

    return "m135,202l453,0";
}

class Wire extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            "firstPin": props.firstPin,
            "secondPin": props.secondPin,

        };

    }

    render() {
        return <path d={calculatePath(this.state.firstPin, this.state.secondPin )} className={styles.Wire} stroke-width="3" stroke="#000" fill="#fff"/>
    }
}

export default Wire;