import "./style.css";
import "./game";

const gameContainer = document.querySelector(
  "#gameContainer"
) as HTMLDivElement;

const inputContainer = document.querySelector(
  "#inputContainer"
) as HTMLDivElement;

const nameInput = document.querySelector("#nameInput") as HTMLInputElement;

const nameButton = document.querySelector("#nameButton") as HTMLButtonElement;

nameButton.addEventListener("click", () => {
  handleSubmission();
});

nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSubmission();
  }
});

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  if (name.length === 0) {
    nameInput.classList.add("invalid");
    nameButton.setAttribute("disabled", "");
  } else {
    nameInput.classList.remove("invalid");
    nameButton.removeAttribute("disabled");
  }
});

function handleSubmission() {
  const name = nameInput.value.trim();
  nameInput.value = "";
  inputContainer.setAttribute("hidden", "");
  startGame(name);
}

function startGame(string: string) {
  const game = document.createElement("jf-jumpgame");
  game.setAttribute("obstacleString", string);
  game.addEventListener("gameOver", endGame);
  gameContainer.appendChild(game);
}

function endGame() {
  setTimeout(() => {
    gameContainer.innerHTML = "";
    inputContainer.removeAttribute("hidden");
  }, 2000);
}
