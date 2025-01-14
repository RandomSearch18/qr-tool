// @ts-ignore
c = () =>
  navigator.bluetooth
    .requestDevice({ filters: [{ services: ["battery_service"] }] })
    .then((device) => {
      console.log(device)
    })
    .catch((error) => {
      console.error(error)
    })
