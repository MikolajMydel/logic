import React from "react";
import styles from "./Pin.module.scss";

const stateClasses = {
    true: styles.PinHighState,
    false: styles.PinLowState,
    undefined: styles.PinUndefinedState,
};
class Pin extends React.Component {
    constructor(props) {
        super();
        this.style = styles;
        this.index = props.index;
        this.gate = props.gate;
    }

    setStateClass = () => {
        this.setState({
            stateClass: stateClasses[this.state.value],
        });
    };

    componentDidMount() {
        if (this.props.mount) this.props.mount(this); // dodaj siebie do tablicy pinów swojej bramki
    }
}

export default Pin;
