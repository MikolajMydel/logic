import styles from './ControlPanel.module.scss';

const ControlPanel = (props) => (
    <nav className={ styles.ControlPanel }>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: true } ) } > Węzeł prawda </button>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: false } ) } > Węzeł fałsz </button>
        <button onClick={ () => props.addElement ( { type: "endNode" } ) } > Węzeł wyjścia </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "AND", inputCount: 2, outputCount: 1 } ) } > Bramka AND </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 2, outputCount: 1 } ) } > Bramka OR </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 10, outputCount: 1 } ) } > Bramka testowa (10 wejść) </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "NOT", inputCount: 1, outputCount: 1 } ) } > Bramka NOT </button>
    </nav>
)

export default ControlPanel;
