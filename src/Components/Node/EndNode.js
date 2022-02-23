import parentChange from "../../Events/parentChange";
import Node from "./Node";

class EndNode extends Node {
  state = {
    ...this.state,
    parentPin: undefined,
    value: undefined,
  };

  handleOnMouseDown = (e) => {
    if (e.button === 0) {
      const newParent = this.props.getFocusedElement();
      if (newParent) this.changeParentPin(newParent);
    }
  };

  disconnect = () => this.changeParentPin(undefined);

  changeParentPin = (newParent) => {
    if (newParent !== this.state.parentPin) {
      if (this.state.parentPin) this.state.parentPin.disconnect(this);

      this.setState(
        { parentPin: newParent },
        // funkcja powiadamiajaca przewod o usunieciu polaczenia
        () => {
          if( this.state.ref.current )
            this.state.ref.current.dispatchEvent(parentChange);
        }
      );

      if (newParent) {
        newParent.connect(this);
        this.props.drawWire(newParent, this);
        this.receiveSignal(newParent.state.value);
      } else this.receiveSignal(undefined);
    }
  };

  selfDestruct = () => {
    this.fireRemoveEvent();

    this.disconnect();
    this.setState({render: false});
  }

  receiveSignal(signal) {
    this.setState({ value: signal });
  }
}

export default EndNode;
