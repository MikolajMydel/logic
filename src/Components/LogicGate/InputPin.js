import Pin from "./Pin";
import {checkForCycle} from "../../functions";

class InputPin extends Pin {
    constructor(props) {
        super(props);
        this.state = {
            parentPin: undefined,
            value: undefined,
        }
    }

    handleOnClick = () => {
        const newParent = this.props.getFocusedElement();
        if(newParent)
            this.changeParentPin(newParent);
    }

    disconnect() {
        this.state.parentPin.disconnect(this);
        this.setState({'parentPin': undefined});
        this.receiveSignal(undefined);
    }

    // zmień do jakiego outputa podłączony jest ten input
    changeParentPin(newParent) {
        if (this.state.parentPin)
            this.state.parentPin.disconnect(this);
        newParent.connect(this);
        this.setState({'parentPin': newParent});
        this.receiveSignal(newParent.state.value);
    }

    receiveSignal(signal) {
        this.setState({'value': signal}, function() {
            // sprawdzanie pętli wykonuje się dla każdej bramki, raczej
            // niepotrzebnie, ale jak próbuję to naprawić to się psuje :/
            if (this.gate.state.recursion) return;
            if (checkForCycle(this.gate)){
                this.gate.setState({"recursion": true},
                    () => setTimeout(
                        () => { this.gate.setState({"recursion": false})}, 500)
                );
            }
            this.gate.processOutput();
        });
	}

    render(){
        return <button className={ this.style.LogicGateInput } onClick={ this.handleOnClick } ></button>;
    }
}

export default InputPin;
