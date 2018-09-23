console.log("It works");

var xmlDoc = document.getElementById("webkit-xml-viewer-source-xml").firstChild;
var xmlText = document.getElementById("webkit-xml-viewer-source-xml").innerHTML;

/**var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlText, "text/xml");
*/
console.log(xmlDoc);