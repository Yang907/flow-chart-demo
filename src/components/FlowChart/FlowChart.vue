<template>
  <div class="container" style="width: 100%; height: 100%">
    <div class="content" style="width: 100%; height: 100%">
      <div class="app-stencil" id="stencilContainer" v-show="!onlyRead"></div>
      <div class="app-content" id="graphContainer"></div>
    </div>
    <!-- 工具栏 -->
    <div class="operations" v-show="!onlyRead">
      <div class="operations-item">
        <el-popover
          placement="top-start"
          title="快捷键"
          width="200"
          trigger="hover"
        >
          <div>
            <div>画布缩放：ctrl/meta+鼠标滚轮</div>
            <div>节点内容编辑：鼠标左键双击</div>
            <div>节点大小调整：鼠标左键单击</div>
            <div>多个节点框选：ctrl/meta+鼠标左键拖动</div>
            <div>节点删除：鼠标左键单击节点</div>
            <div>连线颜色修改：鼠标右键</div>
            <div>连线删除/修改：鼠标左键单击连线</div>
            <div>文本颜色修改：鼠标右键</div>
            <div>退出只读模式：ctrl+alt+shift</div>
          </div>
          <div slot="reference">
            <i class="el-icon-more"></i>
            <div class="text">操作说明</div>
          </div>
        </el-popover>
      </div>
      <div class="operations-item" @click="onlyReadFun()">
        <i class="el-icon-view"></i>
        <div class="text">只读模式</div>
      </div>
      <div
        class="operations-item"
        :class="{ active: isSelect }"
        @click="selectFun()"
      >
        <i class="el-icon-crop"></i>
        <div class="text">
          {{ isSelect ? "禁用框选" : "开启框选" }}
        </div>
      </div>
      <div class="operations-item" @click="saveFun()">
        <i class="el-icon-thumb"></i>
        <div class="text">保存数据</div>
      </div>
    </div>

    <!-- 编辑节点弹窗 -->
    <el-dialog
      title="编辑节点"
      :visible.sync="isShowEditCard"
      :close-on-click-modal="false"
      width="30%"
      @close="cancelEdit()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <template v-if="!isGroup">
          <el-form-item label="节点code" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="节点名称" prop="name" class="node_name">
            <el-input v-model="form.name"></el-input>
            <el-color-picker
              v-model="form.textColor1"
              size="small"
              @change="($event) => colorChange($event, 1)"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="角色名称" class="node_name">
            <el-input v-model="form.role"></el-input>
            <el-color-picker
              v-model="form.textColor2"
              size="small"
              @change="($event) => colorChange($event, 2)"
            ></el-color-picker>
          </el-form-item>
        </template>
        <el-form-item label="节点类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择节点类型"
            class="node_select"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="submitEdit('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 右键下拉菜单 -->
    <div class="custom_drop_down" id="custom_drop_down">
      <div class="custom_drop_down_item">
        背景颜色
        <el-color-picker
          v-model="nodeColor"
          size="small"
          @change="($event) => setColor($event, 1)"
        ></el-color-picker>
      </div>
      <div class="custom_drop_down_item">
        文字/连线颜色
        <el-color-picker
          v-model="edgeColor"
          size="small"
          @change="($event) => setColor($event, 2)"
        ></el-color-picker>
      </div>
      <div class="custom_drop_down_item">
        <div>
          字体大小
          <el-input-number
            v-model="fontSize"
            size="mini"
            :precision="0"
            :step="1"
            @change="fontSizeChange"
          ></el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { dataValue } from "./dataConfig";
import {
  initGraph,
  initStencil,
  registerNode,
  eventOnFun,
  eventOffFun,
} from "./config";

