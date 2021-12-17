import React from 'react';
import styles from './StartingNode.module.scss';

class StartingNode extends React.Component {
    state = {
        value: undefined,
        childPins: [],
    }

    constructor(props) {
        super();
        this.state.value = props.value;
    };

    getValue = () => this.state.value;

    // przylaczanie innego pina jako dziecko
    connect = (target) => {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    render() {
        const value = this.state.value;
        let style;

        // styl na podstawie wartosci
        if ( value === undefined ) {
            style = styles.StartingNodeUndefined;
        }
        else {
            if ( value ) style = styles.StartingNodeTrue;
            else style = styles.StartingNodeFalse;
        }

        return (
            <div className={ `${styles.StartingNode} ${style}` } onClick={ () => this.props.setFocusedElement(this) } >
            </div>
        )
    }
}

export default StartingNode;
