import React from 'react';
import Node from './Node';
import styles from './Node.module.scss';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,

        ref: React.createRef(),
    }

    changeParentPin(newParent) {
        // musimy usunac pin z listy dzieci starego rodzica...
        const oldParent = this.state.parentPin;
        // ... o ile ten istnial (nie jest undefined)
        if (oldParent){
            const oldParentChildren = oldParent.state.childPins;
            const pinIndex = oldParentChildren.indexOf (this);

            // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
            const updatedOldParentChildren = [...oldParentChildren];
            // usuwamy z niej aktualny pin
            updatedOldParentChildren.splice (pinIndex, 1);

            // ustawiamy nowa tablice dzieci jako stan starego rodzica
            oldParent.setState({"childPins": updatedOldParentChildren });

        }
        newParent.connect(this);
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
    }

    handleOnClick = () => {
        const newParent = this.props.getFocusedElement();
        if(newParent){
            this.changeParentPin(newParent);
            this.props.drawWire( newParent, this );
        }
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}

    render() {
        let style;
        const value = this.state.value;
        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = styles.NodeUndefined;
        else if ( value ) style = styles.NodeTrue;
        else style = styles.NodeFalse;

        const position = this.props.position + 'px';

        return (
            <div ref={this.state.ref}
                className={ `${styles.Node} ${style}` } onMouseDown={ this.handleOnClick } style={{ top: position }} >
            </div>
        )
    }

}

export default EndNode;
