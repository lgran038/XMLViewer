/**
 * Creates elemtent with the class name provided
 */
Document.prototype.createElementWithClass = function (name, className) {
    let elem = document.createElement(name);
    elem.setAttribute("class", className);
    return elem;
};

/**
 * Self node of this element within the source xml tree
 */
Element.prototype.xNode = null;

/**
 * Parent node of this element within the source xml tree
 */
Element.prototype.xParent = null;

/**
 * Array of child nodes of this element within the source xml tree
 */
Element.prototype.xChildren = [];

/**
 * Next sibling node of this element withing the source xml tree
 */
Element.prototype.xNextSibling = null;

/**
 * Previous sibling node of this element withing the source xml tree
 */
Element.prototype.xPreviousSibling = null;

/**
 * If true, then Element has a comment within Element.childNodes
 */
Element.prototype.hasComments = false;

/**
 * Returns a list of non empty text child nodes and comment nodes
 * @param {boolean} includeComments
 */
Element.prototype.getNonEmptyTexts = function (includeComments) {
    let textArr = [];

    for (let node of this.childNodes) {
        if ((node.nodeType == document.TEXT_NODE && node.value.trim()) || (includeComments && node.nodeType == document.COMMENT_NODE)) {
            textArr.push(node);
            
            if (node.nodeType == document.COMMENT_NODE)
                this.hasComments = true;
        }
    }

    return textArr;
};