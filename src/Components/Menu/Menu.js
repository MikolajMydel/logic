import styles from './Menu.module.scss'
import Button from './Button'
import github from '../../images/github.png'

const Menu = (props) => {
    let buttons = [];
    for (const f of props.functions){
        buttons.push(
            <li><Button text={f.name} action={f.function}/></li>
        );
    }
    return (
        <div className={styles.Menu}>
            <ul>
                {buttons}
            </ul>
            <a
                href="https://github.com/isayni/logic"
                target="_blank"
                rel="noreferrer"
            >
                <img src={github} alt="GitHub repository" />
            </a>
        </div>
    )
}

export default Menu;
