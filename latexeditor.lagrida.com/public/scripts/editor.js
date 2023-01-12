/******************************************************************
*                       LAGRIDA Yassine
*             For: https://Latexeditor.lagrida.com
*                       Lagyassine@gmail.com
*                         11/10/2021
*                           &copy;
******************************************************************/

const editor = document.querySelector("#latex_editor");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

const rlb = document.querySelector("#rlb");

const listStartWith = ['(', '{', '['];
const listStartWith2 = [')', '}', ']'];

let savedText = '';

previous.disabled = true;
next.disabled = true;

const maxSaved = 50;
let startSave = 0;
let session = 0;
let savedCodes = [{
    value: '',
    session,
    previous: false,
    canGoNext: false
}];

const computeRemainder = (n, r) => {
    const remainder = r%n;
    if(remainder >= 0){
        return remainder;
    }
    return n + remainder;
}
const applyCache = () => {
    startSave = (startSave + 1) % maxSaved;
    savedCodes[startSave] = {
        value: editor.value,
        session,
        previous: false,
        canGoNext: false
    }
    previous.disabled = false;
    previous.classList.remove('button-disabled-previous');
    next.disabled = true;
    next.classList.add('button-disabled-next');
    if(startSave === maxSaved-1){
        session++;
    }
}
next.addEventListener('click', event => {
    const actualNode = savedCodes[startSave];
    if(!actualNode.canGoNext){
        next.disabled = true;
        next.classList.add('button-disabled-next');
        console.log('impossible going next');
        return;
    }
    const nextStep = startSave + 1 < maxSaved ? startSave + 1 : 0;
    const NextNode = savedCodes[nextStep];
    if(actualNode.session !== NextNode.session){
        next.disabled = true;
        next.classList.add('button-disabled-next');
    }
    editor.value = NextNode.value;
    startSave = computeRemainder(maxSaved, startSave+1);
    editor.focus();
    displayLatex(editor.value, latexResult);
});
previous.addEventListener('click', event => {
    savedCodes[startSave].previous = true;
    const previousStep = startSave - 1 >= 0 ? startSave - 1 : maxSaved - 1;
    // apply or not the process !
    const length = savedCodes.length;
    if(previousStep >= length){
        previous.disabled = true;
        previous.classList.add('button-disabled-previous');
        console.log('not possible overflow');
        return;
    }
    savedCodes[previousStep].canGoNext = true;
    const previousNode = savedCodes[previousStep];
    if(previousNode.previous){
        previous.disabled = true;
        previous.classList.add('button-disabled-previous');
        console.log('not possible arrive to limit');
        return;
    }
    next.disabled = false;
    next.classList.remove('button-disabled-next');
    editor.value = previousNode.value;
    startSave = computeRemainder(maxSaved, startSave-1);
    editor.focus();
    displayLatex(editor.value, latexResult);
});
rlb.addEventListener('click', event => {
    const text = editor.value;
    // Replace \n with a space
    if(text !== ''){
        editor.value = text.replace(/\n/g, ' ');
        applyCache();
        displayLatex(editor.value, latexResult);
    }
    editor.focus();
});
const applyCode = (first, last, replaceText) => {
    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;

    const editorText = editor.value;
    const selectedText = editorText.substring(selectionStart, selectionEnd) || '';
    
    if(replaceText){
        editor.setRangeText(`${first}${selectedText}${last}`, selectionStart, selectionEnd, 'start');
        editor.selectionStart += first.length + selectedText.length;
    }else{ // replace le text selection
        editor.setRangeText(`${first}${last}`, selectionStart, selectionEnd, 'end');
    }
    displayLatex(editor.value, latexResult);
}
editor.addEventListener('input', event => {
    applyCache();
});
editor.addEventListener('keydown', event => {
    const keyPressed = event.key;
    const findKeyIndex = listStartWith.findIndex(el => el === keyPressed);
    if(findKeyIndex > -1){
        event.preventDefault();
        savedText = editor.value;
        const selectionStart = editor.selectionStart;
        const selectionEnd = editor.selectionEnd;
        const selectionWeight = selectionEnd - selectionStart;
    
        const first = listStartWith[findKeyIndex];
        const last = listStartWith2[findKeyIndex];

        if(selectionWeight > 0){
            const textSelected = savedText.substring(selectionStart, selectionEnd);
            editor.setRangeText(`${first}${textSelected}${last}`, selectionStart, selectionEnd, 'end');
            editor.selectionEnd--;
        }else{
            editor.setRangeText(`${first}${last}`, selectionStart, selectionEnd, 'end');
            editor.selectionEnd--;
        }
        applyCache();
        displayLatex(editor.value, latexResult);
    }
});
const applyLatex2 = (first, second, replaceText=true) => {
    editor.focus();
    applyCode(first, second, replaceText);
    applyCache();
}
const applyLatex = (id, replaceText=true) => {
    applyLatex2(latexCodes[id], latexCodes[id+1], replaceText);
}

