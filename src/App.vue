<template>
  <div id="app">
    <InitializeTemplate></InitializeTemplate>
  </div>
</template>

<script>
import InitializeTemplate from '@/views/initializeTemplate'
export default {
  name: "App",
  components: {
    InitializeTemplate,
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
