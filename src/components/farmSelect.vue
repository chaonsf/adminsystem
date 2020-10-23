<template>
    <el-form-item :label="label">
        <el-select
            v-model="selectFarm"
            size="small"
            collapse-tags
            placeholder="请选择"
            style="width: 10vw"
            @change="callback"
        >
            <el-option
                v-for="item in farms"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option> </el-select
    ></el-form-item>
</template>

<script>
import { getFarmTree } from "@/api/basic/farm";
export default {
    props: {
        label: {
           // type: String,
            required: false
        }
    },
    data() {
        return {
            selectFarm: null,
            farms: []
        };
    },
    mounted() {
        this.getFarms().then(() => {
            this.selectFarm = this.farms[0].value;
            this.callback();
        });
    },
    methods: {
        getFarms() {
            return getFarmTree().then(res => {
                res.data.data.forEach(ele => {
                    this.farms.push({
                        label: ele.title,
                        value: ele.id
                    });
                });
            });
        },
        callback() {
            this.$emit("callback", this.selectFarm);
        }
    }
};
</script>

<style></style>
