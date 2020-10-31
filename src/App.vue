<template>
  <div>
    <div class="title">論理回路図</div>
    <main-canvas class="main-canvas"
      :selected="selected"
      @reset="resetSelected"
      :inputText="inputText"
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

@Component({
  components: {
    MainCanvas,
    ReadOnlyCanvas
  }
})
export default class App extends Vue {
  selected = "";
  partsName = ["line", "and", "or", "not", "dot", "input", "output"];
  inputText = "x";
  outputText = "a";

  resetSelected() {
    this.selected = "";
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
