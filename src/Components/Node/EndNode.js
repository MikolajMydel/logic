import Node from './Node';

class EndNode extends Node {
    state = {
        value: undefined,
        parentPin: undefined,
    }

    changeParentPin(newParent) {
        const oldParent = this.state.parentPin;
        if (oldParent){
            const oldParentChildren = oldParent.state.childPins;
            const pinIndex = oldParentChildren.indexOf (this);

            // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
            const updatedOldParentChildren = [...oldParentChildren];
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
        if(newParent)
            this.changeParentPin(newParent);
    }

    receiveSignal(signal) {
        this.setState({'value': signal});
	}
}

export default EndNode;
