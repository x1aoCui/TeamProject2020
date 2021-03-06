var divTop = 50;
var divLeft = 0;
var k = 0;
var textInputFlag = false;

// Add sticky note
function addNote(key = 0, values = []) {
    var id;
    if (key != 0) {
        id = key;
    }
    else {
        // ID using time
        id = new Date().getTime();
    }
    // Location when "add" was hit
    if (divLeft != 0) {
        divLeft += 200;
        if (divLeft >= 1200) {
            divTop += 200;
            divLeft = 50;
        }
    }
    else {
        divLeft = 50;
    }

    if (values.length == 0) {
        //for svg initial
        // let textInitial = [];
        // let text = [];
        //
        // textInitial.push(0);
        // textInitial.push(0);
        // textInitial.push(" ");
        //
        // text.push(textInitial);
        var values = [];
        var initValue = {};
        initValue['text'] = "";
        initValue['color'] = '#CCFFCC';
        initValue['notePositionLeft'] = divLeft;
        initValue['notePositionTop'] = divTop;
        values.push(initValue);
    }

    // Add the note Main content
    var mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "note");
    mainDiv.setAttribute("id", id);
    mainDiv.setAttribute("style", "top:" + values[0]['notePositionTop'] + "px;left:" + values[0]['notePositionLeft'] + "px");

    // Title Div
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "noteTitle");


    // Operations supported on sticky note
    // ==============================================================================================
    // Add note img
    var addImg = document.createElement("img");
    addImg.setAttribute("src", "images/icon-add.png");
    addImg.setAttribute("class", "addIcon");
    // Add note
    addImg.setAttribute("onclick", "addNote()");

    titleDiv.appendChild(addImg);

    // Add deletenote image
    var delImg = document.createElement("img");
    delImg.setAttribute("src", "images/icon-delete.png");
    delImg.setAttribute("class", "delIcon");
    // Delete
    delImg.setAttribute("onclick", "deleteNote('" + id + "')");
    titleDiv.appendChild(delImg);

    // ==============================================================================================
    // Set color of the background
    var colorBg = document.createElement("select");

    colorBg.setAttribute("class", "colorBg");
    colorBg.options.add(new Option("", "#CCFFCC"));
    colorBg.options.add(new Option("", "#FFCCCC"));
    colorBg.options.add(new Option("", "#99CCFF"));
    colorBg.options.add(new Option("", "#FFFFCC"));
    if (values[0]['color']) {
        mainDiv.style.backgroundColor = values[0]['color'];
    }
    colorBg.setAttribute("onclick", "changeColor('" + id + "')");

    titleDiv.appendChild(colorBg);

    // Save button
    var saveImg = document.createElement("img");
    saveImg.setAttribute("src", "images/icon-save.png");
    saveImg.setAttribute("class", "save");
    // Add note
    saveImg.setAttribute("onclick", "saveNote('" + id + "')");
    titleDiv.appendChild(saveImg);
    // pen input
    var penInput = document.createElement("img");
    penInput.setAttribute("src", "images/icon-save.png");
    penInput.setAttribute("class", "penInput");
    // Add note
    penInput.setAttribute("onclick", "penInput('" + id + "')");
    titleDiv.appendChild(penInput);

    //second only text input editable
    var contentDiv = document.createElement("div");
    // if (values[0]['text']) {
    //     var txtDiv = document.createTextNode(values[0]['text']);
    //     contentDiv.appendChild(txtDiv);
    // }
    contentDiv.innerText = values[0]['text'];

    contentDiv.setAttribute("class", "noteContent");
    contentDiv.setAttribute("contenteditable", "true");

    contentDiv.setAttribute("onblur", "saveNote('" + id + "')");

    var inputLimit = 50;
    // var intNum = document.createElement("div");
    var numSpan = document.createElement("span");
    numSpan.setAttribute("class","counter");
    numSpan.innerText = values[0]["text"].length+"/"+inputLimit;

    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(contentDiv);
    mainDiv.appendChild(numSpan);
    document.body.appendChild(mainDiv);
    limitInput(contentDiv,inputLimit);
}

