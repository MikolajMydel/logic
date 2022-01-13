import styles from './Menu.module.scss'

const Button = (props) => {
    return (
        <button onClick={props.action} className={styles.Button}>{props.text}</button>
    )
}

export default Button;
