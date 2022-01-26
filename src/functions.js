import EndNode from "./Components/Node/EndNode";

// https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging/39165137#39165137
// znajdź komponent React na podstawie elementu DOM
export function findReact(dom, traverseUp=0) {
    const key = Object.keys(dom).find(key => key.startsWith("__reactFiber$"));
    const domFiber = dom[key];
    if (domFiber == null) return null;

    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
}

export function checkForCycle(gate) {
    // algorytm DFS
    // https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph
    const gates = collectGates(gate);
    let visited  = new Array(gates.length);
    let recStack = new Array(gates.length);
    for(let i=0;i<gates.length;i++) {
        visited[i]  = false;
        recStack[i] = false;
    }

    for (let i = 0; i < gates.length; i++)
        if (DFSutil(i, visited, recStack, getChildGates(gates[i]))){
            return true;
        }
    return false;
}
function DFSutil(i, visited, recStack, children) {
    if (recStack[i])
        return true;

    if (visited[i])
        return false;

    visited[i] = true;
    recStack[i] = true;

    for (let c=0;c< children.length;c++)
        if (DFSutil(c, visited, recStack, children)){
            return true;
        }

    recStack[i] = false;

    return false;
}
// zbierz wszystkie bramki poniżej podanej
function collectGates(gate) {
    let gates = [gate];
    const loop = (g) => {
        getChildGates(g).forEach((child) => {
            // bramki nie ma jeszcze na liście
            if(!gates.includes(child)) {
                gates.push(child);
                loop(child);
            }
        });
    }
    loop(gate);

    return gates;
}
// zbierz bramki bezpośrednio podłączone do podanej jako dzieci
function getChildGates(gate) {
    let childGates = [];
    for (let i = 0; i < gate.outputs.length; i++) {
        // dodaje wszystkie piny, ktore pobieraja sygnal z aktualnej bramki
        const childPins = gate.outputs[i].state.childPins;
        for (let j = 0; j < childPins.length; j++){
            // pomijamy EndNody
            if (childPins[j] instanceof EndNode) continue;
            childGates.push( childPins[j].gate );
        }
    }
    return childGates;
}