import styles from './Menu.module.scss'
import Button from './Button'

const Menu = (props) => {
    return (
        <div className={styles.Menu}>
            <ul>
                <li><Button text="przycisk 1" action={() => props.functions[0]()}/></li>
                <li><Button text="przycisk 2" action={() => props.functions[1]()}/></li>
                <li><Button text="przycisk 3" action={() => props.functions[2]()}/></li>
            </ul>
        </div>
    )
}

export default Menu;
