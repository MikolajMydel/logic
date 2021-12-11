import React from 'react';
import styles from './StartingNode.module.scss';

class StartingNode extends React.Component {

    state = {
        'value': undefined,
    }

    constructor( props ) {
        super();

        this.state.value = props.value;

        /* this.setState({'value': props.value}, function() {
            console.log ( this.state.value );
        });
        */
    };

    getValue = () => this.state.value;


    render() {

        const value = this.props.value;
        let style = null;

        // styl na podstawie wartosci
        if ( value === undefined ) {
            style = styles.StartingNodeUndefined;
        } else {

            if ( value ) style = styles.StartingNodeTrue;
            else style = styles.StartingNodeFalse;
        }

        return (

            <div className={`${styles.StartingNode} ${style}`} onClick={ () => this.props.getFocus (this) } >
            </div>
        )

    }
}

export default StartingNode;
