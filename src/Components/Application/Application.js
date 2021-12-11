import React from "react";
import reactDom from "react-dom";

import styles from './Application.module.scss';

import LogicGate from "../LogicGate/LogicGate.js";
import StartingNode from "../StartingNode/StartingNode.js";

import ControlPanel from "../ControlPanel/ControlPanel";

const LogicGatesTypes = {
    "AND": "AND",
    "OR": "OR",
}

const ApplicationContext = React.createContext (undefined);

class Application extends React.Component {


    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    getFocus = ( element ) => {
        this.setState ({'focusedElement': element});
    }


    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    readFocus = () => this.state.focusedElement;


    // dodawanie nowych elementow na plansze
    addElement = ( args ) => {
        const actualElements = this.state.elements;

        let newElement = undefined;
        
        switch ( args.type ) {

            case 'logicGate':
                newElement = <LogicGate gateType={args.gateLogic} getFocus={ this.getFocus } inputs={[undefined, undefined]} readFocus = { this.readFocus } />;
                break;

            case 'startingNode':
                newElement = <StartingNode value={ args.value } getFocus={ this.getFocus } />;
                break;


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