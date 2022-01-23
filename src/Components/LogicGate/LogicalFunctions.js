// jezeli jest chociaz jeden undefined - zwroc undefined
export const AND = (inputs) => {
    let isUndefined = false;
    for (let i = 0; i < inputs.length; i++){
        if (inputs[i] === false) return [false];
        if (inputs[i] === undefined) isUndefined = true;
    }
    if ( isUndefined ) return [undefined];
    return [true];
}

export const NOT = (inputs) => [!(inputs[0])]

// jezeli jest chociaz jeden true - zwroc true
export const OR = (inputs) => {
    let isUndefined = false;
    for (let i = 0; i < inputs.length; i++){
        if ( inputs[i] === true) return [true];
        if (inputs[i] === undefined) isUndefined = true;
    }
    if ( isUndefined ) return [undefined];
    return [false];
}
