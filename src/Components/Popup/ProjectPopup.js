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
                    <button
                        className={styles.MainListProjectBody}
                        onClick={() => this.loadProject(proj)}
                    >
                        <p>{proj}</p>
                    </button>
                    <button
                        className={styles.MainListProjectDelete}
                        onClick={() => this.deleteProject(proj)}
                    >
                        X
                    </button>
                </div>
            );
        }
        let isEmpty = false;
        if (projects.length === 0){
            projects.push(<h2>Brak utworzonych projektów</h2>);
            isEmpty = true;
        }

        return super.render((
            <div className={styles.Main}>
                <h1 className={styles.MainTitle}>Wybierz projekt</h1>
                <div className={styles.MainNewProjectArea}>
                    <div className={styles.AnimatedLabel}>
                        <input
                            type="text"
                            className={`${styles.MainNewText} ${styles.AnimatedLabelInput}`}
                            placeholder=" "
                            maxLength="24"
                            onChange={this.handleOnChange}
                        />
                        <label className={styles.AnimatedLabelLabel}>
                            Nazwa nowego projektu
                        </label>
                    </div>
                    <input
                        type="button"
                        value="Stwórz"
                        className={styles.MainNewButton}
                        onClick={() => this.loadProject(this.state.givenName)}
                    />
                </div>
                <div className={`${styles.MainList} ${ isEmpty ? styles.MainListEmpty : "" }`}>
                    {projects}
                </div>
            </div>
        ));
    }
}

export default ProjectPopup;
