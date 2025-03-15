{
  let audioNodes = {};
  chrome.runtime.onMessage.addListener((e, _, r) => {
    let audioNode = audioNodes[e[0]];
    audioNode
      ? e.length > 2
        ? audioNode[e[3]].value = e[2]
        : r([audioNode[0].value, audioNode[1].value])
      : navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: e[1]
            }
          }
        }).then(media => {
          let context = new AudioContext;
          let gainNode = context.createGain();
          let panNode = context.createStereoPanner();
          context.createMediaStreamSource(media).connect(gainNode);
          gainNode.connect(panNode);
          panNode.connect(context.destination);
          audioNode = audioNodes[e[0]] = [gainNode.gain, panNode.pan];
          e.length > 2
            ? audioNode[e[3]].value = e[2]
            : r(0)
        }).catch(() => 0);
      return !0
  });
}