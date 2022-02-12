import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {

    get value() { return this.state.value }

    render() {
        let style;
        const value = this.state.value;

        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = styles.NodeUndefined;
        else if ( value )
            style = styles.NodeTrue;
        else
            style = styles.NodeFalse;

        const position = this.props.position + 'px';

        return (
            <div ref={this.state.ref}
            className={ `${styles.Node} ${style}` } onMouseDown={ this.handleOnClick } style={{ top: position }} >
            </div>
        )
    }

}

export default Node;
