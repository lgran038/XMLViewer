//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//Only begins running when window loads
function main () {
    //this.addStyles();
    this.loadActiveTheme();

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

//Adds style elements to style sheet, initially default.
function addStyles(){
    var styleSheet = document.getElementsByTagName("style")[0];
    var styles = "";
    styles += this.createStyle("body", [
        {prop: "color", value: "black"},
        {prop: "background-color", value: "white"},
        {prop: "font-family", value: "monospace"},
        {prop: 'font-size', value: "13px"}
    ]);
    styles += this.createStyle(".html-tag", [{prop: "color", value: "#881280"}]);
    styles += this.createStyle(".html-attribute-name", [{prop: "color", value: "#994500"}]);
    styles += this.createStyle(".html-attribute-value", [{prop: "color", value: "#1A1AA6"}]);
    styles += this.createStyle(".html-comment", [{prop: "color", value: "#236E25"}]);
    var styleSheet = document.getElementsByTagName("style")[0];
    styleSheet.appendChild(document.createTextNode(styles));
}

//Loads the theme saved by user. Default is theme is classic
function loadActiveTheme(){
    chrome.storage.local.get(['activeTheme'], function(result){
        updateTheme(result.activeTheme);
        //highlightTheme(result.activeTheme.name);
    });
}

//Creates a new style as a string to be added to the style sheet
function createStyle(styleName, styles){
    var style = "\n" + styleName + " {";
    for (s of styles){
        style += "\n\t" + s.prop + ": " + s.value + ";"
    }
    style+= "\n}\n";
    return style;
}

//When theme is clicked, set it as the selected theme
function onThemeClick(e){
    var themeIndex = 0;
    var selectedTheme = {};
    for(elt of e.path){
        if (elt.id.startsWith("theme-")){
            themeIndex = elt.id.split('_')[1];
            break;
        }
    }
    
    selectedTheme = THEME_LIST[themeIndex];
    chrome.storage.local.set({selectedTheme});

    this.highlightTheme(selectedTheme.name);

}

//When Save Theme is clicked, set the current theme to the selected theme
function onThemeSaveClick(e){
    chrome.storage.local.get(['selectedTheme'], function(result){
        chrome.storage.local.set({activeTheme: result.selectedTheme});

        updateTheme(result.selectedTheme);
    });
}

//Replaces the styles in style sheet with those that match the theme requested
function updateTheme(theme){
    var styleSheet = document.getElementsByTagName("style")[0];
    var styles = styleSheet.innerHTML;
    var body = this.getStyle("body");
    var tag = this.getStyle(".html-tag");
    var attrName = this.getStyle(".html-attribute-name");
    var attrValue = this.getStyle(".html-attribute-value");
    var comment = this.getStyle(".html-comment");

    styles.replace(body, "");
    styles.replace(tag, "");
    styles.replace(attrName, "");
    styles.replace(attrValue, "");
    styles.replace(comment, "");

    var styles = "";
    styles += this.createStyle("body", [
        {prop: "color", value: theme.textColor},
        {prop: "background-color", value: theme.backgroundColor},
        {prop: "font-family", value: theme.fontFamily},
        {prop: 'font-size', value: theme.fontSize}
    ]);
    styles += this.createStyle(".html-tag", [{prop: "color", value: theme.tag}]);
    styles += this.createStyle(".html-attribute-name", [{prop: "color", value: theme.attrName}]);
    styles += this.createStyle(".html-attribute-value", [{prop: "color", value: theme.attrValue}]);
    styles += this.createStyle(".html-comment", [{prop: "color", value: theme.comment}]);
    styleSheet.appendChild(document.createTextNode(styles));
}

function highlightTheme(themeName){
    var targetThemeClass = "#theme-" + themeName;
    var themeIndex = 0;
    var theme = {};
    for (t of THEME_LIST){
        if (t.name === themeName){
            theme = t;
            break;
        }
        themeIndex++;
    }
    targetThemeClass += "_" + themeIndex;
    // themeStyle = this.getStyle(themeClass);
    var styleSheet = document.getElementsByTagName("style")[0];
    var styles = styleSheet.innerHTML;
    var newStyles = "";
    var index = 0;


    //REPLACING THEMES NOT WORKING/////////////////////////////////////////////////////////////////
    styles.replace(this.getStyle("#theme-classic_0"),"");
    styles.replace(this.getStyle("#theme-dark_1"),"");
    styles.replace(this.getStyle("#theme-light_2"),"");
    
    console.log(this.getStyle("#theme-classic_0"));
    console.log(this.getStyle("#theme-dark_1"));
    console.log(this.getStyle("#theme-light_2"));
    
    for (t of THEME_LIST){
        var themeClass = "#theme-" + t.name + "_" + index;
        if(themeClass === targetThemeClass){
            newStyles += this.createStyle(themeClass, [
                {prop: "background-color", value: t.backgroundColor},
                {prop: "font-family", value: t.fontFamily},
                {prop: "font-size", value: t.fontSize},
                {prop: "border-width", value: "3pt"}
            ]);
        }else{
            newStyles += this.createStyle(themeClass, [
                {prop: "background-color", value: t.backgroundColor},
                {prop: "font-family", value: t.fontFamily},
                {prop: "font-size", value: t.fontSize},
                {prop: "border-width", value: "1pt"}
            ]);
        }
        index++;
        
    }
    
    styleSheet.appendChild(document.createTextNode(newStyles));
    
}

//Gets a style from the style sheet
function getStyle(className){
    var styles = document.getElementsByTagName("style")[0];
    var start = styles.innerHTML.indexOf(className);
    var end = styles.innerHTML.indexOf("}", start);
    var result = styles.innerHTML.substring(start, end + 1);
    return result;
}

//MIGHT BE WORKING BUT POTENTIALLY BROKEN
//Currently unused.
function getStyleObj(className){
    var styleString = this.getStyle(className);
    //Insides
    var content = styleString.substring(styleString.indexOf("{") + 1, styleString.indexOf("}"));
    var noWhite = content.replace(/\s/g,'');
    noWhite = noWhite.substring(0, noWhite.length -1);
    var splitContent = noWhite.split(";");
    var styleObject = [];
    for(s of splitContent){
        var prop = s.split(":")[0];
        var value = s.split(":")[1];
        styleObject.push({prop, value});
    }

    return styleObject;
}

//Builds theme selector
function themeSelector(){
    var group = document.createElement("div");
    var groupHeader = document.createElement("div");
    var groupBody = document.createElement("div");
    var groupHeaderTitle = document.createElement("div");
    var saveButton = document.createElement("div");
    var styleSheet = document.getElementsByTagName("style")[0];
    var styles = "";

    group.id = "group";
    groupHeader.id = "group-header";
    groupBody.id = "group-body";
    groupHeaderTitle.id = "group-header-title";
    saveButton.id = "button-save";

    groupHeaderTitle.appendChild(document.createTextNode("Themes"));
    saveButton.appendChild(document.createTextNode("Save Theme"));
    groupHeader.appendChild(groupHeaderTitle);
    groupHeader.appendChild(saveButton);
    group.appendChild(groupHeader);
    saveButton.addEventListener('click', function(e){onThemeSaveClick(e)});

    var themeCounter = 0;
    //Builds themes
    for(item of THEME_LIST){
        var theme = document.createElement("div");
        theme.id = "theme-" + item.name + "_" + themeCounter++;
        styles += "\n#" + theme.id + " {\n\tbackground-color: " + item.backgroundColor + 
        ";\n\tfont-family: " + item.fontFamily + 
        ";\n\tfont-size: " + item.fontSize + 
        ";\n\tborder-width: 1pt;\n}\n";
        theme.addEventListener('click', function(e){onThemeClick(e)});

        var comment = document.createElement("div");
        comment.id = "comment-" + item.name;
        comment.appendChild(document.createTextNode("<--" + item.displayName + "-->"));
        styles += "\n#" + comment.id + " {\n\tcolor: " + item.comment + ";\n}\n";

        var line = document.createElement("div");
        line.id = "xml-line";

        var tag = document.createElement("div");
        tag.id = "tag-" + item.name;
        styles += "\n#" + tag.id + " {\n\tcolor: " + item.tag + ";\n}\n";
        tag.appendChild(document.createTextNode("<Tag\u00A0"));

        var attrName = document.createElement("div");
        attrName.id = "attrName-" + item.name;
        styles += "\n#" + attrName.id + " {\n\tcolor: " + item.attrName + ";\n}\n";
        attrName.appendChild(document.createTextNode("attrName"));
        
        var tag2 = document.createElement("div");
        tag2.id = tag.id;
        tag2.appendChild(document.createTextNode("=\""));

        var attrValue = document.createElement("div");
        attrValue.id = "attrValue-" + item.name;
        styles += "\n#" + attrValue.id + " {\n\tcolor: " + item.attrValue + ";\n}\n";
        attrValue.appendChild(document.createTextNode("attrValue"));

        var tag3 = document.createElement("div");
        tag3.id = tag.id;
        tag3.appendChild(document.createTextNode("\">"));

        var text = document.createElement("div");
        text.id = "text-" + item.name;
        styles += "\n#" + text.id + " {\n\tcolor: " + item.textColor + ";\n}\n";
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

    styleSheet.appendChild(document.createTextNode(styles));

    group.appendChild(groupBody);

    return group;
}
