import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,
    }

    changeParentPin(newParent) {
        if (this.state.parentPin)
            this.state.parentPin.disconnect(this);
        newParent.connect(this);
        this.setState({'parentPin': newParent});
        this.receiveSignal(newParent.state.value);
    }

    disconnect() {
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    handleOnClick = () => {
        const newParent = this.props.getFocusedElement();
        if(newParent)
            this.changeParentPin(newParent);
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}
}

export default EndNode;
