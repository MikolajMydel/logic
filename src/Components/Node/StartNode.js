import Node from './Node';

class StartNode extends Node {
    state = {
        value: false,
        childPins: [],
    }

    // przylaczanie innego pina jako dziecko
    connect(target) {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    handleOnClick = (e) => {
        if(e.button === 0) // Lewy PM
            this.props.setFocusedElement(this);
        else if (e.button === 1) // Środkowy PM
            this.toggleValue();
    }

    toggleValue() {
        const val = !(this.state.value);
        this.setState({value: val}, function() {
            for (let i = 0; i < this.state.childPins.length; i++) {
                this.state.childPins[i].receiveSignal(val);
            }
        });
    }
}

export default StartNode;
