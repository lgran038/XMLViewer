//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//Only begins running when window loads
function main () {

}

function pathToNode(node){
    var path="";
    console.log("Original: ", node);
    var newNode = node;
    while (newNode.parentNode && newNode.id != "collapsible0"){
        if (newNode.className === "html-attribute-name"){
            console.log("attribute: ",newNode.innerText);
            path = "/@" + newNode.innerText + path;
        }
        if (newNode.className === "html-tag"){
            var newPath = newNode.childNodes[0].textContent.substring(1);
            if (newPath[0] === "/")
                newPath = newPath.substring(1);
            console.log("tag: ", newPath)
            path = "/" + newPath + path;
            newNode = newNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            console.log("After tag: ", path)
        }
        if (newNode.className === "collapsible"){
            console.log("collapsible: ", newNode.children[0].children[0].children[1].childNodes[0].textContent.substring(1))
            path = "/" + newNode.children[0].children[0].children[1].childNodes[0].textContent.substring(1) + path;
        }
        newNode = newNode.parentNode;
        console.log("Parent: ", newNode);
    }
    console.log("Final path: ", path);
    return path;
}