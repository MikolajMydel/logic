import Popup from './Popup';
import styles from './SettingsPopup.module.scss';

class SettingsPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '440px',
    }

    state = {
        gridSlider: this.props.settings['gridWidth'],
        showGrid: this.props.settings['showGrid'],
    }

    handleOnChangeSlider = (e) => {
        this.setState({
            gridSlider: e.target.value
        });
    }

    handleOnChangeCheckbox = (e) => {
        this.setState({
            showGrid: e.target.checked
        });
    }

    selfDestruct = () => {
        this.props.adjustSettings({grid: this.state.gridSlider, showGrid: this.state.showGrid})
        this.props.killPopup();
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <input
                    type="range"
                    min="1"
                    max="60"
                    value={this.state.gridSlider}
                    onChange={this.handleOnChangeSlider}
                    className={styles.MainGridSlider}
                />
                <input
                    type="checkbox"
                    checked={this.state.showGrid}
                    onChange={this.handleOnChangeCheckbox}
                />
            </div>
        ));
    }
}

export default SettingsPopup;
