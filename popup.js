chrome.runtime.getContexts({}).then(async contexts => {
  let body = document.body;
  let vol = body.firstChild.lastChild;
  let pan = body.lastChild.lastElementChild;
  let tabId = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].id;
  let streamId = ((await chrome.tabCapture.getCapturedTabs()).find(v => v.tabId == tabId)) ||
    await chrome.tabCapture.getMediaStreamId();

  contexts.length < 2
    ? chrome.offscreen.createDocument({
        justification: "",
        reasons: ["USER_MEDIA"],
        url: "offscreen.htm"
      })
    : (
      chrome.runtime.onMessage.addListener(e => (
        vol.value = e[0],
        pan.value = e[1]
      )),
      chrome.runtime.sendMessage([tabId, streamId])
    );

  vol.oninput = e => chrome.runtime.sendMessage([tabId, streamId, +e.target.value]);
  pan.oninput = e => chrome.runtime.sendMessage([tabId, streamId, e.target.value]);
});