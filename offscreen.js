(chrome => {
  let audioNodes = new Map;
  chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(async e => {
      let tabId = e[0];
      let streamId = e[1];
      let audioNode = audioNodes[tabId];
      if (audioNode) {
        e.length > 2
          ? typeof e[2] == "number"
            ? audioNode[0].value = e[2]
            : audioNode[1].value = +e[2]
          : port.postMessage([audioNode[0].value, audioNode[1].value]);
      }
      else {
        let context = new AudioContext;
        let gainNode = context.createGain();
        let panNode = context.createStereoPanner();
        let source = context.createMediaStreamSource(
          await navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: streamId
              }
            }
          })
        );
        source.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(context.destination);
        (audioNode = audioNodes[tabId] = [gainNode.gain, panNode.pan]);
        e.length > 2 && (
          typeof e[2] == "number"
            ? audioNode[0].value = e[2]
            : audioNode[1].value = +e[2]
        );
      }
    });
  });
})(chrome);