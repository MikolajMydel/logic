import React from "react";
import EndNode from "../Node/EndNode";
import styles from "./LogicGate.module.scss";

// funkcja, ktora dodaje do tablicy wszystkie bramki pobierajace sygnal z bramki podanej jako argument
function collectChildGates ( childGates, gate ) {

    for (let i = 0; i < gate.outputs.length; i++){

        // dodaje wszystkie piny, ktore pobieraja sygnal z aktualnej bramki
        const childPins = gate.outputs[i].state.childPins;

        for (let j = 0; j < childPins.length; j++){
            // pomijamy EndNody
            if (childPins[j] instanceof EndNode) continue;
            childGates.push( childPins[j].gate );
        }
    }
}
class Pin extends React.Component {
    style = styles;

    constructor(props) {
        super();

        this.index = props.index;
        this.gate = props.gate
        props.mount(this); // dodaj siebie do tablicy pinów swojej bramki
        
    }

    searchForRecursion = () => {
        // this = pin typu input
        // bramka ktorej szukamy (sprawdzamy, czy sie powtarza)
        const searchedGate = this.gate;
        const gates = []; // tablica, w ktorej przechowujemy wszystkie bramki do sprawdzenia

        collectChildGates (gates, searchedGate);

        // dopoki sa jakies bramki do sprawdzenia
        while ( gates.length !== 0 ){
            const currentGate = gates.pop();

            // znalezlismy bramke ktorej poszukiwalismy - jest rekurencja
            if ( currentGate === searchedGate ) return true;

            // dodaje wszystkie bramki, ktore pobieraja sygnal z aktualnej bramki
            collectChildGates ( gates, currentGate );
        }

        return false;
    }
}

export default Pin;
