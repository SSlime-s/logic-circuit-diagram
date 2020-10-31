<template>
  <div>
    <canvas width="1000" height="500" class="canvas" ref="canvas" id="test" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
import { drawAnd, drawLine, drawOr, drawNot } from "./parts";

interface Pos {
  x: number;
  y: number;
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

  radius = 50;
  canvas: HTMLCanvasElement = null
  // canvas = null;
  context: CanvasRenderingContext2D = null;
  lines: Pos[][] = [];
  ands: Pos[] = [];
  ors: Pos[] = [];
  nots: Pos[] = []
  lineSelect: Pos = null;
  nowMouse: Pos = null;

  mounted() {
    // mounted 以降で canvas の DOM にアクセスできる
    // CreateJS などを使うときにも、ここで canvas と紐付ける
    // console.log(this.$el);

    this.canvas = this.$refs.canvas // <HTMLCanvasElement>this.$refs.canvas;
    this.context = this.canvas.getContext("2d")!;

    this.canvas.addEventListener("click", this.onClick, false);
    this.canvas.addEventListener("mousemove", this.onMouseMove, false);
  }

  onMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (this.selected) {
      case "line":
        if (!this.lineSelect) {
          if (this.nowMouse) this.nowMouse = null;
        } else {
          this.nowMouse = {
            x: x,
            y: y
          };
        }
        break;
      case "and":
        this.nowMouse = {
          x: x,
          y: y
        };
        break;

      case "or":
        this.nowMouse = {
          x: x,
          y: y
        };
        break;

      case "not":
        this.nowMouse = {
          x: x,
          y: y
        }
        break
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
        // this.selected = ""
        this.resetSelected();
        break;

      case "or":
        this.ors.push(this.nowMouse);
        this.resetSelected();
        break;
      
      case "not":
        this.nots.push(this.nowMouse)
        this.resetSelected()
        break
    }
    // console.log(`x: ${e.clientX - rect.left}, y: ${e.clientY - rect.top}`)
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
        drawNot(this.canvas, this.nowMouse)
    }

    this.ands.forEach(and => drawAnd(this.canvas, and));
    this.ors.forEach(or => drawOr(this.canvas, or));
    this.nots.forEach(not => drawNot(this.canvas, not))

    // drawAnd(this.canvas, {x:500, y:200})

    // this.context.stroke()
    // this.context.fill();
  }

  someMethod(event) {
    // clientX/Y gives the coordinates relative to the viewport in CSS pixels.
    console.log(event.clientX); // x coordinate
    console.log(event.clientY); // y coordinate

    // pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
    console.log(event.pageX);
    console.log(event.pagey);

    // screenX/Y gives the coordinates relative to the screen in device pixels.
    console.log(event.screenX);
    console.log(event.screenY);
  }

  get watched() {
    return [this.lines, this.nowMouse];
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