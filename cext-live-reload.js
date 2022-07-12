// Keep only one reload domain open
const RELOAD_DOMAINS = ["localhost:3000"];
const ReloadTabKey = "reloadTabId";
const PrevTabReloadDomain = "prevTabReloadDomain";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Only fire this event for reload domains listed
  if (
    changeInfo.status === "complete" &&
    RELOAD_DOMAINS.find((url) => tab.url.includes(url))
  ) {
    chrome.tabs.query(
      { lastFocusedWindow: true, active: true },
      function (tabArray) {
        chrome.storage.sync.set({ [ReloadTabKey]: tabArray[0] }, function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error setting " +
                key +
                " to " +
                JSON.stringify(data) +
                ": " +
                chrome.runtime.lastError.message
            );
          }
          chrome.runtime.reload();
        });
      }
    );
  }
});

// Reload Tab
chrome.storage.sync.get(ReloadTabKey, function (data) {
  const tab = data[ReloadTabKey];
  if (!tab) return; // No tab data then return
  // If the current active tab url is listed in reload domains then reload it only once (break the loop)
  chrome.storage.sync.get([PrevTabReloadDomain], function (data) {
    if (RELOAD_DOMAINS.find((url) => tab.url.includes(url))) {
      if (!data || !data[PrevTabReloadDomain]) {
        chrome.storage.sync.set({ [PrevTabReloadDomain]: true });
        chrome.tabs.reload(tab.id);
      }
    } else {
      // If its not listed in reload domains then it will only reload once anyways
      chrome.tabs.reload(tab.id);
    }
    if (data && data[PrevTabReloadDomain]) {
      setTimeout(() => {
        chrome.storage.sync.set({ [PrevTabReloadDomain]: false });
      }, 500);
    }
  });
});
