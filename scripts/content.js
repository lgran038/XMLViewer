//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//RemoveHeader before while doc is loading
var header = document.getElementsByClassName("header")[0];
header.parentNode.removeChild(header);


//Only begins running when window loads
function main () {
    var collapsibleRoot = document.getElementById("collapsible0");

    this.setOnElementClick(collapsibleRoot);
}

//Collapse a node
function collapse(node){
    //First check if the node is collapsible
    if (node.children[0].className === "expanded" || node.children[0].className === "expanded hidden"){
        node.children[0].className = "expanded hidden";
        node.children[1].className = "collapsed";
    }
}

//Expand a node
function expand(node){
    //First check if the node is collapsible
    if (node.children[0].className === "expanded" || node.children[0].className === "expanded hidden"){
        node.children[0].className = "expanded";
        node.children[1].className = "collapsed hidden";
    }
}

//Collapses Children
function collapseChildren(node){
    var children = this.getCollapsibleChildren(node);
    //Collapse children
    for (child of children)
    this.collapse(child);
}

//Expands Children
function expandChildren(node){
    this.expand(node);
    var children = this.getCollapsibleChildren(node);
    //Expand children
    for (child of children)
        this.expand(child);
}

//Collapses Siblings
function collapseSiblings(node){
    var parentNode = node.parentNode.parentNode.parentNode;
    if (parentNode){
        var siblings = this.getCollapsibleChildren(parentNode);
        //Collpase siblings
        for (sibling of siblings)
            this.collapse(sibling);
    }
}

//Expands Siblings
function expandSiblings(node){
    var parentNode = node.parentNode.parentNode.parentNode;
    if (parentNode){
        var siblings = this.getCollapsibleChildren(parentNode);
        //Expand siblings
        for (sibling of siblings)
            this.expand(sibling);
    }
}

//Returns all collapsible children
//Input node must be collapsible
function getCollapsibleChildren(node){
    var childList = [];
    if(node && node.className === "collapsible"){
        //node.children[0].children[1] is collapsible content
        var collapsible = node.children[0].children[1].children;
        
        for (child of collapsible){
            if (child.className === "collapsible"){
                childList.push(child);
            }
        }
    }
    return childList;
}

//On click method for nodes
function setOnElementClick(node){
    //Set on click for line elements
    if(node && node.className === "collapsible"){
        var lines = document.getElementsByClassName("html-tag");

        for (line of lines){
            line.addEventListener('click', makeDoubleClick(), false);
            line.onmousedown = (e) => this.onRightClick(e);
        }
    }
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