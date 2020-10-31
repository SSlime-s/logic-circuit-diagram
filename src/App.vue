<template>
  <div>
    <div class="title"> 論理回路図 </div>
    <main-canvas :selected="selected" @reset="resetSelected" />
    <div v-for="name in partsName" v-bind:key="name" class="selectParts">
      <label>
        <input type="radio" :id="name" :value="name" v-model="selected" />
        <label :for="name">{{ name }}</label>
        <read-only-canvas :view="name" :isSelected="name==selected" />
      </label>
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
  partsName = ["line", "and", "or", "not"];

  resetSelected() {
    this.selected = "";
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500&display=swap');
div {
/* Google fontsで導入したいfontsからfont-familyを取ってくる */
  font-family: 'Noto Serif JP', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.title {
  font-size: 2rem;
}
.selectParts {
  margin-right: 20px;
  padding: 10px;
  float: left;
  font-size: 1.5rem;
}
input[type="radio"]{
  display: none; 
}
</style>
