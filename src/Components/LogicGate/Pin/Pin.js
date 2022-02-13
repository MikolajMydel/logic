import React from "react";
import styles from './Pin.module.scss';

class Pin extends React.Component {

    constructor(props) {
        super();
        this.style = styles;
        this.index = props.index;
        this.gate = props.gate;
    }

    componentDidMount() {
        if(this.props.mount)
            this.props.mount(this); // dodaj siebie do tablicy pinów swojej bramki
    }
}

export default Pin;
