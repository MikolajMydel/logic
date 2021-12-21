import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {

    get value() { return this.state.value }

    // wspólny render ale z innymi onClick, funkcje jako parametr wykorzystując super() w podklasie
    renderBase(onClick) {
        let style;
        const value = this.state.value;
        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = styles.NodeUndefined;
        else if ( value ) style = styles.NodeTrue;
        else style = styles.NodeFalse;

        const position = this.props.position + 'px';

        return (
            <div className={ `${styles.Node} ${style}` } onClick={ () => onClick() } style={{ top: position }} >
            </div>
        )
    }
}

export default Node;
