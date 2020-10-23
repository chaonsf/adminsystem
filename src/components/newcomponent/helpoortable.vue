<template>
    <div class="helpoor">
             <el-table :data='tabledata' border >
                    <el-table-column  prop="createTime"  label="提交日期" align='center'> </el-table-column>
                    <el-table-column  prop="name"  label="户主姓名" align='center'> </el-table-column>
                    <el-table-column  prop="phone"  label="联系方式" align='center'> </el-table-column>
                     <el-table-column  prop="patternStr"  label="帮扶方式" align='center'> </el-table-column>
                    <el-table-column  prop="number"  label="扶贫手册编号" align='center'> </el-table-column>
                    <el-table-column width='80' align='center' label="帮扶详情" fixed="right">
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing" @click='querydetail(scope.row)'></i>
                        </template>
                   </el-table-column>
             </el-table>    
             <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :page-sizes="[8, 16, 32, 64]" :page-size='page.pageSize' :hide-on-single-page='boolen'> </el-pagination>  
             <el-dialog :visible.sync='detailbox' title='帮扶详情' class='detail' :modal='false' width="75  0px">
                    <Helpoordetail :detaildata='detaildata' :detailImg='detailImg'  v-if='!boff'></Helpoordetail>
                    <Help v-if='boff' :detailImg='detailImg' :detaildata='detaildata'></Help>
             </el-dialog>
    </div>
</template>
<script>
import { Loading } from 'element-ui';
import {helpoorlist,helpdetail} from '@/api/poverty'
import Helpoordetail from "@/components/newcomponent/helpoordetail"  
import Help from "@/components/newcomponent/helpdetail"
export default {
      props:['id'],
      components:{
         Helpoordetail,Help
      },
      data(){
          return{
              page:{
                total:0,
                currentPage:1,
                pageSize:8,
                pagerCount:5,
            },
            tabledata:[],
            detailbox:false,
            detaildata:[],
            detailImg:[],
            boff:true,
            boolen:false
          }
      }, 
      created(){
         this.load()
      },
      watch:{
          id(){
             this.load()  
          }
      },
      methods:{
          load(){
              let param={
                   farmId:this.id,
                   size:this.page.pageSize,
                   current:this.page.currentPage
              }
            let loadingInstance = Loading.service({text:'正在加载中。。。'});
            helpoorlist(param).then(res=>{
                 loadingInstance.close();
                 let {code,data,msg}=res.data
                 if(code==200){
                        let records=data.records
                        for(let i=0;i<records.length;i++){
                             records[i].createTime=records[i].createTime.substr(0,10)
                        }
                        this.page.total=data.total
                        this.tabledata=records
                        if(this.tabledata.length==0){
                            this.boolen=true
                        }else{
                            this.boolen=false
                        }
                 }else{
                     this.$msg({msg:msg})
                 }
                 
            })
          },
          currentChange(cur){
              this.page.currentPage=cur
              this.load()
          },
          sizeChange(pageSize){
              this.page.pageSize = pageSize;
              this.load()
          },
          querydetail(item){
                if(item.pattern==1){
                    this.boff=false
                }else{
                    this.boff=true
                }
               this.detailbox=true;
                let id=item.id;
               helpdetail(id).then(res=>{
                   let {code,data,msg}=res.data
                   if(code==200){
                     this.detaildata=data;
                     if(this.detaildata.proveUrl){
                      this.detailImg=this.detaildata.proveUrl.split(',')
                    }
                   }else{
                     this.$msg({msg:msg})
                   }
               })

          },
      }
}
</script>
<style lang="scss" scoped>

</style>