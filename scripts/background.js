//Collapse Children context menu item
function collapseChildren(e){
    chrome.storage.local.get(['childRgtClkIDValid', 'childClickedID'], function(result){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "collapseChildren",
                result: result});
          });
    });
}

//Creates context menu for Collapse Children
chrome.contextMenus.create({
    title: "Collapse Children", 
    contexts:["page"], 
    onclick: collapseChildren
});

//Listener for messages
chrome.runtime.onMessage.addListener(function(e) {
    if (e.message === "childRightClicked"){
        chrome.storage.local.set({childRgtClkIDValid: true});
    }
        
});