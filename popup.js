import {isMuteAllTabs} from "./background.js";


document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.getSelected(null, currentTab => {

        var muteAll = isMuteAllTabs();
        var muteAllTabsButton = document.getElementById('muteTabs');
        var muteCurrentTabButton = document.getElementById('muteCurrent');

        currentTab.mutedInfo.muted ?
            muteCurrentTabButton.setAttribute('checked', 'checked') :
            muteCurrentTabButton.removeAttribute('checked');

        muteAll ?
            muteAllTabsButton.setAttribute('checked', 'checked') :
            muteAllTabsButton.removeAttribute('checked');

        muteCurrentTabButton.addEventListener('click', (event) => {

            currentTab.mutedInfo.muted = event.target.checked;
            chrome.tabs.update(currentTab.id, {muted: event.target.checked});

            if (!event.target.checked)
                muteCurrentTabButton.removeAttribute('checked');
        });
    
        muteAllTabsButton.addEventListener('click', () => {
            muteAll = !muteAll;

            chrome.windows.getAll({populate: true}, windowList => {
                windowList.forEach(window => {
                    window.tabs.forEach(tab => {
                        chrome.tabs.update(tab.id, {muted: muteAll});

                        if (tab.id == currentTab.id) {
                            chrome.tabs.update(currentTab.id, {muted: muteAll});
                            muteCurrentTabButton.checked = muteAll;
                        }
                    });
                });
            });
        }, false);

    });
}, false);
