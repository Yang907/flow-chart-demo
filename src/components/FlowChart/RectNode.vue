<template>
  <div
    class="rect-container"
    :class="{ 'high-light': highLight }"
    :id="'flow_node' + id"
  >
    <div class="node_t" :style="{ color: textColor1 }">
      <span>{{ lobelTop || "节点名称" }}</span>
    </div>
    <div
      class="node_b"
      :style="{
        'background-color': typeColor[type],
        color: textColor2,
      }"
    >
      <span>{{ lobelBottom || "角色名称" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { typeColor } from "./config.js";
export default {
  name: "RectNode",
  inject: ["getNode"],
  data() {
    return {
      lobelTop: "节点名称",
      lobelBottom: "角色名称",
      highLight: false,
      code: null,
      isEdit: false,
      type: 1, // 对应节点类型1，2，3
      id: null,
      typeColor,
      textColor1: "#2c3e50",
      textColor2: "#2c3e50",
    };
  },
  mounted() {
    const node = this.getNode();
    this.lobelTop = node.store.data.label1;
    this.lobelBottom = node.store.data.label2;
    this.highLight = node.store.data.highLight;
    this.code = node.store.data.code;
    this.type = node.store.data.type;
    this.id = node.id;
    node.on("change:code", ({ current }) => {
      this.code = current;
    });
    node.on("change:label1", ({ current }) => {
      this.lobelTop = current;
    });
    node.on("change:label2", ({ current }) => {
      this.lobelBottom = current;
    });
    node.on("change:type", ({ current }) => {
      this.type = current;
    });
    node.on("change:textColor1", ({ current }) => {
      this.textColor1 = current || "#2c3e50";
    });
    node.on("change:textColor2", ({ current }) => {
      this.textColor2 = current || "#2c3e50";
    });
  },
};
</script>
<style scoped>
.rect-container {
  border: 1px solid #5f95ff;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.node_t {
  font-size: 12px;
  box-sizing: border-box;
  /* padding: 2px; */
  height: 55%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node_b {
  font-size: 12px;
  border-top: 1px solid #000;
  /* padding: 2px; */
  background-color: #9bcdff;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input {
  width: calc(100% - 8px);
}
.high-light {
  border: 2px dashed #03e9f4;
  background-color: rgb(124, 104, 252, 0.2);
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
    0 0 100px #03e9f4;
}
</style>
