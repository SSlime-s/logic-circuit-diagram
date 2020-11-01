<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="title">
          真理値表
        </div>
        <div class="logic-formula-list">
          <div v-for="(output, idx) in partsData.outputs" :key="output">
            {{ partsData.outputName[idx].text }} : {{ formulaData[output] }}
          </div>
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
import { MakeTable } from "./makeTable"

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
  inputs: number[]
  outputName: PosText[];
  outputs: number[]
  dots: AllJoin[];
}

@Component({
  components: {}
})
export default class DisplayTable extends Vue {
  @Prop({
    default: []
  })
  private boolData!: boolean[][]

  @Prop({
    default: []
  })
  private formulaData!: string[]

  @Prop({
    default: null
  })
  private partsData!: Parts
}
</script>

<style scoped>
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
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

</style>