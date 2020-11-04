<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- <div class="title">
          真理値表
        </div> -->
        <div class="close-button-container">
          <button class="close-button" @click="$emit('close')">
            X
          </button>
        </div>
        <div class="canvas-and-formula">
          <div class="canvas-container">
            <div class="canvas">
              <display-canvas :allPoses="allPoses" />
            </div>
          </div>
          <div class="logic-fomula-container">
            <table
              v-if="partsData.outputs.length > 0"
              class="logic-formula-list"
            >
              <tr v-for="(output, idx) in partsData.outputs" :key="idx">
                <td class="logic-formula-label">
                  {{ partsData.outputName[idx].text }}
                </td>
                <td class="logic-formula-value">
                  {{ formulaData[output] ? formulaData[output] : "null" }}
                </td>
              </tr>
            </table>

            <div v-else class="logic-formula-null">
              出力が存在しません
            </div>
          </div>
        </div>

        <div class="truth-table-container">
          <div class="truth-table-label">
            真理値表
          </div>
          <table
            v-if="partsData.outputs.length > 0 || partsData.inputs.length > 0"
            class="truth-table"
          >
            <tr class="labels">
              <th
                v-for="(name, index) in partsData.inputName"
                :key="index"
                class="input-label"
              >
                {{ name.text }}
              </th>
              <th
                class="label-split"
                v-if="
                  partsData.inputName.length > 0 &&
                    partsData.outputName.length > 0
                "
              />
              <th
                v-for="(name, index) in partsData.outputName"
                :key="index"
                class="output-label"
              >
                {{ name.text }}
              </th>
            </tr>
            <tr v-for="(bools, index) in boolData" :key="index" class="values">
              <td
                v-for="(idx, index) in partsData.inputs"
                :key="index"
                class="input-value"
              >
                {{ bools[idx] ? 1 : 0 }}
              </td>
              <td
                class="value-split"
                v-if="
                  partsData.inputName.length > 0 &&
                    partsData.outputName.length > 0
                "
              />
              <td
                v-for="(idx, index) in partsData.outputs"
                :key="index"
                class="output-value"
              >
                {{ bools[idx] ? 1 : 0 }}
              </td>
            </tr>
          </table>
          <div v-else class="truth-table-null">
            入力や出力が存在しません
          </div>
        </div>

        <!-- <div class="modal-footer">
          <slot name="footer">
            default footer
            <button class="modal-default-button" @click="$emit('close')">
              OK
            </button>
          </slot>
        </div> -->
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
$accent: #005bac;
$background: #ffffff;
$background-sub: #f0f2f5;
$background-ter: #e2e5e9;
$text: #333333;
$text-sub: #79797a;
$ui: #49535b;
$ui-sub: #6b7d8a;
$ui-ter: #ced6db;
$danger: #f26451;

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
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: auto;
}

.close-button-container {
  text-align: right;
  .close-button {
    background: $background;
    border: none;
    color: $ui-sub;
    font-size: 30px;
    &:hover {
      color: $ui-ter;
    }
  }
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
    display: table-cell;
    width: 100%;
    vertical-align: top;
    margin-top: 20px;
    grid-column: 2;
    position: relative;
    // border: 2px #000 solid;
    .logic-formula-list {
      border-collapse: collapse;
      margin-left: 20px;
      margin-right: 40px;
      font-size: 25px;
      .logic-formula-label {
        border: solid 1px $ui-sub;
        border-right: solid 2px $ui;
      }
      .logic-formula-value {
        border: solid 1px $ui-sub;
        word-break: break-all;
      }
      td {
        padding: 5px;
        padding-right: 20px;
        padding-left: 20px;
      }
    }
    .logic-formula-null {
      position: absolute;
      vertical-align: middle;
      margin-left: 16px;
      color: $text-sub;
      top: 50%;
      transform: translateY(-50%)
    }
  }
}

.truth-table-container {
  .truth-table-label {
    margin-top: 24px;
    font-size: 24px;
  }

  .truth-table {
    display: inline-block;
    border-collapse: collapse;
    padding: 0;
    margin-top: 12px;
    clear: both;
    font-size: 25px;
    .label-split,
    .value-split {
      border: solid 1px $ui-sub;
      padding: 0 2px;
    }
    .label-split {
      background: $background-ter;
      border-bottom: solid 2px $ui;
    }
    .input-label,
    .output-label {
      padding: 5px 40px;
      background: $background-ter;
      border: solid 1px $ui-sub;
      border-bottom: solid 2px $ui;
    }
    .values {
      .input-value,
      .output-value {
        text-align: center;
        border: solid 1px $ui-sub;
      }
      &:nth-child(even) {
        background: $background;
      }
      &:nth-child(odd) {
        background: $background-sub;
      }
    }
  }
  .truth-table-null {
    margin-top: 24px;
    color: $text-sub;
  }
}
</style>
