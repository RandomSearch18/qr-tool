// @ts-ignore
window.c = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((s) => {
      document.querySelector("video").srcObject = s
    })
}
