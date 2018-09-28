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
function collapseOrExpand(node){
    if (node.children[0].className === "expanded"){
        node.children[0].className = "expanded hidden";
        node.children[1].className = "collapsed";
    }else if (node.children[1].className === "collapsed"){
        node.children[0].className = "expanded";
        node.children[1].className = "collapsed hidden";
    }
}

//Expand a node
function expand(node){
    node.children[0].className = "expanded";
    node.children[1].className = "collapsed hidden";
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
                child.children[0].children[0].onmousedown = (e) => this.onElementClick(e);
                child.children[1].children[0].onmousedown = (e) => this.onElementClick(e);
                
                this.setOnElementClick(child);
            }
        }
    }
}

//Triggers when element is clicked
function onElementClick(e){

    //If collapsible element is right clicked
    var id = e.path[3].id;
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

//Listends for messages from background script
//NOTE: SHOULD REFACTOR. ON MESSAGE LISTENER SHOULD MAKE FUNCTION CALLS NOT APPLY LOGIC
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
                var children = this.getCollapsibleChildren(node);
                //Collapse children
                for (child of children)
                    this.collapseOrExpand(child);
            }
            break;
        case "collapseSiblings": //Listening for collapseSiblings message
            //Reset childRgtClkIDValid
            chrome.storage.local.set({childRgtClkIDValid: false});

            //Expand children if child exists and is valid
            if (e.result.childClickedID && e.result.childRgtClkIDValid){
                var node = document.getElementById(e.result.childClickedID);
                var parentNode = node.parentNode.parentNode.parentNode;
                if (parentNode){
                    var siblings = this.getCollapsibleChildren(parentNode);
                    //Expand children
                    for (sibling of siblings)
                        this.collapseOrExpand(sibling);
                }
            }
            break;
        default:
            console.log("Message not recognized: ", e);
    }
}