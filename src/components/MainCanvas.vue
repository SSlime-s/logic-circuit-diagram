<template>
  <div>
    <canvas width="1000" height="500" class="canvas" ref="canvas" id="test" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
import {
  drawAnd,
  drawLine,
  drawOr,
  drawNot,
  drawDot,
  drawInput,
  drawOutput
} from "./parts";

interface Pos {
  x: number;
  y: number;
}

interface PosText {
  pos: Pos;
  text: string;
}

@Component({
  components: {}
})
export default class MainCanvas extends Vue {
  @Prop({
    type: String,
    default: ""
  })
  private selected!: string;

  @Prop({
    type: String,
    default: "x"
  })
  private inputText!: string;

  @Prop({
    type: String,
    default: "a"
  })
  private outputText!: string;

  radius = 50;
  canvas: HTMLCanvasElement = null;
  context: CanvasRenderingContext2D = null;

  lines: Pos[][] = [];
  ands: Pos[] = [];
  ors: Pos[] = [];
  nots: Pos[] = [];
  dots: Pos[] = [];
  inputs: PosText[] = [];
  outputs: PosText[] = [];

  delta: Pos[] = [
    {
      x: -60,
      y: -30
    },
    {
      x: -60,
      y: 30
    },
    {
      x: 70,
      y: 0
    }
  ];

  lineSelect: Pos = null;
  nowMouse: Pos = null;
  // inputText = "A";

  mounted() {
    this.canvas = this.$refs.canvas; // <HTMLCanvasElement>this.$refs.canvas;
    this.context = this.canvas.getContext("2d")!;

    this.canvas.addEventListener("click", this.onClick, false);
    this.canvas.addEventListener("mousemove", this.onMouseMove, false);
  }

  onMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const pos: Pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    switch (this.selected) {
      case "line":
        if (!this.lineSelect) {
          if (this.nowMouse) this.nowMouse = null;
        } else {
          this.nowMouse = pos;
        }
        break;
      case "and":
        this.nowMouse = pos;
        break;

      case "or":
        this.nowMouse = pos;
        break;

      case "not":
        this.nowMouse = pos;
        break;

      case "dot":
        this.nowMouse = pos;
        break;

      case "input":
        this.nowMouse = pos;
        break;

      case "output":
        this.nowMouse = pos;
        break;
    }
  }

  onClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (this.selected) {
      case "line":
        if (this.lineSelect) {
          this.lines.push([this.lineSelect, { x: x, y: y }]);
          this.lineSelect = null;
        } else {
          this.lineSelect = {
            x: x,
            y: y
          };
        }
        break;

      case "and":
        this.ands.push(this.nowMouse);
        this.delta.forEach(d =>
          this.dots.push({ x: this.nowMouse.x + d.x, y: this.nowMouse.y + d.y })
        );
        this.resetSelected();
        break;

      case "or":
        this.ors.push(this.nowMouse);
        this.delta.forEach(d =>
          this.dots.push({ x: this.nowMouse.x + d.x, y: this.nowMouse.y + d.y })
        );
        this.resetSelected();
        break;

      case "not":
        this.nots.push(this.nowMouse);
        this.dots.push({ x: this.nowMouse.x - 40, y: this.nowMouse.y });
        this.dots.push({ x: this.nowMouse.x + 40, y: this.nowMouse.y });
        this.resetSelected();
        break;

      case "dot":
        this.dots.push(this.nowMouse);
        this.resetSelected();
        break;

      case "input":
        this.inputs.push({ pos: this.nowMouse, text: this.inputText });
        this.dots.push({ x: this.nowMouse.x + 40, y: this.nowMouse.y });
        this.resetSelected();
        break;

      case "output":
        this.outputs.push({ pos: this.nowMouse, text: this.outputText });
        this.dots.push({ x: this.nowMouse.x - 40, y: this.nowMouse.y });
        this.resetSelected();
        break;
    }
  }

  draw() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fill();

    this.lines.forEach(line => {
      this.context.moveTo(line[0].x, line[0].y);
      this.context.lineTo(line[1].x, line[1].y);
    });

    this.context.closePath();
    this.context.stroke();

    switch (this.selected) {
      case "line":
        this.context.beginPath();
        if (this.nowMouse && this.lineSelect) {
          this.context.moveTo(this.lineSelect.x, this.lineSelect.y);
          this.context.lineTo(this.nowMouse.x, this.nowMouse.y);
        }
        this.context.closePath();
        this.context.stroke();
        break;

      case "and":
        drawAnd(this.canvas, this.nowMouse);
        break;

      case "or":
        drawOr(this.canvas, this.nowMouse);
        break;

      case "not":
        drawNot(this.canvas, this.nowMouse);
        break;

      case "dot":
        drawDot(this.canvas, this.nowMouse);
        break;

      case "input":
        drawInput(this.canvas, this.nowMouse, this.inputText);
        break;

      case "output":
        drawOutput(this.canvas, this.nowMouse, this.outputText);
        break;
    }

    this.ands.forEach(and => drawAnd(this.canvas, and));
    this.ors.forEach(or => drawOr(this.canvas, or));
    this.nots.forEach(not => drawNot(this.canvas, not));
    this.dots.forEach(dot => drawDot(this.canvas, dot));
    this.inputs.forEach(input => drawInput(this.canvas, input.pos, input.text));
    this.outputs.forEach(output =>
      drawOutput(this.canvas, output.pos, output.text)
    );
  }

  get watched() {
    return [this.lines, this.dots, this.nowMouse];
  }

  @Watch("watched")
  DrawRadius() {
    this.draw();
  }

  @Emit("reset")
  resetSelected() {
    return;
  }
}
</script>

<style scoped>
.canvas {
  border: 2px solid #aaa;
  /* width: auto; */
  height: auto;
}
</style>