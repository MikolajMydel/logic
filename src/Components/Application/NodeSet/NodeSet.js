import React from "react";
import styles from './NodeSet.module.scss';

class NodeSet extends React.Component {
    constructor(props){
        super(props);

        this.nodes = props.nodes;

    }

    render(){
        const position = this.props.position + "px";
        return (
            <div style={{top:position}} className={styles.NodeSet}>
                <div className={`NodeSetHandle ${styles.NodeSetHandle}`}>
                </div>
                {this.nodes}
            </div>
        )
    }

}

export default NodeSet;