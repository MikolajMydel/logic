import styles from './ControlPanel.module.scss';
import DummyGate from '../DummyGate/DummyGate';
import {retrieveFunction} from '../../functions';
import React from "react";

class ControlPanel extends React.Component {

    constructor(props){
        super();
        this.state = {
            dummies: [
                <DummyGate
                    gateName={ "AND" }
                    inputs={ 2 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                gateName={ "OR" }
                    inputs={ 2 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                gateName={ "NOT" }
                    inputs={ 1 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />,
                <DummyGate
                gateName={ "TEST" }
                    inputs={ 2 }
                    outputs={ 2 }
                    addGate={props.addGate}
                />,
                <DummyGate
                gateName={ "OR" }
                    inputs={ 3 }
                    outputs={ 1 }
                    addGate={props.addGate}
                />
            ],
        }
    }
    addDummy = (newGate) => {
        let dummies = this.state.dummies;
        const func = retrieveFunction(newGate.functions);
        const newDummy = (
            <DummyGate
            gateName={ newGate.name }
                function={ func }
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
