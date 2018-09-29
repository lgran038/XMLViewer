//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

this.buildHeader();

//Only begins running when window loads
function main () {
    this.addStyles();
    this.loadActiveTheme();
}

function buildHeader(){
    var body = document.getElementsByTagName("body")[0];
    //Remove original styling of container.
    body.childNodes[1].style.marginTop = "0px";
    body.childNodes[1].style.paddingTop = "10px";

    var header = document.createElement("div");
    header.id = "custom-header-collapsed";
    var content = document.createElement("div");
    content.id = "custom-content";
    var headerTab = document.createElement("div");
    headerTab.id = "custom-tab";

    //Add Icon link element
    var settingsIcon = document.createElement("img");
    settingsIcon.id = "settings-icon";
    settingsIcon.addEventListener('click', function(){onSettingsClick()});

    headerTab.appendChild(settingsIcon);
    content.appendChild(this.themeSelector());
    header.appendChild(headerTab);
    header.appendChild(content);
    
    //Add header
    body.insertBefore(header, body.childNodes[1]);
}

function onSettingsClick(){
    var content = document.querySelectorAll("[id^=custom-header-]")[0];
    if (content.id === "custom-header-expanded"){
        content.id = "custom-header-collapsed";
    }
    else if (content.id === "custom-header-collapsed"){
        content.id = "custom-header-expanded";
    }

}

//Adds style elements to style sheet, initially default.
function addStyles(){
    var styleSheet = document.getElementsByTagName("style")[0];
    var styles = "";
    for (t of THEME_LIST){
        styles += this.createStyle("body." + t.name, [
            {prop: "color", value: t.textColor},
            {prop: "background-color", value: t.backgroundColor},
            {prop: "font-family", value: t.fontFamily},
            {prop: 'font-size', value: t.fontSize}
        ]);
        styles += this.createStyle("body." + t.name + " .html-tag", [{prop: "color", value: t.tag}]);
        styles += this.createStyle("body." + t.name + " .html-attribute-name", [{prop: "color", value: t.attrName}]);
        styles += this.createStyle("body." + t.name + " .html-attribute-value", [{prop: "color", value: t.attrValue}]);
        styles += this.createStyle("body." + t.name + " .html-comment", [{prop: "color", value: t.comment}]);
    }
    
    var styleSheet = document.getElementsByTagName("style")[0];
    styleSheet.appendChild(document.createTextNode(styles));
}

//Loads the theme saved by user. Default is theme is classic
function loadActiveTheme(){
    chrome.storage.local.get(['activeTheme'], function(result){
        if (result.activeTheme){
            updateTheme(result.activeTheme);
            highlightTheme(result.activeTheme.name);
        }
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
    if(selectedTheme){
        chrome.storage.local.set({selectedTheme}, function(){
            highlightTheme(selectedTheme.name);
        });
    };
}

//When Save Theme is clicked, set the current theme to the selected theme
function onThemeSaveClick(){
    chrome.storage.local.get(['selectedTheme'], function(result){
        chrome.storage.local.set({activeTheme: result.selectedTheme});

        updateTheme(result.selectedTheme);
    });
}

//Change the class name of the body to the requested theme.
function updateTheme(theme){
    document.getElementsByTagName("body")[0].className = theme.name;
}

//Highlights the selected theme
function highlightTheme(themeName){
    var themes = document.querySelectorAll('[id^=theme-]');
    var index = 0;
    for (t of themes){
        var name = t.id.split("-")[1].split("_")[0];
        if (name === themeName)
            t.id = "theme-" + name + "_" + index + "-highlighted";
        else
            t.id = "theme-" + name + "_" + index;
        index++;
    }
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
        //Non highlighted Theme
        styles += "\n#" + theme.id + " {\n\tbackground-color: " + item.backgroundColor + 
        ";\n\tfont-family: " + item.fontFamily + 
        ";\n\tfont-size: " + item.fontSize + 
        ";\n\tborder-width: 1pt;\n}\n";

        //Highlighted Theme
        styles += "\n#" + theme.id + "-highlighted {\n\tbackground-color: " + item.backgroundColor + 
        ";\n\tfont-family: " + item.fontFamily + 
        ";\n\tfont-size: " + item.fontSize + 
        ";\n\tborder-width: 3pt;\n}\n";

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
