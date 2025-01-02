(async chrome => {
  let tabId = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].id;
  let streamId = ((await chrome.tabCapture.getCapturedTabs()).find(v => v.tabId == tabId)) ||
    await chrome.tabCapture.getMediaStreamId();
  let port;
  (await chrome.runtime.getContexts({})).length < 2
    ? (
      await chrome.offscreen.createDocument({
        justification: "",
        reasons: ["USER_MEDIA"],
        url: "offscreen.htm"
      }),
      port = await chrome.runtime.connect()
    )
    : (
      (port = await chrome.runtime.connect()).onMessage.addListener(e => (
        inputs[0].value = e[0],
        inputs[1].value = e[1]
      )),
      port.postMessage([tabId, streamId])
    );
  let inputs = document.body.getElementsByTagName("input");
  inputs[0].oninput = e => port.postMessage([tabId, streamId, +e.target.value]);
  inputs[1].oninput = e => port.postMessage([tabId, streamId, e.target.value]);
})(chrome);