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

interface AllJoin {
  line: number[]
  and: number[]
  or: number[]
  not: number[]
  input: number[]
  output: number[]
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

  canvas: HTMLCanvasElement = null;
  context: CanvasRenderingContext2D = null;

  lines: number[][] = []

  ands: Pos[] = [];
  andDot: number[][] = []

  ors: Pos[] = [];
  orDot: number[][] = []

  nots: Pos[] = [];
  notDot: number[][] = []

  dots: Pos[] = [];
  dotsJoin: AllJoin[] = []

  inputs: PosText[] = [];
  inputDot: number[] = []

  outputs: PosText[] = [];
  outputDot: number[] = []


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

  lineSelect: number = null;
  nowMouse: Pos = null;

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
      case "line": {
        const [dist, nearPos] = this.nearDot(pos);
        this.nowMouse = dist < 200 ? this.dots[nearPos] : pos;
        break;
      }

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
    const pos: Pos = {
      x : e.clientX - rect.left,
      y:  e.clientY - rect.top
    }

    switch (this.selected) {
      case "line":
        if (this.lineSelect !== null) {
          const [dist, idx] = this.nearDot(pos)
          if (dist >= 200) {
            this.dotsJoin[this.lineSelect].line.push(this.lines.length)
            this.addDotsJoin()
            this.dotsJoin[this.dots.length].line.push(this.lines.length)

            this.lines.push([this.lineSelect, this.dots.length])

            this.dots.push(this.nowMouse);
          } else {
            this.dotsJoin[this.lineSelect].line.push(this.lines.length)
            this.dotsJoin[idx].line.push(this.lines.length)

            this.lines.push([this.lineSelect, idx])
          }
          this.lineSelect = null;
        } else {
          const [dist, idx] = this.nearDot(pos)
          if (dist < 200) {
            this.lineSelect = idx
          } else {
            this.lineSelect = this.dots.length
            this.dots.push(pos)
            this.addDotsJoin()
          }
        }
        break;

      case "and":
        this.ands.push(this.nowMouse);
        this.andDot.push([this.dots.length, this.dots.length + 1, this.dots.length + 2])
        this.delta.forEach(d => {
          this.addDotsJoin()
          this.dotsJoin[this.dots.length].and.push(this.ands.length - 1)

          this.dots.push({ x: this.nowMouse.x + d.x, y: this.nowMouse.y + d.y })
        });
        this.resetSelected();
        break;

      case "or":
        this.ors.push(this.nowMouse);
        // this.orDot.push([])
        this.orDot.push([this.dots.length, this.dots.length + 1, this.dots.length + 2])
        this.delta.forEach(d => {
          // this.orDot[-1].push(this.dots.length)
          this.addDotsJoin()
          this.dotsJoin[this.dots.length].or.push(this.ors.length - 1)

          this.dots.push({ x: this.nowMouse.x + d.x, y: this.nowMouse.y + d.y })
        });
        this.resetSelected();
        break;

      case "not":
        this.nots.push(this.nowMouse);
        this.notDot.push([this.dots.length, this.dots.length + 1])
        this.addDotsJoin(2)
        this.dotsJoin[this.dots.length].not.push(this.nots.length - 1)
        this.dotsJoin[this.dots.length + 1].not.push(this.nots.length - 1)

        this.dots.push({ x: this.nowMouse.x - 40, y: this.nowMouse.y });
        this.dots.push({ x: this.nowMouse.x + 40, y: this.nowMouse.y });
        this.resetSelected();
        break;

      case "dot":
        this.dots.push(this.nowMouse);
        this.addDotsJoin()

        this.resetSelected();
        break;

      case "input":
        this.inputs.push({ pos: this.nowMouse, text: this.inputText });
        this.inputDot.push(this.dots.length)

        this.dots.push({ x: this.nowMouse.x + 40, y: this.nowMouse.y });
        this.addDotsJoin()
        this.dotsJoin[this.dotsJoin.length - 1].input.push(this.inputs.length - 1)
        this.resetSelected();
        break;

      case "output":
        this.outputs.push({ pos: this.nowMouse, text: this.outputText });
        this.outputDot.push(this.dots.length)

        this.dots.push({ x: this.nowMouse.x - 40, y: this.nowMouse.y });
        this.addDotsJoin()
        this.dotsJoin[this.dotsJoin.length - 1].output.push(this.outputs.length - 1)
        this.resetSelected();
        break;
    }
  }

  draw() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fill();

    this.context.closePath();
    this.context.stroke();

    switch (this.selected) {
      case "line":
        if (this.nowMouse && this.lineSelect !== null) {
          drawLine(this.canvas, this.dots[this.lineSelect], this.nowMouse);
        }
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

  nearDot(pos: Pos): [number, number] {
    let minD = 1e9;
    let minIdx = -1;
    this.dots.forEach((dot, idx) => {
      const d = (pos.x - dot.x) ** 2 + (pos.y - dot.y) ** 2;
      if (d < minD) {
        minD = d;
        minIdx = idx;
      }
    });
    return [minD, minIdx];
  }

  addDotsJoin(x = 1) {
    const defaultAllJoin: AllJoin = {
      line: [],
      and: [],
      or: [],
      not: [],
      input: [],
      output: []
    }
    for(let i=0; i<x; i++) this.dotsJoin.push({
      line: [],
      and: [],
      or: [],
      not: [],
      input: [],
      output: []
    })
  }

  get watched() {
    return [this.lines, this.dots, this.nowMouse];
  }

  get parts() {
    return {
      lines: this.lines,
      ands: this.andDot,
      ors: this.orDot,
      nots: this.notDot,
      inputName: this.inputs,
      inputs: this.inputDot,
      outputName: this.outputs,
      outputs: this.outputDot,
      dots: this.dotsJoin
    }
  }

  get poses() {
    return {
      lines: this.lines,
      ands: this.ands,
      ors: this.ors,
      nots: this.nots,
      inputs: this.inputs,
      outputs: this.outputs,
      dots: this.dots
    }
  }

  @Watch("watched")
  DrawRadius() {
    this.draw();
  }

  @Watch("parts")
  emitParts(){
    this.exportParts()
  }

  @Watch("poses")
  emitPoses(){
    this.exportPoses()
  }

  @Emit("reset")
  resetSelected() {
    return;
  }

  @Emit("parts")
  exportParts() {
    return this.parts
  }

  @Emit("poses")
  exportPoses(){
    return this.poses
  }
}
</script>

<style scoped>
.canvas {
  border: 2px solid #aaa;
  /* width: auto; */
  /* width: 100%; */
}
</style>