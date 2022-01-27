import React from 'react';
import Pin from '../LogicGate/Pin';
import styles from './Wire.module.scss';

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

        // przechowujemy te piny, ktore dotycza bramek (a nie wezly startowe i koncowe)
        const gatePins = [
            props.firstPin,
            props.secondPin,
            
        ].filter( pin => pin instanceof Pin );

        // pozycje pinow zostaja zaktualizowane, gdy przejezdzamy mysza po bramce
        for (let pin of gatePins){
            pin.gate.ref.current.addEventListener('mousemove', this.updatePosition);
        }

        this.firstPin = props.firstPin;
        this.secondPin = props.secondPin;

        this.state = {
            // pozycje pinow w momencie stworzenia polaczenia
            "firstPinPosition": props.firstPin.state.ref.current.getBoundingClientRect(),
            "secondPinPosition": props.secondPin.state.ref.current.getBoundingClientRect(),
        };
    
    }

    // funkcja powodujaca aktualizacje pozycji pinow w stanie
    updatePosition = () => {
        this.setState({
            "firstPinPosition": this.firstPin.state.ref.current.getBoundingClientRect(),
            "secondPinPosition": this.secondPin.state.ref.current.getBoundingClientRect(),
        });
    }

    render() {
        return <path d={calculatePath(this.state.firstPinPosition, this.state.secondPinPosition )} className={styles.Wire} strokeWidth="4" stroke="#000" fill="#fff"/>
    }
}

export default Wire;