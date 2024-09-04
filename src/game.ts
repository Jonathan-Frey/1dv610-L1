const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
        }

        canvas {
          border: 2px solid black;
        }
    </style>
    <canvas id="gameCanvas" width="1000" height="300"></canvas>
`;

export default class JumpGameElement extends HTMLElement {
  #gameCanvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #animationFrameId: number | null = null;
  #gravity = 5;
  #player: Player;
  #obstacles: Obstacle[] = [];
  #gameOver: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    this.#gameCanvas = this.shadowRoot?.querySelector(
      "#gameCanvas"
    ) as HTMLCanvasElement;

    this.#ctx = this.#gameCanvas.getContext("2d") as CanvasRenderingContext2D;

    const width = 50;
    const height = 50;
    const position = new Position(100, this.#gameCanvas.height - 50);
    const hitBox = new HitBox(
      position.y,
      position.x + width,
      position.y + height,
      position.x
    );

    this.#player = new Player(position, width, height, hitBox);
    if (
      this.#player.position.y >=
      this.#gameCanvas.height - this.#player.height
    ) {
      this.#player.state = PlayerState.GROUNDED;
    } else {
      this.#player.state = PlayerState.FALLING;
    }
  }

  connectedCallback() {
    const obstacleString = this.getAttribute("obstacleString");
    this.#ctx.font = "100px serif";
    if (obstacleString !== null) {
      this.#obstacles = obstacleString.split("").map((char, i) => {
        const textMetrics = this.#ctx.measureText(char);
        const x = this.#gameCanvas.width + i * 500;
        const y = this.#gameCanvas.height;
        const position = new Position(x, y);
        const top = position.y - textMetrics.actualBoundingBoxAscent;
        const right = position.x + textMetrics.width;
        const bottom = position.y;
        const left = position.x;
        const hitBox = new HitBox(top, right, bottom, left);
        const obstacle = new Obstacle(char, new Position(x, y), hitBox);
        return obstacle;
      });
    }

    window.addEventListener("keypress", (e) => {
      if (e.key === " " && this.#player.state === PlayerState.GROUNDED) {
        this.#player.state = PlayerState.JUMPING;
      }
    });
    this.#startGame();
  }

  disconnectedCallback() {
    this.#endGame();
  }

  #startGame() {
    const update = () => {
      if (!this.#gameOver) this.#update();
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

    this.#obstacles.forEach((obstacle) => {
      obstacle.moveX(-5);
      console.log(
        obstacle.hitBox.top,
        " ",
        obstacle.hitBox.right,
        " ",
        obstacle.hitBox.bottom,
        " ",
        obstacle.hitBox.left
      );
    });

    if (this.#player.state === PlayerState.JUMPING) {
      // go upwards
      if (
        this.#player.position.y >
        this.#gameCanvas.height - this.#player.height * 4
      ) {
        this.#player.moveY(-5);

        // too high, stop going upwards
      } else {
        this.#player.state = PlayerState.FALLING;
      }
      // fall down
    } else if (
      this.#player.position.y <
      this.#gameCanvas.height - this.#player.height
    ) {
      this.#player.moveY(this.#gravity);
    } else {
      this.#player.state = PlayerState.GROUNDED;
    }

    this.#obstacles.forEach((obstacle) => {
      if (obstacle.hitBox.isColliding(this.#player.hitBox)) {
        this.#gameOver = true;
        this.dispatchEvent(new CustomEvent("gameOver"));
      }
    });

    if (this.#gameOver) {
      this.#ctx.fillStyle = "red";
    } else {
      this.#ctx.fillStyle = "green";
    }

    this.#ctx.fillRect(
      this.#player.position.x,
      this.#player.position.y,
      this.#player.width,
      this.#player.height
    );

    this.#obstacles.forEach((obstacle) => {
      this.#ctx.fillText(
        obstacle.letter,
        obstacle.position.x,
        obstacle.position.y
      );
    });
  }
}

customElements.define("jf-jumpgame", JumpGameElement);

class Player {
  position: Position;
  #width: number;
  #height: number;
  hitBox: HitBox;
  state: PlayerState = PlayerState.NONE;

  constructor(
    position: Position,
    width: number = 50,
    height: number = 50,
    hitBox: HitBox
  ) {
    this.position = position;
    this.#width = width;
    this.#height = height;
    this.hitBox = hitBox;
  }

  public get width(): number {
    return this.#width;
  }

  public get height(): number {
    return this.#height;
  }

  public moveY(amount: number) {
    this.position.y += amount;
    this.hitBox.moveY(amount);
  }
}

enum PlayerState {
  GROUNDED,
  JUMPING,
  FALLING,
  NONE,
}

class Obstacle {
  letter: string;
  position: Position;
  hitBox: HitBox;

  constructor(letter: string, position: Position, hitBox: HitBox) {
    this.letter = letter;
    this.position = position;
    this.hitBox = hitBox;
  }

  moveX(amount: number) {
    this.position.x += amount;
    this.hitBox.moveX(amount);
  }
}

class HitBox {
  top: number;
  left: number;
  bottom: number;
  right: number;

  constructor(top: number, right: number, bottom: number, left: number) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  moveY(amount: number) {
    this.top += amount;
    this.bottom += amount;
  }

  moveX(amount: number) {
    this.left += amount;
    this.right += amount;
  }

  isColliding(hitBox: HitBox): boolean {
    console.log(this.right < hitBox.left);
    console.log(this.left > hitBox.right);
    console.log(this.bottom < hitBox.top);
    console.log(this.top > hitBox.bottom);
    // Check if there is no overlap
    if (
      this.right < hitBox.left || // this is to the left of hitBox
      this.left > hitBox.right || // this is to the right of hitBox
      this.bottom < hitBox.top || // this is above hitBox
      this.top > hitBox.bottom // this is below hitBox
    ) {
      return false;
    }

    // If none of the above, there is an overlap
    return true;
  }
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
