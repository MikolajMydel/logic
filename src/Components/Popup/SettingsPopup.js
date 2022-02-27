import Popup from './Popup';
import styles from './SettingsPopup.module.scss';

class SettingsPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '440px',
    }

    state = {
        gridSlider: this.props.getGrid(),
    }

    handleOnChangeSlider = (e) => {
        this.setState({
            gridSlider: e.target.value
        });
    }

    selfDestruct = () => {
        this.props.adjustSettings({grid: this.state.gridSlider})
        this.props.killPopup();
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <input
                    type="text"
                    onChange={this.handleOnChangeSlider}
                />
            </div>
        ));
    }
}

export default SettingsPopup;
