//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//Only begins running when window loads
function main () {
    var header = document.createElement("div");
    header.id = "custom-header-expanded";
    var body = document.getElementsByTagName("body")[0];
    //Remove original styling of container.
    body.childNodes[1].style.marginTop = "0px";
    body.childNodes[1].style.paddingTop = "10px";

    //header.appendChild(this.collapsedHeader());
    //header.appendChild(this.expandedHeader());

    //Add header
    header.appendChild(this.themeSelector());
    body.insertBefore(header, body.childNodes[1]);
}



function themeSelector(){
    var group = document.createElement("div");
    var groupHeader = document.createElement("div");
    var groupBody = document.createElement("div");
    var groupHeaderTitle = document.createElement("div");
    var styles = document.getElementsByTagName("style")[0];
    
    group.id = "group";
    groupHeader.id = "group-header";
    groupBody.id = "group-body";
    groupHeaderTitle.id = "group-header-title";

    groupHeaderTitle.appendChild(document.createTextNode("Themes"));
    groupHeader.appendChild(groupHeaderTitle);
    group.appendChild(groupHeader);

    for(item of THEME_LIST){
        var theme = document.createElement("div");
        theme.id = "theme-" + item.name.toLowerCase();
        styles.innerHTML += "\n#" + theme.id + " {\n\tbackground-color: " + item.backgroundColor + ";\n} \n";

        var comment = document.createElement("div");
        comment.id = "comment-" + item.name.toLowerCase();
        comment.appendChild(document.createTextNode("<--" + item.name + "-->"));
        styles.innerHTML += "\n#" + comment.id + " {\n\tcolor: " + item.comment + ";\n} \n";

        var line = document.createElement("div");
        line.id = "xml-line";

        var tag = document.createElement("div");
        tag.id = "tag" + item.name.toLowerCase();
        styles.innerHTML += "\n#" + tag.id + " {\n\tcolor: " + item.tag + ";\n} \n";
        tag.appendChild(document.createTextNode("<Tag\u00A0"));

        var attrName = document.createElement("div");
        attrName.id = "attrName-" + item.name.toLowerCase();
        styles.innerHTML += "\n#" + attrName.id + " {\n\tcolor: " + item.attrName + ";\n} \n";
        attrName.appendChild(document.createTextNode("attrName"));
        
        var tag2 = document.createElement("div");
        tag2.id = tag.id;
        tag2.appendChild(document.createTextNode("=\""));

        var attrValue = document.createElement("div");
        attrValue.id = "attrValue-" + item.name.toLowerCase();
        styles.innerHTML += "\n#" + attrValue.id + " {\n\tcolor: " + item.attrValue + ";\n} \n";
        attrValue.appendChild(document.createTextNode("attrValue"));

        var tag3 = document.createElement("div");
        tag3.id = tag.id;
        tag3.appendChild(document.createTextNode("\">"));

        var text = document.createElement("div");
        text.id = "text-" + item.name.toLowerCase();
        styles.innerHTML += "\n#" + text.id + " {\n\tcolor: " + item.textColor + ";\n} \n";
        text.appendChild(document.createTextNode("Text"));

        var closeTag = document.createElement("div");
        closeTag.id = tag.id;
        closeTag.appendChild(document.createTextNode("</Tag>"));

        line.appendChild(tag);
        line.appendChild(attrName);
        line.appendChild(tag2);
        line.appendChild(attrValue);
        line.appendChild(tag3);
        line.appendChild(text);
        line.appendChild(closeTag);

        theme.appendChild(comment);
        theme.appendChild(line);

        groupBody.appendChild(theme);
    }

    group.appendChild(groupBody);

    return group;
}