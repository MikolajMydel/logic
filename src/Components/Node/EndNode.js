import React from "react";
import parentChange from "../../Events/parentChange";
import Node from "./Node";

class EndNode extends Node {
  state = {
    render: false,
    value: undefined,
    parentPin: undefined,
    ref: React.createRef(),
  };

  handleOnMouseDown = (e) => {
    if (e.button === 0) {
      const newParent = this.props.getFocusedElement();
      if (newParent) this.changeParentPin(newParent);
    } else if (e.button === 2) {
        this.selfDestruct();
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

  selfDestruct() {
    this.disconnect();
    this.setState({render: false});
  }

  receiveSignal(signal) {
    this.setState({ value: signal });
  }
}

export default EndNode;
