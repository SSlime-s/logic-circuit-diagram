<template>
  <div>
    <div class="title">
      <div>論理回路図</div>
      <button v-on:click="doMakeTable">真理値表を作成</button>
      <display-table
        v-if="showTable"
        :formulaData="dotsFormula"
        :boolData="dotsBool"
        :partsData="parts"
        @close="showTable = false"
      />
    </div>
    <main-canvas
      class="main-canvas"
      :selected="selected"
      @reset="resetSelected"
      @parts="setParts"
      :inputText="inputText"
      :outputText="outputText"
    />
    <div class="selectPartsContainer">
      <div v-for="name in partsName" v-bind:key="name" class="selectParts">
        <label>
          <input type="radio" :id="name" :value="name" v-model="selected" />
          <label :for="name">{{ name }}</label>
          <read-only-canvas
            :view="name"
            :isSelected="name == selected"
            :inputText="inputText"
            :outputText="outputText"
          />
        </label>
        <input
          v-if="name === 'input'"
          v-model="inputText"
          placeholder="Input Text"
        />
        <input
          v-else-if="name === 'output'"
          v-model="outputText"
          placeholder="Output Text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainCanvas from "./components/MainCanvas.vue";
import ReadOnlyCanvas from "./components/ReadOnlyCanvas.vue";
import { MakeTable } from "./components/makeTable";
import DisplayTable from "./components/DisplayTable.vue";

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
    MainCanvas,
    ReadOnlyCanvas,
    DisplayTable
  }
})
export default class App extends Vue {
  selected = "";
  partsName = ["line", "and", "or", "not", "dot", "input", "output"];
  inputText = "x";
  outputText = "a";
  showTable = false;
  dotsFormula: string[] = [];
  dotsBool: boolean[][] = [];

  parts: Parts = {
    lines: [],
    ands: [],
    ors: [],
    nots: [],
    inputName: [],
    inputs: [],
    outputName: [],
    outputs: [],
    dots: []
  };

  doMakeTable() {
    this.showTable = true;
    const tableData = MakeTable(this.parts);
    this.dotsFormula = tableData.formula;
    this.dotsBool = tableData.bool;
  }

  resetSelected() {
    this.selected = "";
  }

  setParts(parts: Parts) {
    this.parts = parts;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500&display=swap");
div {
  /* Google fontsで導入したいfontsからfont-familyを取ってくる */
  font-family: "Noto Serif JP", serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
/* .main-canvas {
  text-align: left;
} */
input {
  width: 100px;
}
.title {
  font-size: 2rem;
}
.selectPartsContainer {
  position: relative;
  display: inline-block;
  /* left: 50%; */
}
.selectParts {
  /* margin-right: auto; */
  margin: auto;
  padding: 10px;
  float: left;
  /* left: -50%; */
  font-size: 1.5rem;
}
input[type="radio"] {
  display: none;
}
</style>
