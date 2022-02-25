export function findParentGate(pin) {
    let currentParent = pin.parentElement;
    while (!currentParent.classList.contains("LogicGate")) {
        currentParent = currentParent.parentElement;
    }

    return currentParent;
}

export function findParentNode(pin) {
    if (!pin) return;

    let currentParent = pin.parentElement;
    while (!currentParent.className.includes("Node")) {
        currentParent = currentParent.parentElement;
    }

    return currentParent;
}