import "./style.css";

const canvasTemplate = document.createElement("template");

canvasTemplate.innerHTML = `
  <canvas id="game" width="300" height="300"></canvas>
`;

const gameContainer = document.querySelector(
  "#gameContainer"
) as HTMLDivElement;

const nameInput = document.querySelector("#nameInput") as HTMLInputElement;

const nameButton = document.querySelector("#nameButton") as HTMLButtonElement;

nameButton.addEventListener("click", () => {
  handleSubmission();
});

function handleSubmission() {
  const name = nameInput.value;
  if (name.length === 0) {
    nameInput.classList.add("invalid");
  } else {
    nameInput.classList.remove("invalid");
    nameInput.value = "";
    startGame(name);
  }
}

function startGame(string: string) {
  const canvas = canvasTemplate.content.cloneNode(true) as HTMLCanvasElement;
  canvas;
}
