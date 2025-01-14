type Card = [string, string]

const $ = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector)
const $$ = <T extends Element>(selector: string) =>
  document.querySelectorAll<T>(selector)

const database: Card[] = JSON.parse(localStorage.getItem("db") || "[]")

database.length && $("a").removeAttribute("hidden")

// @ts-ignore
window.n = () => {
  const question = $<HTMLTextAreaElement>("#q").value
  const answer = $<HTMLTextAreaElement>("#a").value
  database.push([question, answer])
  localStorage.setItem("db", JSON.stringify(database))
  location.reload()
}
