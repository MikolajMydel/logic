import styles from './ControlPanel.module.scss';

const ControlPanel = (props) => (
    <nav className={ styles.ControlPanel }>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: true } ) } > Węzeł prawda </button>
        <button onClick={ () => props.addElement ( { type: "startingNode", value: false } ) } > Węzeł fałsz </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "AND" } ) } > Bramka AND </button>
        <button onClick={ () => props.addElement ( { type: "logicGate", gateLogic: "OR" } ) } > Bramka OR </button>
    </nav>
)

export default ControlPanel;
