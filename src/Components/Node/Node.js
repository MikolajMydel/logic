import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {

    get value() { return this.state.value }

    renderBase(onClick) {
        let style;
        const value = this.state.value;
        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = styles.NodeUndefined;
        else if ( value ) style = styles.NodeTrue;
        else style = styles.NodeFalse;
        return (
            <div className={ `${styles.Node} ${style}` } onClick={ () => onClick() } >
            </div>
        )
    }
}

export default Node;
