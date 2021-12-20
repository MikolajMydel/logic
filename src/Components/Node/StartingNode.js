import React from 'react';
import styles from './Node.module.scss';

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
            style = styles.NodeUndefined;
        }
        else {
            if ( value ) style = styles.NodeTrue;
            else style = styles.NodeFalse;
        }

        return (
            <div className={ `${styles.Node} ${style}` } onClick={ () => this.props.setFocusedElement(this) } >
            </div>
        )
    }
}

export default StartingNode;
