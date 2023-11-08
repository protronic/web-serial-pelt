(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let port2;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function test_2() {
    port2 = await navigator.serial.requestPort();
    await port2.open({ baudRate: 9600 });
    let result;
    let decoder = new TextDecoderStream();
    inputDone = port2.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;
    reader = inputStream.getReader();
    // CODELAB: Add read loop here.
    result_string = "";
    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(port2.writable);
    outputStream = encoder.writable;
    const writer = outputStream.getWriter();
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            result_string += value;
            try {
                console.log(result_string);
                if (result_string.indexOf("{") != -1 && result_string.indexOf("}") != -1) {
                    try {
                        result_string = result_string.substring(result_string.indexOf("{"), result_string.indexOf("}") + 1);
                        result = JSON.parse(result_string);
                        console.log(result["FIN"]);
                        if (result["BTST"] != undefined) {
                            console.log("called1");
                            await sleep(200);
                            writer.write(JSON.stringify(result));
                        }
                        console.log("2");

                        if (result["FIN"] == 1) {
                            generateDynamicTable(result);
                        }
                        result_string = "";
                    } catch (error) {
                        result_string = "";
                    }
                }
            } catch (error) {
                //console.log(error);
            }
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
}


function generateDynamicTable(result) {

    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');

    var txt1 = document.createTextNode('TEST');
    var txt2 = document.createTextNode('STATUS');

    th1.appendChild(txt1);
    th2.appendChild(txt2);
    tr.appendChild(th1);
    tr.appendChild(th2);

    table.appendChild(tr);
    for (var i = 1; i < Object.keys(result).length; i++) {
        tr = document.createElement('tr');

        var td1 = document.createElement('td');
        td1.style.border = "2px solid black";
        var td2 = document.createElement('td');
        td2.style.border = "2px solid black";

        if (result[Object.keys(result)[i]]) {
            td2.style.backgroundColor = "green";
        } else {
            td2.style.backgroundColor = "red";
        }

        var t = document.createElement("span");
        t.innerText = Object.keys(result)[i];
        t.style.color = "black";

        var t2 = document.createElement("span");
        t2.innerText = result[Object.keys(result)[i]];
        t2.style.color = "black";

        td1.appendChild(t);
        td2.appendChild(t2);
        tr.appendChild(td1);
        tr.appendChild(td2);

        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#test_btn').addEventListener('click', test_2);
});
},{}]},{},[1]);
