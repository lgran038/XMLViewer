var xmlDocRoot = document.getElementById("webkit-xml-viewer-source-xml").firstChild;

//Clearing head and body
document.getElementsByTagName("head")[0].innerHTML = "";
document.getElementsByTagName("body")[0].innerHTML = "";

//Generating new HTML
var bodyElt = document.getElementsByTagName("body")[0];
var newNode = this.createHTMLElementNode(xmlDocRoot);
bodyElt.appendChild(newNode);


//Build an HTML Element Node
function createHTMLElementNode(dataNode, childDataNode){
    var tagName = dataNode.tagName;
    var attributes = dataNode.attributes;
    var openTag = this.createXMLText("<", "xml-meta-text");
    var openTag2 = this.createXMLText("<", "xml-meta-text");
    var closeTag = this.createXMLText(">", "xml-meta-text");
    var closeTag2 = this.createXMLText(">", "xml-meta-text");
    var forwardSlash = this.createXMLText("/", "xml-meta-text");

    //Wraps xml node
    var nodeWrapperDiv = document.createElement("div");
    nodeWrapperDiv.id = "xml-node-wrapper";

    //Name of xml node
    var tagNameDiv = document.createElement("div");
    tagNameDiv.id = "xml-tag-name";
    tagNameDiv.textContent = tagName;
    var tagNameDiv2 = document.createElement("div");
    tagNameDiv2.id = "xml-tag-name";
    tagNameDiv2.textContent = tagName;

    //Opening tag
    nodeWrapperDiv.appendChild(openTag);
    nodeWrapperDiv.appendChild(tagNameDiv);

    //Attributes of xml node
    if (attributes.length > 0){
        for(att of attributes){
            var quote1 = document.createTextNode("\"");
            var quote2 = document.createTextNode("\"");
            var equals = document.createTextNode("=");

            var attributeWrapperDiv = document.createElement("div");
            attributeWrapperDiv.id = "xml-attribute-wrapper";
            var attributeNameDiv = document.createElement("div");
            attributeNameDiv.id = "xml-attribute-name";
            attributeNameDiv.innerHTML = att.nodeName;

            var attributeValueDiv = document.createElement("div");
            attributeValueDiv.id = "xml-attribute-value";
            attributeValueDiv.innerHTML = att.nodeValue;
            
            var space = document.createTextNode('\u00A0');

            //Add attribute
            attributeWrapperDiv.appendChild(space);
            attributeWrapperDiv.appendChild(attributeNameDiv);
            attributeWrapperDiv.appendChild(equals);
            attributeWrapperDiv.appendChild(quote1);
            attributeWrapperDiv.appendChild(attributeValueDiv);
            attributeWrapperDiv.appendChild(quote2);

            nodeWrapperDiv.appendChild(attributeWrapperDiv);
        }
    }
    
    nodeWrapperDiv.appendChild(closeTag);
    //Append Child Nodes
    if (dataNode.childNodes.length > 0){
        for (child of dataNode.childNodes){
            if (child.nodeType === 1){
                var newChildNode = this.createHTMLElementNode(child);
                nodeWrapperDiv.appendChild(this.indentNode(newChildNode));
            }else if(child.nodeType === 3){
                if(child.nextSibling && child.nextSibling.nodeType === 1){
                    var newChildNode = this.createXMLText(child.textContent, "xml-text");
                    nodeWrapperDiv.appendChild(this.indentNode(newChildNode));
                }
                else{
                    var newChildNode = this.createXMLText(child.textContent, "xml-text");
                    nodeWrapperDiv.appendChild(newChildNode);
                }
            }else if(child.nodeType === 8) {
                var commentWrapper = document.createElement("div");
                commentWrapper.id = "xml-comment";
                var newChildNode = document.createTextNode("<!--" + child.nodeValue + "-->");
                commentWrapper.appendChild(newChildNode);
                nodeWrapperDiv.appendChild(this.indentNode(commentWrapper));
            }else{
                console.log("Error: Unexpected node type in createHTMLElementNode." 
                + "\nError Node: " + child.nodeName);
            }            
        }
    }

    nodeWrapperDiv.appendChild(openTag2);
    nodeWrapperDiv.appendChild(forwardSlash);
    nodeWrapperDiv.appendChild(tagNameDiv2);
    nodeWrapperDiv.appendChild(closeTag2);
    return nodeWrapperDiv;
}

function indentNode(node){
    var indentedNode = document.createElement("div");
    indentedNode.id = "xml-indent";
    indentedNode.appendChild(node);
    return indentedNode;
}

function createXMLText(text, id){
    var wrapper = document.createElement("div");
    wrapper.id = id;
    var newText = document.createTextNode(text);
    wrapper.appendChild(newText);

    return wrapper;
}