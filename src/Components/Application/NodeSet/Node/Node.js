import React from 'react';
import styles from '../NodeSet.module.scss';
import remove from '../../../../Events/remove';
import StartNode from './StartNode';
import { findParentNode } from '../../../../findingFunctions';
class Node extends React.Component {
    state = {
        name: "",
        render: true,
        renderNameBox: false,
        ref: React.createRef(),
        value: undefined,

        index: undefined,
    }

    get value() { return this.state.value }
    get name() { return this.state.name }

    componentDidMount(){
        // event uruchamiany z poziomu NodeSet
        findParentNode(this.state.ref.current).addEventListener("attributeChange", this.updateAttributes);
    }

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
        const HTMLParentNode = findParentNode(this.state.ref.current);
        HTMLParentNode.removeEventListener("attributeChange", this.updateAttributes);
        // event sygnalizujacy usuniecie polaczenia dla Wire
        HTMLParentNode.dispatchEvent(remove);
    }

    getNameBox = () => (
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

    // funkcja pozwalajaca na zmiane stanu poprzez zmiane
    // atrybutu elementu HTML (z poziomu NodeSetu)
    // jest uruchamiana podczas eventu attributeChange
    updateAttributes = () => {
        const HTMLParentNode = findParentNode(this.state.ref.current);
        this.setState({
            "index": HTMLParentNode.getAttribute("data-index"),
            "name": HTMLParentNode.getAttribute("data-name"),
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

        return (
            <div
                className={`${styles.Node} ${this instanceof StartNode ? styles.NodeStart : styles.NodeEnd }`}
                style={{ top: position }}
                value={this.state.value}
                data-element="Node"
            >
                <div
                    className={styles.NodeHandle}
                    onMouseUp={this.handleHandleMouseUp}
                    data-element="NodeHandle"
                ></div>
                <div
                    className={styles.NodeIndex}
                >
                    {this.state.index}
                </div>

                <div
                    ref={this.state.ref}
                    className={ `${styles.NodeButton} ${style}` }
                    onMouseDown={ this.handleOnMouseDown }
                ></div>

                {this.state.renderNameBox ? this.getNameBox(): ""}
            </div>
        )
    }

}

export default Node;
