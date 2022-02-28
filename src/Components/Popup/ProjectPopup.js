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
        projects: JSON.parse(localStorage.getItem("projects")),
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

    deleteProject = (project) => {
        if(this.props.getCurrentProjectName() === project) {
            alert('nie możesz usunąć otwartego projektu');
            return;
        }
        let obj = this.state.projects;
        delete obj[project];
        this.setState({projects: obj});
        localStorage.setItem("projects", JSON.stringify(obj));
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
        for (const proj in this.state.projects){
            projects.push(
                <div
                    className={styles.MainListProject}
                >
                    <div
                        className={styles.MainListProjectBody}
                        onClick={() => this.loadProject(proj)}
                    >
                        <p>{proj}</p>
                    </div>
                    <div
                        className={styles.MainListProjectDelete}
                        onClick={() => this.deleteProject(proj)}
                    >
                        <strong>X</strong>
                    </div>
                </div>
            );
        }

        return super.render((
            <div className={styles.Main}>
                <input
                    type="text"
                    className={styles.MainNewText}
                    placeHolder="Nowy projekt"
                    maxLength="24"
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
