var defaultSettings = {
    newsHosts: ["nytimes.com", "theguardian.com"]
};

function onError(e) { console.error(e); }

function checkStoredSettings(storedSettings) {
    if (!storedSettings.since || !storedSettings.newsHosts) {
        browser.storage.local.set(defaultSettings);
    }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

function forget(storedSettings) {
    const newsHosts = storedSettings.newsHosts;
    console.log(newsHosts);

    function notify() {
        let newsHostsString = newsHosts.join(", ");
        browser.notifications.create({
            "type": "basic",
            "title": "Removed browsing data",
            "message": `Removed ${newsHostsString} cookies`
        });
    }

    browser.browsingData.remove({
        hostnames: newsHosts,
        since: 0
    }, {
        cookies: true
    }).then(notify, onError);
}

browser.browserAction.onClicked.addListener(() => {
    const gettingStoredSettings = browser.storage.local.get();
    gettingStoredSettings.then(forget, onError);
});
