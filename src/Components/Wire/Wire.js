import React from 'react';
import styles from './Wire.scss';

function calculatePath (firstPinBoundingClient, secondPinBoundingClient){

    //const firstPinBoundingClient = firstPin.getBoundingClientRect();
    const firstPinCoordinates = [ firstPinBoundingClient.left, firstPinBoundingClient.top ];

    //const secondPinBoundingClient = secondPin.getBoundingClientRect();
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

        // ta wartosc nie zmienia sie przez zycie polaczenia
        this.firstPin = props.firstPin.current;
        this.secondPin = props.secondPin.current;

        this.state = {
            "firstPinPosition": props.firstPin.current.getBoundingClientRect(),
            "secondPinPosition": props.secondPin.current.getBoundingClientRect(),
        };

        setInterval( this.updatePosition, 16 );
    }

    // funkcja powodujaca aktualizacje pozycji pinow w stanie
    updatePosition = () => {
        this.setState({
            "firstPinPosition": this.firstPin.getBoundingClientRect(),
            "secondPinPosition": this.secondPin.getBoundingClientRect(),
        });
    }

    render() {
        return <path onMouseMove={ this.updatePosition } d={calculatePath(this.state.firstPinPosition, this.state.secondPinPosition )} className={styles.Wire} strokeWidth="4" stroke="#000" fill="#fff"/>
    }
}

export default Wire;