import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartNode from "../Node/StartNode";
import EndNode from "../Node/EndNode";
import ControlPanel from "../ControlPanel/ControlPanel";
import Wire from '../WiresBoard/Wire/Wire.js';
import {findReact} from "../../functions";
import Menu from "../Menu/Menu"
import WiresBoard from "../WiresBoard/WiresBoard";


class Application extends React.Component {
    state = {
        focusedElement: undefined,    // aktualnie wybrane wyjście
        heldElement: undefined,       // aktualnie trzymana bramka
        heldElementOffset: [0, 0],    // różnica koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
        elements: {
            inputs: [],
            board: [],
            outputs: [],
        },

        wires: [],

    }

    boardRef = React.createRef()

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
                <EndNode drawWire={ this.drawWire } removeWire={ this.removeWire } 
                getFocusedElement={ this.getFocusedElement } position={ pos }/>
            );
        this.setState ({'elements': elements});
    }

    addGate = (e, args) => {
        let elements = this.state.elements;
        let newGate;
        elements.board.push(
            <LogicGate

                drawWire = { this.drawWire }
                removeWire = { this.removeWire }

                gateType={ args.gateLogic }
                inputs={ args.inputCount }
                outputs={ args.outputCount }
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

    drawWire = (firstPin, secondPin) => {
        const newWiresList = this.state.wires.concat([ <Wire firstPin={firstPin} secondPin={secondPin} /> ]);

        this.setState({"wires": newWiresList});
    }

    removeWire = (firstPin, secondPin, callback ) => {

        let wireIndex;
        const wiresArray = this.state.wires;
    
        for (let i = 0; i < wiresArray.length; i++){
            if ( wiresArray[i].props.firstPin === firstPin && wiresArray[i].props.secondPin === secondPin ){
                    wireIndex = i;
                    break;
                }
        }
        
        const newWiresArray = [ ...this.state.wires ];
        newWiresArray.splice ( wireIndex, 1 );
    
        this.setState({
            "wires": newWiresArray,
    
        }, 
            () => { 
                if (callback) callback();
            }
        )
    }

    render() {
        return (
            <div className={ styles.Application }
                onMouseDown={ (e) => this.grab(e) }
                onMouseMove={ (e) => this.move(e) }
                onMouseUp={ () => this.drop() }
            >
                <Menu />
                
                <WiresBoard wires={this.state.wires} />

                <div className={ styles.Canvas }>
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
                <ControlPanel addGate={this.addGate} />
            </div>
        )
    }
}

export default Application;
