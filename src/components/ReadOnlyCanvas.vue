<template>
  <div>
    <canvas
      width="200"
      height="200"
      class="canvas"
      v-bind:class="{ isSelected: isSelected }"
      ref="canvas"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
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

@Component({
  components: {}
})
export default class ReadOnlyCanvas extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private readonly isSelected: boolean;

  @Prop({
    type: String,
    default: ""
  })
  private readonly view!: string;

  @Prop({
    type: String,
    default: "xz"
  })
  private readonly inputText!: string;

  @Prop({
    type: String,
    default: "a"
  })
  private readonly outputText!: string;

  canvas: HTMLCanvasElement = null;
  context: CanvasRenderingContext2D = null;

  mounted() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d")!;

    this.draw();
  }

  draw() {
    this.context.beginPath();
    this.context.clearRect(0, 0, 200, 200);
    this.context.fill();

    switch (this.view) {
      case "line":
        drawLine(this.canvas, { x: 20, y: 100 }, { x: 180, y: 100 });
        break;

      case "and":
        drawAnd(this.canvas, { x: 100, y: 100 });
        break;

      case "or":
        drawOr(this.canvas, { x: 100, y: 100 });
        break;

      case "not":
        drawNot(this.canvas, { x: 100, y: 100 });
        break;

      case "dot":
        drawDot(this.canvas, { x: 100, y: 100 });
        break;

      case "input":
        drawInput(this.canvas, { x: 100, y: 100 }, this.inputText);
        break;

      case "output":
        drawOutput(this.canvas, { x: 100, y: 100 }, this.outputText);
        break;
    }
  }

  get watcher() {
    return [this.inputText, this.outputText];
  }

  @Watch("watcher")
  drawAll() {
    this.draw();
  }
}
</script>

<style scoped>
.canvas {
  border: 2px solid #aaa;
  /* width: auto; */
  height: 100px;
}
.isSelected {
  border: 2px solid #59f;
}
</style>