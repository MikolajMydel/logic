import React from "react";
import remove from "../../../Events/remove";
import styles from './NodeSet.module.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ref: React.createRef(),
            render: true,
            position: this.props.position,

            name: "",
            renderNameBox: false,

            nodes: this.props.nodes,
            signed: this.props.isSigned,

        }

        this.style = this.props.isInputArea ? styles.NodeSetStart : styles.NodeSetEnd;

        this.spreadMoveEvent();
    }

    getNameBox = () => (
        <div
                className={styles.NodeSetNameBox}
        >
            <input
                onChange={this.onInputChange}
                value={this.state.name}
                onKeyDown={
                    (e) => {if(e.key === "Enter") this.toggleNameBox()}
                }
            />
            <div className={styles.NodeSetNameBoxButtons}>
                <button className={`${styles.Button} ${styles.ButtonDestruct}`} onClick={this.selfDestruct}>delete</button>
                <button className={`${styles.Button} ${styles.ButtonSignBit}`} onClick={this.toggleSignBit} >ZM</button>
            </div>
        </div>
    )

    toggleSignBit = () => {
        this.setState({
        "signed": !this.state.signed,
        }, this.updateValue);
    };

    toggleNameBox = () => {
        this.setState({renderNameBox: !this.state.renderNameBox})
    }

    selfDestruct = () => {
        this.detachEventListeners();
        this.setState({
            "render": false,
        });

        for (let node of this.state.nodes){
            node.dispatchEvent(remove);
        }
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

    removeNode = (e) => {
        if (e.button === 2){
            const nodeToRemove = e.target;
            nodeToRemove.dispatchEvent(remove);

            const newNodesArray = this.state.nodes.filter(
                node => node !== nodeToRemove
            );

            this.state.ref.current.removeChild(nodeToRemove);
            this.setState({
                "nodes": newNodesArray
            }, () => {
                if (this.state.nodes.length === 0) this.removeNodeSet();
                this.updateValue();
            });

        }
    };

    removeNodeSet = () => {
        this.setState({
            'render': false,
        },
        this.detachEventListeners()
        );
    }

    spreadMoveEvent = () => {
        const move = new Event("move");
        for (let node of this.state.nodes){
            node.dispatchEvent(move);
        }
    }

    componentDidMount(){
        this.state.ref.current.addEventListener('signalChange', this.updateValue);
        this.state.ref.current.addEventListener('merge', this.removeNodeSet);
        this.state.ref.current.addEventListener('move', this.spreadMoveEvent);

        const children = this.state.nodes;
        for (let i = 0; i < children.length; i++){
            children[i].style.top = "";
            children[i].addEventListener("mousedown", this.removeNode);
            this.state.ref.current.appendChild(children[i]);
        }

        this.updateValue();
    }

    detachEventListeners = () => {
        this.state.ref.current.removeEventListener('signalChange', this.updateValue);
        this.state.ref.current.removeEventListener('merge', this.removeNodeSet);
        this.state.ref.current.removeEventListener('move', this.spreadMoveEvent);
    }

    render(){
        if (!this.state.render) return null;

        return (
            <div ref={this.state.ref}
                style={{top: this.state.position}}
                className={`${styles.NodeSet} ${this.style}`}
                onClick={this.show}
                data-element="NodeSet"
                data-signed={this.state.signed}
            >

                <div className={styles.NodeSetHandle}
                    data-element="NodeSetHandle"
                    onMouseUp={this.handleHandleMouseUp}
                >
                    {this.state.value}
                    {this.state.renderNameBox ? this.getNameBox() : ""}
                </div>
            </div>
        )
    }
}

export default NodeSet;