<template>
    <div class='count'> 
          <div class='item'>
               <label>理赔申请人:</label>
               <span>{{provedata.farmName}}</span>
          </div>
          <div class='item'>
               <label>联系电话:</label>
               <span>{{provedata.phone}}</span>
          </div>
          <div class='item'>
               <label>出险银行卡号:</label>
               <span>{{provedata.bankCard}}</span>
          </div>
          <div class='item'>
               <label>损失情况描述:</label>
               <span>{{provedata.description}}</span>
          </div>
          <p class="tt">（一）保险单正本及分户清单；</p>
          <p>（二）事故证明书；</p>
          <p>（三）损失清单：</p>
          <p>（四）耳号标识：</p>
          <p>（五）灾害发生时间、地点的书面情况以及其他必要的有效单证材料；</p>
          <p>（六）政府畜牧防疫监营管理机构出具的真实合法的诊断证明、治疗证明、防疫证明、死亡原因证明：</p>
          <p>（七）已对病死保险母猪作无害化处理的证明；</p>
          <p>（八）投保人，被保险人所能提供的与确认保险事故的性质、原因、损失程度等有关的其他证明和资料。被保险人未履行前款约定的义务，导致保险人无法核实损失情况的，保险人对无法核实的部分不承担赔偿责任。以集体方式统一投保的被保险人，在申请赔偿时可委托投保人代办申请赔偿事宜</p>
    </div>
</template>
<script>
export default {
      props:['provedata']
}
</script>
<style lang="scss" scoped>
.count{
    width:450px;
    margin: 0 auto;
    .item{
        display: flex;
        flex-direction: row;
        margin-bottom: 30px;
        font-size: 14px;
        label{
            display: inline-block;
            width: 98px;
            text-align: right;
        }
        span{
            flex: 1;
            margin-left: 10px;
        }
    }
    .tt{
        margin-top: 50px;
    }
    p{
        color: #666;
    }
}
</style>