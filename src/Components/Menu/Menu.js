import styles from './Menu.module.scss'
import Button from './Button'

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
        </div>
    )
}

export default Menu;
