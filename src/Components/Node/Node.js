import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {

    get value() { return this.state.value }

    render() {
        if(this.state.render === false) return null;
        let style;
        const value = this.state.value;

        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = styles.NodeButtonUndefined;
        else if ( value )
            style = styles.NodeButtonTrue;
        else
            style = styles.NodeButtonFalse;

        const position = this.props.position + 'px';

        return (
            <div
                className={styles.Node}
                style={{ top: position }}
            >
                <div
                    className={styles.NodeHandle}
                ></div>

                <div
                    ref={this.state.ref}
                    className={ `${styles.NodeButton} ${style}` }
                    onMouseDown={ this.handleOnMouseDown }
                ></div>

                <div
                    className={styles.NodeNameBox}
                >
                    <input value={"nazwa"}/>
                    <div onClick={this.selfDestruct}>delete</div>
                </div>
            </div>
        )
    }

}

export default Node;
