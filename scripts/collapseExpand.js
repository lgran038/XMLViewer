//All functions pertaining to collapsing and expanding go here

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
