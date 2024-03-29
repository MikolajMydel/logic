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
        showName: true,
        ref: React.createRef(),
        value: undefined,

        index: undefined,
    }

    get value() { return this.state.value }
    get name() { return this.state.name }

    componentDidMount(){
        const HTMLElement = findParentNode(this.state.ref.current);
        // event uruchamiany z poziomu NodeSet
        HTMLElement.addEventListener("attributeChange", this.updateAttributes);
        HTMLElement.addEventListener("remove", this.removeNode);
        HTMLElement.addEventListener("merge", this.onMerge);
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

    onMerge = () => {
        findParentNode(this.state.ref.current).removeEventListener("remove", this.removeNode);
        this.setState({showName: false});
    }

    fireRemoveEvent = () => {
        const HTMLParentNode = findParentNode(this.state.ref.current);
        HTMLParentNode.removeEventListener("attributeChange", this.updateAttributes);
        HTMLParentNode.removeEventListener("remove", this.removeNode);
        HTMLParentNode.removeEventListener("merge", this.onMerge);
        // event sygnalizujacy usuniecie polaczenia dla Wire
        HTMLParentNode.dispatchEvent(remove);
    }

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

    getNameBox = () => {
        if(this.state.renderNameBox)
            return (
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
                    <button className={`${styles.Button} ${styles.ButtonDestruct}`}
                    onClick={this.selfDestruct}>usuń</button>
                </div>
            );
        else if(this.props.showNodeNames && this.state.showName && this.state.name !== '')
            return (
                <div
                    className={styles.NodeName}
                >
                    <p>{this.state.name}</p>
                </div>
            );
        else
            return '';
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
                    data-element="NodeButton"
                ></div>
                {this.getNameBox()}
            </div>
        )
    }

}

export default Node;
