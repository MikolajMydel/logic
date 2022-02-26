import React from "react";
import './NodeSet.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ref: React.createRef(),

        }

        this.position = props.HTMLChildren[0].style.top;
    }

    calculateValue = () => {
        const nodes = this.nodes;
        for (let i = 0; i < nodes.length; i++){
            console.log(nodes[i]);
        }
    }

    componentDidMount(){
        this.state.ref.current.addEventListener('signalChange', this.calculateValue);

        const children = this.props.HTMLChildren;

        for (let i = 0; i < children.length; i++){
            // usuwam style zwiazane z indywidualna pozycja node
            children[i].style.top = "";
            this.state.ref.current.appendChild(children[i]);
        }
    }

    componentWillUnmount(){
        this.state.ref.current.removeEventListener('signalChange', this.calculateValue);
    }

    render(){
        return (
            <div ref={this.state.ref} style={{top:this.position}} className={'NodeSet'} onClick={this.show}>
                <div className={`NodeSetHandle`}>
                </div>
            </div>
        )
    }

}

export default NodeSet;