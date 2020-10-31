interface Pos {
  x: number;
  y: number;
}

type Canvas = HTMLCanvasElement; // Vue | Element | Vue[] | Element[]

export function drawAnd(canvas: Canvas, pos: Pos) {
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
  context.beginPath();
  context.moveTo(pos.x + 10, pos.y - 50);
  context.lineTo(pos.x - 50, pos.y - 50);
  context.lineTo(pos.x - 50, pos.y + 50);
  context.lineTo(pos.x + 10, pos.y + 50);
  context.arc(
    pos.x + 10,
    pos.y,
    50,
    (90 / 180) * Math.PI,
    (270 / 180) * Math.PI,
    true
  );

  context.moveTo(pos.x + 60, pos.y);
  context.lineTo(pos.x + 70, pos.y);

  context.moveTo(pos.x - 50, pos.y - 30);
  context.lineTo(pos.x - 60, pos.y - 30);

  context.moveTo(pos.x - 50, pos.y + 30);
  context.lineTo(pos.x - 60, pos.y + 30);

  context.closePath();
  context.stroke();
}

export function drawOr(canvas: Canvas, pos: Pos) {
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
  context.beginPath();

  context.moveTo(pos.x - 50, pos.y - 50);
  context.quadraticCurveTo(pos.x, pos.y, pos.x - 50, pos.y + 50);
  context.quadraticCurveTo(pos.x + 30, pos.y + 40, pos.x + 60, pos.y);
  context.quadraticCurveTo(pos.x + 30, pos.y - 40, pos.x - 50, pos.y - 50);

  context.moveTo(pos.x + 60, pos.y);
  context.lineTo(pos.x + 70, pos.y);

  context.moveTo(pos.x - 34, pos.y - 30);
  context.lineTo(pos.x - 60, pos.y - 30);

  context.moveTo(pos.x - 34, pos.y + 30);
  context.lineTo(pos.x - 60, pos.y + 30);

  context.closePath();
  context.stroke();
}

export function drawNot(canvas: Canvas, pos: Pos) {
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!
  context.beginPath()

  context.moveTo(pos.x-30, pos.y-20)
  context.lineTo(pos.x-30, pos.y+20)
  context.lineTo(pos.x+20, pos.y)
  context.lineTo(pos.x-30, pos.y-20)

  context.moveTo(pos.x+30, pos.y)
  context.arc(pos.x+25, pos.y, 5, 0, 2*Math.PI)

  context.moveTo(pos.x-30, pos.y)
  context.lineTo(pos.x-40, pos.y)

  context.moveTo(pos.x+30, pos.y)
  context.lineTo(pos.x+40, pos.y)

  context.closePath()
  context.stroke()
}

export function drawLine(canvas: Canvas, start: Pos, end: Pos) {
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.closePath();
  context.stroke();
}

