<template>
  <div id="app">
    <Home></Home>
    <!-- <Main></Main> -->
  </div>
</template>

<script>
import Home from "@/views/Home";
import Main from "@/views/index/main.vue";
export default {
  name: "App",
  components: {
    Home,
    // Main,
  },
};
</script>

<style>
#app {
  /* min-width: 800px; */
  height: 100%;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2e384d;
  min-width: 1280px;
}
</style>
