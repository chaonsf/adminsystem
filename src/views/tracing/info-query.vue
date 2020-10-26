<template>
    <basic-container>
        <el-row :span="24">
            <el-col :span="18">
                <el-input
                    v-model="barcode"
                    placeholder="请输入要查询的溯源号"
                ></el-input>
            </el-col>
            <el-col :span="6">
                <el-button
                    type="primary"
                    @click="search"
                    style="margin-left:20px;"
                    >查询</el-button
                >
            </el-col>
        </el-row>
        <div id="iframe">
            <!-- <iframe
                src="/trace/index.html"
                frameborder="0"
                width="100%"
                height="800px"
                id="iframe"
            ></iframe> -->
        </div>
    </basic-container>
</template>

<script>
import { getFlag, getPhotos } from "@/api/basic/farm";
import { format, subDays } from "date-fns";
export default {
    data() {
        return {
            barcode: ""
        };
    },
    created() {
        if (sessionStorage.getItem("chipNo")) {
            this.barcode = sessionStorage.getItem("chipNo");
            this.search();
            sessionStorage.removeItem("chipNo");
        }
    },
    methods: {
        search() {
            if (this.barcode.replace(/\s+/g, "") == "") {
                this.$message.error("芯片号不能为空");
            } else {
                getFlag(this.barcode).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success("查询成功");
                        var iframe = document.getElementById("iframe");
                        iframe.innerHTML = `<iframe src="https://ynyiot.com/#/trace/${this.barcode}" frameborder="0" width="100%" height=1080></iframe>`;
                    } else {
                        this.$message.error(
                            "暂无该畜禽信息,请确认溯源号后重试"
                        );
                        document.getElementById("iframe").innerHTML = "";
                    }
                });
            }
        },
        photos() {
            getPhotos({
                farmId: 1,
                beginTime: format(
                    subDays(new Date(), 2),
                    "yyyy-MM-dd HH:mm:ss"
                ),
                endTime: format(subDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss")
            }).then(res => {
                console.log(res);
            });
        }
    }
};
</script>
<style></style>