// Move the note
var dragObj;
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var z = 0;
var noteLocation;

function limitInput(noteContent,length=10) {
    var counter = noteContent.parentNode.childNodes[2];
    input = noteContent;
    settings = {
        maxLen: length,
    }
    keys = {
        'backspace': 8,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'delete': 46,
        // 'cmd':
        'leftArrow': 37,
        'upArrow': 38,
        'rightArrow': 39,
        'downArrow': 40,
    }
    utils = {
        special: {},
        navigational: {},
        isSpecial(e) {
            return typeof this.special[e.keyCode] !== 'undefined';
        },
        isNavigational(e) {
            return typeof this.navigational[e.keyCode] !== 'undefined';
        }
    }
    utils.special[keys['backspace']] = true;
    utils.special[keys['shift']] = true;
    utils.special[keys['ctrl']] = true;
    utils.special[keys['alt']] = true;
    utils.special[keys['delete']] = true;
    utils.navigational[keys['upArrow']] = true;
    utils.navigational[keys['downArrow']] = true;
    utils.navigational[keys['leftArrow']] = true;
    utils.navigational[keys['rightArrow']] = true;
    input.addEventListener('keyup', function(event) {
        let len = event.target.innerText.trim().length;
        counter.innerHTML = len+"/"+length;
        if (len >= settings.maxLen && !hasSelection) {
            event.preventDefault();
            return false;
        }
    });
    input.addEventListener('keydown', function(event) {
        let len = event.target.innerText.trim().length;
        hasSelection = false;
        selection = window.getSelection();
        isSpecial = utils.isSpecial(event);
        isNavigational = utils.isNavigational(event);

        if (selection) {
            hasSelection = !!selection.toString();
        }
        if (isSpecial || isNavigational) {
            return true;
        }
        if (len >= settings.maxLen && !hasSelection) {
            event.preventDefault();
            return false;
        }
    });
}

function mousedownHandler(e) {

    if (e.target.className == 'noteTitle') {
        //locate the note
        dragObj = e.target.parentNode;

        var t = dragObj.style.top;
        var l = dragObj.style.left;
        z += 1;
        dragObj.setAttribute("style", "top:" + t + ";left:" + l + ";z-index:" + z);

        _startX = e.targetTouches[0].clientX;
        _startY = e.targetTouches[0].clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;

        document.addEventListener("touchmove", mousemoveHandler, false);
        //dierctly way to do
        $('html,body').css('height', '100%').css('overflow', 'hidden');
    }
    if (e.target.className == "noteContent") {
        console.log("notecontent touched");
        textObj = e.target;
    }
    if(e.target.getAttribute("class") == 'svgContent'){


        // //the svgContent id Idk why not change after touching other note so I use note id by finding parent parent id to locate the real svg content
        var noteId = e.target.parentElement.parentElement.getAttribute("id");
        var svgContent  = document.getElementById(noteId).childNodes[1].firstChild;

        noteLocation = svgContent.parentElement.parentElement;
        var noteL = Number(noteLocation.style.left.replace("px","" ));
        var noteT = Number(noteLocation.style.top.replace("px","" ));
        //idk why this note works
        //var titleHeight = Number(document.querySelector('.noteTitle').style.height.replace("px","" ));
        //console.log(document.querySelector('.noteTitle').style);
        titleHeight = 28;
        noteT = noteT + titleHeight;

        svgContent.addEventListener("touchstart",function(e)
        {
            e.preventDefault();
            var pathElement = document.createElementNS(svgNS,"path");
            var x = e.targetTouches[0].clientX- noteL;

            var y = e.targetTouches[0].clientY - noteT;
            pathElement.setAttribute("d","M"+x+','+y+'L'+x+','+y);
            pathElement.setAttribute('stroke', 'black');
            pathElement.setAttribute('fill', 'none');
            //console.log("svgtouched");

            function touchMove(e)
            {

                var x = e.targetTouches[0].clientX- noteL;
                var y = e.targetTouches[0].clientY - noteT;
                pathElement.setAttribute("d",pathElement.getAttribute('d')
                        +' '+x+','+y);
                svgContent.appendChild(pathElement);
            }
            function touchEnd(e)
            {
                svgContent.removeEventListener('touchmove', touchMove);
                svgContent.removeEventListener('touchend', touchEnd);
            }
            svgContent.addEventListener('touchmove', touchMove);
            svgContent.addEventListener('touchend', touchEnd);
        });
    }
}

