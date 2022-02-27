import React from "react";
import './NodeSet.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ref: React.createRef(),
            nodes: this.props.nodes,
            render: true,

            position: this.props.position,

        }
    }

    calculateValue = () => {
        const nodes = this.state.nodes;
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

    componentDidMount(){
        this.state.ref.current.addEventListener('signalChange', this.calculateValue);
        this.state.ref.current.addEventListener('merge', this.hideNodeSet);

        const children = this.state.nodes;
        for (let i = 0; i < children.length; i++){
            children[i].style.top = "";
            this.state.ref.current.appendChild(children[i]);
        }
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