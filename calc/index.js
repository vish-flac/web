const maindisplay = document.getElementById("mainDisplay");

const secdisplay = document.getElementById("secDisplay");

function appendtoDisplay(input) {


    const operators = ['+', '-', '×', '÷'];
    if (operators.includes(maindisplay.value.charAt(0))) {
        maindisplay.value =  maindisplay.value.substring(1);
    }

    maindisplay.value += input;

    if(hasAnExpression)
    {
        let expression = maindisplay.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '');
        secdisplay.value = eval(expression);
    }


    
}

function clearDisplay() {
    maindisplay.value = "";
    secdisplay.value = "";
}

function calc() {
    try{
        let expression = maindisplay.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '');
        maindisplay.value = eval(expression);

        secdisplay.value = "Kunjumel";
    }
    catch(error){
        maindisplay.value = "Error";

        setTimeout(function() {
            maindisplay.value = "";
        }, 3000);

    }
    
}

function hasAnExpression(displayValue) {
    const expressionRegex = /^[0-9]+(\s*[+\-*/×÷]\s*[0-9]+)*$/;

    return expressionRegex.test(displayValue);
}


