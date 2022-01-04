import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,
    }

    changeParentPin(newParent) {
        newParent.connect(this);
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
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
