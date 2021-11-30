var customFunctions = {
    "Test": (i) => {
        return basicFunctions.And( [basicFunctions.Or( [i[0], i[1]] ), basicFunctions.Or( [i[1], i[2]] )] );
    },
    "Test2": (i) => {
        return basicFunctions.Not( [customFunctions.Test(i)] )
    }
}

let node1 = new StartNode(true);
let node2 = new StartNode(false);
let node3 = new StartNode(true);
let node4 = new StartNode(false);

let and = new Block(basicFunctions.And);
and.assignInput(0, node1);
and.assignInput(1, node2);

let or = new Block(basicFunctions.Or);
or.assignInput(0, node3);
or.assignInput(1, node4);

let customBlock = new Block(customFunctions.Test2, 3);
customBlock.assignInput(0, and);
customBlock.assignInput(1, or);
customBlock.assignInput(2, node4);

let notBlock = new Block(basicFunctions.Not, 1);
notBlock.assignInput(0, customBlock);

console.log(notBlock.giveOutput());
console.log('-----\n')

// zeby "odpiac" input
customBlock.assignInput(0, undefined)

console.log(notBlock.giveOutput())
