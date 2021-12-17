import React from "react";
import styles from "./LogicGate.module.scss";

class Pin extends React.Component {
    constructor( {...props} ) {
        super();
        if(props.pinType === 'output' || props.pinType === 'input')
            this.state = {
                pinType: props.pinType,
                index: props.index,
                gate: props.gate,
                value: undefined,
                parentPin: undefined,
                childPins: [],
            }
        props.mount(this.state.pinType, this, this.state.index); // dodaj siebie do tablicy pinów swojej bramki
    }
    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin = () => {
        const newParent = this.props.getFocusedElement();
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
        this.props.renderGate();
    }
    receiveSignal = (signal) => {
        this.setState({'value': signal}, function() { // setState() nie zmienia state
            // od razu więc resztę kodu dodaję do funkcji callback, inaczej state
            // pozostałby taki jak wcześniej
            // może state to nie jest najlepsze miejsce to trzymania tych danych
            if (this.state.pinType === 'input') {
                this.state.gate.processOutput();
            } else { // output
                for (let i = 0; i < this.state.childPins.length; i++) {
                    this.state.childPins[i].receiveSignal(signal);
                }
            }
        });
	}
    render(){
        if (this.state.pinType === 'input')
            return <button className={ styles.LogicGateInput } onClick={ () => this.changeParentPin() } ></button>;
        else
            return <button className={ styles.LogicGateOutput } onClick={ () => this.props.setFocusedElement(this) }> </button>;
    }
}

export default Pin;
