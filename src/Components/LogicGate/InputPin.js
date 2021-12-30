import Pin from "./Pin";

class InputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            parentPin: undefined,
            value: undefined,
        }
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin = () => {
        const newParent = this.props.getFocusedElement();
        newParent.connect(this);
        this.setState({'parentPin': newParent})
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            this.gate.processOutput();
        });
	}

    render(){
        return <button className={ this.style.LogicGateInput } onClick={ this.changeParentPin } ></button>;
    }
}

export default InputPin;
