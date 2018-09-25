//Collapse Children context menu item
function collapseChildren(e){
    chrome.storage.local.get(['childRgtClkIDValid', 'childClickedID'], function(result){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "contextMenu",
                message: "collapseChildren",
                result: result});
          });
    });
}

//Collapse Children context menu item
function expandChildren(e){
    chrome.storage.local.get(['childRgtClkIDValid', 'childClickedID'], function(result){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "contextMenu",
                message: "expandChildren",
                result: result});
          });
    });
}

//URLs where context menus should be added
var urlPatterns = ["http://*/*.xml", "https://*/*.xml", "file:///*.xml"];
//Creates context menu for Collapse Children
chrome.contextMenus.create({
    title: "Collapse Children", 
    contexts:["page"], 
    onclick: collapseChildren,
    documentUrlPatterns: urlPatterns
});

chrome.contextMenus.create({
    title: "Expand Children", 
    contexts:["page"], 
    onclick: expandChildren,
    documentUrlPatterns: urlPatterns
});

//Listener for messages
chrome.runtime.onMessage.addListener(function(e) {
    switch(e.message){
        case "childRightClicked":
            chrome.storage.local.set({childRgtClkIDValid: true});
            break;
        default:
            console.log("Message not recognized: ", e);
    }
});