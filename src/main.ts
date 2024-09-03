import "./style.css";
import "./game";

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
  const game = document.createElement("jf-jumpgame");
  gameContainer.appendChild(game);
  console.log(game);
}

function endGame() {
  gameContainer.innerHTML = "";
}
