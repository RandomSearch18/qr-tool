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
 * Render a card to the DOM
 * @param i Index of the card
 * @returns `undefined` if the card **was** shown without any errors, or `0` if the card doesn't exist
 */
const showCard = (i: number): 0 | undefined => {
  if (!database[box][i]) return 0
  $("h2").textContent = `Box ${box + 1}: Card ${i + 1}/${database.length}`
  $("p").textContent = database[box][i][0]
  currentCard = i
}

// If there are cards in the database, show the first one & ensure that the current card elements are visible
showCard(0) ?? $("a").removeAttribute("hidden")

// @ts-ignore
window.n = () => {
  // Callback for when the "+" (add card) button is clicked
  const question = $<HTMLTextAreaElement>("#q").value
  const answer = $<HTMLTextAreaElement>("#a").value
  database[box].push([question, answer])
  localStorage.setItem("db", JSON.stringify(database))
  location.reload()
}

// @ts-ignore
window.s = () => {
  // Callback for when the "Show" (show answer) button is clicked
  $("p").textContent = database[box][currentCard][1]
}

// @ts-ignore
window.y = () => {
  // Callback for the checkmark button
  // We move the card up to the next box
  database[box + 1].push(database[box][currentCard])
  nextCard()
}

// @ts-ignore
window.n = () => {
  // Callback for the red X button
  // We move the card all the way down to box 1
  database[0].push(database[box][currentCard])
  nextCard()
}

const nextCard = () => {
  // Remove the current card, because this is always called from the checkmark/X buttons
  database[box].splice(currentCard, 1)
  showCard(currentCard + 1)
}