export default {
  name: "FlowChart",
  data() {
    return {
      data: [],
      highlightCode: ["12550"], //高亮节点
      highLightNode: [],
      graph: null,
      onlyRead: false,
      isSelect: false,
      isShowEditCard: false,
      form: {
        code: "",
        name: "",
        role: "",
        type: "",
        textColor1: "",
        textColor2: "",
      },
      typeOptions: [
        {
          label: "批量保前-批次审批流程",
          value: 1,
        },
        {
          label: "批量保前-费用与放款落实",
          value: 2,
        },
        {
          label: "批量保后-批量处理",
          value: 3,
        },
        {
          label: "批量保后-风险待办",
          value: 4,
        },
      ],
      rules: {
        code: [{ required: true, message: "请输入节点code", trigger: "blur" }],
        name: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入节点类型", trigger: "blur" }],
      },
      editNodeId: null,
      showContextMenu: false,
      edgeColor: "#A2B1C3", // 边/文本颜色
      nodeColor: "#A2B1C3", // 节点颜色
      curEdge: {},
      isGroup: false,
      fontSize: 12,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.addEventListener("keydown", this.myKeyFun);
    });
  },
  destroyed() {
    window.removeEventListener("keydown", this.myKeyFun);
  },
  methods: {
    init() {
      // 创建画布
      this.graph = initGraph("graphContainer");
      // 创建左侧组件栏
      this.stencil = initStencil(this.graph);
      document
        .getElementById("stencilContainer")
        .appendChild(this.stencil.container);
      // 注册节点
      registerNode(this.graph, this.stencil);

      // 启用事件交互监听
      this.interactiveFun();
      this.isSelect = this.graph.options.selecting.enabled;

      // 设置高亮节点
      const dataArr = (data, highlightCode) => {
        if (data.cells) {
          return {
            cells: data.cells.map((item) => {
              if (highlightCode.indexOf(item.code) > -1) {
                this.highLightNode.push(item);
                this.translateView(item.position.x, item.position.y);
              }
              return {
                ...item,
                highLight: highlightCode.indexOf(item.code) > -1,
              };
            }),
          };
        } else {
          return {
            cells: [],
          };
        }
      };
      this.graph.fromJSON(dataArr(this.data, this.highlightCode)); // 渲染元素
      // graph.centerContent(); // 居中显示

      // 群组显示处理
      const types = this.highLightNode.map((item) => {
        return item.type;
      });
      const parents = this.data.cells.filter((item) => {
        return item.parent;
      });
      parents.forEach((item) => {
        if (types.indexOf(item.type) > -1) {
          const cell = this.graph.getCellById(item.id);
          if (cell) {
            // 修改填充颜色
            cell.attr("body/fill", "rgba(255,255,255,0.6)");
          }
        }
      });
    },
    saveFun() {
      console.log(this.graph.toJSON());
    },

    // 开启/取消框选
    selectFun() {
      if (this.graph) {
        this.graph.options.selecting.enabled =
          !this.graph.options.selecting.enabled;
        this.isSelect = this.graph.options.selecting.enabled;
      }
    },

    // 只读
    onlyReadFun() {
      this.onlyRead = true;
      this.handleContextMenu(0, 0, "none");
      this.graph.getEdges().forEach((edge) => {
        edge.removeTools();
      });
      this.graph.getNodes().forEach((node) => {
        node.prop("onlyRead", true);
        node.removeTools();
      });
      eventOffFun(this.graph);
      if (this.graph) {
        this.graph.options.interacting = false;
        this.graph.options.selecting.enabled = false;
        this.graph.options.resizing.enabled = false;
      }
    },

    // 键盘监听
    myKeyFun(e) {
      // 退出只读模式
      if (this.onlyRead && e.altKey && e.ctrlKey && e.shiftKey) {
        this.onlyRead = false;
        this.interactiveFun();
      }
    },

    // 启动所有交互效果
    interactiveFun() {
      const _this = this;
      eventOnFun(this.graph, function (val) {
        _this.isGroup = val.isGroup;
        // 双击编辑节点
        if (val.nodeClicked) {
          _this.form = {
            code: val.node.store.data.code,
            name: val.node.store.data.label1,
            role: val.node.store.data.label2,
            type: val.node.store.data.type,
            textColor1: val.node.store.data.textColor1,
            textColor2: val.node.store.data.textColor2,
          };
          _this.isShowEditCard = true;
          _this.editNodeId = val.node.id;
        }
        // 右键显示菜单
        if (val.contextmenu) {
          _this.curEdge = val.edge ? val.edge : val.node;
          _this.edgeColor = val.edge
            ? val.edge.attrs.line.stroke
            : val.node.attrs.text.fill;
          _this.nodeColor = val.node ? val.node.attrs.body.fill : "#A2B1C3";
          _this.fontSize = val.node ? val.node.attrs.text.fontSize : 12;
          _this.handleContextMenu(val.e.clientX, val.e.clientY, "block"); // 调用自定义的右键菜单显示方法
        }
        if (val.blankClick) {
          _this.handleContextMenu(0, 0, "none");
        }
      });
      if (this.graph) {
        this.graph.options.interacting = true;
        // this.graph.options.selecting.enabled = true;
        this.graph.options.resizing.enabled = true;
      }
    },

    // 移动画布
    translateView(x, y) {
      const canvasWidth = this.graph.container.offsetWidth;
      const canvasHeight = this.graph.container.offsetHeight;
      const tx = x > canvasWidth ? x - canvasWidth + 200 : 0;
      const ty = y > canvasHeight ? y - canvasHeight + 60 : 0;
      // this.graph.centerPoint(item.position.x, item.position.y);
      this.graph.translate(-tx, -ty);
    },

    submitEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let cell = this.graph.getCellById(this.editNodeId);
          if (cell) {
            cell.prop("code", this.form.code);
            cell.prop("label1", this.form.name);
            cell.prop("label2", this.form.role);
            cell.prop("type", this.form.type);
            cell.prop("textColor1", this.form.textColor1);
            cell.prop("textColor2", this.form.textColor2);
            // 重新设置节点大小
            if (!this.isGroup) {
              this.$nextTick(() => {
                const targetDom = document
                  .getElementById(`flow_node${this.editNodeId}`)
                  .getBoundingClientRect();
                if (targetDom) {
                  cell.setSize({
                    width: targetDom.width,
                    height: targetDom.height,
                  });
                }
              });
            }
            this.isShowEditCard = false;
            this.isGroup = false;
            this.editNodeId = null;
            this.resetForm("form");
          }
        }
      });
    },
    cancelEdit() {
      this.isShowEditCard = false;
      this.resetForm("form");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleContextMenu(x, y, type) {
      this.$nextTick(() => {
        const dropdown = document.getElementById("custom_drop_down");
        dropdown.style.left = `${x}px`;
        dropdown.style.top = `${y + 10}px`;
        dropdown.style.display = type;
      });
    },

    colorChange(value, type) {
      this.form[`textColor${type}`] = value;
    },
    setColor(value, type) {
      const cell = this.graph.getCellById(this.curEdge.id);
      // 然后设置它的样式
      if (cell) {
        // 设置节点颜色
        if (type === 1) {
          cell.attr("body/fill", value || "#EFF4FF");
        } else {
          // 修改边的颜色
          cell.attr("line/stroke", value || "#A2B1C3");
          // 修改文字颜色
          cell.attr("text/fill", value || "#A2B1C3");
        }
      }
      const dropdown = document.getElementById("custom_drop_down");
      dropdown.style.display = `none`;
      this.curEdge = {};
      this.edgeColor = "#A2B1C3";
      this.nodeColor = "#A2B1C3";
    },
    fontSizeChange() {
      const cell = this.graph.getCellById(this.curEdge.id);
      if (cell) {
        // 修改文字颜色
        cell.attr("text/fontSize", this.fontSize || 12);
      }
    },
  },
};
</script>
<style scoped>
.container {
  position: relative;
}
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
.operations {
  border-radius: 8px;
  background-color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  font-size: 14px;
}
.operations-item {
  cursor: pointer;
  padding: 5px 10px;
}
.operations-item .text {
  font-size: 12px;
}
.active {
  background-color: #409eff;
  color: #fff;
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
.node_select {
  width: 100%;
}
.custom_drop_down {
  width: 200px;
  border-radius: 4px;
  background-color: #fff;
  position: absolute;
  display: none;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.custom_drop_down .custom_drop_down_item {
  padding: 8px;
  cursor: pointer;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.custom_drop_down .custom_drop_down_item .el-input-number {
  width: 100px;
}
::v-deep
  .el-dialog
  .el-dialog__body
  .el-form
  .node_name
  .el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
