//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

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
    
    //Listening for collapseChildren message
    if(e.message === "collapseChildren"){
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Collapse children if child exists and is valid
        if (e.result.childClickedID && e.result.childRgtClkIDValid){
            var node = document.getElementById(e.result.childClickedID);
            var children = this.getCollapsibleChildren(node);
            //Collapse children
            for (child of children)
                this.collapse(child);
        }
    }

    //Listening for expandChildren message
    if(e.message === "expandChildren"){
        //Reset childRgtClkIDValid
        chrome.storage.local.set({childRgtClkIDValid: false});

        //Collapse children if child exists and is valid
        if (e.result.childClickedID && e.result.childRgtClkIDValid){
            var node = document.getElementById(e.result.childClickedID);
            //Expand itself if collapsed
            this.expand(node);
            var children = this.getCollapsibleChildren(node);
            //Expand children
            for (child of children)
                this.expand(child);
        }
    }

});