<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad">
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          v-if="true"
          @click="handleDelete"
        >删 除</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from "@/api/basic/sukkah";
import { getFarmTree } from "@/api/basic/farm";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      init: {
        farmTree: []
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        searchMenuSpan: 4,
        column: [
          {
            label: "所属基地",
            prop: "farmId",
            type: "tree",
            dicData: [],
            props: {
              label: "title"
            },
            span: 24,
            search: true,
            rules: [
              {
                required: true,
                message: "请选择所属基地",
                trigger: "click"
              }
            ]
          },
          {
            label: "棚舍编号",
            prop: "sukkNo",
            rules: [
              {
                required: true,
                message: "请输入棚舍编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "棚舍名称",
            prop: "sukkName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入棚舍名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "面积(米²)",
            prop: "area",
            type: "number",
            hide: true
          },
          {
            label: "范围",
            prop: "range",
            hide: true
          },
          {
            label: "位置",
            prop: "address",
            hide: true
          },
          {
            label: "结构类型",
            prop: "attribute",
            type: "select",
            dicData: [
              {
                label: "开敞式",
                value: "开敞式"
              },
              {
                label: "有窗式",
                value: "有窗式"
              },
              {
                label: "密闭式",
                value: "密闭式"
              },
              {
                label: "其他",
                value: "其他"
              }
            ],
            rules: [
              {
                required: false,
                message: "请选择结构类型",
                trigger: "blur"
              }
            ]
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }
            ]
          },
          {
            label: "备注",
            prop: "remark"
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
        addBtn: this.vaildData(this.permission.sukkah_add, true),
        viewBtn: this.vaildData(this.permission.sukkah_view, true),
        delBtn: this.vaildData(this.permission.sukkah_delete, true),
        editBtn: this.vaildData(this.permission.sukkah_edit, true)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowSave(row, loading, done) {
      add(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },
    rowUpdate(row, index, loading, done) {
      update(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
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
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
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
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
      getFarmTree(this.form.tenantId).then(res => {
        // const index = this.$refs.crud.findColumnIndex("farmId");
        // this.option.column[index].dicData = res.data.data;

        const column = this.findObject(this.option.column, "farmId");
          column.dicData = res.data.data;
      });
    }
  }
};
</script>

<style>
</style>
