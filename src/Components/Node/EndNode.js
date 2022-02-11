import React from 'react';
import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,

        ref: React.createRef(),
    }

    handleOnClick = (e) => {
        if(e.button === 0) { // lewy
            const newParent = this.props.getFocusedElement();
            if(newParent)
                this.changeParentPin(newParent);
        } else if(e.button === 1) { // srodkowy
            this.disconnect();
        }
    }

    disconnect() {
        if(!this.state.parentPin) return;
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    changeParentPin = (newParent) => {
        if ( newParent !== this.state.parentPin ){
            if (this.state.parentPin)
                this.state.parentPin.disconnect(this);

            newParent.connect(this);

            this.props.drawWire( newParent, this );

            this.setState({'parentPin': newParent});
            this.receiveSignal(newParent.state.value);
        }
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}
}

export default EndNode;
