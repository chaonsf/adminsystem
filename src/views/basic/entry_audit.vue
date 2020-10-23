<template>
  <basic-container>
    <el-dialog
      title="用户审核"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-form>
        <el-form-item label="用户姓名：" label-width="120px" v-show="flag">
          <el-input v-model="name" placeholder="请输入姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户身份证：" label-width="120px" v-show="flag">
          <el-input v-model="idcard" placeholder="请输入身份证号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态：" label-width="120px">
          <el-select v-model="value" clearable placeholder="请选择状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="examine">确 定</el-button>
      </span>
    </el-dialog>
      <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page="page"
      @current-change="CurrentChange"
      @size-change="sizeChange"
      @search-change="searchChange"
      >
       <template slot-scope="{row}"
                slot="idImage1">
        <img :src="row.idImage1" alt="" width="100" height @click="openPreview(row.idImage1)">
      </template>
       <template slot-scope="{row}"
                slot="idImage2">
        <img :src="row.idImage2" alt="" width="100" height @click="openPreview(row.idImage2)">
      </template>
      <template slot-scope="{row}"
                slot="authorizeImage">
        <img :src="row.authorizeImage" alt="" width="100" height @click="openPreview(row.authorizeImage)">
      </template>
      <template slot-scope="{row}"
                slot="status">
        <el-tag :style="row.status=='待审核'?color1:(row.status=='审核通过'?color2:color3)">{{row.status}}</el-tag> 
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-edit-outline" :size="size" :type="type" @click="openDialog(row.id,row.roleName)" v-show="row.status=='待审核'?true:false">审核</el-button>
      </template>
    </avue-crud>   
  </basic-container>
</template>

<script>
import { getEntryAudit,putEntryAudit } from "@/api/basic/farm.js";
  export default { 
    data(){                                                                                                                                                                                                                                                                                                                                                      
      return {
        flag:true,
        roleName:'',
        name:'',
        idcard:'',
        img:[],
        options: [{
          value: 2,
          label: '审核通过'
        }, {
          value: 3,
          label: '审核不通过'
        }],
        value: '',
        dialogVisible: false,
        color1:'color:blue',
        color2:'color:green',
        color3:'color:red',
        enterAuditParams:{
          limit:5,
          offset:1,
          name:'',
          roleName:''
        },
        page:{
          pageSize:5, 
          total:100,
          currentPage:1,
          pageSizes:[5,10,20,30,40]
        },
        option:{
          addBtn:false,
          index:true,
          editBtn:false,
          delBtn:false,
          searchMenuSpan: 4,
          menuWidth:120,
          column:[
             {
              label:'手机号',
              prop:'mobile',
            },     
            {
              label:'组织类型',
              prop:'roleName',
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入组织类型",
                  trigger: "blur"
                }
              ]
            },      
            { 
              label:'申请时间',
              prop:'createTime',
              width:140
            },       
            
             {
              label:'姓名',
              prop:'name',
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入名称",
                  trigger: "blur"
                }
              ]
            },
            // {
            //   label:'身份证号',
            //   prop:'idcard',
            //   width:140,
            // },
            {
              label:'身份证正面',
              prop:'idImage1',
              slot:true
            },
            {
              label:'身份证反面',
              prop:'idImage2',
              slot:true
            },
            {
              label:'组织授权图片',
              prop:'authorizeImage',
              slot:true
            },
            {
              label:'审核人',
              prop:'updateName'
            },
            {
              label:'审核时间',
              prop:'updateTime',
              width:140
            },
            {
              label:"状态",
              prop:'status',
              slot:true
            }
          ],
        },
        data:[],
        userId:''
      }
    },
    methods:{
      openPreview(idImage1){
        this.img = [{thumbUrl:idImage1,url:idImage1}]
        this.$ImagePreview(this.img, 0);
      },
      sizeChange(val){
        this.page.currentPage = 1
        this.page.pageSize = val
        this.enterAuditParams.limit = val
        this.enterAuditParams.offset = 1
        this.getEntryAudit()
      }, 
      CurrentChange(currentPage){
        this.enterAuditParams.offset = currentPage
        this.getEntryAudit()
      },
      searchChange(params,done){
        const {name,roleName} = JSON.parse(JSON.stringify(params))
        this.enterAuditParams.name = name
        this.enterAuditParams.roleName = roleName
        this.getEntryAudit()
        done()
      },
      getEntryAudit(){
        getEntryAudit(this.enterAuditParams).then(res=>{
          this.data = res.data.data.list
          this.page.total = res.data.data.total
          this.data.map((current, index) => {
          switch (current.status) {   
            case 1: current.status = '待审核'
              break
            case 2: current.status = '审核通过'
              break
            case 3: current.status = '审核不通过'
              break
            }
          })
        })
      },
      examine(){
        const id = this.value
        const userId = this.userId
        const name = this.name
        const idcard = this.idcard
        if( this.roleName == '普通用户' ){
          putEntryAudit(id,userId,name,idcard).then(res=>{
            if( res.data.code == 200 ){
              this.$message.success('审核成功')
              this.getEntryAudit()
            }else{
              this.$message.error(res.data.msg)
            }
          })
          this.dialogVisible = false
        }else{
          if( name == '' || idcard == '' || id == '' ){
            this.$message.error('信息不能为空')
          }else{
            putEntryAudit(id,userId,name,idcard).then(res=>{
            if( res.data.code == 200 ){
              this.$message.success('审核成功')
              this.getEntryAudit()
            }else{
              this.$message.error(res.data.msg)
            }
          })
          this.dialogVisible = false
          }
        }
      },
      openDialog(id,roleName){
        this.dialogVisible = true
        this.userId = id
        this.roleName = roleName
        if( roleName == '普通用户' ){
          this.flag = false
        }else{
          this.flag = true
        }
      }
    },
    created(){
      this.getEntryAudit()
    },
  }
</script>

<style>
</style>
