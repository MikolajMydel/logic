import Popup from './Popup';
import styles from './ProjectPopup.module.scss';

function validateProjectName(name) {
    if(name === undefined) return false;
    var regex = /^[A-Za-z0-9 ]+$/;
    return regex.test(name);
}
class ProjectPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '600px',
    }

    state = {
        givenName: undefined,
    }

    handleOnChange = (e) => {
        this.setState({
            givenName: e.target.value
        });
    }

    loadProject = (name) => {
        if (!validateProjectName(name)) {
            alert('niepoprawna nazwa');
            return;
        }
        this.props.loadProject(name);
        this.props.killPopup();
    }

    selfDestruct = () => {
        if(this.props.getCurrentProjectName() === undefined){
            alert('wybierz lub utwórz projekt')
            return;
        }
        this.props.killPopup();
    }
    render(){
        var projects = [];
        for (const proj in JSON.parse(localStorage.getItem("projects"))){
            projects.push(
                <div
                    className={styles.MainListProject}
                    onClick={() => this.loadProject(proj)}
                >
                    {proj}
                </div>
            );
        }

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
                        onClick={() => this.loadProject(this.state.givenName)}
                    />
                <hr/>
                <div className={styles.MainList}>
                    {projects}
                </div>
            </div>
        ));
    }
}

export default ProjectPopup;
