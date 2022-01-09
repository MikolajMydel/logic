import React from 'react';
import styles from './Wire.scss';

function calculatePath (firstPin, secondPin){
    return "m135,202l453,0";
}

const Wire = (firstPin, secondPin) => {

    return <path d={calculatePath (firstPin, secondPin) } className={styles.Wire} stroke-width="3" stroke="#000" fill="#fff"/>
}

export default Wire;