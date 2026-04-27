// Tea Tricks — JavaScript port of the 1996/2003 Java applet by Edwin Martin
// Original: TeaTricks.java (BlockSpace + TeaTricks classes)

(() => {
  const BLOCK_SIZE = 16;
  const COLS = 10;
  const ROWS = 18;

  const SHAPES = [
    [0,0, 0,1, 0,2, 0,3], // I
    [0,1, 0,2, 1,0, 1,1], // S
    [0,1, 1,0, 1,1, 2,1], // T
    [0,0, 0,1, 1,0, 1,1], // O
    [0,0, 0,1, 1,1, 1,2], // Z
    [0,0, 0,1, 0,2, 1,2], // L
    [0,0, 0,1, 0,2, 1,0], // J
  ];
  const SHAPE_W = [1, 2, 3, 2, 2, 2, 2];
  const SHAPE_H = [4, 3, 2, 2, 3, 3, 3];

  const COLOR_BLOCK = 'rgb(255,192,98)';
  const COLOR_STACK = 'rgb(255,136,96)';
  const COLOR_ROW   = 'rgb(255,197,176)';
  const COLOR_BG    = 'rgb(255,255,223)';
  const COLOR_TEXT  = '#b84040';
  const FONT        = 'bold 25px helvetica, arial, sans-serif';

  class BlockSpace {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;

      this.blocks = Array.from({ length: COLS }, () => new Array(ROWS).fill(false));
      this.currentShape = new Array(8).fill(0);
      this.currentShapeWidth = 0;
      this.currentShapeHeight = 0;
      this.xPos = 0;
      this.yPos = 0;

      this.score = 0;
      this.level = 1;
      this.delay = 300;
      this.delaySaved = 300;
      this.dropShapes = false;

      this.textEffect = false;
      this.textEffectString = '';
      this.textEffectLoop = 0;
      this.textEffXPos = 0;

      this.newDrop();
      this.clear();
      this.setTextEffect('Tea Tricks');
    }

    clear() {
      this.score = 0;
      this.level = 1;
      this.noTextEffect();
      this.dropShapes = false;
      this.delay = 300;
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) this.blocks[x][y] = false;
      }
    }

    newDrop() {
      this.dropShapes = true;
      const n = Math.floor(Math.random() * 7);
      for (let i = 0; i < 8; i++) this.currentShape[i] = SHAPES[n][i];
      this.currentShapeWidth = SHAPE_W[n];
      this.currentShapeHeight = SHAPE_H[n];
      this.xPos = Math.floor(Math.random() * (COLS - this.currentShapeWidth));
      this.yPos = -this.currentShapeHeight;
    }

    collision(x, y, shape, height) {
      if (y + height > ROWS) return true;
      for (let i = 0; i < 4; i++) {
        const xs = x + shape[i * 2];
        const ys = y + shape[i * 2 + 1];
        if (ys >= 0 && this.blocks[xs][ys]) return true;
      }
      return false;
    }

    next() {
      if (!this.dropShapes) return;
      this.score++;

      let rowsDeleted = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        let complete = true;
        for (let x = 0; x < COLS; x++) {
          if (!this.blocks[x][y]) { complete = false; break; }
        }
        if (complete) {
          for (let y2 = y; y2 > 0; y2--) {
            for (let x = 0; x < COLS; x++) this.blocks[x][y2] = this.blocks[x][y2 - 1];
          }
          for (let x = 0; x < COLS; x++) this.blocks[x][0] = false;
          rowsDeleted++;
          y++; // recheck this row
        }
      }
      if (rowsDeleted > 0) this.score += 100 + (rowsDeleted - 1) * 200;

      if (this.score > 1000 * this.level) {
        this.delay = Math.floor((this.delay * 19) / 20);
        this.level++;
      }

      if (this.collision(this.xPos, this.yPos + 1, this.currentShape, this.currentShapeHeight)) {
        if (this.yPos < 0) {
          this.dropShapes = false;
          this.setTextEffect('Game Over');
          return;
        }
        for (let i = 0; i < 4; i++) {
          const x = this.xPos + this.currentShape[i * 2];
          const y = this.yPos + this.currentShape[i * 2 + 1];
          this.blocks[x][y] = true;
        }
        this.newDrop();
      } else {
        this.yPos++;
      }
    }

    horShift(dx) {
      if (!this.dropShapes) return;
      const xNew = this.xPos + dx;
      if (xNew >= 0 && xNew <= (COLS - this.currentShapeWidth) &&
          !this.collision(xNew, this.yPos, this.currentShape, this.currentShapeHeight)) {
        this.xPos = xNew;
        this.draw();
      }
    }

    drop() {
      if (!this.dropShapes) return;
      while (!this.collision(this.xPos, this.yPos + 1, this.currentShape, this.currentShapeHeight)) {
        this.yPos++;
        this.score += 2;
      }
    }

    turn() {
      if (!this.dropShapes) return;
      const newShape = new Array(8);
      for (let i = 0; i < 4; i++) {
        newShape[i * 2]     = this.currentShapeHeight - 1 - this.currentShape[i * 2 + 1];
        newShape[i * 2 + 1] = this.currentShape[i * 2];
      }
      const newShapeWidth = this.currentShapeHeight;
      const newShapeHeight = this.currentShapeWidth;
      let newXPos = this.xPos;
      if (newXPos + newShapeWidth > COLS) newXPos = COLS - newShapeWidth;

      if (this.collision(newXPos, this.yPos, newShape, newShapeHeight)) return;

      this.currentShapeWidth = newShapeWidth;
      this.currentShapeHeight = newShapeHeight;
      this.xPos = newXPos;
      for (let i = 0; i < 8; i++) this.currentShape[i] = newShape[i];
      this.draw();
    }

    setTextEffect(str) {
      this.textEffectString = str;
      this.textEffect = true;
      this.textEffectLoop = 0;
      this.delaySaved = this.delay;
      this.delay = 100;
      this.ctx.font = FONT;
      const w = this.ctx.measureText(str).width;
      this.textEffXPos = (this.width - w) / 2;
    }

    noTextEffect() {
      this.delay = this.delaySaved;
      this.textEffect = false;
    }

    draw() {
      const ctx = this.ctx;
      const w = BLOCK_SIZE * COLS + 1;
      const h = BLOCK_SIZE * ROWS + 1;

      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, w, h);
      // subtle 3D-ish bevel (light top/left, dark bottom/right) — mimics fill3DRect
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath(); ctx.moveTo(0.5, h - 0.5); ctx.lineTo(0.5, 0.5); ctx.lineTo(w - 0.5, 0.5); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath(); ctx.moveTo(w - 0.5, 0.5); ctx.lineTo(w - 0.5, h - 0.5); ctx.lineTo(0.5, h - 0.5); ctx.stroke();

      for (let y = 0; y < ROWS; y++) {
        let complete = true;
        for (let x = 0; x < COLS; x++) {
          if (!this.blocks[x][y]) { complete = false; break; }
        }
        ctx.fillStyle = complete ? COLOR_ROW : COLOR_STACK;
        for (let x = 0; x < COLS; x++) {
          if (this.blocks[x][y]) {
            ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        }
      }

      ctx.fillStyle = COLOR_BLOCK;
      for (let i = 0; i < 4; i++) {
        const x = this.xPos + this.currentShape[i * 2];
        const y = this.yPos + this.currentShape[i * 2 + 1];
        if (y >= 0) {
          ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }

      this.paintTextEffect();
    }

    paintTextEffect() {
      if (!this.textEffect) return;
      const ctx = this.ctx;
      ctx.fillStyle = COLOR_TEXT;
      ctx.font = FONT;
      ctx.textBaseline = 'alphabetic';
      const amp = 50 - (this.textEffectLoop > 50 ? 50 : this.textEffectLoop);
      let charX = this.textEffXPos;
      for (const ch of this.textEffectString) {
        const y = 100 + Math.sin(this.textEffectLoop / 2.0 - charX / 30.0) * (amp + 1) * 5;
        ctx.fillText(ch, charX, y);
        charX += ctx.measureText(ch).width;
      }
      this.textEffectLoop++;
    }
  }

  const canvas = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const game = new BlockSpace(canvas);
  let paused = false;
  let timer = null;

  function tick() {
    game.next();
    game.draw();
    scoreEl.textContent = 'Score: ' + game.score;
    timer = setTimeout(tick, game.delay);
  }
  tick();

  document.getElementById('btn-left').addEventListener('click', () => { game.horShift(-1); canvas.focus(); });
  document.getElementById('btn-right').addEventListener('click', () => { game.horShift(1); canvas.focus(); });
  document.getElementById('btn-turn').addEventListener('click', () => { game.turn(); canvas.focus(); });
  document.getElementById('btn-new').addEventListener('click', () => {
    game.noTextEffect();
    game.clear();
    game.newDrop();
    paused = false;
    canvas.focus();
  });

  document.addEventListener('keydown', (e) => {
    let handled = true;
    switch (e.key) {
      case 'ArrowLeft': case 'j': game.horShift(-1); break;
      case 'ArrowRight': case 'l': game.horShift(1); break;
      case 'ArrowUp': case 'k': game.turn(); break;
      case 'ArrowDown': case 'n': game.drop(); break;
      case 'p':
        if (!paused) {
          if (game.dropShapes) {
            game.dropShapes = false;
            game.setTextEffect('Pause');
            paused = true;
          }
        } else {
          game.dropShapes = true;
          game.noTextEffect();
          paused = false;
        }
        break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  });

  canvas.focus();
})();
