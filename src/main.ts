type Card = [string, string]

const $ = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector)
const reload = () => location.reload()

const database: Card[][] = JSON.parse(
  localStorage.getItem("db") || "[[],[],[]]"
)

const saveDatabase = () => localStorage.setItem("db", JSON.stringify(database))

let box = 0

/**
 * Render the first card in the current box
 * @returns `undefined` if the card **was** shown without any errors, or `0` if the card doesn't exist
 */
const renderCard = (): 0 | undefined => {
  $("h2").textContent = `Box ${box + 1} (${database[box].length} cards)`
  if (!database[box][0]) {
    $("p").textContent = "Empty box"
    return 0
  }
  $("p").textContent = database[box][0][0]
}

// @ts-ignore `b` for "box dropdown changed"
self.b = () => {
  // @ts-ignore
  box = $<HTMLSelectElement>("select").value - 1
  // If there are cards in the box, show the first one
  // -1 so that when we first call showCard, it'll increment snowCard and show the first card
  renderCard()
}

// We show the first card in the box that happens to be selected on page load (which is normally box 1, unless the browser is filling it from a previous page load)
// @ts-ignore
self.b()

// @ts-ignore `p` for "plus button callback"
self.p = () => {
  // Callback for when the "+" (add card) button is clicked
  const question = $<HTMLTextAreaElement>("#q").value
  const answer = $<HTMLTextAreaElement>("#a").value
  database[0].push([question, answer])
  saveDatabase()
  reload()
}

// @ts-ignore `s` for "show answer"
self.s = () => {
  // Callback for when the book emoji (show answer) button is clicked
  $("p").textContent = database[box][0][1]
}

// @ts-ignore `n` for "next card"
self.n = (offset: number) => {
  // Callback for the red X and checkmark buttons
  // If offset is 0, move the card all the way down. If offset is 1, move the card to the next box
  // If card is in the last box (index 2), keep it in there
  const newBox = Math.min((box + offset) * offset, 2)
  database[newBox].push(database[box][0])
  database[box].shift()
  saveDatabase()
  const cardOffset = renderCard() ?? -1
  if (1 + cardOffset > database[box].length) {
    confirm(`End of box ${box + 1}. Restart?`) && reload()
  }
}
