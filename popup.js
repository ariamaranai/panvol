chrome.runtime.getContexts({}, contexts =>
  chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
    let tabId = tabs[0].id;
    let streamId = (await chrome.tabCapture.getCapturedTabs()).find(v => v.tabId == tabId) || await chrome.tabCapture.getMediaStreamId();
    let body = document.body;
    let vol = body.firstChild.lastChild;
    let pan = body.lastChild.lastElementChild;
    contexts.length < 2
      ? chrome.offscreen.createDocument({
        justification: "",
        reasons: ["USER_MEDIA"],
        url: "offscreen.htm"
      })
      : chrome.runtime.sendMessage([tabId, streamId], m =>
         m && (vol.value = m[0], pan.value = m[1])
      );
    vol.oninput = e => chrome.runtime.sendMessage([tabId, streamId, +e.target.value, 0]);
    pan.oninput = e => chrome.runtime.sendMessage([tabId, streamId, +e.target.value, 1]);
  })
);