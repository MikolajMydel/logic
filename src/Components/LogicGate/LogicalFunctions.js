export function OR ( inputs ){
    for (let i = 0; i < inputs.length; i++){
        if ( inputs[i] === true) return true;
    }
    return false;
}

// jezeli jest chociaz jeden false - zwroc false
// jezeli jest chociaz jeden undefined - zwroc undefined
// sprawdzam czy byl undefined dopiero na koncu funkcji
// aby miec pewnosc, ze nie ma na nastepnych miejscach
// false (poniewaz wowczas mamy pewnosc, ze wartoscia bramki
// jest falsz)
export function AND ( inputs ){

    let isUndefined = false;

    for (let i = 0; i < inputs.length; i++){
        if (inputs[i] === false) return false;
        if (inputs[i] === undefined) isUndefined = true;
    }

    if ( isUndefined ) return undefined;
    else return true;

}