<template>
  <div id="app">
    <FlowChart />
  </div>
</template>

<script>
import FlowChart from "./components/FlowChart/FlowChart.vue";

export default {
  name: "App",
  components: {
    FlowChart,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}
body {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
