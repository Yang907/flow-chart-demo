import { Graph, Shape, Addon } from "@antv/x6";
import RectNode from "./RectNode.vue";
import { register } from "@antv/x6-vue-shape";

export const typeColor = {
  1: "#9bcdff",
  2: "#D8F5C5",
  3: "#c0f2ff",
  4: "#F2E3C4",
};
// 连接桩
export const ports = {
  groups: {
    top: {
      position: {
        name: "absolute",
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    right: {
      position: {
        name: "absolute",
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    bottom: {
      position: {
        name: "absolute",
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    left: {
      position: {
        name: "absolute",
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
  },
  items: [
    {
      group: "top",
      args: {
        x: "50%",
        y: "0%",
      },
    },
    {
      group: "right",
      args: {
        x: "100%",
        y: "50%",
      },
    },
    {
      group: "bottom",
      args: {
        x: "50%",
        y: "100%",
      },
    },
    {
      group: "left",
      args: {
        x: "0%",
        y: "50%",
      },
    },
  ],
};

// 初始化画布
export function initGraph(container) {
  return new Graph({
    container: document.getElementById(container),
    width: "100%",
    height: "100%",
    grid: true,
    panning: {
      enabled: true,
    },
    // 框选
    selecting: {
      enabled: false,
      multiple: true,
      rubberband: true,
      modifiers: ["ctrl", "meta"],
      movable: true,
      showNodeSelectionBox: true,
      pointerEvents: "none",
    },
    // 分组
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox();
        return this.getNodes().filter((node) => {
          // 只有 data.parent 为 true 的节点才是父节点
          const data = node.store.data;
          if (data && data.parent) {
            const targetBBox = node.getBBox();
            return bbox.isIntersectWithRect(targetBBox);
          }
          return false;
        });
      },
    },
    // 调整节点大小
    resizing: {
      enabled: true,
    },
    // snapline: true,
    background: {
      color: "#F2F7FA",
    },
    mousewheel: {
      enabled: true,
      modifiers: ["ctrl", "meta"],
    },
    // interacting: {
    //   edgeLabelMovable: true,
    // },
    interacting: true, //是否启用交互

    connecting: {
      router: {
        name: "manhattan",
        args: {
          excludeShapes: ["custom-rect-text"],
        },
      },
      connector: {
        name: "normal",
        args: {
          radius: 0,
        },
      },
      allowBlank: false,
      snap: {
        radius: 20,
      },
      // 连线初始配置
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 1,
              targetMarker: {
                name: "block",
                width: 6,
                height: 6,
              },
            },
            text: {
              fontSize: 12,
              fill: "#262626",
            },
          },
          zIndex: 10,
        });
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#5F95FF",
            stroke: "#5F95FF",
          },
        },
      },
    },
  });
}

// 初始化组件栏
export function initStencil(graph) {
  const { Stencil } = Addon;
  return new Stencil({
    title: "流程图",
    target: graph,
    stencilGraphWidth: 220,
    stencilGraphHeight: 280,
    collapsable: true,
    groups: [
      {
        title: "流程图组件",
        name: "group1",
        collapsable: false,
        layoutOptions: {
          columns: 2,
          columnWidth: 80,
          rowHeight: 55,
        },
      },
      {
        title: "节点类型",
        name: "group2",
        collapsable: false,
        layoutOptions: {
          columns: 1,
          columnWidth: 180,
          rowHeight: 55,
        },
      },
    ],
    getDropNode: (node) => {
      const { width, height } = node.size();
      if (node.store.data.shape.includes("custom-rect-node")) {
        return node.clone().size(180, 70);
      } else if (node.store.data.shape.includes("custom-rect-group")) {
        return node
          .clone()
          .size(width * 1.5, height * 1.5)
          .attr("text/text", "");
      } else {
        return node.clone().size(width * 1.5, height * 1.5);
      }
    },
  });
}

