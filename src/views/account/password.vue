<template>
    <div class='editphone'>
         <el-form label-width="108px">
              <el-form-item label='新密码' class='require'>
                   <el-input v-model="form.pwd"></el-input>
              </el-form-item>
              <el-form-item label='重新输入密码' class='require'>
                   <el-input v-model="form.twoPwd"></el-input>
              </el-form-item>
              <el-form-item class='bottom'>
                   向尾号{{lastdigit}}的手机号码发送验证码
              </el-form-item>
               <Verifity :phone='form.phone' @codemsg='codemsg' ref='yanzheng'></Verifity>
              <el-form-item class='demo'>
                   <el-button type='primary' @click='submit'>确认修改</el-button> 
              </el-form-item>
         </el-form>
    </div>
</template>
<script>
import Verifity from "@/components/newcomponent/verifity"
import {changepassword,adminMsg} from "@/api/poverty"
export default {
     components:{
        Verifity
     },
     data(){
          return{
               form:{
                    userId:'',
                    pwd:'',
                    twoPwd:'',
                    code:'',
                    phone:''
               },
               lastdigit:''
          }
     },
     created(){
       this.getAdmin()
     },
     methods:{
        codemsg(msg){
             this.form.code=msg
        },
        getAdmin(){
                adminMsg().then(res=>{
                     let {code,data}=res.data;
                     if(code==200){
                         this.form.userId=data.id;
                         if(!data.phone){
                               this.$msg({msg:'获取不到管理员手机号，请联系后台管理员'})
                               return
                         }else{
                             this.form.phone=data.phone;
                             this.lastdigit=data.phone.substring(7,11)
                         }
                     }
                })
       },
       submit(){
            let form=this.form
            if(!form.pwd){
                 this.$msg({msg:"请填写密码"})
                 return
            }else if(form.pwd!==form.twoPwd){
                  this.$msg({msg:"两次密码输入不一致"})
                  return
            }else if(!form.code){
                  this.$msg({msg:'请填写验证码'})
                  return
            }
            changepassword(form).then(res=>{
                   let {code,msg}=res.data
                   if(code==200){
                       this.$msg({
                            msg:"操作成功",
                            type:'success'
                       })
                       this.form={
                             pwd:'',
                             twoPwd:'',
                             code:'',
                             phone:'' 
                       }
                      this.$refs.yanzheng.clear()
                   }else{
                       this.$msg({msg:msg})
                   }
            })
       }
     }
    
}
</script>
<style lang="scss">
.editphone{
    width: 750px;
    margin: 10px auto;
    .demo{
        text-align: center;
        .el-button{
            width: 100px;
        }
    }
    .bottom{
         margin-bottom: 0;
         color:#333
    }
     .require{
         .el-form-item__label::before{
             content: "*";
             color: #F56C6C;
             margin-right: 4px;                       
       }
  }
}
</style>