<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               :page="page"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad"
               >
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}" slot="category">
        <el-tag v-if="row.category==1">{{row.categoryName}}</el-tag>
        <el-tag v-else-if="row.category==2" type="danger">{{row.categoryName}}</el-tag>
        <el-tag v-else-if="row.category==3" type="warning">{{row.categoryName}}</el-tag>
        <el-tag v-else type="info">{{row.categoryName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, remove, update, add, getVariety} from "@/api/breed/variety";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
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
              label: "畜禽类型",
              type: "select",
              row: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=livestock",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              span: 24,
              slot: true,
              prop: "category",
              search: true,
              rules: [{
                required: true,
                message: "请选择畜禽类型",
                trigger: "blur"
              }]
            },
            {
              label: "品种名称",
              prop: "varName",
              row: true,
              span: 24,
              search: true,
              rules: [{
                required: true,
                message: "请输入品种名称",
                trigger: "blur"
              }]
            },
            {
            label: "排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: false,
                message: "请输入排序",
                trigger: "blur",
              }
            ]
          },
          {
            label: "备注说明",
            prop: "remark",
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
          addBtn: this.vaildData(this.permission.menu_add, true),
          viewBtn: this.vaildData(this.permission.menu_view, true),
          delBtn: this.vaildData(this.permission.menu_delete, true),
          editBtn: this.vaildData(this.permission.menu_edit, true)
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
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
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
          getVariety(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
        this.onLoad(this.page);
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
        this.onLoad(this.page);
      },
      onLoad(page, params = {}) {
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
        });
      }
    }
  };
</script>

<style>
</style>
