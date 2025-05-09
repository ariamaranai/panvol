{
  let audioNodes = {};
  chrome.runtime.onConnect.addListener(p =>
    p.onMessage.addListener((m, p) => {
      let audioNode = audioNodes[m[0]];
      audioNode
        ? m.length > 2
          ? audioNode[m[3]].value = m[2]
          : p.postMessage([audioNode[0].value, audioNode[1].value])
        : navigator.mediaDevices.getUserMedia({
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
            m.length > 2
              ? audioNode[m[3]].value = m[2]
              : p.postMessage(0);
          }).catch(() => 0);
    })
  )
}