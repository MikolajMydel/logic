import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartNode from "../Node/StartNode";
import EndNode from "../Node/EndNode";
import ControlPanel from "../ControlPanel/ControlPanel";

class Application extends React.Component {
    state = {
        focusedElement: undefined,    // aktualnie wybrane wyjście
        heldElement: undefined,       // aktualnie trzymana bramka
        heldElementOffset: [0, 0],    // różnica koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
        elements: {
            inputs: [],
            board: [],
            outputs: [],
        }
    }

    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    setFocusedElement = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    getFocusedElement = () => this.state.focusedElement;

    // dodawanie nowych elementow na plansze
    addElement = ( args ) => {
        let elements = this.state.elements;

        switch ( args.type ) {
            case 'logicGate':
                elements.board.push(
                    <LogicGate
                        gateType={ args.gateLogic }
                        inputs={ args.inputCount }
                        outputs={ args.outputCount }
                        getFocusedElement={ this.getFocusedElement }
                        setFocusedElement={ this.setFocusedElement }
                    />
                );
                break;
            case 'startNode':
                elements.inputs.push(
                    <StartNode setFocusedElement={ this.setFocusedElement } position={ args.position }/>
                );
                break;
            case 'endNode':
                elements.outputs.push(
                    <EndNode getFocusedElement={ this.getFocusedElement } position={ args.position }/>
                );
                break;
            default:
                break;
        }
        this.setState ({'elements': elements});
    }

    addNode = (e, type) => {
        // dodaj tylko jeżeli kliknięto na czysty obszar (nie np istniejący node)
        if ( !e.target.classList.contains('Area') )
            return;
        const args = {
            type: type,
            position: e.clientY,
        }
        this.addElement(args);
    }

    grab(e){
        // funkcja "podnosząca" bramkę
        const element = e.target;
        if (element.classList.contains("LogicGate")) {
            this.setState({heldElement: element});
            // obliczenie różnicy koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
            const xo = e.clientX - element.offsetLeft;
            const yo = e.clientY - element.offsetTop;
            this.setState({heldElementOffset: [xo, yo]});
        }
    }

    move(e){
        // przenieś bramkę (jeżeli jakaś jest trzymana)
        if(this.state.heldElement){
            const element = this.state.heldElement;
            const board = e.currentTarget;

            let x = e.clientX - this.state.heldElementOffset[0]; // różnica x
            let y = e.clientY - this.state.heldElementOffset[1]; // różnica y

            if (x < board.offsetLeft)
                // za daleko w lewo
                x = board.offsetLeft;
            else if (x + element.offsetWidth > board.offsetWidth + board.offsetLeft)
                // za daleko w prawo
                x = board.offsetWidth + board.offsetLeft - element.offsetWidth;
            if (y < board.offsetTop)
                // za daleko w górę
                y = board.offsetTop;
            else if (y + element.offsetHeight > board.offsetHeight + board.offsetTop)
                // za daleko w dół
                y = board.offsetHeight + board.offsetTop - element.offsetHeight;

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
            <div className={ styles.Application } >
                <div className={ styles.Canvas }>
                    <div className={ `Area ${styles.InputArea}` }
                        onClick={ (e) => this.addNode(e, 'startNode')}>
                        { this.state.elements.inputs }
                    </div>
                    <div className={ styles.Board }
                        onMouseDown={ (e) => this.grab(e) }
                        onMouseMove={ (e) => this.move(e) }
                        onMouseUp={ () => this.drop() }
                    >
                        { this.state.elements.board }
                    </div>
                    <div className={ `Area ${styles.OutputArea}` }
                        onClick={ (e) => this.addNode(e, 'endNode')}>
                        { this.state.elements.outputs }
                    </div>
                </div>
                <ControlPanel addElement={ this.addElement } />
            </div>
        )
    }
}

export default Application;