// 注册节点
export function registerNode(graph, stencil) {
  // 注册节点
  register({
    shape: "custom-rect-node",
    width: 66,
    height: 40,
    zIndex: 10,
    component: RectNode,
    ports: { ...ports },
  });
  Graph.registerNode(
    "custom-rect",
    {
      inherit: "rect",
      width: 66,
      height: 40,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    "custom-polygon",
    {
      inherit: "polygon",
      width: 66,
      height: 40,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
          refPoints: "0,10 10,0 20,10 10,20",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: {
        ...ports,
      },
    },
    true
  );

  Graph.registerNode(
    "custom-circle",
    {
      inherit: "circle",
      width: 45,
      height: 45,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    "custom-image",
    {
      inherit: "rect",
      width: 52,
      height: 52,
      zIndex: 10,
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "image",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          stroke: "#5F95FF",
          fill: "#5F95FF",
        },
        image: {
          width: 26,
          height: 26,
          refX: 13,
          refY: 16,
        },
        label: {
          refX: 3,
          refY: 2,
          textAnchor: "left",
          textVerticalAnchor: "top",
          fontSize: 12,
          fill: "#fff",
        },
      },
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    "custom-rect-dashed",
    {
      inherit: "rect",
      width: 50,
      height: 50,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          strokeDasharray: 3,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    "custom-rect-text",
    {
      inherit: "rect",
      width: 50,
      height: 30,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 0,
          strokeDasharray: 0,
          stroke: "rgba(255,255,255,0.1)",
          fill: "rgba(255,255,255,0.1)",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      // ports: { ...ports },
    },
    true
  );
  Graph.registerNode(
    "custom-rect-group",
    {
      inherit: "rect",
      width: 66,
      height: 40,
      zIndex: 10,
      parent: true,
      attrs: {
        body: {
          strokeWidth: 1,
          strokeDasharray: 3,
          stroke: "#5F95FF",
          fill: "rgba(255,255,255,0)",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
    },
    true
  );

  // 节点类型
  Graph.registerNode(
    "custom-rect-type1",
    {
      inherit: "rect",
      width: 150,
      height: 30,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: typeColor[1],
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );
  Graph.registerNode(
    "custom-rect-type2",
    {
      inherit: "rect",
      width: 150,
      height: 30,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: typeColor[2],
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );
  Graph.registerNode(
    "custom-rect-type3",
    {
      inherit: "rect",
      width: 150,
      height: 30,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: typeColor[3],
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );
  Graph.registerNode(
    "custom-rect-type4",
    {
      inherit: "rect",
      width: 150,
      height: 30,
      zIndex: 10,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: typeColor[4],
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );

  const r1 = graph.createNode({
    shape: "custom-rect",
    label: "开始",
    attrs: {
      body: {
        rx: 25,
        ry: 20,
      },
    },
  });
  const r2 = graph.createNode({
    shape: "custom-rect-node",
    label1: "节点名称",
    label2: "角色名称",
    type: 1,
    textColor1: "#2c3e50",
    textColor2: "#2c3e50",
    attrs: {
      body: {
        rx: 125,
        ry: 20,
      },
    },
  });
  const r3 = graph.createNode({
    shape: "custom-rect",
    attrs: {
      body: {
        rx: 6,
        ry: 6,
      },
    },
    label: "可选过程",
  });
  const r4 = graph.createNode({
    shape: "custom-polygon",
    attrs: {
      body: {
        rx: 125,
        ry: 20,
        refPoints: "0,10 10,0 20,10 10,20",
      },
    },
    label: "决策",
  });
  const r5 = graph.createNode({
    shape: "custom-polygon",
    attrs: {
      body: {
        refPoints: "10,0 40,0 30,20 0,20",
      },
    },
    label: "数据",
  });
  const r6 = graph.createNode({
    shape: "custom-circle",
    label: "连接",
  });
  const r7 = graph.createNode({
    shape: "custom-rect-dashed",
    label: "客户池",
  });

  const r8 = graph.createNode({
    shape: "custom-rect-text",
    label: "文字",
  });

  const r9 = graph.createNode({
    shape: "custom-rect-type1",
    label: "批量保前-批次审批流程",
  });
  const r10 = graph.createNode({
    shape: "custom-rect-type2",
    label: "批量保前-费用与放款落实",
  });
  const r11 = graph.createNode({
    shape: "custom-rect-type3",
    label: "批量保后-批量处理",
  });
  const r12 = graph.createNode({
    shape: "custom-rect-type4",
    label: "批量保后-风险待办",
  });
  const r13 = graph.createNode({
    shape: "custom-rect-group",
    label: "群组",
  });
  stencil.load([r1, r2, r3, r4, r5, r6, r7, r8, r13], "group1");
  stencil.load([r9, r10, r11, r12], "group2");
}

// 事件
export function eventOnFun(graph, callback) {
  // 控制连接桩显示/隐藏
  const showPorts = (ports, show) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  };

  // 点击节点显示删除按钮
  graph.on("node:click", ({ node }) => {
    if (!node.hasTool("button-remove")) {
      node.addTools([
        {
          name: "button-remove",
          args: { x: 10, y: 5 },
        },
      ]);
    } else {
      node.removeTool("button-remove");
    }
  });

  // 鼠标移入展示连接点
  graph.on("node:mouseenter", () => {
    const container = document.getElementById("graphContainer");
    const ports = container.querySelectorAll(".x6-port-body");
    showPorts(ports, true);
  });
  graph.on("node:mouseleave", () => {
    const container = document.getElementById("graphContainer");
    const ports = container.querySelectorAll(".x6-port-body");
    showPorts(ports, false);
  });

  // 鼠标点击连线展示删除/拖动线段工具
  graph.on("edge:click", ({ edge }) => {
    if (!edge.hasTool("button-remove")) {
      edge.addTools([
        {
          name: "button-remove",
          args: {
            distance: "20%",
            offset: 0,
            // 删除回调
            // onClick ({ cell }) {
            // }
          },
        },
      ]);
    } else {
      edge.removeTool("button-remove");
    }
    if (!edge.hasTool("segments")) {
      const xDistance = Math.abs(
        edge.getTargetPoint().x - edge.getSourcePoint().x
      );
      const yDistance = Math.abs(
        edge.getTargetPoint().y - edge.getSourcePoint().y
      );
      const distance = Math.min(xDistance, yDistance);
      edge.addTools([
        {
          name: "segments",
          args: {
            snapRadius: 20,
            precision: distance + 0.5,
            attrs: {
              fill: "#444",
              // distance: "80%",
            },
          },
        },
      ]);
    } else {
      edge.removeTool("segments");
    }
  });

  // 双击编辑节点
  graph.on("node:dblclick", ({ node, e }) => {
    if (
      node.store.data.shape === "custom-rect-node" ||
      node.store.data.shape === "custom-rect-group"
    ) {
      node.prop("isEdit", true);
      callback({
        nodeClicked: true,
        node: node,
        isGroup: node.store.data.shape === "custom-rect-group",
      });
    } else {
      node.addTools({
        name: "node-editor",
        args: {
          event: e,
        },
      });
    }
  });

  // 双击编辑边
  graph.on("edge:dblclick", ({ edge, e }) => {
    edge.addTools({
      name: "edge-editor",
      args: {
        event: e,
      },
    });
  });

  // 监听节点数据改变-编辑节点内容用
  graph.on("node:changed", ({ node }) => {
    // 如果节点id修改了，需要重新渲染一个节点，删除原来的节点
    if (node.store.data.isUpdate) {
      graph.addNode({
        id: node.store.data.id,
        shape: "custom-rect-node",
        x: node.store.data.position.x,
        y: node.store.data.position.y,
        label1: node.store.data.label1,
        label2: node.store.data.label2,
        type: node.store.data.type,
        isEdit: node.store.data.isEdit,
        width: 180,
        height: 70,
      });
      graph.removeNode(node.id);
    }
  });

  // 监听边的右键事件
  graph.on("edge:contextmenu", ({ edge, e }) => {
    callback({ contextmenu: true, edge, e });
  });

  // 监听节点的右键事件
  graph.on("node:contextmenu", ({ node, e }) => {
    if (node.store.data.shape !== "custom-rect-node") {
      callback({ contextmenu: true, node, e });
    }
  });

  // 空白处点击事件
  graph.on("blank:click", () => {
    callback({ blankClick: true });
  });
}

// 清除事件
export function eventOffFun(graph) {
  graph.off("node:click");
  graph.off("node:mouseenter");
  graph.off("node:mouseleave");
  graph.off("edge:click");
  graph.off("node:dblclick");
  graph.off("edge:dblclick");
  graph.off("node:changed");
  graph.off("node:contextmenu");
}
