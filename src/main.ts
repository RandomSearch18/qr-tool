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

// @ts-ignore `n` for "next card"
window.n = (offset: number) => {
  // Callback for the red X and checkmark buttons
  // If offset is 0, move the card all the way down. If offset is 1, move the card to the next box
  // If card is in the last box (index 2), keep it in there
  database[box == 2 ? (box + offset) * offset : 3].push(
    database[box][currentCard]
  )
  database[box].splice(currentCard, 1)
  showCard(currentCard + 1)
}
