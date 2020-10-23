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
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template slot="search">
        <el-col :lg="7" :xl="5">
          <el-form-item label="起始日期">
            <el-date-picker
              v-model="query.operTime_dategt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lg="7" :xl="5">
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="query.operTime_datelt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail,getCity } from "@/api/report/operlog";
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
      selectionList: [],
      option: {
        menuWidth: 120,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: false,
        header: false,
        searchMenuSpan: 4,
        column: [
          {
            label: "日志标题",
            prop: "title"
          },
          {
            label: "帐号",
            prop: "account"
          },
          {
            label: "姓名",
            prop: "userName",
            search: true
          },
          {
            label: "IP地址",
            prop: "remoteIp"
          },
          {
            label:'登录地区',
            prop:'city',
          },
          {
            label: "登录时间",
            prop: "operTime",
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
          {
            label: "用户代理",
            prop: "userAgent",
            hide: true,
            type: "textarea",
            span: 24,
            minRows: 2
          }
        ]
      },
      data: []
    };
  },
  created(){
    this.onLoad(this.page)
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        editBtn: false
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
      this.onLoad(this.page)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page)
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
        this.data = data.records.map((item,index)=>{
          if( item.remoteIp == '127.0.0.1' || item.remoteIp.slice(0,3) == '192' ){
            this.$set(item,'city','---')
          }else{
              getCity(item.remoteIp).then(res=>{
              let obj1 = res.data.split('localAddress=')[1].split('"')[1]
              let obj2 = res.data.split('localAddress=')[1].split('"')[3]
              this.$set(item,'city',`${obj2}${obj1}`)
            })
          }
          return item
        })
        // let newData = []
        // for( let i=0;i<data.records.length;i++ ){
        //   if( data.records[i].remoteIp == '127.0.0.1' || data.records[i].remoteIp.slice(0,3) == '192' ){
        //       this.$set(data.records[i],'city',' ')
        //   }else{
        //     getCity(data.records[i].remoteIp).then(res=>{
        //       let obj1 = res.data.split('localAddress=')[1].split('"')[1]
        //       let obj2 = res.data.split('localAddress=')[1].split('"')[3]
        //       this.$set(data.records[i],'city',`${obj2}${obj1}`)
        //     })
        //   }
        //   newData.push(data.records[i])
        // }
        // this.data = newData
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
