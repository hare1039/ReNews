var defaultSettings = {
    newsHosts: ["nytimes.com",
                "theguardian.com",
                "bostonglobe.com",
                "sciencemag.org",
                "wsj.com",
                "washingtonpost.com",
                "nature.com"];
};

function checkStoredSettings(storedSettings) {
    if (!storedSettings.since || !storedSettings.newsHosts) {
        browser.storage.local.set(defaultSettings);
    }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, console.error);

function forget(storedSettings) {
    const newsHosts = storedSettings.newsHosts;
    console.log(newsHosts);

    function reload(tabs) {
        let tab = tabs[0];
        console.log(tab.url);
        let reloading = browser.tabs.reload(tab.id);
        reloading.then(() => {console.log("loaded");}, console.error);
    };

    function notify() {
        let newsHostsString = newsHosts.join(", ");
        browser.notifications.create({
            "type": "basic",
            "title": "Removed browsing data",
            "message": `Removed ${newsHostsString} cookies`
        });

        browser.tabs.query({currentWindow: true, active: true}).then(reload, console.error);
    };

    browser.browsingData.remove({
        hostnames: newsHosts,
        since: 0
    }, {
        cookies: true
    }).then(notify, console.error);
}

browser.browserAction.onClicked.addListener(() => {
    const gettingStoredSettings = browser.storage.local.get();
    gettingStoredSettings.then(forget, console.error);
});
