import styles from './Menu.module.scss'
import Button from './Button'

const Menu = (props) => {
    return (
        <ul className={ styles.Menu }>
            <li><Button text="przycisk 1" action={() => console.log("przysick")}/></li>
            <li><Button text="przycisk 2"/></li>
            <li><Button text="przycisk 3"/></li>
        </ul>
    )
}

export default Menu;
