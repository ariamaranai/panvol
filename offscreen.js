(chrome => {
  let audioNodes = {};
  chrome.runtime.onMessage.addListener(e => {
    let tabId = e[0];
    let streamId = e[1];
    let audioNode = audioNodes[tabId];
    if (audioNode) {
      e.length > 2
        ? typeof e[2] == "number"
          ? audioNode[0].value = e[2]
          : audioNode[1].value = +e[2]
        : chrome.runtime.sendMessage([audioNode[0].value, audioNode[1].value]);
    } else {
      let context = new AudioContext;
      let gainNode = context.createGain();
      let panNode = context.createStereoPanner();
      navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: streamId
          }
        }
      }).then(media => {
        let source = context.createMediaStreamSource(media);
        source.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(context.destination);
        audioNode = audioNodes[tabId] = [gainNode.gain, panNode.pan];
        e.length > 2 && (
          typeof e[2] == "number"
            ? audioNode[0].value = e[2]
            : audioNode[1].value = +e[2]
        );
      });
    }
  });
})(chrome);
