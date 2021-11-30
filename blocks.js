class Elem {
    constructor(){

    }
}
class Block extends Elem{
    constructor(func, numberOfInputs=2){
        super();
        this.function = func
        this.inputs = [];
        this.maxInputIdx = numberOfInputs - 1;
    }
    assignInput(idx, inp){
        if (idx > this.maxInputIdx)
            // zbyt wysoki index
            return
        this.inputs[idx] = inp;
    }
    giveOutput(){
        let inputs = []
        // jezeli nie wszystkie inputy sa zdefiniowane, zwracamy null
        for (let i=0; i<=this.maxInputIdx; i++){
            if ( !(this.inputs[i] instanceof Elem) || this.inputs[i].giveOutput() === null )
                return null
            inputs.push(this.inputs[i].giveOutput())
        }
        return this.function(inputs)
    }
}
class StartNode extends Elem {
    constructor(val=true){
        super();
        this.value = val;
    }
    toggleValue(){
        console.log(this.func)
        this.value = !this.value;
    }
    giveOutput(){
        return this.value;
    }
}

const basicFunctions = {
    "And": (i) => (i[0] && i[1]),
    "Or":  (i) => (i[0] || i[1]),
    "Not": (i) => !(i[0]),
}
