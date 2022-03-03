import React from 'react';
import styles from './Popup.module.scss';

class Popup extends React.Component {
    style = {
        maxWidth: '400px',
        height: '400px',
    }

    selfDestruct = () => {
        this.props.killPopup();
    }

    render(contents){
        return(
            <>
                <div
                className={styles.Popup}
                style={this.style}
                >
                    <strong onClick={this.selfDestruct}>X</strong>
                    {contents}
                </div>
                <div className={styles.Cover} onClick={this.selfDestruct}>
                </div>
            </>
        );
    }
}

export default Popup;
