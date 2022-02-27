import React from "react";
import './NodeSet.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ref: React.createRef(),
            render: true,

            position: this.props.position,

        }
    }

    calculateValue = () => {
        const nodes = this.props.nodes;
        for (let i = 0; i < nodes.length; i++){
            console.log(nodes[i]);
        }
    }

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
        this.state.ref.current.addEventListener('signalChange', this.calculateValue);
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
        this.state.ref.current.removeEventListener('signalChange', this.calculateValue);
        this.state.ref.current.removeEventListener('merge', this.hideNodeSet);
    }

    render(){
        if (!this.state.render) return null;

        return (
            <div ref={this.state.ref} style={{top: this.state.position}} className={'NodeSet'} onClick={this.show}>
                <div className={`NodeSetHandle`}>
                </div>
            </div>
        )
    }

}

export default NodeSet;