import Popup from './Popup';
import styles from './ProjectPopup.module.scss';

class ProjectPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '600px',
    }

    handleOnChange = (e) => {
        this.setState({
            givenName: e.target.value
        });
    }

    render(){
        var projects = [];
        return super.render((
            <div className={styles.Main}>
                    <input
                        type="text"
                        className={styles.MainNewText}
                        placeHolder="Nowy projekt"
                        onChange={this.handleOnChange}
                    />
                    <input
                        type="button"
                        value="+"
                        className={styles.MainNewButton}
                        onClick={() => {this.props.loadProject(this.state.givenName); this.props.killPopup();}}
                    />
                <hr/>
                {projects}
            </div>
        ));
    }
}

export default ProjectPopup;
