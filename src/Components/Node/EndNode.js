import React from 'react';
import Node from './Node';

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
}

export default EndNode;
