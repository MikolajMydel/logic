import React from "react";
import styles from './NodeSet.module.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ref: React.createRef(),

        }
        this.nodes = props.nodes;
    }

    calculateValue = () => {
        const nodes = this.nodes;
        for (let i = 0; i < nodes.length; i++){
            console.log(nodes[i]);
        }
    }

    componentDidMount(){
        this.state.ref.current.addEventListener('signalChange', this.calculateValue);
    }

    componentWillUnmount(){
        this.state.ref.current.removeEventListener('signalChange', this.calculateValue);
    }

    render(){
        const position = this.props.position + "px";
        return (
            <div ref={this.state.ref} style={{top:position}} className={styles.NodeSet} onClick={this.show}>
                <div className={`NodeSetHandle ${styles.NodeSetHandle}`}>
                </div>
                {this.nodes}
            </div>
        )
    }

}

export default NodeSet;