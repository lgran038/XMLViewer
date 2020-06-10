let XParser = function (xmlRoot)  {

    this.buildOpenTag = function (sourceNode, selfClosing) {
        let openTag = document.createElementWithClass("span", "html-tag");
        openTag.appendChild(document.createTextNode("<" + sourceNode.tagName));
        openTag.xNode = sourceNode;
        openTag.xParent = sourceNode.parentNode;
        
        for (let attrNode of sourceNode.attributes) {
            let attr = document.createElementWithClass("span", "html-attribute");
            attr.xNode = attrNode;
            attr.xParent = sourceNode;
            
            let attrName = document.createElementWithClass("span", "html-attribute-name");
            attrName.appendChild(document.createTextNode(attrNode.name));

            let attrValue = document.createElementWithClass("span", "html-attribute-value");
            attrValue.appendChild(document.createTextNode(attrNode.value));

            attr.appendChild(attrName);
            attr.appendChild(document.createTextNode('=\"'));
            attr.appendChild(attrValue);
            attr.appendChild(document.createTextNode('\"'));

            openTag.appendChild(attr);            
        }

        if (selfClosing)
            openTag.appendChild(document.createTextNode("/>"));
        else
            openTag.appendChild(document.createTextNode(">"));

        return openTag;
    };

    this.buildCloseTag = function (sourceNode) {
        let closeTag = document.createElementWithClass("span", "html-tag");
        closeTag.appendChild(document.createTextNode("</" + sourceNode.tagName));
        closeTag.appendChild(document.createTextNode(">"));

        return closeTag;
    }

    this.buildComment = function (sourceNode, parentNode) {
        let line = document.createElementWithClass("div", "line");

        let span = document.createElementWithClass("span", "comment html-comment");
        span.appendChild(document.createTextNode(sourceNode.nodeValue));

        line.appendChild(span);
        if (parentNode)
            parentNode.appendChild(line);

        return line;
    }

    this.buildText = function (sourceNode, parentNode) {
        if (sourceNode.nodeValue.trim()) {
            let textNode = document.createElement("span");
            textNode.appendChild(document.createTextNode(sourceNode.nodeValue));
    
            if (parentNode)
                parentNode.appendChild(textNode);

            return textNode;
        }

        return null;
    }

    /**
     * @param {Element} sourceNode 
     * 
     */
    this.buildElement = function (sourceNode, siblingPos) {
        // Always make line to store html open tag
        let htmlOpenTagLine = document.createElementWithClass("div", "line");
        let openTag = this.buildOpenTag(sourceNode, false);
        
        let folderNum = this.folderNum;

        // complex nodes are elements or comments which would need to be stored within a folder
        let hasComplexNodes = false;
        let treeNodes = [];
        let childPos = 0;
        for (let child of sourceNode.childNodes) {
            switch (child.nodeType) {
                case document.TEXT_NODE:
                    if (child.nodeValue.trim())
                        treeNodes.push(this.buildText(child, null));
                    break;
                case document.COMMENT_NODE:
                        hasComplexNodes = true;
                        treeNodes.push(this.buildComment(child, null));
                    break;
                case document.ELEMENT_NODE:
                        hasComplexNodes = true;
                        ++this.folderNum;
                        treeNodes.push(this.buildElement(child, childPos));
                        openTag.xChildren.push(child);
                        ++childPos;
                    break;
            }
        }

        if (sourceNode.xChildren[siblingPos + 1])
        {
            openTag.xNextSibling = sourceNode.xChildren[siblingPos + 1];
            openTag.xNextSibling.xPreviousSibling = openTag;
        }
            

        // Closing html tag
        let closeTag = this.buildCloseTag(sourceNode);

        if (hasComplexNodes) {
            // Folder flow
            let folder = document.createElementWithClass("div", "folder");
            folder.setAttribute("id", "myFolder" + folderNum);

            let opened = document.createElementWithClass("div", "opened");

            for (let node of treeNodes) {
                opened.appendChild(node);
            }
            
            let folded = document.createElementWithClass("span", "folded hidden");
            folded.appendChild(document.createTextNode("..."));

            let folderButton = document.createElementWithClass("span", "folder-button fold");
            htmlOpenTagLine.appendChild(folderButton);
            htmlOpenTagLine.appendChild(openTag);

            let htmlCloseTagLine = document.createElementWithClass("div", "line");
            htmlCloseTagLine.appendChild(closeTag);

            folder.appendChild(htmlOpenTagLine);
            folder.appendChild(opened);
            folder.appendChild(folded);
            folder.appendChild(htmlCloseTagLine);

            return folder;
        }
        else {
            // Non Folder flow
            htmlOpenTagLine.appendChild(openTag);

            for (let node of treeNodes) {
                htmlOpenTagLine.appendChild(node);
            }

            htmlOpenTagLine.appendChild(closeTag);

            this.folderNum--;
            return htmlOpenTagLine;
        }
    };

    this.init = function () {
        console.log("childNodes");
        console.log(this.root.childNodes);
        console.log("children");
        console.log(this.root.children);
        console.log(this.root.attributes);
        
        this.parsedTree = this.buildElement(this.root, 0);
        
        console.log("TREEEEEE!!!!!");
        console.log(this.parsedTree);
    }

    this.reload = function () {
        location.reload();
    }

    this.root = xmlRoot;
    this.parsedTree = document.getElementsByClassName("pretty-print")[0];
    this.folderNum = 0;
    this.init();
    console.log("output");
    console.log(this.parsedTree);
};