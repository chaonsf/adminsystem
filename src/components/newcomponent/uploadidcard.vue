<template>
                     <div class="float uploaddemo">
                      <el-upload :action="fronturl" class="idCardupload card left" list-type="picture-card" :headers='header'
                        :on-success='idCardFrontSuccess' :on-remove="removeFront" :file-list='idcardfront'>
                               <span>上传身份证正面</span>
                       </el-upload>
                       <el-upload :action="uploadUrl" class="idCardupload left" :headers='header' list-type="picture-card"
                         :on-success='idCardBackSuccess' :on-remove="removeBack">
                                   <span>上传身份证反面</span>
                       </el-upload>
                    </div>    
</template>
<script>
import config from '@/config/website'
export default {
     data(){
         return{
             header:config.header,
              fronturl:'/api/alioss/idcard-upload',
              idcardfront:[],
             uploadUrl:config.uploadUrl,
             form:{
                 adminIdCardFront:'',
                 adminIdCardBack:''
             }
         }
     },
     methods:{
        idCardFrontSuccess(res,file){
            let {code,data,msg}=res
            if(code==200){
                if(data && data.num){
                    this.form.adminIdCardFront=file.response.data
                    this.$emit('cardid',data.num)
                }else{
                     this.form.adminIdCardFront=''
                     this.idcardfront=[];
                     this.$msg({msg:'请上传身份证正面'})
                }
            }else{
                this.$msg({msg})
            }
            
        },
        removeFront(){
             this.form.adminIdCardFront=''
        },
        idCardBackSuccess(res,file){
            this.form.adminIdCardBack=file.response.data
        },
       removeBack(){
            this.form.adminIdCardBack=''
        },

     }
}
</script>
<style lang="scss">
.uploaddemo{
                 overflow: hidden;
                 margin-left: 102px;
                .left{
                    float: left;
                }
            .idCardupload{
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                width:300px;
                height:150px;
                text-align: center;
                line-height: 150px;
                margin-right: 20px;
                .el-upload--picture-card{
                    width:100%;
                }
                .el-upload-list__item{
                    width: 100% ;
                    
                }
            }
}

</style>