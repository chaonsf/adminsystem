<template>
    <div class='adminChange'>
         <div class='content'>
          <el-form label-width="108px">
              <el-form-item label="新管理员姓名" class='require'>
                   <el-input v-model='form.adminName'></el-input>
              </el-form-item>
              <el-form-item label="手机号码" class='require'>
                   <el-input v-model='form.adminPhone'></el-input>
              </el-form-item>
              <Verifity :phone='form.adminPhone' ref='phonecode' @codemsg='codemsg'></Verifity>
              <el-form-item label="身份证号码" class='require'>
                   <el-input v-model='form.adminIdCard'></el-input>
              </el-form-item>   
          </el-form>
           <Uploadidcard ref='card' @cardid='fugai'></Uploadidcard>
           <el-form label-width="108px" class='mt22'>
              <el-form-item label="输入账户密码" class='require'>
                   <el-input type='password' v-model='form.pwd'></el-input>
              </el-form-item>
                <el-form-item class='demo'>
                    <el-button type="primary" @click='submit'>提交</el-button>
              </el-form-item>
           </el-form>
         </div>
    </div>
</template>
<script>
import Verifity from "@/components/newcomponent/verifity"
import Uploadidcard from '@/components/newcomponent/uploadidcard'
import {changeAdmin,adminMsg} from "@/api/poverty"
import {cardid} from '@/util/validate'
export default {
     components:{
         Verifity,Uploadidcard
     },
     data(){
        return{
            form:{
                adminName:'',
                adminPhone:'',
                adminIdCard:'',
                pwd:'',
                adminId:'',
                adminCode:''
            }
        }
     },
     created(){
        this.getAdmin()
     },
     methods:{
           submit(){
               let card=this.$refs.card
                let form=Object.assign(this.form,card.form);
                let result=cardid(form.adminIdCard)
                if(!form.adminName){
                     this.$msg({msg:'请填写管理员姓名'})
                     return 
                }else if(!form.adminPhone){
                      this.$msg({msg:'请填写手机号'})
                      return
                }else if(!form.adminCode){
                     this.$msg({msg:'请填写验证码'})
                     return
                }else if(!form.adminIdCard || result[0]){
                     this.$msg({msg:result[1]})
                     return
                }else if(!form.adminIdCardFront){
                     this.$msg({msg:"请上传身份证正面"})
                     return
                }else if(!form.adminIdCardBack){
                  this.$msg({msg:"请上传身份证反面"})
                  return
                }else if(!form.pwd){
                     this.$msg({msg:"请填写密码"})
                     return
                }
                changeAdmin(form).then(res=>{
                      let {code,msg}=res.data;
                      if(code==200){
                           this.$msg({msg:"操作成功",type:'success'})
                           this.form={
                               adminName:'',
                              adminPhone:'',
                              adminIdCard:'',
                               pwd:'',
                             adminCode:''
                           }
                           this.$refs.phonecode.clear()
                           
                      }else{
                            this.$msg({msg})
                      }
                })
           },
           getAdmin(){
                adminMsg().then(res=>{
                     let {code,data}=res.data;
                     if(code==200){
                         this.form.adminId=data.id
                     }
                })
           },
           codemsg(code){
              this.form.adminCode=code
           },
           fugai(id){
                this.form.adminIdCard=id;
           }
     }
}
</script>
<style lang="scss">
.adminChange{
    padding: 10px 20px;
    .content{
        width: 750px;
        margin: 0 auto;
    }
    .mt22{
        margin-top: 22px;
    }
    .demo{
        text-align: center;
        .el-button{
            width: 100px;
        }
    }
    .idCardupload{
         border: none !important;
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