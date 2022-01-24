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


        /*props.firstPin.gate.addEventListener('click', () => {
            console.log ("witam");
        }) */
        props.firstPin.gate.onclick = this.updatePosition;

        this.state = {
            "firstPinPosition": props.firstPin.state.ref.current.getBoundingClientRect(),
            "secondPinPosition": props.secondPin.state.ref.current.getBoundingClientRect(),
        };
    
    }

    // funkcja powodujaca aktualizacje pozycji pinow w stanie
    updatePosition = () => {

        console.log ( this.props.firstPin.gate.ref );


        this.setState({
            "firstPinPosition": this.firstPin.getBoundingClientRect(),
            "secondPinPosition": this.secondPin.getBoundingClientRect(),
        });
    }

    render() {
        return <path d={calculatePath(this.state.firstPinPosition, this.state.secondPinPosition )} className={styles.Wire} strokeWidth="4" stroke="#000" fill="#fff"/>
    }
}

export default Wire;