<template>
  <div class="display-canvas-container">
    <canvas
      width="1000"
      height="500"
      class="display-canvas"
      ref="canvas"
      id="test"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
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

interface AllJoin {
  line: number[];
  and: number[];
  or: number[];
  not: number[];
  input: number[];
  output: number[];
}

@Component({
  components: {}
})
export default class DisplayCanvas extends Vue {
  @Prop({})
  private allPoses;

  canvas: HTMLCanvasElement = null;
  context: CanvasRenderingContext2D = null;

  lines: number[][] = this.allPoses.lines;
  ands: Pos[] = this.allPoses.ands;
  ors: Pos[] = this.allPoses.ors;
  nots: Pos[] = this.allPoses.nots;
  dots: Pos[] = this.allPoses.dots;
  inputs: PosText[] = this.allPoses.inputs;
  outputs: PosText[] = this.allPoses.outputs;

  setPoses() {
    this.lines = this.allPoses.lines;

    this.ands = this.allPoses.ands;

    this.ors = this.allPoses.ors;

    this.nots = this.allPoses.nots;

    this.dots = this.allPoses.dots;

    this.inputs = this.allPoses.inputs;

    this.outputs = this.allPoses.outputs;
  }

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

  mounted() {
    this.canvas = this.$refs.canvas; // <HTMLCanvasElement>this.$refs.canvas;
    this.context = this.canvas.getContext("2d")!;
    this.setPoses();
    this.draw();
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "#ffffff"
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fill();

    this.context.closePath();
    this.context.stroke();

    this.lines.forEach(line =>
      drawLine(this.canvas, this.dots[line[0]], this.dots[line[1]])
    );
    this.ands.forEach(and => drawAnd(this.canvas, and));
    this.ors.forEach(or => drawOr(this.canvas, or));
    this.nots.forEach(not => drawNot(this.canvas, not));
    this.dots.forEach(dot => drawDot(this.canvas, dot));
    this.inputs.forEach(input => drawInput(this.canvas, input.pos, input.text));
    this.outputs.forEach(output =>
      drawOutput(this.canvas, output.pos, output.text)
    );
  }
}
</script>

<style lang="scss" scoped>
$accent: #005bac;
$background: #ffffff;
$background-sub: #f0f2f5;
$text: #333333;
$text-sub: #79797a;
$ui: #49535b;
$ui-sub: #6b7d8a;
$danger: #f26451;

.display-canvas-container {
  // height: 100%;
  .display-canvas {
    border: 2px solid #49535b;
    width: 40vw;
    margin: 0px;
    background: $background;
  }
}
</style>
