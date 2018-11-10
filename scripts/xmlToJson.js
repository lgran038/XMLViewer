//Wait until doc is loaded, then begin execution
window.addEventListener ("load", main, false);

//Only begins running when window loads
function main () {
    var inputXml = document.getElementById("webkit-xml-viewer-source-xml").children[0];

    //console.log(JSON.stringify(this.xmlToJson(inputXml), null, 2));
}

function xmlToJson(xml){
    if (xml.nodeType != 3 || (xml.nodeType === 3 && xml.nodeValue.trim() != "")){
        var obj = {};
        if (xml.nodeType === 1){ //Element Node
            //Do attributes
            if (xml.attributes.length > 0){
                for (attr of xml.attributes){
                    obj["@" + attr.nodeName] = attr.nodeValue;
                }
            }
        } 
        else if (xml.nodeType === 3){ //Text Node
            obj = xml.nodeValue.trim();
        }
        
        //Do Children
        if (xml.hasChildNodes()){
            for(child of xml.childNodes) {
                if(child.nodeType != 3 || (child.nodeType === 3 && child.nodeValue.trim() != "")){
                    var nodeName = child.nodeName;
                    //if (obj[nodeName])
                        //console.log("OBJ Before", nodeName, JSON.stringify(obj[nodeName], null, 2));
                    if (typeof(obj[nodeName]) == "undefined") {
                            obj[nodeName] = xmlToJson(child);
                    } else {
                        if (typeof(obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        console.log(child.nodeType, child.nodeName);
                        obj[nodeName].push(xmlToJson(child));
                        
                        //console.log("OBJ After", nodeName, JSON.stringify(obj[nodeName], null, 2));
                    }
                }
            }
        }

        return obj;
    }
}