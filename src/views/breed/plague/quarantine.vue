<template>
  <basic-container>
      <div style="float: left;margin: 0 20px 15px 10px;">
        <span>基地：</span>
        <el-select
            v-model="selectInfo.farmId"
            size="small"
            filterable
            collapse-tags
            placeholder="请选择"
            @change="farmChange(selectInfo.farmId)"
        >
            <el-option
                v-for="item in farms"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>
      </div>
      <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      @row-del="RowDelete"
      :page="page"
      @current-change="CurrentChange"
      @row-update="update"
      >
      <template slot="menuLeft">
        <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            plain
            @click="handleDelete"
            >删 除</el-button
        >
      </template>
      <!-- <template slot-scope="{row}"
                slot="status">
        <el-tag :style="row.status==='已检疫'?style1:style2">{{row.status}}</el-tag>
      </template> -->
    </avue-crud>   
  </basic-container>
</template>

<script>
  import {getFarms} from '@/api/farm/diagram.js'
  export default {
    data(){
      return {
        farms:[],
          selectInfo:{
              farmId:'金山农庄壹号餐桌',
          },
        // style1:{color:'blue'},
        // style2:{color:'red'},
        page:{
          pageSize:10,
          total:0,
          currentPage:1,
          pageSizes:[10,20,30,40,50]
        },
        option:{
          index:true,
          column:[
            {
              label:'基地',
              prop:'name'
            }, 
            {
              label:'棚舍',
              prop:'sukkah'
            },
            {
              label:'品种',
              prop:'kind'
            },
            {
              label:'是否检疫',
              prop:'flag',
              // slot:true
            },
            {
              label:'检疫人员',
              prop:'staff'
            },
            {
              label:'检疫时间',
              prop:'time'
            }
          ],
        },
        data:[]
      }
    },
    created(){
      getFarms().then(res=>{
          const newData = res.data
          for( let i=0;i<newData.length;i++ ){
              this.farms.push({label:newData[i].name,value:newData[i].code})
          }
      });
    },
    methods:{
      handleDelete(){
        console.log('删除')
      },
      farmChange(farmId){
            // this.query.farmId = farmId
            // this.onLoad(this.page)
            console.log(farmId)
      },
      change(form){
        console.log(form)
      },
      RowDelete(){
        console.log('点击了删除按钮')
      },
      CurrentChange(){
        console.log('切换了页面')
      },
      update(row, index, loading, done){
        loading()
      },
    },
  }
</script>

<style>
</style>
