//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//RemoveHeader before while doc is loading
var header = document.getElementsByClassName("header")[0];
header.parentNode.removeChild(header);


//Only begins running when window loads
function main () {
    var collapsibleRoot = document.getElementById("collapsible0");
    this.setEventListeners(collapsibleRoot);

    document.getElementsByClassName("pretty-print")[0].addEventListener('click', (e) => {
        var content = document.querySelectorAll("[id^=custom-header-]")[0];
        content.id = "custom-header-collapsed";
    }, true);
}

//On click method for nodes
function setEventListeners(node){
    //Set on click for line elements
    if(node && node.className === "collapsible"){
        var lines = document.getElementsByClassName("html-tag");

        for (line of lines){
            line.addEventListener('click', makeDoubleClick(), false);
            line.onmousedown = (e) => this.onRightClick(e);
            line.addEventListener('mouseover', (e) => onMouseOver(e));
        }
    }
}

//On Mouse Over
function onMouseOver(e){
    // Trying to determine path of hovered node

    this.xPathMain(e);

}

//Triggers when element is clicked
function onElementClick(e){
    if(e.type === "click"){
        //Left Click
        if(e.which === 1){
            //Collapse Children on ctrl+left_click
            if(e.ctrlKey && e.path[3].className === "collapsible"){
                var node = e.path[3];
                this.collapseChildren(node);
            }
            //Expand Children on alt+left_click
            if(e.altKey && e.path[3].className === "collapsible"){
                var node = e.path[3];
                this.expandChildren(node);
            }
        }
    }
}

//Triggers when element is double clicked
function onDoubleClick(e){
    var id;
    //If the chosen node is collapsible
    if (e.path[3].className === "collapsible"){
        id = e.path[3].id;
        //Collapse Siblings
        if(e.ctrlKey){
            var node = document.getElementById(id);
            this.collapseSiblings(node);
        }
        //ExpandSiblings
        if(e.altKey){
            var node = document.getElementById(id);
            this.expandSiblings(node);
        }
    }

    //If the chosen node is not collapsible
    else{
        for (elt of e.path){
            if (elt.className === "collapsible"){
                id = elt.id;
                break;
            }
        }
        //Collapse Children of Parent (Collapse Siblings of target)
        if(e.ctrlKey){
            var node = document.getElementById(id);
            this.collapseChildren(node);
        }
        //Expand Children of Parent (Expand Siblings of target)
        if(e.altKey){
            var node = document.getElementById(id);
            this.expandChildren(node);
        }
    }
}

function onRightClick(e){
    //Right Click
    if(e.which === 3){
        //Set the id of child clicked on
        var id;
        //If chosen node is Collapsible
        if (e.path[3].className === "collapsible")
            id = e.path[3].id;
        //If chosen node is not collapsible
        else{
            for (elt of e.path){
                if (elt.className === "collapsible"){
                    id = elt.id;
                    break;
                }
            }
            id += "_isSibling";
        }
        chrome.storage.local.set({childClickedID: id}, function(){
            chrome.runtime.sendMessage({
                childClickedID: e.path[3].id,
                message: "childRightClicked"
            });
        });
    }
}

//Only either fires a single click or a double click.
//When double click is pressed, no single clicks fire.
var makeDoubleClick = function(e) {
    var clicks = 0;
    var timeout;

    return function (e) {
        clicks++;
        if (clicks == 1) {
            timeout = setTimeout(function () {
                onElementClick(e);
                clicks = 0;
            }, 250);
        } else {
            clearTimeout(timeout);
            onDoubleClick(e);
            clicks = 0;
        }
    };
}



//Listens for messages from background script
chrome.runtime.onMessage.addListener(function(e) {
    switch(e.type){
        case "contextMenu":
            this.contextMenuClick(e);
            break;
        default:
            console.log("Message Type not recognized: ", e);
            break;
    }
});

function contextMenuClick(e){
    switch(e.message){
        case "collapseChildren": //Listening for collapseChildren message
            //Collapse children if child exists and is valid
            if (e.result.childClickedID && e.result.childRgtClkIDValid && (e.result.childClickedID.indexOf("_")<0)){
                var node = document.getElementById(e.result.childClickedID);
                this.collapseChildren(node);
            }
            break;
        case "expandChildren": //Listening for expandChildren message
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Expand children if child exists and is valid
        if (e.result.childClickedID && e.result.childRgtClkIDValid && (e.result.childClickedID.indexOf("_")<0)){
            var node = document.getElementById(e.result.childClickedID);
            this.expandChildren(node);
        }
        break;
        case "collapseSiblings": //Listening for collapseSiblings message
            //Reset childRgtClkIDValid
            chrome.storage.local.set({childRgtClkIDValid: false});

            //Collapse Siblings if they exist
            if (e.result.childClickedID && e.result.childRgtClkIDValid  && (e.result.childClickedID.indexOf("_")<0)){
                var node = document.getElementById(e.result.childClickedID);
                this.collapseSiblings(node);
            }else if(e.result.childClickedID && e.result.childRgtClkIDValid){
                var node = document.getElementById(e.result.childClickedID.substring(0, e.result.childClickedID.indexOf("_")));
                this.collapseChildren(node);
            }
            break;
        case "expandSiblings": //Listening for expandSiblings message
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Expand Siblings if they exist
        if (e.result.childClickedID && e.result.childRgtClkIDValid  && (e.result.childClickedID.indexOf("_")<0)){
            var node = document.getElementById(e.result.childClickedID);
            this.expandSiblings(node);
        }else if(e.result.childClickedID && e.result.childRgtClkIDValid){
            var node = document.getElementById(e.result.childClickedID.substring(0,  e.result.childClickedID.indexOf("_")));
            this.expandChildren(node);
        }
        break;
        default:
            console.log("Message not recognized: ", e);
    }
}