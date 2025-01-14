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
  // Bug: If the view is changed to an empty box, but there's already a card being shown, that old card won't be cleared.
  // (a workaround is to refresh the page)
  if (!database[box][i]) return 0
  $("h2").textContent = `Box ${box + 1}: Card ${i + 1}/${database[box].length}`
  $("p").textContent = database[box][i][0]
  currentCard = i
}

// @ts-ignore `b` for "box dropdown changed"
window.b = () => {
  box = parseInt($<HTMLSelectElement>("select").value) - 1
  // If there are cards in the box, show the first one & ensure that the current card elements are visible
  showCard(0) ?? $("a").removeAttribute("hidden")
}

// We show the first card in the box that happens to be selected on page load (which is normally box 1, unless the browser is filling it from a previous page load)
// @ts-ignore
window.b()

// @ts-ignore `p` for "plus button callback"
window.p = () => {
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
  database[box == 2 ? 2 : (box + offset) * offset].push(
    database[box][currentCard]
  )
  database[box].splice(currentCard, 1)
  showCard(currentCard + 1)
}
