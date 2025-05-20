chrome.runtime.getContexts({}, contexts =>
  chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs =>
    chrome.tabCapture.getCapturedTabs(async result => {
      let tabId = tabs[0].id;
      let streamId = result.find(v => v.tabId == tabId) || await chrome.tabCapture.getMediaStreamId();
      let vol = document.body.firstElementChild;
      let pan = vol.nextElementSibling;
      let init = contexts.length < 2;
      init &&
      await chrome.offscreen.createDocument({
        justification: "",
        reasons: ["BLOBS"],
        url: "offscreen.htm"
      });
      let p = await chrome.runtime.connect();
      init || (
        p.onMessage.addListener(m => m && (vol.value = m[0], pan.value = m[1])),
        p.postMessage([tabId, streamId])
      );
      vol.oninput = e => p.postMessage([tabId, streamId, +e.target.value, 0]);
      pan.oninput = e => p.postMessage([tabId, streamId, +e.target.value, 1]);
      pan.nextSibling.onclick = () => p.postMessage([tabId, streamId, (vol.value = 1, pan.value = 0)]);
    })
  )
);