import React from 'react';
import parentChange from '../../Events/parentChange';
import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,

        ref: React.createRef(),
    }

    handleOnClick = (e) => {
        const newParent = this.props.getFocusedElement();
            if(newParent)
                this.changeParentPin(newParent);
    }

    changeParentPin = (newParent) => {
        if ( newParent !== this.state.parentPin ){
            if (this.state.parentPin)
                this.state.parentPin.disconnect(this);

            newParent.connect(this);

            this.props.drawWire( newParent, this );

            this.setState({'parentPin': newParent},
                // funkcja powiadamiajaca przewod o usunieciu polaczenia
                () => { this.state.ref.current.dispatchEvent(parentChange)}
            );

            this.receiveSignal(newParent.state.value);
        }
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}
}

export default EndNode;
