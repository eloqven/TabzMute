'use strict'
var muteAllTabs = false;

const isMuteAllTabs = () => {
    return muteAllTabs;
}

chrome.commands.onCommand.addListener(command => {
    switch (command) {
		case "mute_current":
			chrome.tabs.getSelected(null, tab => {
				chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
			});
			break;

		case "mute_all":
            muteAllTabs = !muteAllTabs;
            
			chrome.windows.getAll({populate: true}, windowList => {
				windowList.forEach(window => {
					window.tabs.forEach(tab => {
						if (tab.audible || tab.mutedInfo.muted) {
							chrome.tabs.update(tab.id, {muted: muteAllTabs});
						}
					});
				});
			});
			break;

		case "mute_all_but_current":
			chrome.windows.getAll({populate: true}, windowList => {
				windowList.forEach(window => {
					window.tabs.forEach(tab => {
						if (tab.audible) {
							chrome.tabs.update(tab.id, {muted: true})
						}
					});
				});
            });
            
			chrome.tabs.getSelected(null, tab => {
				chrome.tabs.update(tab.id, {muted: false});
			});
			break;

		default:
			break;
	}
});

export {
    isMuteAllTabs
}
