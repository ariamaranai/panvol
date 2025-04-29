chrome.runtime.getContexts({}, contexts =>
  chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs => {
    chrome.tabCapture.getCapturedTabs(async result => {
      let tabId = tabs[0].id;
      let streamId = result.find(v => v.tabId == tabId) || await chrome.tabCapture.getMediaStreamId();
      let vol = document.body.firstElementChild;
      let pan = vol.nextElementSibling;

      contexts.length < 2
        ? chrome.offscreen.createDocument({
          justification: "",
          reasons: ["BLOBS"],
          url: "offscreen.htm"
        })
        : chrome.runtime.sendMessage(streamId, m => m && (vol.value = m[0], pan.value = m[1]));

      vol.oninput = e => chrome.runtime.sendMessage([tabId, streamId, +e.target.value, 0]);
      pan.oninput = e => chrome.runtime.sendMessage([tabId, streamId, +e.target.value, 1]);
    });
  })
);