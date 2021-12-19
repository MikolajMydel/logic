export function OR ( inputs ){

    console.log ( inputs );

    for (let i = 0; i < inputs.length; i++){
        if ( inputs[i] === true) return true;
    }

    // nie ma ani jednej wartosci true
    return false;
}