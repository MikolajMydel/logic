import Node from './Node';

class StartingNode extends Node {
    state = {
        value: false,
        childPins: [],
    }

    constructor(props) {
        super();
        this.state.value = props.value;
    }

    // przylaczanie innego pina jako dziecko
    connect = (target) => {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    render() {
        return super.renderBase(() => this.props.setFocusedElement(this))
    }
}

export default StartingNode;
