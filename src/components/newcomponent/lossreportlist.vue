<template>
    <div class='lossreport'>
            <el-table :data='tabledata' border stripe>
                    <el-table-column  prop="chipNo"  label="芯片号" align='center'> </el-table-column>
                     <el-table-column  prop="property"  label="属性" align='center' > </el-table-column>
                      <el-table-column  prop="status"  label="状态" align='center' > </el-table-column>
                      <el-table-column  prop="days"  label="在栏天数" align='center'> </el-table-column>
                    <el-table-column width='80' align='center' label="详情" fixed='right'>
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing" @click='detail(scope.row)'></i>
                        </template>
                   </el-table-column>
            </el-table>
            <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :page-sizes="[6, 12, 18, 24]" :page-size='page.pageSize' :hide-on-single-page='boff'> </el-pagination> 
              <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="680px">
                <Livestock :detailid='detailid'></Livestock>
          </el-dialog>
    </div>
    
</template>
<script>
import {harmlessdetailtable} from '@/api/poverty'
import { Loading } from 'element-ui';
import Livestock from "@/components/newcomponent/livestockdetail"
export default {
     props:['operId'],
     components:{
        Livestock 
     },
     data(){
         return{
              page:{
                total:0,
                currentPage:1,
                pageSize:6,
                pagerCount:5,
            },
            tabledata:[],
            detailbox:false,
            detailid:'',
            boff:false
         }
     },
     created(){
        this.load()
     },
     watch:{
        operId(){
            this.load()
        }
     },
     methods:{
         load(){
            let param={
                 operId:this.operId,
                 current:this.page.currentPage,
                 size:this.page.pageSize
            }
          let loadingInstance = Loading.service({text:'正在加载中。。。'});
          harmlessdetailtable(param).then(res=>{
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
                   this.$msg({msg})
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
           detail(item){
              this.detailid=item.id;
              this.detailbox=true
           }
     }
}
</script>
<style lang="scss" scoped>
.lossreport{
    .el-pagination{
        text-align: center;
        margin-top: 10px;
    }
}
</style>