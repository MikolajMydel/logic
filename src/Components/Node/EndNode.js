import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,
    }

    changeParentPin = () => {
        const newParent = this.props.getFocusedElement();
        newParent.connect(this);
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}

    render() {
        return super.renderBase(this.changeParentPin);
    }
}

export default EndNode;
