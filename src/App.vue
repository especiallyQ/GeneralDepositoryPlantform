<template>
  <div id="app">
    <Login></Login>
  </div>
</template>

<script>
import Login from "@/views/login/login.vue";
export default {
  name: "App",
  components: {
    Login,
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