// Anke Lehmann's code
// function addTextInput(svgTxtElement, svgContent, x, y) {
//     // when text input flag triggered
//     var input = document.createElement("input");
//     input.setAttribute("id", "tbInputText");
//
//     input.type = 'text';
//     input.style.position = 'fixed';
//     input.style.left = (x ) + "px";
//     input.style.top = (y ) + "px";
//     input.style.width = 100 + "px";
//     input.style.height = 20 + "px";
//     input.style.backgroundColor = "blue";
//     input.style.zIndex = "10";
//     input.setAttribute("onblur", "removeInput()");
//     input.setAttribute("onmousemove", "this.focus()");
//
//     var textFlag = false;
//     if (svgTxtElement.textContent != '') {
//         input.value = svgTxtElement.textContent;
//         textFlag = true;
//     }
//     if (textInputFlag == false) {
//         textInputFlag = true;
//         document.body.appendChild(input);
//         input.addEventListener('keydown', function (event) {
//             if (event.keyCode == 13) {
//                 console.log("keydown");
//                 svgTxtElement.textContent = document.getElementById('tbInputText').value;
//                 if (!textFlag) {
//                     svgContent.appendChild(svgTxtElement);
//                 } else {
//                     svgText.textContent = document.getElementById('tbInputText').value;
//                 }
//                 svgTxtElement = '';
//                 document.getElementById("tbInputText").remove();
//                 textInputFlag = false;
//                 //init();
//             }
//
//             if (event.keyCode == 27) {
//                 //init();
//                 svgTxtElement = '';
//                 document.getElementById("tbInputText").remove();
//                 textInputFlag = false;
//             }
//
//         });
//
//     }
//
//
// }

function removeInput() {
    if (!(document.getElementById("tbInputText").value)) {
        document.getElementById("tbInputText").remove();
        textInputFlag = false;
    }

}
//store note
function penInput(key) {
    //switch container to svg
    //locate mainDiv
    var obj = document.getElementById(key);
    var nodeName = obj.childNodes[1].nodeName;
    if(nodeName == "DIV"){
        console.log("switch to svg now");
        obj.childNodes[1].innerText = "";
        obj.childNodes[1].setAttribute("contenteditable", "true");
        //var contentDiv = document.createElement("div");
        var contentSvg = document.createElementNS(svgNS,"svg");
        contentSvg.setAttribute("class","svgContent");
        contentSvg.setAttribute("id","svgContent");
        contentSvg.style.width = "100%";
        contentSvg.style.height = "100%";
        obj.childNodes[1].appendChild(contentSvg);
        obj.removeChild(obj.childNodes[2]);
    }
}
//store note
function saveNote(key) {

    //locate mainDiv
    var obj = document.getElementById(key);

    //parent
    var values = [];
    //record each node's value
    var value = {};
    //array for text input lists
    var textValueList = [];
    //array for text svg as x,y,and textcontent
    console.log(obj.childNodes[1].nodeName.innerHTML);
    value['text'] = (obj.childNodes[1].innerText);

    var color = obj.firstElementChild.childNodes[2];
    var selectedColor = color.options[color.options.selectedIndex].value;
    value['color'] = selectedColor;

    var notePositionLeft = obj.style.left;
    var notePositionTop = obj.style.top;
    console.log("notePosition " + notePositionLeft, notePositionTop);
    value['notePositionLeft'] = notePositionLeft.replace("px", "");
    value['notePositionTop'] = notePositionTop.replace("px", "");
    values.push(value);
    values = JSON.stringify(values);

    if (values.length > 0) {
        //save to storage
        localStorage.setItem(key, values);

    }
}

