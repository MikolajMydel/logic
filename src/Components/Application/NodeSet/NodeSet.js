import React from "react";
import './NodeSet.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ref: React.createRef(),
            render: true,
            value: this.calculateValue(),
            position: this.props.position,

        }

    }

    calculateValue = () => {
        const nodes = this.props.nodes;
        let value = 0;

        for (let i = 0; i < nodes.length; i++){
            if (nodes[i].getAttribute("value") === "true") value += Math.pow(2, i);
        }

        return value;
    }

    updateValue = () => this.setState({
        'value': this.calculateValue(),
    });

    hideNodeSet = () => {
        this.setState({
            'render': false,
        },
        this.detachEventListeners()
        );
    }

    spreadMoveEvent = () => {
        const move = new Event("move");
        for (let node of this.props.nodes){
            node.dispatchEvent(move);
        }
    }

    componentDidMount(){
        this.state.ref.current.addEventListener('signalChange', this.updateValue);
        this.state.ref.current.addEventListener('merge', this.hideNodeSet);
        this.state.ref.current.addEventListener('move', this.spreadMoveEvent);

        const children = this.props.nodes;
        for (let i = 0; i < children.length; i++){
            children[i].style.top = "";
            this.state.ref.current.appendChild(children[i]);
        }

        this.spreadMoveEvent();
    }

    detachEventListeners = () => {
        this.state.ref.current.removeEventListener('signalChange', this.updateValue);
        this.state.ref.current.removeEventListener('merge', this.hideNodeSet);
        this.state.ref.current.removeEventListener('move', this.spreadMoveEvent);
    }

    render(){
        if (!this.state.render) return null;

        return (
            <div ref={this.state.ref}
                style={{top: this.state.position}}
                className={'NodeSet'}
                onClick={this.show}
            >

                <div className="NodeSetHandle"
                    data-element="NodeSetHandle"
                >
                    {this.state.value}
                </div>
            </div>
        )
    }

}

export default NodeSet;