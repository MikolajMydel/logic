import styles from './ControlPanel.module.scss';
import DummyGate from '../DummyGate/DummyGate';
import {retrieveFunction} from '../../functions';
import {AND, NOT, OR, FALSE, TRUE} from "../../logicalFunctions"
import React from "react";

// NAZWA BRAMKI MUSI BYĆ TAKA SAMA JAK NAZWA JEJ FUNKCJI
const defaultDummies = (addgate) => [
    <DummyGate
        gateName={ "AND" }
        function={AND}
        color={"cornflowerblue"}
        inputs={ 2 }
        outputs={ 1 }
        addGate={addgate}
    />,
    <DummyGate
        gateName={ "NOT" }
        function={NOT}
        color={"purple"}
        inputs={ 1 }
        outputs={ 1 }
        addGate={addgate}
    />,
    <DummyGate
        gateName={ "OR" }
        function={OR}
        color={"chocolate"}
        inputs={ 2 }
        outputs={ 1 }
        addGate={addgate}
    />,
    <DummyGate
        gateName={ "FALSE" }
        function={FALSE}
        color={"red"}
        inputs={ 0 }
        outputs={ 1 }
        addGate={addgate}
    />,
    <DummyGate
        gateName={ "TRUE" }
        function={TRUE}
        color={"lime"}
        inputs={ 0 }
        outputs={ 1 }
        addGate={addgate}
    />,
]
class ControlPanel extends React.Component {
    constructor(props){
        super();
        this.state = {
            dummies: defaultDummies(props.addGate),
        }
    }

    // wczytuje tylko bramki domyślne i te przesłane jako argument
    reset = (savedGates) => {
        let newDummies = [];
        for(const savedGate of savedGates){
            newDummies.push(this.createDummy(savedGate));
        }
        this.setState({dummies: defaultDummies(this.props.addGate).concat(newDummies)})
    }

    createDummy = (newGate) => {
        const func = retrieveFunction(newGate.functions);

        // zrób tą funkcję dostępną globalnie
        global[newGate.name] = func;

        return (
            <DummyGate
                gateName={ newGate.name }
                function={ func }
                color={ newGate.color }
                inputs={ newGate.inputs }
                outputs={ newGate.outputs }
                addGate={ this.props.addGate }
            />
        )
    }
    addDummy = (newGate) => {
        let dummies = this.state.dummies;
        dummies.push(this.createDummy(newGate));
        this.setState({dummies: dummies});
    }

    handleOnWheel = (e) => {
        const el = e.currentTarget;
        el.scrollLeft += e.deltaY;
    }

    render(){
        return (
        <div
            className={ styles.ControlPanel }
            ref={this.props.reference}
            onWheel={this.handleOnWheel}
        >
            {this.state.dummies}
        </div>
        );
    }
}

export default ControlPanel;
