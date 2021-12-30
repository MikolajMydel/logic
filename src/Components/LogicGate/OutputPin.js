import Pin from "./Pin";

class OutputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            childPins: [],
            value: undefined,
        }
    }

    // przylaczanie innego pina jako dziecko
    connect(target) {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            for (let i = 0; i < this.state.childPins.length; i++) {
                this.state.childPins[i].receiveSignal(signal);
            }
        });
	}

    render(){
        return <button className={ this.style.LogicGateOutput } onClick={ () => this.props.setFocusedElement(this) }> </button>;
    }
}

export default OutputPin;
