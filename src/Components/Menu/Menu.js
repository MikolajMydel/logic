import styles from './Menu.module.scss'
import Button from './Button'

const Menu = (props) => {
    return (
        <div className={styles.Menu}>
            <ul>
                <li><Button text="przycisk 1" action={() => console.log("przycisk 1")}/></li>
                <li><Button text="przycisk 2"/></li>
                <li><Button text="przycisk 3"/></li>
            </ul>
        </div>
    )
}

export default Menu;
