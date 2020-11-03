<template>
  <div class="app-container">
    <div class="title">
      <span class="title-text">論理回路図</span>
      <span class="make-table-button-container">
        <button class="make-table-button" v-on:click="doMakeTable">
          真理値表を作成
        </button>
      </span>
      <display-table
        v-if="showTable"
        :formulaData="dotsFormula"
        :boolData="dotsBool"
        :partsData="parts"
        :allPoses="poses"
        @close="showTable = false"
      />
    </div>
    <main-canvas
      class="main-canvas"
      :selected="selected"
      @reset="resetSelected"
      @parts="setParts"
      @poses="setPoses"
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
          class="change-name"
          v-if="name === 'input'"
          v-model="inputText"
          placeholder="Input Text"
        />
        <input
          class="change-name"
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
  loading = false;

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

  poses = {
    lines: [],
    ands: [],
    ors: [],
    nots: [],
    inputs: [],
    outputs: [],
    dots: []
  };

  doMakeTable() {
    this.loading = true;
    const tableData = MakeTable(this.parts);
    this.showTable = true;
    this.dotsFormula = tableData.formula;
    this.dotsBool = tableData.bool;
  }

  resetSelected() {
    this.selected = "";
  }

  setParts(parts: Parts) {
    this.parts = parts;
  }

  setPoses(poses) {
    this.poses = poses;
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

@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500&display=swap");
div {
  /* Google fontsで導入したいfontsからfont-familyを取ってくる */
  font-family: "Noto Serif JP", serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
  /* margin-top: 60px; */
}
/* .main-canvas {
  text-align: left;
} */
input {
  width: 100px;
}
.app-container {
  background: $background;
}
.title {
  // width: 100vw;
  // border: solid 2px #000;
  position: relative;
  .title-text {
    // display: inline-block;
    // text-align: center;
    font-size: 48px;
    vertical-align: middle;
    // float: center;
  }
  .make-table-button-container {
    position: absolute;
    // border: solid 2px #f00;
    right: 0;
    // top: 0;
    height: 100%;
    // display: hidden;
    // display: inline-block;
    text-align: right;
    .make-table-button {
      border: $ui-ter solid 1px;
      background: $background-sub;
      &:hover {
        border-color: $accent;
        background: $background-ter;
      }
      padding: 4px 16px;
      height: auto;
      font-size: 24px;
      font-family: "Noto Serif JP", serif;
    }
  }
}
.main-canvas {
  margin-top: 24px;
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
.change-name {
  border: #ced6db solid 2px;
  &:focus {
    border: 2px solid #005bac;
    outline: 0;
  }
}
</style>
