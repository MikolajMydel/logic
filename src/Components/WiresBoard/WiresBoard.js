import styles from './WiresBoard.module.scss';

const WiresBoard = (props) => {
    return (
        <svg className={ styles.WiresBoard }>
                { props.wires }
        </svg>
    )
}

export default WiresBoard;