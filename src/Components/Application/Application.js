import React from "react";
import styles from './Application.module.scss';
import LogicGate from "../LogicGate/LogicGate";
import StartNode from "./NodeSet/Node/StartNode";
import EndNode from "./NodeSet/Node/EndNode";
import ControlPanel from "../ControlPanel/ControlPanel";
import Menu from "../Menu/Menu";
import ProjectPopup from "../Popup/ProjectPopup";
import SettingsPopup from "../Popup/SettingsPopup";
import SaveGatePopup from "../Popup/SaveGatePopup";
import {findReact, makeNewGate} from "../../functions";
import {AND, NOT, OR, FALSE, TRUE} from "../../logicalFunctions";
import Wire from '../WiresBoard/Wire/Wire.js';
import WiresBoard from "../WiresBoard/WiresBoard";
import remove from "../../Events/remove";
import move from "../../Events/move";
import NodeSet from "./NodeSet/NodeSet";
import merge from "../../Events/merge";

class Application extends React.Component {
    state = {
        focusedElement: undefined,    // aktualnie wybrane wyjście
        heldElement: undefined,       // aktualnie trzymana bramka
        heldElementOffset: [0, 0],    // różnica koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
        popup: null,

        inputs: [],
        board: [],
        outputs: [],

        wires: [],
        settings: {
            grid: 40, // ile pikseli na siatkę
            showGrid: true, // czy siatka ma byc widoczna
            showNodeNames: true, // czy pokazywać nazwy nodów TODO
            clock: 100, // z jakim interwałem odświeżane stany bramek
            nodesPerClick: 1, // ilosc node'ow dodawanych z kazdym kliknieciem
            isSignedDefault: false, // czy nowe nodesety maja postac zm
        }
    }

    boardRef   = React.createRef()
    canvasRef  = React.createRef()
    controlRef = React.createRef()
    controlPanelObject

    // funkcja zmieniajaca aktualnie wybrane wyjscie - pozwala na uzycie kliknietego wyjscia na wejscie bramki logicznej
    setFocusedElement = ( element ) => {
        this.setState ({'focusedElement': element});
    }

    // funkcja zwracajaca aktualnie wybrane wyjscie - umozliwia kliknietej bramce logicznej zmiane wejscia na wczesniej klikniete wyjscie
    getFocusedElement = () => this.state.focusedElement;

    getCurrentProjectName = () => this.currentProjectName;

    getGrid = () => this.state.grid;

    // tylko raz po wyrenderowaniu tego komponentu
    componentDidMount(){
        global.NOT   = NOT;
        global.AND   = AND;
        global.OR    = OR;
        global.TRUE  = TRUE;
        global.FALSE = FALSE;

        // bez contextmenu
        window.addEventListener("contextmenu", (e) => e.preventDefault());

        this.controlPanelObject = findReact(this.controlRef.current);

        this.showPopup('project')
    }

    // wczytaj zapisany projekt z localstorage
    loadProject = (projectName) => {
        let saved = [];
        let projects = {};
        if(localStorage.getItem('projects') !== null){
            projects = JSON.parse(localStorage.getItem('projects'));

            // usuwa z globalnego kontekstu customowe funkcje poprzedniego projektu
            if(projects[this.currentProjectName] !== undefined)
                for (const saved of projects[this.currentProjectName]){
                    global[saved['name']] = undefined;
                }

            // wpisuje do 'saved' zapisane bramki
            if(projects[projectName] !== undefined)
                saved = projects[projectName];
        }

        this.currentProjectName = projectName;

        this.controlPanelObject.reset(saved);
        this.clearCanvas();
    }

    addNode = (e, type) => {
        // dodaj tylko jeżeli kliknięto na czysty obszar (nie np istniejący node)
        if ( !e.target.classList.contains('Area') )
            return;

        const pos = e.clientY - e.target.offsetTop - 25;
        let stateCopy = Object.assign({}, this.state);

        const nodesPerClick = this.state.settings.nodesPerClick;

        if (type === "startNode")
            for (let i = 0; i < nodesPerClick; i++){
                stateCopy.inputs.push(<StartNode
                    position={pos}
                    setFocusedElement={ this.setFocusedElement }/>)
            }
        else // endNode
            for (let i = 0; i < nodesPerClick; i++){
                stateCopy.outputs.push(<EndNode
                    drawWire={this.drawWire}
                    position={pos}
                    getFocusedElement={this.getFocusedElement}
                />)
            };

        this.setState (stateCopy, () => {
            this.sideAreaModification(e, undefined, pos)
        });
    }

