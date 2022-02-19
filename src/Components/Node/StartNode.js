import Node from './Node';
import signalChange from '../../Events/signalChange';
class StartNode extends Node {
    state = {
        ...this.state,
        childPins: [],
        value: false,
    }

    // przylaczanie innego pina jako dziecko
    connect(target) {
        let cps = this.state.childPins;
        cps.push(target);
        this.setState({'childPins': cps});
    }

    disconnect(target) {
        const oldChildren = this.state.childPins;
        const pinIndex = oldChildren.indexOf(target);

        // tworzymy kopie tablicy dzieci (aby uniknac bezposredniej zmiany stanu)
        let updatedChildren = [...oldChildren];
        updatedChildren.splice (pinIndex, 1);

        // ustawiamy nowa tablice dzieci jako stan
        this.setState({"childPins": updatedChildren });
    }

    handleOnMouseDown = (e) => {
        if(e.button === 0) // Lewy PM
            this.props.setFocusedElement(this);
        else if (e.button === 1) // Środkowy PM
            this.toggleValue();
    }

    selfDestruct = () => {
        this.fireRemoveEvent();

        this.setState({render: false});
        for(const child of this.state.childPins){
            child.disconnect(this);
        }
    }

    toggleValue() {
        const val = !(this.state.value);
        this.setState({value: val}, function() {
            for (let i = 0; i < this.state.childPins.length; i++) {
                this.state.childPins[i].receiveSignal(val);
            }

            this.state.ref.current.dispatchEvent(signalChange);
        });
    }
}

export default StartNode;
