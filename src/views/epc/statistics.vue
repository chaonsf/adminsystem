<template>
    <div class='ststist'>
          <Query @search='submit' @clear='clear'></Query>
          <div class='content'>
                <el-row :gutter='30'>
                    <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='12'>
                            <el-table border  :data="tableData" :span-method="objectSpanMethod">
                                <el-table-column label='禽畜种类' prop='type' width='80'></el-table-column>
                                 <el-table-column label='品类' prop='category' width='80'></el-table-column>
                                  <el-table-column label='品种' prop='variety'></el-table-column>
                                  <el-table-column label='检疫合格数' prop='quantity' width='140'></el-table-column>
                                   <el-table-column label='检疫不合格数' prop='noquantity' width='140'></el-table-column>
                            </el-table>

                    </el-col>
                    <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='12'>
                          <el-table border  :data="vaccinesdata">
                              <el-table-column label='疫苗名称' prop='name'></el-table-column>
                              <el-table-column label='免疫数' prop='Immune' width='100'></el-table-column>
                               <el-table-column label='检测合格数' prop='qualified' width='100'></el-table-column>
                               <el-table-column label='检测不合格数' prop='unqualified' width='150'></el-table-column>
                          </el-table>
                    </el-col>
                    <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='12'>
                           <div class='pie' id='statist'></div>
                    </el-col>
                    <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='12'>
                           <div class='pie' id='statist1'></div>
                    </el-col>
                </el-row>
          </div>
          <div class='bh'></div>
    </div>
</template>
<script>
import Query from '@/components/epidemic/querycomponent'
import echarts from 'echarts'
export default {
    components:{
         Query
    },
    data(){
        return{
             tableData:[
                 {type:'禽类',category:'鸡',variety:'F9金蝉土鸡',quantity:3782,noquantity:35},
                 {type:'禽类',category:'鸡',variety:'白羽鸡',quantity:4882,noquantity:26},
                 {type:'禽类',category:'鸡',variety:'乌骨鸡',quantity:235,noquantity:16},
                 {type:'禽类',category:'鸡',variety:'珍珠鸡',quantity:150,noquantity:10},
                  {type:'禽类',category:'鸡',variety:'芦花鸡',quantity:2550,noquantity:26},
                   {type:'禽类',category:'鸡',variety:'跑山鸡',quantity:3450,noquantity:34},
             ],
             spanArr:[],
             catearr:[],
             vaccinesdata:[
                  {name:'禽流感疫苗',Immune:'2000',qualified:'1950',unqualified:'50'},
                  {name:'鸡新城疫疫苗',Immune:'1000',qualified:'940',unqualified:'60'},
                  {name:'鸡痘疫苗',Immune:'500',qualified:'480',unqualified:'20'},
                  {name:'马立克氏病疫苗',Immune:'800',qualified:'770',unqualified:'30'},
                  {name:'鸡传染性支气管炎疫苗',Immune:'1800',qualified:'1760',unqualified:'40'},
                  {name:'禽霍乱菌苗',Immune:'2700',qualified:'2674',unqualified:'26'},
             ], 

        }
    },
    created() {
         this.getOrderNumber()
    },
    mounted() {
        this.linechart1()
        this.linechart2()
    },
    methods:{
        submit(param){
           console.log("param:",param)
        },
        clear(){

        },
        getOrderNumber(){
            let data=this.tableData;
                for(let i=0;i<data.length;i++){
                    if(i===0){
                         this.spanArr.push(1)
                         this.pos=0
                         //第二行
                         this.catearr.push(1)
                         this.cate=0
                    }else{
                         if (data[i].type === data[i - 1].type){
                                    this.spanArr[this.pos] += 1;
                                   this.spanArr.push(0);

                         }else{
                               this.spanArr.push(1);
                              this.pos = i;

                         }
                         if(data[i].category===data[i-1].category){
                              this.catearr[this.cate]+=1
                              this.catearr.push(0)
                         }else{
                             this.catearr.push(1)
                             this.cate=i
                         }
                    }
                }
               
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }){
                   if (columnIndex === 0) {
                         const _row = this.spanArr[rowIndex];
                         const _col = _row > 0 ? 1 : 0;
                        return {
                             rowspan: _row,
                              colspan: _col
                        }
                   }
                   if(columnIndex===1){
                       const _row = this.catearr[rowIndex];
                        const _col = _row > 0 ? 1 : 0;
                        return{
                            rowspan: _row,
                             colspan: _col
                        }
                   }
            
        },
        linechart1(){
             let chartup=echarts.init(document.getElementById('statist'));
             let name=[];
             let quantity=[];
             let unqualified=[]
             let tabledata=this.tableData;
             for(let i=0;i<tabledata.length;i++){
                  name.push(tabledata[i].variety)
                  quantity.push(tabledata[i].quantity)
                  unqualified.push(tabledata[i].noquantity)
             }
             let option={
                  legend:{
                      data:['检疫合格数','检疫不合格数']
                  },
            tooltip: {
             trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
               }
             }
          },
              xAxis: [
                 {
                     type: 'category',
                       data:name,
                         axisPointer: {
                              type: 'shadow',
                        }
                }
              ],
              yAxis: {},

              series:[
                  {
                      name:'检疫合格数',
                       type: 'bar',
                       data:quantity,
                       barWidth:30,
                       itemStyle:{
                           normal:{
                               color:'#5195d2'
                           }
                       }
                  },
                  {
                      name:'检疫不合格数',
                      type:'line',
                      data:unqualified,
                       itemStyle:{
                           normal:{
                               color:'#ef8943'
                           }
                       }
                  }
              ]
             }
             chartup.setOption(option)
        },
        linechart2(){
             let chartup=echarts.init(document.getElementById('statist1'));
             let names=[];
             let quantity=[];
             let unqualified=[]
             let tabledata=this.vaccinesdata;
             for(let i=0;i<tabledata.length;i++){
                  names.push(tabledata[i].name)
                  quantity.push(tabledata[i].qualified)
                  unqualified.push(tabledata[i].unqualified)
             }
             let option={
                  legend:{
                      data:['监测合格数','监测不合格数']
                  },
                tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
              xAxis: [
                 {
                     type: 'category',
                       data:names,
                         axisPointer: {
                              type: 'shadow',
                        },
                     axisLabel:{
                         interval:0,
                         rotate:20
                     }
                }
              ],
              yAxis: {},

              series:[
                  {
                      name:'监测合格数',
                       type: 'bar',
                       data:quantity,
                       barWidth:30,
                       itemStyle:{
                           normal:{
                               color:'#5195d2'
                           }
                       }
                  },
                  {
                      name:'监测不合格数',
                      type:'line',
                      data:unqualified,
                       itemStyle:{
                           normal:{
                               color:'#ef8943'
                           }
                       }
                  }
              ]
             }
             chartup.setOption(option)
        },
        
    }
}
</script>
<style lang="scss" scoped>
.ststist{
    padding: 10px 20px;
    .pie{
        height: 450px;
        width: 100%;
    }
    .bh{
        height: 50px;
    }
}
</style>