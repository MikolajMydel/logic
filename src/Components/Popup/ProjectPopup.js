import Popup from './Popup';
import styles from './ProjectPopup.module.scss';

class ProjectPopup extends Popup {
    style = {
        maxWidth: '440px',
        height: '600px',
    }
    render(){
        var projects = [];
        return super.render((
            <div className={styles.Main}>
                <button className={styles.MainNewButton}>Nowy Projekt +</button>
                <hr/>
                {projects}
            </div>
        ));
    }
}

export default ProjectPopup;
