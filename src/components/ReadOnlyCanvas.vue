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
    type: Boolean,
    default: false
  })
  private readonly isSelected: boolean;

  @Prop({
    type: String,
    default: ""
  })
  private readonly view!: string;

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
        this.context.beginPath();
        this.context.moveTo(20, 100);
        this.context.lineTo(80, 100);
        this.context.closePath();
        this.context.stroke();
        break;
      case "and":
        drawAnd(this.canvas, { x: 100, y: 100 });
        break;

      case "or":
        drawOr(this.canvas, { x: 100, y: 100 });
        break;
      
      case "not":
        drawNot(this.canvas, { x:100, y:100 })
    }
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