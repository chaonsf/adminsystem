<template>
  <div>
    <basic-container>
      <avue-tabs :option="option"
                 v-model="form"
                 @change="handleChange"
                 @submit="handleSubmit"></avue-tabs>
    </basic-container>
  </div>
</template>

<script>
  import option from "@/const/user/info";
  import {
    updatePassword
  } from "@/api/system/user";

  export default {
    data() {
      return {
        type: "info",
        option: option,
        form: {}
      };
    },
    created() {
      this.handleWitch();
    },
    methods: {
      handleSubmit() {        
        if (this.form.oldPassword )
        updatePassword(this.form.oldPassword,this.form.newPassword).then(() => {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          }).catch((error)=>{
            console.log(error)
            this.$message({
              type: "error",
              message: "修改失败!"+error.message
            });
          });
      },
      handleWitch() {
        if (this.type === "info") {
          this.form = {
            username: "",
            name: "",
            phone: "",
            detail: ""
          };
        }
      },
      handleChange(item) {
        this.type = item.prop;
        this.handleWitch();
      }
    }
  };
</script>

<style>
</style>
