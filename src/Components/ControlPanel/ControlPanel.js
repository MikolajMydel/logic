import styles from './ControlPanel.module.scss';

const ControlPanel = (props) => (
    <nav className={ styles.ControlPanel }>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: true } ) } > Węzeł prawda </button>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: false } ) } > Węzeł fałsz </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "AND", inputCount: 2 } ) } > Bramka AND </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 2 } ) } > Bramka OR </button>

        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR", inputCount: 5 } ) } > Bramka testowa (5 wejść) </button>
    </nav>
)

export default ControlPanel;
