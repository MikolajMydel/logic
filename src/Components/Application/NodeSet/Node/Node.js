import React from 'react';
import '../NodeSet.scss';
import remove from '../../../../Events/remove';
import StartNode from './StartNode';
import { findParentNode } from '../../../../findingFunctions';
class Node extends React.Component {
    state = {
        name: "",
        render: true,
        renderNameBox: false,
        ref: React.createRef(),
        value: undefined,
    }

    get value() { return this.state.value }
    get name() { return this.state.name }

    toggleNameBox = () => {
        this.setState({renderNameBox: !this.state.renderNameBox})
    }

    handleHandleMouseUp = (e) => {
        if(e.button === 2) { // tylko PPM
            this.toggleNameBox();
        }
    }

    onInputChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    fireRemoveEvent = () => {
        // event sygnalizujacy usuniecie polaczenia dla Wire
        findParentNode(this.state.ref.current).dispatchEvent(remove);
    }

    getNameBox = () => (
        <div
            className={'NodeNameBox'}
        >
            <input
                onChange={this.onInputChange}
                value={this.name}
                onKeyDown={
                    (e) => {if(e.key === "Enter") this.toggleNameBox()}
                }
            />
            <div onClick={this.selfDestruct}>delete</div>
        </div>
    );

    render() {
        if(this.state.render === false) return null;
        let style;
        const value = this.state.value;

        // zwróć styl na podstawie wartosci
        if ( value === undefined )
            style = 'NodeButtonUndefined';
        else if ( value )
            style = 'NodeButtonTrue';
        else
            style = 'NodeButtonFalse';

        const position = this.props.position + 'px';

        return (
            <div
                className={`Node ${this instanceof StartNode ? 'NodeStart':'NodeEnd' }`}
                style={{ top: position }}
                value={this.state.value}
                data-element="Node"
            >
                <div
                    className={`NodeHandle`}
                    onMouseUp={this.handleHandleMouseUp}
                    data-element="NodeHandle"
                ></div>

                <div
                    ref={this.state.ref}
                    className={ `NodeButton ${style}` }
                    onMouseDown={ this.handleOnMouseDown }
                ></div>

                {this.state.renderNameBox ? this.getNameBox(): ""}
            </div>
        )
    }

}

export default Node;
