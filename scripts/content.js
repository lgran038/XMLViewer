//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

function main (evt) {
    //Code goes here
    //Example: var test = document.getElementById("collapsible0");
    var tags = document.getElementsByClassName("body");
    console.log(tags);
    console.log("Parent Node", document.getElementById("collapsible0"));
    this.getCollapsibleChildren(document.getElementById("collapsible0"));
}

function collapse(node){
    node.children[0].className = "expanded hidden";
    node.children[1].className = "collapsed";
}

function getCollapsibleChildren(node){
    //node.children[0].children[1] is collapsible content
    var collapsible = node.children[0].children[1].children;
    for (child of collapsible){
        if (child.className === "collapsible"){
            console.log("Collapsible child: ",child);
        }
    }
}