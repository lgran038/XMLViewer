//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//RemoveHeader before while doc is loading
var header = document.getElementsByClassName("header")[0];
header.parentNode.removeChild(header);


//Only begins running when window loads
function main () {
    var collapsibleRoot = document.getElementById("collapsible0");
    
    //Setting root's onclick
    collapsibleRoot.children[0].children[0].onmousedown = (e) => this.onElementClick(e);
    collapsibleRoot.children[1].children[0].onmousedown = (e) => this.onElementClick(e);
    this.setOnElementClick(collapsibleRoot);
}

//Collapse a node
function collapse(node){
    node.children[0].className = "expanded hidden";
    node.children[1].className = "collapsed";
}

//Expand a node
function expand(node){
    node.children[0].className = "expanded";
    node.children[1].className = "collapsed hidden";
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
    
    //Set on click only for collapsible nodes
    if(node && node.className === "collapsible"){
        var collapsible = node.children[0].children[1].children;

        for (child of collapsible){
            if (child.className === "collapsible"){
                child.children[0].children[0].onclick = (e) => this.onElementClick(e);
                child.children[1].children[0].onclick = (e) => this.onElementClick(e);
                child.children[0].children[0].ondblclick = (e) => this.onDoubleClick(e);
                child.children[1].children[0].ondblclick = (e) => this.onDoubleClick(e);
                
                this.setOnElementClick(child);
            }
        }
    }
}

//Triggers when element is clicked
function onElementClick(e){
    if(e.type === "click"){
        //If collapsible element is right clicked
        var id = e.path[3].id;
        if(e.which === 1){
            //Collapse Children on ctrl+left_click
            if(e.ctrlKey){
                var node = document.getElementById(id);
                this.collapseChildren(node);
            }
            //Expand Children on alt+left_click
            if(e.altKey){
                var node = document.getElementById(id);
                this.expandChildren(node);
            }
        }
        if(e.which === 3){
            //Set the id of child clicked on
            chrome.storage.local.set({childClickedID: id}, function(){
                chrome.runtime.sendMessage({
                    childClickedID: id,
                    message: "childRightClicked"
                });
            });
        }
    }
}

function onDoubleClick(e){
    if(e.type === "dblclick"){
        //If collapsible element is right clicked
        var id = e.path[3].id;
        if(e.which === 1){
            if(e.ctrlKey){
                var node = document.getElementById(id);
                this.collapseSiblings(node);
            }
            if(e.altKey){
                var node = document.getElementById(id);
                this.expandSiblings(node);
            }
        }
    }
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
    console.log(e.message);
    switch(e.message){
        case "collapseChildren": //Listening for collapseChildren message
            //Reset childRgtClkIDValid
            chrome.storage.local.set({childRgtClkIDValid: false});

            //Collapse children if child exists and is valid
            if (e.result.childClickedID && e.result.childRgtClkIDValid){
                var node = document.getElementById(e.result.childClickedID);
                this.collapseChildren(node);
            }
            break;
        case "expandChildren": //Listening for expandChildren message
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Expand children if child exists and is valid
        if (e.result.childClickedID && e.result.childRgtClkIDValid){
            var node = document.getElementById(e.result.childClickedID);
            this.expandChildren(node);
        }
        break;
        case "collapseSiblings": //Listening for collapseSiblings message
            //Reset childRgtClkIDValid
            chrome.storage.local.set({childRgtClkIDValid: false});

            //Expand children if child exists and is valid
            if (e.result.childClickedID && e.result.childRgtClkIDValid){
                var node = document.getElementById(e.result.childClickedID);
                this.collapseSiblings(node);
            }
            break;
        case "expandSiblings": //Listening for expandSiblings message
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Expand children if child exists and is valid
        if (e.result.childClickedID && e.result.childRgtClkIDValid){
            var node = document.getElementById(e.result.childClickedID);
            this.expandSiblings(node);
        }
        break;
        default:
            console.log("Message not recognized: ", e);
    }
}