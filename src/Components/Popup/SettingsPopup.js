import Popup from './Popup';
import styles from './SettingsPopup.module.scss';

class SettingsPopup extends Popup {
    style = {
        maxWidth: '440px',
        height:   '440px',
    }

    state = {
        settings: {
            ...this.props.settings,
        }
    }

    handleOnChangeSlider = (e) => {
        this.setState({
            settings: {
                ...this.state.settings,
                grid: e.target.value
            }
        });
    }

    handleOnChangeCheckbox = (e, setting) => {
        let settings = {...this.state.settings};
        settings[setting] = e.target.checked;
        this.setState({settings: settings});
    }

    selfDestruct = () => {
        this.props.adjustSettings(this.state.settings);
        this.props.killPopup();
    }

    getGridSliderValue = () => {
        var val = this.state.settings.grid;
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
                        value={this.state.settings.grid}
                        onChange={this.handleOnChangeSlider}
                        className={styles.MainSectionGridSlider}
                    />
                    <br/>
                    <br/>
                    <span>show grid</span>
                    <input
                        type="checkbox"
                        checked={this.state.settings.showGrid}
                        onChange={(e) => this.handleOnChangeCheckbox(e, 'showGrid')}
                    />
                </div>
                <p>Nodes</p>
                <div className={styles.MainSection}>
                    <span>show names</span>
                    <input
                        type="checkbox"
                        checked={this.state.settings.showNodeNames}
                        onChange={(e) => this.handleOnChangeCheckbox(e, 'showNodeNames')}
                    />
                </div>
            </div>
        ));
    }
}

export default SettingsPopup;
