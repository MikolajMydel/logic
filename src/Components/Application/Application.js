import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartNode from "../Node/StartNode";
import EndNode from "../Node/EndNode";
import ControlPanel from "../ControlPanel/ControlPanel";
import {findReact, makeNewGate} from "../../functions";
import Menu from "../Menu/Menu"

function validateGateName(name) {
    // nazwa może składać się wyłącznie z liter i cyfr
    // oraz musi zaczynać się od litery
    var regex = /^[A-Za-z][A-Za-z0-9]*$/;
    return regex.test(name);
}
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

    boardRef = React.createRef()
    canvasRef = React.createRef()
    controlRef = React.createRef()

    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    setFocusedElement = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    getFocusedElement = () => this.state.focusedElement;

    addNode = (e, type) => {
        // dodaj tylko jeżeli kliknięto na czysty obszar (nie np istniejący node)
        if ( !e.target.classList.contains('Area') )
            return;

        const pos = e.clientY - e.target.offsetTop - 10; // 10 - połowa wysokości
        let elements = this.state.elements;
        if (type === "startNode")
            elements.inputs.push(
                <StartNode setFocusedElement={ this.setFocusedElement } position={ pos }/>
            );
        else // endNode
            elements.outputs.push(
                <EndNode getFocusedElement={ this.getFocusedElement } position={ pos }/>
            );
        this.setState ({'elements': elements});
    }

    addGate = (e, args) => {
        let elements = this.state.elements;
        let newGate;
        elements.board.push(
            <LogicGate
                gateName={ args.gateName }
                inputs={ args.inputCount }
                outputs={ args.outputCount }
                function={ args.function }
                getFocusedElement={ this.getFocusedElement }
                setFocusedElement={ this.setFocusedElement }
                reference={el => newGate = el}
            />
        );
        this.setState ({'elements': elements}, function(){
            // 'e.target' odnosi się teraz do komponentu DummyGate
            const xo = e.clientX - e.target.offsetLeft;
            const yo = e.clientY - e.target.offsetTop;

            newGate.style.left = e.clientX - xo + 'px';
            newGate.style.top  = e.clientY - yo + 'px';

            this.setState({
                heldElement: newGate,
                heldElementOffset: [xo, yo],
            });
        });
    }

    // funkcja podnosząca bramkę
    grab(e) {
        const element = e.target;
        if (element.classList.contains("LogicGate")) {
            this.setState({heldElement: element});
            // obliczenie różnicy koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
            const xo = e.clientX - element.offsetLeft;
            const yo = e.clientY - element.offsetTop;
            this.setState({heldElementOffset: [xo, yo]});
        }
    }

    move(e) {
        // przenieś bramkę (jeżeli jakaś jest trzymana)
        if(this.state.heldElement){
            const element = this.state.heldElement;
            const canvas  = e.currentTarget;
            const board   = this.boardRef.current;

            let x = e.clientX - this.state.heldElementOffset[0]; // różnica x
            let y = e.clientY - this.state.heldElementOffset[1]; // różnica y

            if (x < board.offsetLeft)
                // za daleko w lewo
                x = board.offsetLeft;
            else if (x + element.offsetWidth > board.offsetWidth + board.offsetLeft)
                // za daleko w prawo
                x = board.offsetWidth + board.offsetLeft - element.offsetWidth;
            if (y < canvas.offsetTop)
                // za daleko w górę
                y = canvas.offsetTop;
            else if (y + element.offsetHeight > canvas.offsetHeight + canvas.offsetTop)
                // za daleko w dół
                y = canvas.offsetHeight + canvas.offsetTop - element.offsetHeight;

            element.style.left = x + 'px';
            element.style.top = y + 'px';
        }
    }

    drop() {
        // upuść trzymaną bramkę
        const element = this.state.heldElement;
        if(element){
            this.setState({heldElement: undefined});
            const board = this.boardRef.current;
            const y = parseInt(element.style.top.split('px')[0])

            // jeżeli przeniesiony poniżej poziomu 'board', usuń
            if (y + (element.offsetHeight) > board.offsetHeight + board.offsetTop){
                const comp = findReact(element);
                if(comp.selfDestruct)
                    comp.selfDestruct();
            }
        }
    }

    saveGate = () => {
        let name = "";
        do {
            name = prompt();
            // sprawdza poprawność nazwy i czy nie jest już taka zdefiniowana
        } while(!validateGateName(name) || global[name] != undefined);

        const newGateObject = makeNewGate(this.canvasRef, name);
        let saved;
        if(localStorage.getItem("savedGates") !== null)
            saved = JSON.parse(localStorage.getItem("savedGates"));
        else
            saved = [];

        saved.push(newGateObject);
        localStorage.setItem("savedGates", JSON.stringify(saved));
        findReact(this.controlRef.current).addDummy(newGateObject);
    }

    clearCanvas = () => {
        this.setState({elements: {inputs: [], board: [], outputs: []}})
    }

    render() {
        return (
            <div className={ styles.Application }
                onMouseDown={ (e) => this.grab(e) }
                onMouseMove={ (e) => this.move(e) }
                onMouseUp={ () => this.drop() }
            >
                <Menu functions={[this.saveGate, this.clearCanvas]}/>
                <div className={ styles.Canvas }
                    ref={el => this.canvasRef = el}
                >
                    <div className={ `Area ${styles.InputArea}` }
                        onClick={ (e) => this.addNode(e, 'startNode')}
                    >
                        { this.state.elements.inputs }
                    </div>
                    <div className={ styles.Board }
                        ref={this.boardRef}
                    >
                        { this.state.elements.board }
                    </div>
                    <div className={ `Area ${styles.OutputArea}` }
                        onClick={ (e) => this.addNode(e, 'endNode')}
                    >
                        { this.state.elements.outputs }
                    </div>
                </div>
                <ControlPanel addGate={this.addGate} reference={this.controlRef}/>
            </div>
        )
    }
}

export default Application;
