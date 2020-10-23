<template>
    <div class='query'>
  <!--        <el-form :inline="true"  class='form' label-width="82px">
               <el-form-item label="省">
                   <el-select  placeholder="省" v-model="provinceId" @change='provinceChange'>
                     <el-option v-for='item in province' :key='item.zoneCode' :value='item.zoneCode' :label='item.zoneName'></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label='市'>
                            <el-select  placeholder="市" v-model="cityId" @change="cityChange">
                                 <el-option v-for="item in city" :key='item.zoneCode'
                                  :value='item.zoneCode' :label="item.zoneName"
                                 ></el-option>
                            </el-select>                
                </el-form-item>
                <el-form-item label='县'>
                            <el-select  placeholder="县" v-model="countyId">
                                 <el-option v-for='item in county' :key='item.zoneCode'
                                  :value='item.zoneCode' :label="item.zoneName"
                                 ></el-option>
                            </el-select>                      
                </el-form-item>
                <el-form-item label='关键词'>
                        <el-input v-model='keyword' placeholder="请输入关键词"></el-input>                 
                </el-form-item>
                <el-form-item>
                      <el-button type="primary" @click='query'>查询</el-button>               
                </el-form-item>
         </el-form> -->
         <Query :time='false' @search='query'>

         </Query>
         <div>
              <el-table :data='tabledata' border stripe>
                     <el-table-column  prop="province"  label="省" align='center' width='80'> </el-table-column>
                     <el-table-column  prop="city"  label="市" align='center' width='80'> </el-table-column>
                      <el-table-column  prop="county"  label="县/区" align='center' width='80'> </el-table-column>
                      <el-table-column  prop="county"  label="养殖场名称" align='center'> </el-table-column>
                       <el-table-column  prop="county"  label="场主" align='center'> </el-table-column>
                        <el-table-column  prop="county"  label="地址" align='center'> </el-table-column>
                         <el-table-column  prop="county"  label="联系方式" align='center'> </el-table-column>
                       <el-table-column  prop="county"  label="订单金额" align='center'> </el-table-column>
                        <el-table-column  prop="county"  label="收款方" align='center'> </el-table-column>
                         <el-table-column  prop="county"  label="剩余授信" align='center'> </el-table-column>
                      <el-table-column width='80' align='center' label="订单详情" fixed='right'>
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing"></i>
                        </template>
                     </el-table-column>
                    <el-table-column width='80' align='center' label="借款详情" fixed='right'>
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing"></i>
                        </template>
                   </el-table-column>
              </el-table>
         </div>
    </div>
</template>
<script>
import {provinceAndcity,zone} from '@/api/poverty'
import Query from "@/components/newcomponent/queryhead"
export default {
     components:{
        Query
     },
      data(){
          return{
              province:[],
              provinceId:'',
              city:[],
              cityId:'',
              county:[],
              countyId:'',
              tabledata:[],
              keyword:''
              
          }
      },
      created(){
          this.query()
      },
      methods:{
          query(){
               
          }
      }
}
</script>
<style lang="scss" scoped>
.query{
   padding: 10px 20px;
}
</style>