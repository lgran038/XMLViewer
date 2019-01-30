// All function pertaining to XPath go here.

function xPathMain(e){
    var xPathNODE = this.buildXPath(e);
    
    console.log("PATH: " + xPathNODE.XPath);
    console.log("NODE Data: " + xPathNODE.node.srcElement.className);
}

//Returns the XPath of the selected node
//Currently returns a general XPath, not the specific path
function buildXPath(node){
    var path = "";
    var htmlTagFound = false;
    var firstExpanded = true;
    var collapsedFound = false;
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
                if((htmlTagFound && !firstExpanded) || (htmlTagFound && collapsedFound) || !htmlTagFound){
                    path = "/" + this.getHtmlTagName(elt.children[0].children[1].innerText) + path;
                    previousElt = elt;
                    collapsedFound = false;
                }
                firstExpanded = false;
                break;
            case "collapsed":
                collapsedFound = true;
                break;
        }
    }

    return {XPath: path, node}; 
}

//Returns html tag name
function getHtmlTagName(text){
    return text.replace(/[<>/]/g,' ').trim().split(' ')[0];
}