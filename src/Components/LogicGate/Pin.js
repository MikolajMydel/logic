import React from "react";
import styles from "./LogicGate.module.scss";

class Pin extends React.Component {
    style = styles;

    constructor(props) {
        super();

        this.index = props.index;
        this.gate = props.gate;
    }

    componentDidMount() {
        if(this.props.mount)
            this.props.mount(this); // dodaj siebie do tablicy pinów swojej bramki
    }
}

export default Pin;
