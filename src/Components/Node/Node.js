import React from 'react';
import styles from './Node.module.scss';

class Node extends React.Component {
    state = {
        name: "",
        render: true,
        renderNameBox: false,
        value: false,
        ref: React.createRef(),
    }

    get value() { return this.state.value }
    get name() { return this.state.name }

    handleHandleMouseDown = (e) => {
        if(e.button === 0){
            this.setState({renderNameBox: !this.state.renderNameBox})
        }
    }

    onInputChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

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
        if(this.state.renderNameBox)
            var nameBox = (
                <div
                    className={styles.NodeNameBox}
                >
                    <input onChange={this.onInputChange} value={this.name}/>
                    <div onClick={this.selfDestruct}>delete</div>
                </div>
            );

        return (
            <div
                className={styles.Node}
                style={{ top: position }}
            >
                <div
                    className={`NodeHandle ${styles.NodeHandle}`}
                    onMouseDown={this.handleHandleMouseDown}
                ></div>

                <div
                    ref={this.state.ref}
                    className={ `${styles.NodeButton} ${style}` }
                    onMouseDown={ this.handleOnMouseDown }
                ></div>

                {nameBox}
            </div>
        )
    }

}

export default Node;
