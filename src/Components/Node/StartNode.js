import Node from './Node';

class StartNode extends Node {
    state = {
        value: false,
        childPins: [],
    }

    // przylaczanie innego pina jako dziecko
    connect = (target) => {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    toggleValue = () => {
        const val = !(this.state.value);
        this.setState({value: val}, function() {
            for (let i = 0; i < this.state.childPins.length; i++) {
                this.state.childPins[i].receiveSignal(val);
            }
        });
        // testowo dałem tą funkcję tutaj bo nie mam na ten moment jak inaczej sprawdzić działanie toggleValue()
        // wykonuja sie obie jednoczesnie przy kliknieciu
        this.props.setFocusedElement(this)
    }

    render() {
        return super.renderBase(this.toggleValue)
    }
}

export default StartNode;
