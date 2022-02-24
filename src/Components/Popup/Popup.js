import React from 'react';
import styles from './Popup.module.scss';

class Popup extends React.Component {
    style = {
        maxWidth: '400px',
        height: '400px',
    }
    render(){
        return(
            <div className={styles.Cover}>
                <div
                    className={styles.Popup}
                    style={this.style}
                >
                    <p onClick={this.props.killPopup}>X</p>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Popup;
