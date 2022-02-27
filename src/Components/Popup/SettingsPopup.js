import Popup from './Popup';
import styles from './SettingsPopup.module.scss';

class SettingsPopup extends Popup {
    style = {
        maxWidth: '440px',
        height:   '440px',
    }

    state = {
        gridSlider: this.props.settings['grid'],
        showGrid:   this.props.settings['showGrid'],
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
        this.props.adjustSettings({
            grid:     this.state.gridSlider,
            showGrid: this.state.showGrid,
        })
        this.props.killPopup();
    }

    getGridSliderValue = () => {
        var val = this.state.gridSlider;
        if(val === '1') val = "off";
        return val;
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <p>Grid</p>
                <div className={styles.MainSection}>
                    <span>{"width: " + this.getGridSliderValue()}</span>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={this.state.gridSlider}
                        onChange={this.handleOnChangeSlider}
                        className={styles.MainSectionGridSlider}
                    />
                    <br/>
                    <br/>
                    <span>show grid</span>
                    <input
                        type="checkbox"
                        checked={this.state.showGrid}
                        onChange={this.handleOnChangeCheckbox}
                    />
                </div>
            </div>
        ));
    }
}

export default SettingsPopup;
