<template>
  <div
    class="rect-container"
    :class="{ 'high-light': highLight }"
    @dblclick="handleDoubleClick()"
  >
    <div v-if="isEdit" class="node_c">
      <!-- <span v-if="!isEdit">{{ code || "节点code" }}</span> -->
      <input class="input" v-model="code" placeholder="code值" />
    </div>
    <div v-if="isEdit" class="node_c">
      <!-- <span v-if="!isEdit">{{ code || "节点code" }}</span> -->
      <input class="input" v-model="type" placeholder="节点类型" />
    </div>
    <div class="node_t">
      <span v-if="!isEdit">{{ lobelTop || "节点名称" }}</span>
      <input class="input" v-else v-model="lobelTop" placeholder="节点名称" />
    </div>
    <div class="node_b" :style="{ 'background-color': typeColor[type] }">
      <span v-if="!isEdit">{{ lobelBottom || "角色名称" }}</span>
      <input
        class="input"
        v-else
        v-model="lobelBottom"
        placeholder="角色名称"
      />
    </div>
  </div>
</template>

<script lang="ts">
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
      preCode: null,
      type: 1, // 对应节点类型1，2，3
      typeColor: {
        1: "#9bcdff",
        2: "#c0f2ff",
        3: "#c9d8b4",
      },
    };
  },
  mounted() {
    const node = this.getNode();
    this.lobelTop = node.store.data.label1;
    this.lobelBottom = node.store.data.label2;
    this.highLight = node.store.data.highLight;
    this.code = node.store.data.id;
    this.type = node.store.data.type;
    this.preCode = this.code;
    window.addEventListener("keydown", this.myFunction);
  },

  destroyed() {
    window.removeEventListener("keydown", this.myFunction);
  },

  methods: {
    handleDoubleClick() {
      this.isEdit = true;
      const node = this.getNode();
      node.prop("isEdit", true);
    },
    myFunction(e) {
      const node = this.getNode();
      // const preId = node.id;

      if (e.altKey && e.key.toLowerCase() == "s") {
        this.isEdit = false;
        node.prop("label1", this.lobelTop);
        node.prop("label2", this.lobelBottom);
        node.prop("id", this.code);
        node.prop("isEdit", false);
        node.prop("type", this.type);
        // id被修改，需要添加标识，以便重新渲染node
        if (this.preCode != this.code) {
          node.prop("isUpdate", true);
        }
      }
    },
  },
};
</script>
<style scoped>
.rect-container {
  border: 1px solid #5f95ff;
}

.node_c {
  font-size: 12px;
  border-bottom: 1px solid #000;
  padding: 2px;
}
.node_t {
  font-size: 12px;
  border-bottom: 1px solid #000;
  padding: 2px;
}
.node_b {
  font-size: 12px;
  padding: 2px;
  background-color: #9bcdff;
}
.input {
  width: calc(100% - 8px);
}
.high-light {
  border: 2px dashed red;
  background-color: rgb(124, 104, 252, 0.2);
}
</style>
