const isArrayEqual = function (array1, array2) {
    let i = array1.length;
    if (i != array2.length) return false;
    while (i--) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
};

function code2elements(text) {
    let result = [];
    const len = text.length;
    let action = -1;
    for (let i = 0; i < len; i++) {
        const code = text.charCodeAt(i);
        if (action == 3) {
            result[result.length - 1] += text[i];
            if (code == 34) {
                action = -1;
            }
        }
        else if (action == 2) {
            result[result.length - 1] += text[i];
            if (code == 39) {
                action = -1;
            }
        }
        else if (code == 9 || code == 10 ||code == 13 || code == 32) {
            action = 0;
        }
        else if (code == 33 || (code >= 35 && code <= 38) || (code >= 40 && code <= 47) || (code >= 58 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126)) {
            result.push(text[i]);
            action = -1;
        }
        else if (code == 34) {
            result.push(text[i]);
            action = 3;
        }
        else if (code == 39) {
            result.push(text[i]);
            action = 2;
        }
        else {
            if (action == 1)result[result.length - 1] += text[i];
            else {
                result.push(text[i]);
                action = 1;
            }
        }
    }
    return result;
}

function code2elementsEx(text) {
    let result = [];
    const len = text.length;
    let action = -1;
    for (let i = 0; i < len; i++) {
        const code = text.charCodeAt(i);
        if (action == 4) {
            result[result.length - 1] += text[i];
            if (text[i]=="》") {
                action = -1;
            }
        }
        else if (action == 3) {
            result[result.length - 1] += text[i];
            if (code == 34) {
                action = -1;
            }
        }
        else if (action == 2) {
            result[result.length - 1] += text[i];
            if (code == 39) {
                action = -1;
            }
        }
        else if (text[i]=="《") {
            result.push(text[i]);
            action = 4;
        }
        else if (code == 9 || code == 10 ||code == 13 || code == 32) {
            if (action == 0)result[result.length - 1] += text[i];
            else {
                result.push(text[i]);
                action = 0;
            }
        }
        else if (code == 33 || (code >= 35 && code <= 38) || (code >= 40 && code <= 47) || (code >= 58 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126)) {
            result.push(text[i]);
            action = -1;
        }
        else if (code == 34) {
            result.push(text[i]);
            action = 3;
        }
        else if (code == 39) {
            result.push(text[i]);
            action = 2;
        }
        else {
            if (action == 1)result[result.length - 1] += text[i];
            else {
                result.push(text[i]);
                action = 1;
            }
        }
    }
    return result;
}

function codeElements2HTML(codeElements, mark={"blue":["if", "else", "while", "for", "continue", "break"]}){
    result="";
    for (let ce of codeElements){
        if(ce.startsWith("《")){
            line=ce.slice(1,-1).split("｜");
            if(line.length >= 2){
                result += "<input type='text' placeholder='" + line[0] + "' onchange='onTextChange(this,\"" + line[1].replace(/"/g, "\\\"").replace(/'/g, "\\\'") + "\")'/>"
            }
        }
        else if(ce.startsWith("\"") || ce.startsWith("\'")){
            result+="<span style=\"color:" + "rgb(125,202,64)" + "\"><i>" + ce + "</i></span>";
        }
        else{
            let isHighLight=false;
            for(const color in mark){
                if(mark[color].includes(ce)){
                    result+="<span style=\"color:" + color + "\">" + ce + "</span>";
                    isHighLight=true;
                    break;
                }
            }
            if(!isHighLight){
                result+=ce.replace(/ /g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
            }
        }
    }
    return result;
}

function onTextChange(e, text) {
    if(e.value.length == 0)return;
    const input = code2elements(e.value);
    const texts = text.split("、");
    for(anstext of texts){
        const ans = code2elements(anstext);
        if (isArrayEqual(ans, input)) {
            e.style.background = "#ddefff";
            e.style.border = "unset";
            e.setAttribute("readonly", "true");
            return;
        }
    }
}

function initCodeTutorial(){
    sElements=document.getElementsByTagName("script");
    for(const e of sElements){
        const mark={};
        if(e.type=="Python" || e.type=="python"){
            mark["blue"] = ["if", "elif", "else", "while", "for", "continue", "break", "in", "pass", "and", "or", "global", "from", "class", "return", "def", "try", "import", "del", "as", "assert", "async", "await", "except", "finally", "is", "lambda", "nonlocal", "not", "raise", "with", "yield"];
            mark["rgb(217,141,5)"] = ["print", "range", "str", "int", "float", "open", "input"];
            mark["purple"] = ["True", "False", "None"];
        }
        if(e.type=="C" || e.type=="c"){
            mark["blue"] = ["auto","break","case","char","const","continue","default","do","double","else","enum","extern","float","for","goto","if","int","long","register","return","signed","sizeof","short","static","struct","switch","typedef","union","unsigned","void","volatile","while"];
        }
        if(Object.keys(mark).length > 0){
            const newDiv = document.createElement("div");
            newDiv.classList.add("code");
            newDiv.innerHTML = codeElements2HTML(code2elementsEx(e.innerHTML), mark);
            e.parentNode.insertBefore(newDiv, e);
        }
    }
}

initCodeTutorial();
