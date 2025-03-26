// Select elements from form
const form = document.querySelector("form")
const drawQuantity = document.getElementById("draw")
const initial = document.getElementById("initial")
const final = document.getElementById("final")
const notRepeatNumber = document.getElementById("check")

// select element to change checkbox img
const bgCheck = document.getElementById("bg-check")

// select elements to manipulate results display
const resultsWrapper = document.querySelector("#results-wrapper")
const firstPage = document.querySelector(".first-page")
const resultsPage = document.querySelector("footer")

// get second page button to monitor
const btn = document.getElementById("next-draw")

// Capture input event to format value
drawQuantity.oninput = () => {
  // obtain current value of input and remove non numeric characters
  let value = drawQuantity.value.replace(/\D/g, "")

  // update value
  drawQuantity.value = Number(value)
  // console.log(drawQuantity.value)
}

initial.oninput = () => {
  // obtain current value of input and remove non numeric characters
  let value = initial.value.replace(/\D/g, "")

  // update value
  initial.value = Number(value)
  // console.log(initial.value)
}

final.oninput = () => {
  // obtain current value of input and remove non numeric characters
  let value = final.value.replace(/\D/g, "")

  // update value
  final.value = Number(value)
  // console.log(final.value)
}

// change checkbox img
notRepeatNumber.onclick = () => {
  try {
    if (typeof notRepeatNumber.checked !== "boolean")
      throw new Error("Problem on checkbox checked value")

    // check if checkbox is checked or not and change img
    if (notRepeatNumber.checked === true)
      bgCheck.src = "assets/icons/check-checked.svg"
    if (notRepeatNumber.checked === false)
      bgCheck.src = "assets/icons/check-default.svg"

    // console.log(notRepeatNumber.checked)
    
  } catch (error) {
    console.error(error)
  }
}

// create new object to receive parameters for draw
const drawInfo = {
  draw_quantity: 2, // Valor padrão: 2
  initial_value: 1,       // Valor padrão: 1
  final_value: 100,         // Valor padrão: 100
  not_repeat_number: true,
  results: [] // empty array to store results
}

// submit event
form.onsubmit = (event) => {
  // prevent default behavior of submit
  event.preventDefault()

  // check if the draw process is possible
  try {
    // update drawInfo
    drawInfo.draw_quantity = Number(drawQuantity.value) || 2
    drawInfo.initial_value = Number(initial.value) || 1
    drawInfo.final_value = Number(final.value) || 100
    drawInfo.not_repeat_number = notRepeatNumber.checked

    // console.log(drawInfo)

    // Boolean operations to check if the draw process is possible
    if(drawInfo.initial_value > drawInfo.final_value)
      throw new Error("O valor inicial não pode ser menor que o final")
    if(drawInfo.draw_quantity > (drawInfo.final_value - drawInfo.initial_value + 1) && drawInfo.not_repeat_number)
      throw new Error("A quantidade de números sorteados diferentes não pode exceder o intervalo de números definidos")

    // draw numbers
    DrawNumbers(drawInfo.draw_quantity, drawInfo.initial_value, drawInfo.final_value, drawInfo.not_repeat_number)

    // check results
    // console.log(drawInfo.results)

    // change the display to the second page
    resultsPage.classList.remove("hide")
    firstPage.classList.add("hide")

    // add results to the second screen
    AddResults(drawInfo.results)

    // animate results
    AnimateResult()

  } catch (error) {
    alert(error)
    console.log(error)
  }
}

// redraw event
btn.onclick = (event) => {
  event.preventDefault()
  
  // delete previous results
  resultsWrapper.innerHTML = ""
  drawInfo.results = []

  // draw new results
  DrawNumbers(drawInfo.draw_quantity, drawInfo.initial_value, drawInfo.final_value, drawInfo.not_repeat_number)

  // add results to the second screen
  AddResults(drawInfo.results)

  // animate results
  AnimateResult()
}


// FUNCTIONS

// function to generate random number
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// function to draw the numbers
function DrawNumbers(numberOfDraws, initial, final, notRepeatDraw) {
  // draw numbers
  for (let i = 0; i < numberOfDraws; i++) {
    let result = getRandomInt(initial, final + 1)
    
    // draw for the case where drawing the same number is possible
    if (notRepeatDraw === false)
      drawInfo.results.push(result)

    // draw for the case where drawing the same number is not possible
    if (notRepeatDraw === true) {
      // checks if the number was drawn
      let safetyBreak = 0
      while (drawInfo.results.includes(result)){
        result = getRandomInt(initial, final + 1)
        safetyBreak++
        // safety break in the case of an infinite loop
        if (safetyBreak>10000) {
          throw new Error ("Não foi possível sortear os números")
        }
      }
      drawInfo.results.push(result)
    }
  }
}

// function to write results in HTML
function AddResults(results) {
  for(let result of results) {
    const div = document.createElement("div")
    div.innerHTML = `${result}`

    const bgDiv = document.createElement("div")
    bgDiv.classList.add("bg-result")

    const resultWrapper = document.createElement("div")
    resultWrapper.classList.add("result-wrapper")

    resultWrapper.append(bgDiv, div)

    resultsWrapper.append(resultWrapper)
  }
}

function AnimateResult() {
  const results = document.querySelectorAll(".result-wrapper");

  results.forEach((result, index) => {
      setTimeout(() => {
          result.classList.add("fade-in");
      }, index * 1000); // Staggered delay (1s per result)
  });
}
