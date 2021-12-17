import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartingNode from "../StartingNode/StartingNode";
import ControlPanel from "../ControlPanel/ControlPanel";

class Application extends React.Component {
    state = {
        focusedElement: undefined,    // aktualnie wybrane wyjście
        heldElement: undefined,       // aktualnie trzymana bramka
        heldElementOffset: [0, 0],    // różnica koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
        elements: []                  // wszystkie elementy planszy
    }

    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    setFocusedElement = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    getFocusedElement = () => this.state.focusedElement;

    // dodawanie nowych elementow na plansze
    addElement = ( args ) => {
        let actualElements = this.state.elements;
        let newElement;

        switch ( args.type ) {
            case 'logicGate':
                newElement = <LogicGate gateType={ args.gateLogic } inputs={ args.inputCount } outputs={ args.outputCount }getFocusedElement = { this.getFocusedElement } setFocusedElement={ this.setFocusedElement }/>;
                break;
            case 'startingNode':
                newElement = <StartingNode value={ args.value } setFocusedElement={ this.setFocusedElement } />;
                break;
            default:
                newElement = undefined;
        }

        actualElements.push ( newElement );
        this.setState ({elements: actualElements});
    }

    grab(e){
        // funkcja "podnosząca" bramkę
        const element = e.target;
        if (element.classList.contains("LogicGate")) {
            this.setState({heldElement: element});
            // obliczenie różnicy koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
            const xo = e.clientX - element.offsetLeft;
            const yo = e.clientY - element.offsetTop;
            this.setState({heldElementOffset: [xo, yo]})
        }
    }

    move(e){
        // przenieś bramkę (jeżeli jakaś jest trzymana)
        if(this.state.heldElement){
            const element = this.state.heldElement;
            const x = e.clientX - this.state.heldElementOffset[0]; // różnica x
            const y = e.clientY - this.state.heldElementOffset[1]; // różnica y
            element.style.left = x + 'px';
            element.style.top = y + 'px';
        }
    }

    drop(){
        // upuść trzymaną bramkę
        this.setState({heldElement: undefined});
    }

    render() {
        return (
            <div
                className={`${styles.Application}`}
                onMouseDown={ (e) => this.grab(e) }
                onMouseMove={ (e) => this.move(e) }
                onMouseUp={ () => this.drop() }
            >
                <div className={ styles.Canvas } >
                    { this.state.elements }
                </div>
                <ControlPanel addElement={ this.addElement } />
            </div>
        )
    }
}

export default Application;
