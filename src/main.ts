type Card = [string, string]

const $ = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector)
const $$ = <T extends Element>(selector: string) =>
  document.querySelectorAll<T>(selector)

const database: Card[][] = JSON.parse(
  localStorage.getItem("db") || "[[],[],[]]"
)

let box = 0
let currentCard: number

/**
 * Render the next card (database[currentCard + 1]), and updates `currentCard`
 * @returns `undefined` if the card **was** shown without any errors, or `0` if the card doesn't exist
 */
const nextCard = (): 0 | undefined => {
  // Note: The case of currentCard > database[box].length (i.e. end of box) is handled in self.n()
  currentCard++
  $("h2").textContent = `Box ${box + 1}: Card ${currentCard + 1}/${
    database[box].length
  }`
  if (!database[box][currentCard]) {
    $("p").textContent = "Empty box"
    return 0
  }
  $("p").textContent = database[box][currentCard][0]
}

// @ts-ignore `b` for "box dropdown changed"
self.b = () => {
  box = parseInt($<HTMLSelectElement>("select").value) - 1
  // If there are cards in the box, show the first one
  // -1 so that when we first call showCard, it'll increment snowCard and show the first card
  currentCard = -1
  nextCard()
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
  localStorage.setItem("db", JSON.stringify(database))
  location.reload()
}

// @ts-ignore
self.s = () => {
  // Callback for when the "Show" (show answer) button is clicked
  $("p").textContent = database[box][currentCard][1]
}

// @ts-ignore `n` for "next card"
self.n = (offset: number) => {
  // Callback for the red X and checkmark buttons
  // If offset is 0, move the card all the way down. If offset is 1, move the card to the next box
  // If card is in the last box (index 2), keep it in there
  const newBox = Math.min((box + offset) * offset, 2)
  if (newBox - box) {
    database[newBox].push(database[box][currentCard])
    database[box].splice(currentCard, 1)
    localStorage.setItem("db", JSON.stringify(database))
  }
  const cardOffset = nextCard() ?? -1
  if (currentCard + 1 + cardOffset >= database[box].length) {
    confirm(`End of box ${box + 1}. Restart?`) && location.reload()
  }
}
