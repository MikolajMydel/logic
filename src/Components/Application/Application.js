import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartingNode from "../StartingNode/StartingNode";
import ControlPanel from "../ControlPanel/ControlPanel";

class Application extends React.Component {
    state = {
        focusedElement: undefined,    // aktualnie wybrane wyjście
        heldElement: undefined,       // aktualnie trzymana bramka
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
                newElement = <LogicGate gateType={ args.gateLogic } setFocusedElement={ this.setFocusedElement } inputs={ args.inputCount } getFocusedElement = { this.getFocusedElement } />;
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
        }
    }

    move(e){
        // przenieś bramkę (jeżeli jakaś jest trzymana)
        if(this.state.heldElement){
            const x = e.clientX;
            const y = e.clientY;
            const element = this.state.heldElement;
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
                <ControlPanel addElement={ this.addElement } />
                <div className={ styles.Canvas } >
                    { this.state.elements }
                </div>
            </div>
        )
    }
}

export default Application;
