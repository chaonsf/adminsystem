<template>
              <el-row>
                   <el-col :span='12'>
                         <div class="item">
                              <label>地址:</label>
                            <span>{{detaildata.reg}}</span>
                         </div>
                   </el-col>
                   <el-col :span='12'>
                     <div class="item">
                          <label>户主姓名:</label>
                         <span>{{detaildata.name}}</span>
                     </div>
                   </el-col>
                   <el-col :span='12'>
                     <div class="item">
                          <label>身份证号码:</label>
                        <span>{{detaildata.idCard}}</span>
                      </div>
                   </el-col>
                   <el-col :span='12'>
                      <div class="item">
                           <label>扶贫信息系统编号:</label>
                         <span>{{detaildata.number}}</span>
                      </div>
                   </el-col>
                   <el-col :span='24'>
                      <div class="item">
                           <label>帮扶方式:</label>
                        <span>{{detaildata.patternStr}}
                            (
                                  <span v-for='(item,ind) in detaildata.fosters' :key='item.id'>{{item.variety}}共{{item.count}}只<span v-if='ind!=detaildata.fosters.length-1'>,</span></span>
                            )
                            
                        </span>
                         
                       </div>
                   </el-col>
                   <el-col :span='12'>
                     <div class="item">
                          <label>帮扶总金额:</label>
                         <span>{{detaildata.amount}}</span>
                     </div>
                   </el-col>
                   
                   <el-col :span='24'>

                <div class="item">
                   <label>帮扶证明:</label>
                              <span class='enterprise'>
                                    <ul>
                                         <li  v-for='(item,index) in detailImg' :key='index' @click="showimg2(item)">
                                               <el-image :src='item'></el-image>
                                         </li>
                                    </ul>
                                    
                               </span>
                </div>
                         <el-dialog :visible.sync="dialogVisible2" :modal='false'>
                             <img width="100%" :src="dialogImageUrl2" alt="">
                         </el-dialog>
<!--                           <el-carousel :interval="4000" type="card" height="150px">
                               <el-carousel-item v-for="(item,index) in detailImg" :key="index">
                                <el-image :src='item'></el-image>
                              </el-carousel-item>
                         </el-carousel> -->
                   </el-col>
              </el-row>
</template>
<script>
export default {
     props:['detaildata','detailImg'],
     data(){
         return{
             dialogVisible2:false,
             dialogImageUrl2:''
         }
     },
     methods:{
          showimg2(item){
                this.dialogVisible2=true;
                this.dialogImageUrl2=item
          }
     }
}
</script>
<style lang="scss" scoped>

</style>
