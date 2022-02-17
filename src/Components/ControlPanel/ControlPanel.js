import styles from './ControlPanel.module.scss';
import DummyGate from '../DummyGate/DummyGate';
import {retrieveFunction} from '../../functions';
import {AND, NOT, OR, FALSE, TRUE} from "../../logicalFunctions"
import React from "react";

class ControlPanel extends React.Component {

    constructor(props){
        super();
        this.state = {
            // NAZWA BRAMKI MUSI BYĆ TAKA SAMA JAK NAZWA JEJ FUNKCJI
            dummies: [
                <DummyGate
                    gateName={ "AND" }
                    function={AND}
                    color={"cornflowerblue"}
                    inputs={ 2 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                    gateName={ "NOT" }
                    function={NOT}
                    color={"purple"}
                    inputs={ 1 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                    gateName={ "OR" }
                    function={OR}
                    color={"chocolate"}
                    inputs={ 2 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                    gateName={ "FALSE" }
                    function={FALSE}
                    color={"red"}
                    inputs={ 0 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                    gateName={ "TRUE" }
                    function={TRUE}
                    color={"lime"}
                    inputs={ 0 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
            ],
        }
    }
    addDummy = (newGate) => {
        let dummies = this.state.dummies;
        const func = retrieveFunction(newGate.functions);

        // zrób tą funkcję dostępną globalnie
        global[newGate.name] = func;

        const newDummy = (
            <DummyGate
                gateName={ newGate.name }
                function={ func }
                color={ newGate.color }
                inputs={ newGate.inputs }
                outputs={ newGate.outputs }
                addGate={ this.props.addGate }
            />
        )
        dummies.push(newDummy);
        this.setState({dummies: dummies});
    }

    render(){
        return (
        <nav className={ styles.ControlPanel }
            ref={this.props.reference}
        >
            {this.state.dummies}
        </nav>
        );
    }
}

export default ControlPanel;
