import styles from './ControlPanel.module.scss';
import DummyGate from '../DummyGate/DummyGate';

const ControlPanel = (props) => (
    <nav className={ styles.ControlPanel }>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "AND", inputCount: 2, outputCount: 1 } ) } > Bramka AND </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 2, outputCount: 1 } ) } > Bramka OR </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 10, outputCount: 1 } ) } > Bramka testowa (10 wejść) </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "TEST", inputCount: 2, outputCount: 2 } ) } > Bramka testowa (2 wyjścia) </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "NOT", inputCount: 1, outputCount: 1 } ) } > Bramka NOT </button>
        <DummyGate
            gateType={ "AND" }
            inputs={ 2 }
            outputs={ 1 }
        />
        <DummyGate
            gateType={ "NOT" }
            inputs={ 1 }
            outputs={ 1 }
        />
    </nav>
)

export default ControlPanel;
