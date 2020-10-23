<template>
    <div class='editphone'>
         <el-form label-width="106px">
              <el-form-item label='管理员姓名'>
                   <el-input v-model='form.adminName'></el-input>
              </el-form-item>
              <el-form-item label='新手机号码' class='require'>
                   <el-input v-model='form.phone'></el-input>
              </el-form-item>
              <Verifity :phone='form.phone' @codemsg='codemsg' ref='yanzheng'></Verifity>
              <el-form-item label='输入账号密码' class='require'>
                   <el-input type='password' v-model='form.pwd'></el-input>
              </el-form-item>
              <el-form-item class='demo'>
                   <el-button type='primary' @click='submit'>确认修改</el-button>
              </el-form-item>
         </el-form>
    </div>
</template>
<script>
import Verifity from "@/components/newcomponent/verifity"
import {changePhone,adminMsg} from "@/api/poverty"
export default {
    components:{
        Verifity,
    },
         data(){
             return{
                 form:{
                    adminName:'',
                     phone:'',
                     pwd:'',
                     code:'',
                     userId:""
               }
             }
         },
         created(){
              this.getAdmin()
         },
         methods:{
             codemsg(code){
                 this.form.code=code
             },
           getAdmin(){
                adminMsg().then(res=>{
                     let {code,data}=res.data;
                     if(code==200){
                         this.form.userId=data.id
                     }
                })
           },
           submit(){
               let form=this.form;
               if(!form.phone){
                   this.$msg({msg:'请填写手机号'})
                   return
               }else if(!form.pwd){
                    this.$msg({msg:"请填写密码"})
                    return
               }else if(!form.code){
                   this.$msg({msg:'请填写验证码'})
                   return
               }
               changePhone(form).then(res=>{
                   let {code,msg}=res.data
                   if(code==200){
                       this.$msg({
                            msg:"操作成功",
                            type:'success'
                       })
                       this.form={
                             adminName:'',
                             phone:'',
                              pwd:'',
                             code:'',
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
     .require{
         .el-form-item__label::before{
             content: "*";
             color: #F56C6C;
             margin-right: 4px;                       
       }
  }
}
</style>