<template>
    <basic-container>
      <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page="page"
      @size-change="sizeChange"
      @current-change="CurrentChange"
      @search-change="searchChange"
      >
       <template slot-scope="{row}"
                slot="farmImage">
        <img :src="row.farmImage" alt="" width="100%" height @click="openPreview(row.farmImage)">
      </template>
       <template slot-scope="{row}"
                slot="contractImage">
        <img :src="row.contractImage" alt="" width="100%" height @click="openPreview(row.contractImage)">
      </template>
      <template slot-scope="{row}"
                slot="subsidyImage">
        <img :src="row.subsidyImage" alt="" width="100%" height @click="openPreview(row.subsidyImage)">
      </template>
    </avue-crud>   
    </basic-container>
  </template>
  
<script>
import { getLocateList } from "@/api/basic/farm.js";
export default {
    data(){
        return {
        enterInfoParams:{
            limit:10,
            offset:1,
            name:'',
            phone:''
        },
        img:[],
        page:{
            pageSize:10,
            total:10,
            currentPage:1,
            pageSizes:[10,20,30,40,50]
        },
        option:{
        addBtn:false,
        border: true,
        editBtn:false,
        delBtn:false,
        viewBtn:true,
        searchMenuSpan:4,
        index:true,
        menuWidth:120,
        column:[
        {
            label:'姓名',
            prop:'name',
            search:true,
            rules: [
            {
                required: true,
                message: "请输入基地名称",
                trigger: "blur"
            }
            ]
        },
        {
            label:'手机号',
            prop:'phone',
            search: true,
            width:100,
            rules: [
            {
                required: true,
                message: "请输入基地名称",
                trigger: "blur"
            }
            ]
        },
        {
            label:'身份证号',
            prop:'idcard',
            width:140,
        },
        {
            label:'籍贯',
            prop:'nativePlace',
            width:140,
        },
        {
            label:'主营业务',
            prop:'mainBusiness',
        },
        {
            label:'经营所在地',
            prop:'manaAddress',
            width:100
        },
        {
            label:'家庭住址',
            prop:'homeAddress'
        },
        {
            label:'经营年限',
            prop:'ageLimit'
        },
        {
            label:'经营面积',
            prop:'manaArea',
            width:100
        },
        {
            label:'是否购买保险',
            prop:'insurance',
            width:100
        },
        {
            label:'经营场地照片',
            prop:'farmImage',
            slot:true,
            width:100,
            listType: 'picture-img',
            type: 'upload',
            propsHttp: {
                url: 'data'
            },
        },
        {
            label:'承包合同照片',
            prop:'contractImage',
            slot:true,
            width:100,
            listType: 'picture-img',
            type: 'upload',
            propsHttp: {
                url: 'data'
            },
        },
        {
            label:'当前养殖规模',
            prop:'currScale',
            width:120
        },
        {
            label:'意向养殖品种',
            prop:'inteVariety',
            width:120
        },
        {
            label:'意向养殖规模',
            prop:'inteScale',
            width:120
        },
        {
            label:'家庭年收入',
            prop:'familyIncome',
            width:100
        },
        {
            label:'家庭总资产',
            prop:'totalAssets',
            width:100
        },
        {
            label:'可提供担保',
            prop:'guarantee',
            width:100
        },
        {
            label:'国家补贴证明照片',
            prop:'subsidyImage',
            slot:true,
            width:120,
            listType: 'picture-img',
            type: 'upload',
            propsHttp: {
                url: 'data'
            },
        },
        ]
        },
        data:[]
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
        this.enterInfoParams.limit = val
        this.enterInfoParams.offset = 1
        this.getLocateList()
      }, 
    CurrentChange(currentPage){
        this.enterInfoParams.offset = currentPage
        this.getEntryAudit()
    },
    searchChange(params,done){
        const {name,phone} = JSON.parse(JSON.stringify(params))
        this.enterInfoParams.name = name
        this.enterInfoParams.phone = phone
        this.getLocateList()
        done()
    },
    getLocateList(){
        getLocateList(this.enterInfoParams).then(res=>{
            console.log(res)
            this.data = res.data.data.list
            this.page.total = res.data.data.total
        })
    }
    },
    created(){
        this.getLocateList()
    }
}
  </script>
  
  <style>

  </style>
  