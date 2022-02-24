import React from 'react';
import styles from './Popup.module.scss';

class Popup extends React.Component {
    state={
        render: true,
    }

    style = {
        maxWidth: '400px',
        height: '400px',
    }
    render(){
        if (!this.state.render) return null;

        return(
            <div className={styles.Cover}>
                <div
                    className={styles.Popup}
                    style={this.style}
                >
                    <p onClick={() => this.setState({render: false})}>X</p>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Popup;