    // albo podajemy pozycje, albo focused element
    sideAreaModification = (e, focusedElement, position = undefined) => {
        // node'y i nodesety znajdujace sie pod kursorem
        const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY).filter(
            (element) => {
                const elementType = element.getAttribute("data-element");
                return (
                // jezeli element jest nodem nalezacym do nodesetu, to go zostawiamy
                // (zapobiegniecie powtarzaniu node'ow)
                elementType === "Node" && element.parentElement.getAttribute("data-element") !== "NodeSet")
                        || elementType === "NodeSet";
            }
        );

        // sa elementy do scalenia
        if (elementsUnderCursor.length > 1){
            // szukamy elementu, od ktorego pobierzemy pozycje
            // (tego, ktory nie byl trzymany)
            if (typeof focusedElement !== "undefined"){
                for (let sideAreaElement of elementsUnderCursor){
                    if (sideAreaElement !== focusedElement.parentElement){
                        position = sideAreaElement.style.top;
                    }
                }
            }
            // posegregowanie elementow
            const interactiveElements = {
                'nodes': [],
                'nodeSets': [],
            };
            elementsUnderCursor.forEach((element) => {
                const elementType = element.getAttribute("data-element");
                if (elementType === "Node") interactiveElements["nodes"].push(element);
                else interactiveElements["nodeSets"].push(element);
            });

            this.mergeNodes(interactiveElements, position, e.clientX <= 50);
        }
    }

    mergeNodes = (elements, position, isInputArea) => {
        let stateCopy = Object.assign({}, this.state),
        childNodes = [],
        isSigned = false;

        if (elements.nodeSets.length === 0){
            childNodes = elements.nodes;
        } else {
            // dodaj do tablicy wszystkie nody nalezace do nodesetow
            for (let i = 0; i < elements.nodeSets.length; i++){
                // jezeli chociaz jeden nodeset byl z bitem znaku, to
                // nowy tez bedzie mial bit znaku
                if (elements.nodeSets[i].getAttribute("data-signed") === "true") isSigned = true;

                childNodes.push(
                    ...elements.nodeSets[i].childNodes
                );
            };

            childNodes.push( ...elements.nodes );

            // zostawiamy tylko node'y
            childNodes = childNodes.filter(
                (node) => node.getAttribute("data-element") === "Node"
            );

            // powiadom nodesety o scaleniu
            for (let nodeSet of elements.nodeSets){
                nodeSet.dispatchEvent(merge);
            }
        }

        if (isInputArea) {
            stateCopy.inputs.push(<NodeSet
            nodes={childNodes}
            position={position}
            isInputArea = {isInputArea}
            isSigned={isSigned}
            unmountNode={this.unmountNode}
        />)} else {
            stateCopy.outputs.push(<NodeSet
                nodes={childNodes}
                position={position}
                isInputArea={isInputArea}
                isSigned={isSigned}
                unmountNode={this.unmountNode}
            />);
        }

        this.setState(stateCopy);
    }

    addGate = (e, args) => {
        const boardCopy = [...this.state.board];

        let newGate;
        boardCopy.push(
            <LogicGate
                gateName={ args.gateName }
                inputs={ args.inputCount }
                outputs={ args.outputCount }
                function={ args.function }
                style={ args.style }
                drawWire = { this.drawWire }
                getFocusedElement={ this.getFocusedElement }
                setFocusedElement={ this.setFocusedElement }
                getClock={() => this.state.settings.clock}
                reference={el => newGate = el}
            />
        );
        this.setState ({'board': boardCopy}, function(){
            // 'e.target' odnosi się teraz do komponentu DummyGate
            const xo = e.clientX - e.target.offsetLeft + this.controlRef.current.scrollLeft;
            const yo = e.clientY - e.target.offsetTop + (e.target.offsetHeight/2);

            newGate.style.left = e.clientX - xo + 'px';
            newGate.style.top  = e.clientY - yo + 'px';
            newGate.style.zIndex = 2;

            this.setState({
                heldElement: newGate,
                heldElementOffset: [xo, yo],
            });
        });
    }

    handleMouseDown = (e) => {
        if(e.button === 0)
            this.grab(e);
    }

    // funkcja podnosząca element
    grab(e) {
        let element = e.target;
        const elementType = element.getAttribute("data-element");

        if (["LogicGate", "NodeHandle", "NodeSetHandle", "NodeSetFoldButton"].includes(elementType)) {

            if (elementType === "NodeSetFoldButton")
                element = element.parentElement;

            element.style.zIndex = 2;
            this.setState({heldElement: element});

            const grid = this.state.settings.grid
            // obliczenie różnicy koordynatów x i y, między punktem chwytu a faktycznym położeniem bloku
            // uwzględnia szerokość siatki
            const xo = e.clientX - element.offsetLeft - grid/2;
            const yo = e.clientY - element.offsetTop - grid/2;
            this.setState({heldElementOffset: [xo, yo]});
        }

    }

    // przenieś trzymany element
    move(e) {
        const element = this.state.heldElement;
        if(!element) return;

        const canvas  = e.currentTarget;
        const board   = this.boardRef.current;

        switch (element.getAttribute("data-element")){
            case "LogicGate": {
                let x = e.clientX - this.state.heldElementOffset[0] - board.offsetLeft; // różnica x
                let y = e.clientY - this.state.heldElementOffset[1] - board.offsetTop; // różnica y

                const grid = this.state.settings.grid;
                x = x - (x % grid) + board.offsetLeft;
                y = y - (y % grid) + board.offsetTop;

                if (x < board.offsetLeft)
                    // za daleko w lewo
                    x = board.offsetLeft;
                else if (x + element.offsetWidth > board.offsetWidth + board.offsetLeft)
                    // za daleko w prawo
                    x = board.offsetWidth + board.offsetLeft - element.offsetWidth;
                if (y < canvas.offsetTop)
                    // za daleko w górę
                    y = canvas.offsetTop;
                else if (y + element.offsetHeight > canvas.offsetHeight + canvas.offsetTop)
                    // za daleko w dół
                    y = canvas.offsetHeight + canvas.offsetTop - element.offsetHeight;

                element.style.left = x + 'px';
                element.style.top = y + 'px';
                element.dispatchEvent(move);
            }
            break;

            case "NodeSetHandle": {
                const nodeSet = element.parentElement;
                let y = e.clientY;

                if (y > nodeSet.parentElement.offsetHeight - 20)
                    y = nodeSet.parentElement.offsetHeight - 20;

                if (y < nodeSet.parentElement.offsetTop + 40)
                    y = nodeSet.parentElement.offsetTop + 40;

                nodeSet.style.top = y - 60 + 'px';
                nodeSet.dispatchEvent(move);
            }

            break;

            case "NodeHandle": {
                const node = element.parentElement;
                let y = e.clientY;

                if (y > node.parentElement.offsetHeight - 20)
                    y = node.parentElement.offsetHeight - 20;

                if (y < node.parentElement.offsetTop + 40)
                    y = node.parentElement.offsetTop + 40;

                node.style.top = y - 65 + 'px';
                node.dispatchEvent(move);
            }
            break;

            default: return;
        }
    }

    drop(e) {
        const element = this.state.heldElement;

        if (element){
            const elementType = element.getAttribute("data-element");
            if (elementType === "NodeSetHandle" || elementType === "NodeHandle"){
                this.sideAreaModification(e, element);
            }

            // upuść trzymany element
            this.setState({heldElement: undefined});
            const board = this.boardRef.current;
            const y = parseInt(element.style.top.split('px')[0])

            // jeżeli przeniesiony poniżej poziomu 'board', usuń
            if (y + (element.offsetHeight) > board.offsetHeight + board.offsetTop){
                const comp = findReact(element);
                comp.selfDestruct();
                element.dispatchEvent(remove);

                const focused = this.getFocusedElement();
                if(focused && focused.gate === comp)
                    this.setFocusedElement(undefined);
            } else {
                element.style.zIndex = 1;
            }
        }
    }

    drawWire = (firstPin, secondPin) => {
        const newWiresList = this.state.wires.concat([ <Wire firstPin={firstPin} secondPin={secondPin} /> ]);
        this.setState({"wires": newWiresList});
    }

    // zapisuje obszar roboczy jako nową bramkę do projektu
    saveGate = (name, color) => {
        const newGateObject = makeNewGate(this.canvasRef, name, color);

        // zapisywanie w localStorage
        let projects = {};
        if(localStorage.getItem('projects') !== null)
            projects = JSON.parse(localStorage.getItem('projects'));
        if(projects[this.currentProjectName] === undefined)
            projects[this.currentProjectName] = [];

        projects[this.currentProjectName].push(newGateObject);
        localStorage.setItem("projects", JSON.stringify(projects));

        // dodaj nową bramkę do zasobnika
        this.controlPanelObject.addDummy(newGateObject);
        this.clearCanvas();
    }

    adjustSettings = (settings) => {
        this.setState({settings: settings});
    }

    showPopup = (name) => {
        var popup;
        switch(name) {
            case 'project':
                popup = (
                    <ProjectPopup
                        getCurrentProjectName={this.getCurrentProjectName}
                        loadProject={this.loadProject}
                        killPopup={this.killPopup}
                    />
                );
                break;
            case 'save':
                popup = (<SaveGatePopup saveGate={this.saveGate} killPopup={this.killPopup}/>);
                break;
            case 'settings':
                popup = (
                    <SettingsPopup
                        adjustSettings={this.adjustSettings}
                        settings={this.state.settings}
                        killPopup={this.killPopup}
                    />
                 );
                break;
            default:
                return;
        }
        this.setState({'popup': popup});
    }

    killPopup = () => {
        this.setState({popup: null})
    }

    clearSideAreas = () => {
        const canvasElements = [...this.canvasRef.childNodes.values()];
        const sideAreas = canvasElements.filter(
            (element) => element !== this.boardRef.current
        )

        for (let sideArea of sideAreas){
            for (let childNode of sideArea.childNodes){
                childNode.dispatchEvent(remove);
            }
        }
    }

    // wyczyść obszar roboczy
    clearCanvas = () => {
        this.clearSideAreas();
        this.setState({focusedElement: undefined, board: [], wires: []});
    }

    render() {
        if(this.state.settings.showGrid)
            var gridStyle = {backgroundSize: this.state.settings.grid + 'px ' + this.state.settings.grid + 'px'};

        return (
            <div className={ styles.Application }
                onMouseDown={ this.handleMouseDown }
                onMouseMove={ (e) => this.move(e) }
                onMouseUp={ (e) => this.drop(e) }
            >
                {this.state.popup}
                <Menu functions={[
                    {
                        name: "zapisz bramkę",
                        function: () => this.showPopup('save'),
                    },
                    {
                        name: "wyczyść",
                        function: this.clearCanvas,
                    },
                    {
                        name: "projekt",
                        function: () => this.showPopup('project'),
                    },
                    {
                        name: "ustawienia",
                        function: () => this.showPopup('settings'),
                    },
                ]}/>
                <WiresBoard wires={this.state.wires} />
                <div
                    className={ styles.Canvas }
                    ref={el => this.canvasRef = el}
                >
                    <div
                        className={ `Area ${styles.InputArea}` }
                        onClick={ (e) => this.addNode(e, 'startNode')}
                    >
                        { this.state.inputs }
                    </div>
                    <div
                        className={ styles.Board }
                        ref={this.boardRef}
                        // rysuje siatkę o odpowiednim rozmiarze na tle
                        style={gridStyle}
                    >

                        { this.state.board }

                    </div>
                    <div
                        className={ `Area ${styles.OutputArea}` }
                        onClick={ (e) => this.addNode(e, 'endNode')}
                    >
                        { this.state.outputs }
                    </div>
                </div>
                <ControlPanel addGate={this.addGate} reference={this.controlRef}/>
            </div>
        )
    }
}

export default Application;
