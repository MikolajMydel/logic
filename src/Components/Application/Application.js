import React from "react";
import reactDom from "react-dom";

import styles from './Application.module.scss';

import LogicGate from "../LogicGate/LogicGate.js";
import StartingNode from "../StartingNode/StartingNode.js";
import { act } from "react-dom/cjs/react-dom-test-utils.production.min";

const LogicGatesTypes = {
    "AND": "AND",
    "OR": "OR",
}

const ApplicationContext = React.createContext (undefined);

class Application extends React.Component {

    getFocus = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    readFocus = () => this.state.focusedElement;

    addElement = ( args ) => {
        const actualElements = this.state.elements;

        let newElement = undefined;
        
        switch ( args.type ) {

            case 'logicGate':
                newElement = <LogicGate gateType={args.gateLogic} inputs={[undefined, undefined]} readFocus = { this.readFocus } />;
                break;

            case 'startingNode':
                newElement = <StartingNode value={ args.value } getFocus={ this.getFocus } />;
                break;


        }

        actualElements.push ( newElement );

        console.log ( newElement );

        this.setState ({elements: actualElements});
    }

    state = {

        focusedElement: undefined,

        elements:
        [
            <StartingNode value={true} getFocus={ this.getFocus } />,
            <StartingNode value={false} getFocus={ this.getFocus } />,

            <LogicGate gateType="AND" inputs={[undefined, undefined]} readFocus = { this.readFocus } />,
        ]
    }

    render() {
        return (
            <>
                <nav className={ styles.ControlPanel }>

                    <button onClick={ () => this.addElement ( { type: "startingNode", value: true } ) } > Węzeł prawda </button>
                    <button onClick={ () => this.addElement ( { type: "startingNode", value: false } ) } > Węzeł fałsz </button>


                    <button onClick={ () => this.addElement ( { type: "logicGate", gateLogic: "AND" } ) } > Bramka AND </button>
                    <button onClick={ () => this.addElement ( { type: "logicGate", gateLogic: "OR" } ) } > Bramka OR </button>


                </nav>

                <div className={ styles.Canvas } >
                    { this.state.elements }
                </div>
            </>
        )

    }
}

export default Application;