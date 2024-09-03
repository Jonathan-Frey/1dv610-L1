const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
        }

        canvas {
          border: 2px solid black;
        }
    </style>
    <canvas id="gameCanvas" width="300" height="300"></canvas>
`;

export default class JumpGameElement extends HTMLElement {
  #gameCanvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #animationFrameId: number | null = null;
  #gravity = 5;
  #player: Player;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    this.#gameCanvas = this.shadowRoot?.querySelector(
      "#gameCanvas"
    ) as HTMLCanvasElement;

    this.#ctx = this.#gameCanvas.getContext("2d") as CanvasRenderingContext2D;

    this.#player = new Player();
  }

  connectedCallback() {
    window.addEventListener("keypress", (e) => {
      if (e.key === " ") {
        console.log("space has been pressed");
        this.#player.jumping = true;
      }
    });
    this.#startGame();
  }

  disconnectedCallback() {
    this.#endGame();
  }

  #startGame() {
    const update = () => {
      this.#update();
      this.#animationFrameId = requestAnimationFrame(update);
    };
    this.#animationFrameId = requestAnimationFrame(update);
  }

  #endGame() {
    if (this.#animationFrameId !== null) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#animationFrameId = null;
    }
  }

  #update() {
    this.#ctx.clearRect(0, 0, this.#gameCanvas.width, this.#gameCanvas.height);
    const time = performance.now() / 1000;
    this.#player.x = (time * 100) % this.#gameCanvas.width;

    this.#ctx.fillStyle = "red";
    this.#ctx.fillRect(
      this.#player.x,
      this.#player.y,
      this.#player.width,
      this.#player.height
    );
  }
}

customElements.define("jf-jumpgame", JumpGameElement);

class Player {
  x: number;
  y: number;
  #width: number;
  #height: number;
  jumping = false;

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 50,
    height: number = 50
  ) {
    this.x = x;
    this.y = y;
    this.#width = width;
    this.#height = height;
  }

  public get width(): number {
    return this.#width;
  }

  public get height(): number {
    return this.#height;
  }
}
