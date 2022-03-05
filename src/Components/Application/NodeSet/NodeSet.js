import React from "react";
import remove from "../../../Events/remove";
import styles from './NodeSet.module.scss';
import attributeChange from "../../../Events/attributeChange";
import { findParentNode } from "../../../findingFunctions";
class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ref: React.createRef(),
            render: true,
            position: this.props.position,

            name: "",
            renderNameBox: false,
            showName: true,

            nodes: this.props.nodes,
            signed: this.props.isSigned,

            folded: false,

        }

        this.style = this.props.isInputArea ? styles.NodeSetStart : styles.NodeSetEnd;
    }

    toggleSignBit = () => {
        this.setState({
        "signed": !this.state.signed,
        }, this.updateValue);
    };

    toggleNameBox = () => {
        this.setState({renderNameBox: !this.state.renderNameBox})
    }

    selfDestruct = () => {
        for (let node of this.state.nodes){
            node.dispatchEvent(remove);
        }

        this.removeNodeSet();
    }

    removeNodeSet = () => {
        this.detachEventListeners();
        this.setState({
            'render': false,
        });
    }

    onInputChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleHandleMouseUp = (e) => {
        if(e.button === 2) { // tylko PPM
            this.toggleNameBox();
        }
    }

    calculateValue = () => {
        const nodes = this.state.nodes;
        let value = 0, range = 0, sign = 1;
        if (this.state.signed) {
            // aby najstarszy bit zostal pominiety przy obliczaniu wartosci
            range = 1;
            // pierwszy bit (najstarszy) decyduje o znaku
            sign = (nodes[0].getAttribute("value") === "true" ? -1 : 1);
        }

        for (let i = nodes.length - 1; i >= range; i--){
            if (nodes[i].getAttribute("value") === "true") value += Math.pow(2, nodes.length - i - 1);
        }

        return value * sign;
    }

    updateValue = () => this.setState({
        'value': this.calculateValue(),
    });

    handleMouseDown = (e) => {
        if (e.button === 2) {
            this.removeNode(e.target);
        }
    }

    removeNode = (element) => {
        const targetType = element.getAttribute("data-element");
        if (targetType === "Node"){
            element.dispatchEvent(remove);

            const newNodesArray = this.state.nodes.filter(
                node => node !== element
            );

            element.removeEventListener("mousedown", this.handleMouseDown);
            if (this.state.ref.current) this.state.ref.current.removeChild(element);

            if (newNodesArray.length === 0 && this.state.render) this.selfDestruct();
            else this.setState({
                "nodes": newNodesArray
            });

        } else {
            // jezeli zostal klikniety przycisk, to rozprzestrzen event na rodzica
            if (targetType === "NodeButton") this.removeNode (findParentNode(element));
        }

        this.assignIndexes();
    };

    spreadMoveEvent = () => {
        const move = new Event("move");
        for (let node of this.state.nodes){
            node.dispatchEvent(move);
        }
    }

    spreadNameChange = () => {
        const nodeSetName = this.state.name;

        for (let node of this.state.nodes){
            const nodeIndex = node.getAttribute("data-index");
            node.setAttribute("data-name", `${nodeSetName}_${nodeIndex}`);
            node.dispatchEvent(attributeChange);
        }
    }

    assignIndexes = () => {
        const children = this.state.nodes;
        for (let i = 0; i < children.length; i++){
            children[i].setAttribute("data-index", children.length - i - 1);
            children[i].dispatchEvent(attributeChange);
        };

        this.spreadNameChange();
    }

    componentDidMount(){
        const HTMLElement = this.state.ref.current;
        HTMLElement.addEventListener('signalChange', this.updateValue);
        HTMLElement.addEventListener('merge', this.removeNodeSet);
        HTMLElement.addEventListener('move', this.spreadMoveEvent);
        HTMLElement.addEventListener('remove', this.removeNodeSet);

        const children = this.state.nodes;
        for (let i = 0; i < children.length; i++){
            children[i].style.top = "";
            children[i].addEventListener("mousedown", this.handleMouseDown);
            // wartosc potrzebna dla css do skladania nodesetu
            children[i].style.setProperty("--node-number", i + 1);

            HTMLElement.appendChild(children[i]);
        };

        this.assignIndexes();

        setTimeout(this.spreadMoveEvent, 50);

        this.updateValue();
    }

    detachEventListeners = () => {
        const HTMLElement = this.state.ref.current;
        HTMLElement.removeEventListener('signalChange', this.updateValue);
        HTMLElement.removeEventListener('merge', this.removeNodeSet);
        HTMLElement.removeEventListener('move', this.spreadMoveEvent);
        HTMLElement.removeEventListener('remove', this.removeNodeSet);
    }

    toggleFold = () => this.setState({
        "folded": !this.state.folded,
    }, () => {
        const nodes = this.state.nodes;
        let animationDuration = 0;
        // 0.2s * numer node'a dla kazdego node'a
        for (let i = 0; i < nodes.length; i++){
            animationDuration += (i + 1) * 200;
        }

        const delay = animationDuration / 60;
        const interval = setInterval(this.spreadMoveEvent, delay);

        setTimeout(() => {
            window.clearInterval(interval)
        }, animationDuration);
    })

    fold = () => this.setState({
        "folded": true,
    });

    unfold = () => this.setState({
        "folded": false,
    });

    getNameBox = () => {
        if(this.state.renderNameBox)
            return (
                <div
                        className={styles.NodeSetNameBox}
                >
                    <input
                        onBlur={this.spreadNameChange}
                        onChange={this.onInputChange}
                        value={this.state.name}
                        onKeyDown={
                            (e) => {
                                if(e.key === "Enter"){
                                    this.toggleNameBox();
                                    this.spreadNameChange();
                                };
                            }
                        }
                    />
                    <div className={styles.NodeSetNameBoxButtons}>
                        <button className={`${styles.Button} ${styles.ButtonDestruct}`} onClick={this.selfDestruct}>delete</button>
                        <button className={`${styles.Button} ${styles.ButtonSignBit}`} onClick={this.toggleSignBit} >ZM</button>
                    </div>
                </div>
            )
        else if (this.state.showName && this.state.name !== '')
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

    render(){
        if (!this.state.render) return null;

        return (
            <div ref={this.state.ref}
                style={{top: this.state.position}}
                className={`${styles.NodeSet} ${this.style} ${this.state.folded ? styles.NodeSetFolded : ""}`}
                onClick={this.show}
                data-element="NodeSet"
                data-signed={this.state.signed}
            >

                <div className={styles.NodeSetHandle}
                    data-element="NodeSetHandle"
                    onMouseUp={this.handleHandleMouseUp}
                >
                    {this.state.value}
                    {this.getNameBox()}
                    <button
                        className={styles.ButtonFold}
                        data-element="NodeSetFoldButton"
                        onClick={this.toggleFold}
                    >
                        {(this.state.folded && 'v') || '^'}
                    </button>
                </div>
            </div>
        )
    }
}

export default NodeSet;
