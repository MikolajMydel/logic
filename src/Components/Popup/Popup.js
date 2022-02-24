import React from 'react';
import styles from './Popup.module.scss';

class Popup extends React.Component {
    state={
        render: true,
        ref: React.createRef(),
    }

    render(){
        if (!this.state.render) return null;

        return(
            <div
                className={styles.Popup}
                ref={this.state.ref}
            >
                {this.props.content}
                <p onClick={() => this.setState({render: false})}>x</p>
            </div>
        );
    }
}

export default Popup;
