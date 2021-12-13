import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate.js";
import StartingNode from "../StartingNode/StartingNode.js";
import ControlPanel from "../ControlPanel/ControlPanel";

const ApplicationContext = React.createContext (undefined);

class Application extends React.Component {
    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    setFocusedElement = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    getFocusedElement = () => this.state.focusedElement;

    // dodawanie nowych elementow na plansze
    addElement = ( args ) => {
        const actualElements = this.state.elements;
        let newElement = undefined;

        switch ( args.type ) {
            case 'logicGate':
                // domyślnie 2 inputy
                newElement = <LogicGate gateType={ args.gateLogic } setFocusedElement={ this.setFocusedElement } inputs={ 2 } getFocusedElement = { this.getFocusedElement } />;
                break;
            case 'startingNode':
                newElement = <StartingNode value={ args.value } setFocusedElement={ this.setFocusedElement } />;
                break;
            default:
                newElement = <StartingNode value={ args.value } setFocusedElement={ this.setFocusedElement } />;
        }

        actualElements.push ( newElement );
        this.setState ({elements: actualElements});
    }

    // przechowywanie aktualnie wybranego wyjscia i wszystkich elementow na planszy
    state = {
        focusedElement: undefined,
        elements:
        [

        ]
    }

    render() {
        return (
            <>
                <ControlPanel addElement={this.addElement} />
                <div className={ styles.Canvas } >
                    { this.state.elements }
                </div>
            </>
        )
    }
}

export default Application;
