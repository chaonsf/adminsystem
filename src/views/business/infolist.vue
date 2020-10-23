<template>
    <div class="infolist">
           <el-form :inline="true" class='form'>
                <el-form-item label='资讯类型'>
         <el-select v-model="value" @change='change'>
             <el-option v-for='item in optionarray' :key='item.value' :label='item.label'
              :value='item.value'></el-option>
         </el-select>
                </el-form-item>
                <el-form-item class='large'>
                     <!--  <i class="iconfont icon-jiatianjiakuangxuanduoxuan-8"></i> -->
                     <el-button type="primary" icon="el-icon-plus" @click='add'>新增</el-button>
                </el-form-item>
           </el-form>
           <div class='content'>
                 <el-button type="primary" icon="el-icon-delete" class="mb10" @click='deletelist'>删除</el-button>
                 <el-table  ref="multipleTable" :data="tabledata"  tooltip-effect="dark"  style="width: 100%" @selection-change="handleSelectionChange">
                              <el-table-column  type="selection" width="55"></el-table-column>
                              <el-table-column label="资讯标题" prop='tile' align='center'></el-table-column>
                              <el-table-column label="发布时间" prop='publishTime' align='center'></el-table-column>
                              <el-table-column label='资讯类型' prop='type' align='center'  show-overflow-tooltip></el-table-column>
                             <el-table-column width='160' align='center' label="操作" >
                               <template slot-scope="scope">
                                   <span @click='query(scope.row)'> <i class="iconfont icon-xiangqing option" ></i><span class='option'>查看</span></span>
                                <span @click='edit(scope.row)'><i class="el-icon-edit option"></i><span class='option'>修改</span></span>
                              </template>
                           </el-table-column>
                  </el-table>
                 <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination> 
                 <el-dialog :visible.sync='addbox' :title="addtitle" class="detail" width='880px'>
                       <Editconsole @close='close' :id='id'></Editconsole>
                 </el-dialog>
                 <el-dialog :visible.sync='querybox' title='查看' class='detail' width='880px'>
                         <Querycondole :id='id'></Querycondole>
                 </el-dialog>
           </div>
    </div>
</template>
<script>
import {infotype,infolist,dellist} from  '@/api/poverty'
 import { Loading } from 'element-ui';
 import Editconsole from "@/components/newcomponent/editconsole"
 import Querycondole from "@/components/newcomponent/queryconsole"
 
export default {
       components:{
             Editconsole,Querycondole
       },
       data(){
           return{
              optionarray:[],
              value:' ',
              page:{
                total:0,
                currentPage:1,
                pageSize:10,
                pagerCount:5,
            },
            tabledata:[],
             multipleSelection: [],
             boff:false,
             addtitle:"",
             addbox:false,
             id:'a',
             querybox:false
           }
       },
       created(){
           this.load()
       },
       methods:{
           load(){
               let loadingInstance = Loading.service({text:'正在加载中。。。'});
               infotype().then(res=>{
                      loadingInstance.close();
                      let {code,data,msg}=res.data
                      if(code==200){
                          let arr=[]
                        for(let key in data){
                             arr.push({
                                  value:key,
                                  label:data[key]
                             })
                        }
                        arr.unshift({
                             value:' ',
                             label:'全部'
                        })
                        
                        this.optionarray=arr
                        this.change()
                      }else{
                          this.$msg({
                              msg
                          })
                      }
               })
           },
           change(){
                let param={
                     current:this.page.currentPage,
                     size:this.page.pageSize,
                     type:this.value
                }
                let loadingInstance = Loading.service({text:'正在加载中。。。'});
                infolist(param).then(res=>{
                     loadingInstance.close();
                     let {code,data,msg}=res.data
                     if(code==200){
                        this.tabledata=data.records
                        if(this.tabledata.length==0){
                            this.boff=true
                        }else{
                            this.boff=false
                        }
                        this.page.total=data.total
                     }else{
                         this.$msg({msg})
                     }
                })
           },
         handleSelectionChange(val) {
             this.multipleSelection = val;
        },
        add(){
            this.addbox=true 
            this.id='a'
            this.addtitle='新增'
        },
        currentChange(cur){
              this.page.currentPage=cur
              this.change()
        },
        sizeChange(pageSize){
              this.page.pageSize = pageSize;
              this.change()
        },
        close(){
            this.addbox=false;
            this.change()
        },
        edit(item){
            this.addtitle='修改'
            this.id=item.id
            this.addbox=true
        },
        query(item){
             this.id=item.id
             this.querybox=true
        },
        deletelist(){
            let arr=this.multipleSelection
             if(arr.length==0){
                  this.$msg({msg:"请至少选择一条"})
             }else{
                 this.$popup({
                      text:'是否确定删除？',
                      ok:()=>{
                       let brr=[]
                      arr.forEach(item=>{
                         brr.push(item.id)
                      })
                     let paran={
                         ids:brr.join(",")
                     }
                    dellist(paran).then(res=>{
                         let {code,msg}=res.data
                        if(code==200){
                            this.change()
                        }else{
                           this.$msg({msg})
                       }
                     })
                      }
                 })

             }
        }
     }
}
</script>
<style lang="scss" scoped>
.infolist{
   padding: 10px 20px;
   .form{
       .iconfont{
           font-size: 30px;
           margin-left: 15px;
           cursor: pointer;
       }
   }
   .option{
        color: #409eef;
         cursor: pointer;
         font-size: 14px;
   }
   .el-icon-edit{
       margin-left: 10px;
   }
   span.option{
       margin-left: 5px;
       display: inline-block;
   }
   .mb10{
       margin-bottom: 10px;
   }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
    }
}
</style>