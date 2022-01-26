import styles from './ControlPanel.module.scss';
import DummyGate from '../DummyGate/DummyGate';

const ControlPanel = (props) => (
    <nav className={ styles.ControlPanel }>
        <DummyGate
            gateType={ "AND" }
            inputs={ 2 }
            outputs={ 1 }
            addGate={props.addGate}
        />
        <DummyGate
            gateType={ "OR" }
            inputs={ 2 }
            outputs={ 1 }
            addGate={props.addGate}
        />
        <DummyGate
            gateType={ "NOT" }
            inputs={ 1 }
            outputs={ 1 }
            addGate={props.addGate}
        />
        <DummyGate
            gateType={ "TEST" }
            inputs={ 2 }
            outputs={ 2 }
            addGate={props.addGate}
        />
        <DummyGate
            gateType={ "OR" }
            inputs={ 3 }
            outputs={ 1 }
            addGate={props.addGate}
        />
    </nav>
)

export default ControlPanel;
