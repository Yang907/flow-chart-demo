<template>
  <div class="container" style="width: 100%; height: 100%">
    <div class="content" style="width: 100%; height: 100%">
      <div class="app-stencil" id="stencilContainer"></div>
      <div class="app-content" id="graphContainer"></div>
    </div>
    <button
      @click="exportFun()"
      style="height: 36px; position: absolute; top: 0; right: 0"
    >
      保存
    </button>
  </div>
</template>
<script>
import { dataValue } from "./dataConfig";
import {
  ports,
  initGraph,
  initStencil,
  registerNode,
  eventFun,
} from "./config";

export default {
  name: "FlowChart",
  data() {
    return {
      data: dataValue,
      highlighCode: ["11010"], //高亮节点
      graph: null,
      ports: ports,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      // 创建画布
      this.graph = initGraph();
      // 创建左侧组件栏
      this.stencil = initStencil(this.graph);
      document
        .getElementById("stencilContainer")
        .appendChild(this.stencil.container);
      // 注册节点
      registerNode(this.graph, this.stencil);

      eventFun(this.graph);

      // 设置高亮节点
      const dataArr = () => {
        if (this.data.nodes) {
          return {
            nodes: this.data.nodes.map((it) => {
              return {
                ...it,
                highLight: this.highlighCode.indexOf(it.id) > -1,
              };
            }),
            edges: this.data.edges,
          };
        } else if (this.data.cells) {
          return {
            cells: this.data.cells.map((item) => {
              return {
                ...item,
                highLight: this.highlighCode.indexOf(item.id) > -1,
              };
            }),
          };
        } else {
          return {
            cells: [],
          };
        }
      };
      this.graph.fromJSON(dataArr()); // 渲染元素
      // graph.centerContent(); // 居中显示
    },
    exportFun() {
      console.log(this.graph.toJSON());
    },
  },
};
</script>
<style scoped>
.content {
  font-family: sans-serif;
  display: flex;
}
.app-stencil {
  width: 200px;
  height: 100%;
  border: 1px solid #f0f0f0;
  position: relative;
}

.app-content {
  flex: 1;
  height: 100%;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  display: flex;
}
.x6-widget-stencil {
  background-color: #fff;
}
.x6-widget-stencil-title {
  background-color: #fff;
}
.x6-widget-stencil-group-title {
  background-color: #fff !important;
}
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}
.x6-widget-transform > div {
  border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.x6-widget-transform-resize {
  border-radius: 0;
}
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}
.x6-widget-selection-box {
  opacity: 0;
}
</style>
