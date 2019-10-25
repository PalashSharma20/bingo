export function pad(n) {
  return `${10 > n ? "0" : ""}${n}`
}

export function shuffle(array) {
  let newArr = []
  while (array.length) {
    let randomIndex = Math.floor(Math.random() * array.length),
      element = array.splice(randomIndex, 1)
    newArr.push(element[0])
  }
  return newArr
}
