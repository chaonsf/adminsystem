<template>
  <el-dialog :visible.sync='visible' @close='onClose' :append-to-body=true width="80%" :fullscreen=true>
    <basic-container>
      <avue-crud
        :option="option"
        :data="data"
        :page="page"
        v-model="form"
        :permission="permissionList"
        :before-open="beforeOpen"
        @search-change="searchChange"
        @search-reset="searchReset"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @on-load="onLoad"
        @upload-after="uploadAfter"
      >
      </avue-crud>
    </basic-container>
    <div slot="footer" class="dialog-footer" center=true>
    <el-button size="small" @click="onClose">取 消</el-button>
    <el-button type="primary" size="small" @click="onClose(selectionList)">确 定</el-button>
  </div>
  </el-dialog>
</template> 

<script>
import { getList} from "@/api/breed/livestock.js";
import { mapGetters } from "vuex";

export default {
  props: {
    visible: false,
    lsList: {
      type: Array,
    },  // 已选择的畜禽
  },
  data() {
    return {
      form: {},
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: this.lsList,
      option: {
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        searchMenuSpan: 4,
        column: [
          {
            label: "批次号",
            prop: "batchno",
            hide: "true",
            addDisplay: false,
            disabled: true,
            row: true
          },
          {
            label: "畜禽id",
            prop: "liveStockId",
            type: "number",
            hide: "true",
            display: false,
            disabled: true
          },
          { prop: "lsoperId", hide: "true", display: false, disabled: true },
          {
            prop: "lsoperDetailId",
            hide: "true",
            display: false,
            disabled: true
          },

          {
            label: "芯片号",
            prop: "chipNo",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入芯片号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "条码",
            prop: "barcode",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入条码",
                trigger: "blur"
              }
            ]
          },
          {
            label: "基地",
            prop: "farmId",
            type: "select",
            props: {
              label: "name",
              value: "code"
            },
            cascaderItem: ["sukkId"],
            search: true,
            dicUrl: "/api/mkx-farm/farm/getFarms",
            rules: [
              {
                required: true,
                message: "请选择基地",
                trigger: "blur"
              }
            ]
          },
          {
            label: "棚舍",
            prop: "sukkId",
            type: "select",
            props: {
              label: "name",
              value: "code"
            },
            search: true,
            dicFlag: false,
            dicUrl: "/api/mkx-sukkah/sukkah/getSukkahs/{{key}}",
            rules: [
              {
                required: true,
                message: "请选择棚舍",
                trigger: "blur"
              }
            ]
          },
          {
            label: "昵称",
            prop: "nickName",
            hide: true,

            rules: [
              {
                required: false,
                message: "请输入昵称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "品种",
            prop: "varietyId",
            type: "select",
            dicUrl: "/api/breed/variety/getVarieties",
            props: {
              label: "name",
              value: "code"
            },
            rules: [
              {
                required: true,
                message: "请选择品种",
                trigger: "blur"
              }
            ]
          },
          {
            label: "性别",
            prop: "sex",
            type: "select",
            dicData: [
              {
                label: "公",
                value: 1
              },
              {
                label: "母",
                value: 0
              }
            ],
            rules: [
              {
                required: true,
                message: "请选择性别",
                trigger: "blur"
              }
            ]
          },
          {
            label: "重量(斤)",
            prop: "weight",
            type: "number",
            rules: [
              {
                required: false,
                message: "请输入重量",
                trigger: "blur"
              }
            ]
          },
          {
            label: "来源",
            prop: "source",
            type: "select",
            hide: true,
            dicData: [
              {
                label: "购入",
                value: 1
              },
              {
                label: "自繁",
                value: 0
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入来源",
                trigger: "blur"
              }
            ]
          },
          {
            label: "入栏时间",
            prop: "lairageTime",
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            rules: [
              {
                required: true,
                message: "请选择入栏时间",
                trigger: "blur"
              }
            ]
          },

          {
            label: "累计步数",
            prop: "stepCount",
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入累计步数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "备注",
            prop: "remark",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入备注",
                trigger: "blur"
              }
            ]
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入排序",
                trigger: "blur"
              }
            ]
          },
          {
            label: "图片",
            prop: "photourl",
            type: "upload",
            hide: true,
            listType: "picture-card",
            canvasOption: {
              text: "avue",
              ratio: 0.1
            },
            oss: "ali",
            loadText: "附件上传中，请稍等",
            span: 24,
            tip: "只能上传jpg/png文件，且不超过500kb"
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: this.vaildData(this.permission.menu_view, true),
        delBtn: false,
        editBtn: false
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.liveStockId);
      });
      return ids.join(",");
    }
  },
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    beforeOpen(done, type) {
      // if (["edit", "view"].includes(type)) {
      //   getVariety(this.form.id).then(res => {
      //     this.form = res.data.data;
      //   });
      // }
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page);
    },
    onLoad(page, params = {}) {
      // 仅查询可以操作的畜禽
      this.query.canOper = true
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
      });
    },
    uploadAfter(res, done) {
      console.log(res);
      done();
    },
    onClose() {
      this.$emit('dialogClose', this.selectionList)
    },
    
  }
};
</script>

<style>
</style>
   