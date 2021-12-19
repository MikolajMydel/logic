// sprawdzam czy byl undefined dopiero na koncu funkcji
// aby miec pewnosc, ze nie ma na nastepnych miejscach
// znaczacych wartosci
export function OR ( inputs ){

    let isUndefined = false;

    for (let i = 0; i < inputs.length; i++){
        if ( inputs[i] === true) return true;
        if (inputs[i] === undefined) isUndefined = true;
    }

    if ( isUndefined ) return undefined;
    else return false;
}

// jezeli jest chociaz jeden false - zwroc false
// jezeli jest chociaz jeden undefined - zwroc undefined
export function AND ( inputs ){

    let isUndefined = false;

    for (let i = 0; i < inputs.length; i++){
        if (inputs[i] === false) return false;
        if (inputs[i] === undefined) isUndefined = true;
    }

    if ( isUndefined ) return undefined;
    else return true;
}