import Popup from './Popup';
import styles from './SaveGatePopup.module.scss';

class ProjectPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '160px',
    }

    state = {
        givenName: undefined,
        givenColor: '#ff00ff',
    }

    handleOnChangeName = (e) => {
        this.setState({
            givenName: e.target.value
        });
    }

    handleOnChangeColor= (e) => {
        this.setState({
            givenColor: e.target.value
        });
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <input
                    type="text"
                    className={styles.MainNameText}
                    placeHolder="NowaBramka"
                    onChange={this.handleOnChangeName}
                />
                <input
                    type="button"
                    value="+"
                    className={styles.MainNewButton}
                    onClick={() => this.saveGate()}
                />
                <input
                    type="color"
                    className={styles.MainColor}
                    value={this.state.givenColor}
                    onChange={this.handleOnChangeColor}
                />
            </div>
        ));
    }
}

export default ProjectPopup;