//reload from local
function loadData() {
    //key,value as json，passed to addNote
    var idLength = 0;
    var idArray = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);
        idLength++;
        idArray.push(key);
        addNote(key, value);
    }

    //test line link when note num is 2
    if (idLength == 2) {
        //link(idArray);
    }


}
//delete note
function deleteNote(key) {
    var obj = document.getElementById(key);
    obj.parentNode.removeChild(obj);
    // localStorage
    localStorage.removeItem(key);
}
//clear all
function deleteNotesAll() {
    localStorage.clear();
    //refresh
    location.reload();
}

function changeColor(id) {
    var obj = document.getElementById(id);
    var color = obj.firstElementChild.childNodes[2];

    //just a guessing
    var selectedColor = color.options[color.options.selectedIndex].value;

    obj.style.backgroundColor = selectedColor;
    saveNote(id);

}

function link(idArray) {
    jsPlumb.ready(function () {
        jsPlumb.connect({
            source: document.getElementById(idArray[0]),
            target: document.getElementById(idArray[1]),
            endpoint: 'Rectangle'
        })

        jsPlumb.draggable(document.getElementById(idArray[0]));
        jsPlumb.draggable(document.getElementById(idArray[1]));
    })

}
function mouseupHandler(e) {
    // //after moving it will save the note automatically
    $('html,body').removeAttr('style');
    document.removeEventListener("touchmove", mousemoveHandler, false);
    saveNote(e.target.parentNode.id);

    // document.removeEventListener("mousemove", mousemoveHandler, false);

}
function mousemoveHandler(e) {
    // // for page not moving when moving the note
    // e.preventDefault();
    ///console.log(e.changedTouches);
    dragObj.style.left = (_offsetX + e.targetTouches[0].clientX - _startX) + 'px';
    dragObj.style.top = (_offsetY + e.targetTouches[0].clientY - _startY) + 'px';
    // dragObj.style.left = (_offsetX + e.clientX - _startX) + 'px';	    // for page not moving when moving the note
    // dragObj.style.top = (_offsetY + e.clientY - _startY) + 'px';
}

function getMousePos(event) {
    var e = event || window.event;
    return { 'x': e.clientX, 'y': clientY }
}

window.addEventListener("load", init, false);


function init() {
    // Adding event listener for adding note
    var btnNote = document.getElementById("addNote");
    btnNote.addEventListener("click", function () { addNote(); }, false);

    // Adding event listener for deleting stickies
    var btnRemove = document.getElementById("removeAllNote");
    btnRemove.addEventListener("click", function () { deleteNotesAll(); }, false);

    // Adding event listener for clustering stickies based on color
    var btnColor = document.getElementById("clusterColorStickies");
    btnColor.addEventListener("click", function () { clusterColorStickies(); }, false);


    // Adding event listener for searching sticky based on color
    var btnSearchNote = document.getElementById("searchNote");
    // btnSearchNote.addEventListener("click", function () { searchSticky(document.querySelector("input").value); }, false);
    btnSearchNote.addEventListener("click", function () { searchSticky(); }, false);


    loadData();
    // Add event listeners
    document.addEventListener("touchstart", mousedownHandler, false);
    document.addEventListener("touchend", mouseupHandler, false);
}


