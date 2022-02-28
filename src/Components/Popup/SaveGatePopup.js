import Popup from './Popup';
import styles from './SaveGatePopup.module.scss';

function validateGateName(name) {
    // nazwa może składać się wyłącznie z liter i cyfr
    var regex = /^f_[A-Za-z0-9]+$/;
    return regex.test(name);
}

const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16)

class SaveGatePopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '160px',
    }

    state = {
        givenName: '',
        givenColor: getRandomColor(),
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

    saveGate = () => {
        const name = 'f_' + this.state.givenName;
        if(!validateGateName(name) || global[name] !== undefined){
            alert('niepoprawna nazwa');
            return;
        }

        this.props.saveGate(name, this.state.givenColor);
        this.selfDestruct();
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <input
                    type="text"
                    className={styles.MainNameText}
                    placeHolder="NowaBramka"
                    maxLength="12"
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

export default SaveGatePopup;
