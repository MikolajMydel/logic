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

    handleOnChangeSlider = (e, setting) => {
        let settings = {...this.state.settings};
        settings[setting] = e.target.value;
        this.setState({settings: settings});
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

    getClockSliderValue = () => {
        var val = this.state.settings.clock;
        if(val === '1') val = "off";
        return val;
    }

    render(){
        return super.render((
            <div className={styles.Main}>
                <p>Siatka</p>
                <div className={styles.MainSection}>
                    <span>{"rozmiar: " + this.getGridSliderValue()}</span>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={this.state.settings.grid}
                        onChange={(e) => this.handleOnChangeSlider(e, 'grid')}
                        className={styles.MainSectionSlider}
                    />
                    <br/>
                    <br/>
                    <span>pokaż siatkę</span>
                    <input
                        type="checkbox"
                        checked={this.state.settings.showGrid}
                        onChange={(e) => this.handleOnChangeCheckbox(e, 'showGrid')}
                    />
                </div>
                <p>Bramki</p>
                <div className={styles.MainSection}>
                    <span>{'interwał czasowy: ' + this.getClockSliderValue() + 'ms'}</span>
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        value={this.state.settings.clock}
                        onChange={(e) => this.handleOnChangeSlider(e, 'clock')}
                        className={styles.MainSectionSlider}
                    />
                </div>
                <p>Pola wejścia/wyjścia</p>
                <div className={styles.MainSection}>
                    <span>pokaż nazwy</span>
                    <input // na razie nie ma zastosowania TODO
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
