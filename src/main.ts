// @ts-ignore
window.c = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((s) => {
      let v = document.querySelector("video")
      v.srcObject = s
      v.play()
    })
}
