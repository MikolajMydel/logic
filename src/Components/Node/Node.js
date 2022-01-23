import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {

    get value() { return this.state.value }

    render() {
        // zwróć styl na podstawie wartosci
        let style = (this.value) ? styles.NodeTrue : styles.NodeFalse;
        const position = this.props.position + 'px';

        return (
            <div className={ `${styles.Node} ${style}` } onMouseDown={ this.handleOnClick } style={{ top: position }} >
            </div>
        )
    }
}

export default Node;
