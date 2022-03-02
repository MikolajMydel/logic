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
            <a href="https://github.com/isayni/logic"><img src={github}/></a>
        </div>
    )
}

export default Menu;
