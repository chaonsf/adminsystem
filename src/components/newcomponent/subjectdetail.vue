<template>
    <div class='subject'>
           <el-table :data='tabledata' border stripe>
                    <el-table-column  prop="chipNo"  label="芯片号" align='center'> </el-table-column>
                    <el-table-column  prop="property"  label="属性" align='center' > </el-table-column>
                    <el-table-column  prop="days"  label="日龄" align='center' > </el-table-column>
                    <el-table-column width='80' align='center' label="详情">
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing"  @click='querydetail(scope.row)'></i>
                        </template>
                   </el-table-column>
              </el-table>
        <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :page-sizes="page.pages" :page-size='page.pageSize' :hide-on-single-page='boff'> </el-pagination>  
          <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="680px">
                <Livestock :detailid='detailid'></Livestock>
          </el-dialog>
    </div>
</template>
<script>
import { Loading } from 'element-ui';
import {subjectlist} from '@/api/poverty'
import Livestock from "@/components/newcomponent/livestockdetail"
export default {
     props:['insId'],
     components:{
        Livestock
     },
     data(){
         return{
             tabledata:[],
              page:{
                total:0,
                currentPage:1,
                pageSize:7,
                pagerCount:5,
                pages:['7','14','21','28']
            },
            detailid:'',
            detailbox:false
         }
     },
     created(){
         this.tableinit()
     },
     watch:{
        insId(){
            this.tableinit()
        } 
     },
     methods:{
         tableinit(){
              let param={
                  insId:this.insId,
                  current:this.page.currentPage,
                  size:this.page.pageSize
              }
              let loadingInstance = Loading.service({text:'正在加载中。。。'});
              subjectlist(param).then(res=>{
                  loadingInstance.close();
                  let {code,data,msg}=res.data
                  if(code==200){
                      this.tabledata=data.records
                      this.page.total=data.total
                      if(this.tabledata.length==0){
                            this.boff=true
                      }else{
                          this.boff=false
                      }
                  }else{
                     this.$msg({
                         msg:msg
                     })
                  }
              })
         },
          currentChange(cur){
              this.page.currentPage=cur
              this.tableinit()
          },
          sizeChange(pageSize){
              this.page.pageSize = pageSize;
              this.tableinit()
          },
          querydetail(item){
              this.detailbox=true
              this.detailid=item.id
          }
     }
}
</script>
<style lang="scss" scoped>
.subject{
    .iconfont{
        color: #409eef;
        cursor: pointer;
    }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
    }
}
</style>