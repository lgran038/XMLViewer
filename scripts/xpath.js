// All function pertaining to XPath go here.


//Returns the XPath of the selected node
function buildXPath(node){
    console.log(node.path);
    var path = "";
    var previousElt = "";
    var htmlTagFound = false;
    var firstExpanded = true;
    for (elt of node.path){
        switch(elt.className){
            case "html-attribute":
                path = "/@" + elt.children[0].innerText.trim() + path;
                previousElt = elt;
                break;
            case "html-tag":
                path = "/" + this.getHtmlTagName(elt.innerText) + path;
                htmlTagFound = true;
                break;
            case "expanded":
                if((htmlTagFound && !firstExpanded) || !htmlTagFound){
                    path = "/" + this.getHtmlTagName(elt.children[0].children[1].innerText) + path;
                    previousElt = elt;
                    firstExpanded = false;
                }
                break;
            case "collapsed":
                path = "/" + this.getHtmlTagName(elt.children[0].innerText) + path;
                previousElt = elt;
                break;
        }
    }

    console.log("PATH: " + path);
}

//Returns html tag name
function getHtmlTagName(text){
    return text.replace(/[<>/]/g,' ').trim().split(' ')[0];
}