function clusterColorStickies() {

    // We initially support 2 clusters
    // Cluster 1: Red
    // Cluster 2: Green
    // Cluster 3: Blue
    // Cluster 4: Yellow

    // Get the dimensions of the screen
    var height = window.screen.height;
    var width = window.screen.width;


    var c1_x1 = 0, c1_y1 = 0;
    var c1_xstart = 0, c1_ystart = 0;
    var c2_x1 = width / 2, c2_y1 = 0;
    var c3_x1 = 0, c3_y1 = height / 2;
    var c4_x1 = width / 2, c4_y1 = height / 2;

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);

        if (value[0].color == "#FFCCCC") {
            document.getElementById(key).style.left = c1_x1 + "px";
            document.getElementById(key).style.top = c1_y1 + "px";

            if ((c1_y1 + 180) < (height / 2)) {
                c1_y1 += 180;
            }
            else {
                c1_x1 += 180;
                c1_y1 = c1_ystart;
            }
            if ((c1_x1 + 180) > width / 2) {
                c1_xstart += 20;
                c1_ystart += 20;
                c1_x1 = c1_xstart;
                c1_y1 = c1_ystart;

            }

        }
        if (value[0].color == "#CCFFCC") {
            document.getElementById(key).style.left = c2_x1 + "px";
            document.getElementById(key).style.top = c2_y1 + "px";

            if ((c2_y1 + 180) < (height / 2)) {
                c2_y1 += 180;
            }
            else {
                c2_x1 += 180;
                c2_y1 = 0;
            }
        }
        if (value[0].color == "#99CCFF") {
            document.getElementById(key).style.left = c3_x1 + "px";
            document.getElementById(key).style.top = c3_y1 + "px";

            if ((c3_y1 + 180) < height) {
                c3_y1 += 180;
            }
            else {
                c3_x1 += 180;
                c3_y1 = height / 2;
            }
        }
        if (value[0].color == "#FFFFCC") {
            document.getElementById(key).style.left = c4_x1 + "px";
            document.getElementById(key).style.top = c4_y1 + "px";

            if ((c4_y1 + 180) < height) {
                c4_y1 += 180;
            }
            else {
                c4_x1 += 180;
                c4_y1 = height / 2;
            }
        }

    }
}

function searchSticky() {

    var h = window.screen.height - 280;
    var w = window.screen.width - 500;
    var input = document.createElement("input");
    input.setAttribute("id", "tbInputText");
    input.setAttribute("placeholder", "Search text here!");
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = w + "px";
    input.style.top = h + "px";
    input.style.width = 150 + "px";
    input.style.height = 50 + "px";
    input.style.backgroundColor = "yellow";

    document.body.appendChild(input);
    input.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            console.log("keydown");
            search_text = document.getElementById('tbInputText').value;
            document.getElementById("tbInputText").remove();
            move_position_sticky(search_text);
        }
        if (event.keyCode == 27) {
            document.getElementById("tbInputText").remove();
        }



    });

}

function move_position_sticky(search_text) {

    var count = 0;
    var sticky_key = 0;
    var original_x = 0, original_y = 0;

    // console.log(search_text);
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);


        var str1 = value[0].text; // Text in stickies
        var n = str1.search(new RegExp(search_text, "i"));
        if (n != -1) {
            original_x = value[0].notePositionLeft;
            original_y = value[0].notePositionTop;
            break;
        }
    }
    if (n != -1) {
        var height = window.screen.height - 300;
        var width = window.screen.width - 300;
        document.getElementById(key).style.top = height + "px";
        document.getElementById(key).style.left = width + "px";
        var sticky = document.getElementById(key);
        sticky.addEventListener('keydown', function (event) {
            if (event.keyCode == 13) {
                sticky_position_change(key, original_x, original_y);
            }
        });
    }


}

function sticky_position_change(key,new_x, new_y){
    document.getElementById(key).style.left = new_x + "px";
    document.getElementById(key).style.top = new_y + "px";
    saveNote(key);
}
