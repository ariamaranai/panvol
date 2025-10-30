{
  let audioNodes = {};
  chrome.runtime.onConnect.addListener(p =>
    p.onMessage.addListener((m, p) => {
      let len = m.length;
      let audioNode = audioNodes[m[0]];
      audioNode
        ? len > 2
          ? len > 3
            ? audioNode[m[3]].value = m[2]
            : audioNode[audioNode[0].value = 1].value = 0
          : p.postMessage([audioNode[0].value, audioNode[1].value])
        : len > 3 && navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: m[1]
              }
            }
          }).then(media => {
            let context = new AudioContext;
            let gainNode = context.createGain();
            let panNode = context.createStereoPanner();
            context.createMediaStreamSource(media).connect(gainNode);
            gainNode.connect(panNode);
            panNode.connect(context.destination);
            audioNode = audioNodes[m[0]] = [gainNode.gain, panNode.pan];
            len > 3
              ? audioNode[m[3]].value = m[2]
              : p.postMessage(0);
          }).catch(() => 0);
    })
  )
}