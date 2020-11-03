<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- <div class="title">
          真理値表
        </div> -->
        <div class="canvas-and-formula">
          <div class="canvas-container">
            <div class="canvas">
              <display-canvas :allPoses="allPoses" />
            </div>
          </div>
          <div class="logic-fomula-container">
            <table class="logic-formula-list">
              <tr v-for="(output, idx) in partsData.outputs" :key="output">
                <td class="logic-formula-label">
                  {{ partsData.outputName[idx].text }}
                </td>
                <td class="logic-formula-value">
                  {{ formulaData[output] ? formulaData[output] : "null" }}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="truth-table-container">
          <table class="truth-table">
            <tr class="labels">
              <th
                v-for="name in partsData.inputName"
                :key="name.text"
                class="input-label"
              >
                {{ name.text }}
              </th>
              <th class="label-split" />
              <th
                v-for="name in partsData.outputName"
                :key="name.text"
                class="output-label"
              >
                {{ name.text }}
              </th>
            </tr>
            <tr v-for="bools in boolData" :key="bools" class="values">
              <td
                v-for="idx in partsData.inputs"
                :key="idx"
                class="input-value"
              >
                {{ bools[idx] ? 1 : 0 }}
              </td>
              <td class="value-split" />
              <td
                v-for="idx in partsData.outputs"
                :key="idx"
                class="output-value"
              >
                {{ bools[idx] ? 1 : 0 }}
              </td>
            </tr>
          </table>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            default footer
            <button class="modal-default-button" @click="$emit('close')">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import DisplayCanvas from "./DisplayCanvas.vue";

interface Pos {
  x: number;
  y: number;
}

interface PosText {
  x: number;
  y: number;
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

interface Parts {
  lines: number[][];
  ands: number[][];
  ors: number[][];
  nots: number[][];
  inputName: PosText[];
  inputs: number[];
  outputName: PosText[];
  outputs: number[];
  dots: AllJoin[];
}

@Component({
  components: {
    DisplayCanvas
  }
})
export default class DisplayTable extends Vue {
  @Prop({
    default: []
  })
  private boolData!: boolean[][];

  @Prop({
    default: []
  })
  private formulaData!: string[];

  @Prop({
    default: null
  })
  private partsData!: Parts;

  @Prop({})
  private allPoses;

  validDotsIdx: boolean[] = [];

  mounted() {
    this.validDotsIdx = new Array(this.formulaData.length);
    for (let i = 0; i < this.validDotsIdx.length; i++)
      this.validDotsIdx[i] = false;
    this.partsData.inputs.forEach(idx => (this.validDotsIdx[idx] = true));
    this.partsData.outputs.forEach(idx => (this.validDotsIdx[idx] = true));
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 90%;
  height: 90%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: auto;
}

.canvas-and-formula {
  // border: solid 5px #000;
  overflow: hidden;
  width: 100%;
  max-width: 90vw;
  display: grid;
  grid-template-columns: 45vw 45vw;
  .canvas-container {
    // border: solid 5px #000;
    width: 100%;
    display: table-cell;
    margin-top: 20px;
    vertical-align: top;
    grid-column: 1;
    text-align: right;
    .canvas {
      // border: solid 5px #f00;
      display: flex-end;
      padding-right: 20px;
    }
    // display: inline-block;
  }
  .logic-fomula-container {
    // border: solid 5px #000;
    display: table-cell;
    width: 100%;
    // max-width: 45vw;
    vertical-align: top;
    margin-top: 20px;
    grid-column: 2;
    .logic-formula-list {
      border-collapse: collapse;
      margin-left: 20px;
      // table-layout: fixed;
      margin-right: 40px;
      .logic-formula-label {
        border: solid 1px #000;
        border-right: solid 3px #000;
      }
      .logic-formula-value {
        border: solid 1px #000;
        word-break : break-all;
      }
      td {
        padding: 5px;
        padding-right: 20px;
        padding-left: 20px;
        // overflow-wrap: break-word;
      }
    }
  }
}

.truth-table {
  display: inline-block;
  border-collapse: collapse;
  border: solid #000;
  margin-top: 40px;
  clear: both;
  .input-label,
  .output-label {
    padding: 5px;
    padding-left: 40px;
    padding-right: 40px;
    background: #ccc;
    border: solid 1px #000;
    border-bottom: solid 3px #000;
  }
  .values {
    .input-value,
    .output-value {
      text-align: center;
      border: solid 1px #000;
    }
    &:nth-child(odd) {
      background: #eee;
    }
  }
}
</style>
