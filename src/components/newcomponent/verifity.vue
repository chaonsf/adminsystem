<template>
                        <el-form-item label="验证码:" class="yancode require">
                          <el-input v-model='code' @blur='blur'></el-input>
                           <el-button type="primary" @click="send" :disabled="status">{{buttonName}}</el-button>
                       </el-form-item>
</template>
<script>
import {isvalidatemobile} from "@/util/validate";
import {sendMsg} from "@/api/poverty"
export default {
    props:['phone'],
     data(){
         return{
              code:"",
                buttonName:'发送',
                msgTime:60,//倒计时
                 status:false,
               
         }
     },
     methods:{
         send(){
             let msg=isvalidatemobile(this.phone);
            if(msg[0]){
                 this.$msg({msg:msg[1]})
            }else{
                 let param={
                     phone:this.phone,
                     type:2
                 }
                sendMsg(param).then(res=>{
                     let {code}=res.data
                     //console.log("msg:",msg)
                     if(code==200){
                         this.getcode();
                        /*  this.$msg({
                            message:msg,
                            type:'success'
                         }) */
                     }
                })
            }
         },
         blur(){
              this.$emit('codemsg',this.code)
         },
         getcode(){ //获取验证码
            this.status=true;
             let timer=setInterval(()=>{
                 this.msgTime--;
                 this.buttonName=this.msgTime+'s';
                 if(this.msgTime==0){
                     this.msgTime=60;
                     this.status=false;
                     this.buttonName='发送'
                     clearInterval(timer)
                 }
             },1000)
        },
        clear(){
           this.code='';
           this.buttonName='发送'
            this.msgTime=60,
            this.status=false
        }
     }
}
</script>
<style lang="scss">
                .yancode{
                    .el-form-item__content{
                        display: flex;
                        flex-direction: row;
                        .el-input{
                            flex:1;
                            margin-right: 10px;
                        }
                   }
                }
</style>