import React from 'react';
import styles from './Node.module.scss';
import remove from '../../Events/remove';
import StartNode from './StartNode';
import { findParentNode } from '../../findingFunctions';
class Node extends React.Component {
    state = {
        name: "",
        render: true,
        renderNameBox: false,
        ref: React.createRef(),
        value: undefined,
    }

    get value() { return this.state.value }
    get name() { return this.state.name }

    toggleNameBox = () => {
        this.setState({renderNameBox: !this.state.renderNameBox})
    }

    handleHandleMouseUp = (e) => {
        if(e.button === 2) { // tylko PPM
            this.toggleNameBox();
        }
    }

    onInputChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    fireRemoveEvent = () => {
        // event sygnalizujacy usuniecie polaczenia dla Wire
        findParentNode(this.state.ref.current).dispatchEvent(remove);
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
                    <input
                        onChange={this.onInputChange}
                        value={this.name}
                        onKeyDown={
                            (e) => {if(e.key === "Enter") this.toggleNameBox()}
                        }
                    />
                    <div onClick={this.selfDestruct}>delete</div>
                </div>
            );

        return (
            <div
                className={`${styles.Node} ${this instanceof StartNode ? styles.NodeStart:styles.NodeEnd }`}
                style={{ top: position }}
            >
                <div
                    className={`NodeHandle ${styles.NodeHandle}`}
                    onMouseUp={this.handleHandleMouseUp}
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
