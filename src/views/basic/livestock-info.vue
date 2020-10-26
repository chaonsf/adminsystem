<template>
    <basic-container>
        <el-form :inline="true" class="selection-bar">
            <farm-select label="基地" @callback="farmChange"></farm-select>
        </el-form>
        <avue-crud
            class="livestock_info"
            :option="option"
            :data="data"
            :page.sync="page"
            @row-del="rowDel"
            v-model="form"
            :permission="permissionList"
            @row-update="rowUpdate"
            @row-save="rowSave"
            :before-open="beforeOpen"
            @search-change="searchChange"
            @search-reset="searchReset"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @on-load="onLoad"
            :upload-error="uploadError"
            :upload-before="uploadBefore"
            :upload-after="uploadAfter"
        >
            <template slot-scope="{ type, size, row }" slot="menu">
                <el-button
                    icon="el-icon-mobile"
                    :size="size"
                    :type="type"
                    @click="suyuan(row.chipNo)"
                    >溯源</el-button
                >
            </template>
            <template slot-scope="{ row }" slot="nameLabel" style="float:left;">
                <vue-qr
                    style="margin-left:80px;"
                    :text="'https://ynyiot.com/#/trace/' + row.chipNo"
                    :margin="0"
                    colorLight="#fff"
                ></vue-qr>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import vueQr from "vue-qr";
import { getList, getUpdate } from "@/api/basic/livestock-info.js";
import { mapGetters } from "vuex";
import { validateNumOrDecimals } from "@/util/validate.js";
import FarmSelect from "@/components/farmSelect.vue";

export default {
    components: {
        "farm-select": FarmSelect,
        vueQr
    },
    data() {
        return {
            form: {},
            query: {
                farmId: 1
            },
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            selectionList: [],
            option: {
                tip: false,
                border: true,
                index: true,
                viewBtn: true,
                columnBtn: false,
                refreshBtn: false,
                searchMenuSpan: 4,
                column: [
                    {
                        label: "畜禽id",
                        prop: "liveStockId",
                        type: "number",
                        hide: "true",
                        display: false,
                        disabled: true
                    },
                    {
                        prop: "lsoperId",
                        hide: "true",
                        display: false,
                        disabled: true
                    },
                    {
                        prop: "lsoperDetailId",
                        hide: "true",
                        display: false,
                        disabled: true
                    },
                    {
                        label: "基地",
                        prop: "farmId",
                        type: "select",
                        disabled: true,
                        cascaderItem: ["sukkId"],
                        props: {
                            label: "name",
                            value: "code"
                        },
                        dicUrl: "/api/mkx-farm/farm/getFarms"
                    },
                    // {
                    //     label: "棚舍q",
                    //     prop: "sukkId",
                    //     disabled: true,
                    //     type: "select",
                    //     dicFlag: false,
                    //     props: {
                    //         label: "name",
                    //         value: "code"
                    //     },
                    //     dicUrl: "/api/mkx-sukkah/sukkah/getSukkahs/{{key}}",
                    //     rules: [
                    //         {
                    //             required: true,
                    //             message: "请选择棚舍",
                    //             trigger: "blur"
                    //         }
                    //     ]
                    // },
                    {
                        label: "芯片号",
                        prop: "chipNo",
                        disabled: true,
                        rules: [
                            {
                                required: true,
                                message: "请输入芯片号",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "条码",
                        prop: "barcode",
                        hide: true,
                        rules: [
                            {
                                required: true,
                                message: "请输入条码",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "昵称",
                        prop: "nickName",
                        hide: true,

                        rules: [
                            {
                                required: false,
                                message: "请输入昵称",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "品种",
                        prop: "varietyId",
                        type: "select",
                        dicUrl: "/api/breed/variety/getVarieties",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        rules: [
                            {
                                required: true,
                                message: "请选择品种",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "性别",
                        prop: "sex",
                        type: "select",
                        dicData: [
                            {
                                label: "公",
                                value: 1
                            },
                            {
                                label: "母",
                                value: 0
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: "请选择性别",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "来源",
                        prop: "source",
                        type: "select",
                        hide: false,
                        dicData: [
                            {
                                label: "购入",
                                value: 1
                            },
                            {
                                label: "自繁",
                                value: 2
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: "请输入来源",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "重量(克)",
                        prop: "weight",
                        disabled: true,
                        rules: [
                            {
                                required: false,
                                trigger: "blur",
                                validator: validateNumOrDecimals
                            }
                        ]
                    },
                    {
                        label: "累计步数",
                        prop: "stepCount",
                        disabled: true,
                        type: "number",
                        rules: [
                            {
                                required: false,
                                message: "请输入累计步数",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "状态",
                        prop: "status",
                        hide: false,
                        type: "select",
                        dicData: [
                            {
                                label: "正常",
                                value: 1
                            },
                            {
                                label: "疾病",
                                value: 6
                            },
                            {
                                label: "死亡",
                                value: 9
                            },
                            {
                                label: "出栏",
                                value: 4
                            }
                        ]
                    },
                    {
                        label: "备注",
                        prop: "remark",
                        hide: true,
                        rules: [
                            {
                                required: false,
                                message: "请输入备注",
                                trigger: "blur"
                            }
                        ]
                    },
                    // {
                    //     label: "排序",
                    //     prop: "sort",
                    //     type: "number",
                    //     hide: true,
                    //     rules: [
                    //         {
                    //             required: false,
                    //             message: "请输入排序",
                    //             trigger: "blur"
                    //         }
                    //     ]
                    // },
                    {
                        label: "图片",
                        prop: "photourl",
                        type: "upload",
                        listType: "picture-img",
                        propsHttp: {
                            url: "data"
                        },
                        span: 14,
                        tip: "只能上传jpg/png文件，且不超过500kb",
                        action: "/api/alioss/imgupload"
                    },
                    {
                        label: "二维码",
                        prop: "name",
                        hide: true,
                        span: 6,
                        formslot: true,
                        labelslot: true,
                        errorslot: true,
                        editDisplay: false
                    }
                ]
            },
            data: []
        };
    },
    computed: {
        ...mapGetters(["permission"]),
        permissionList() {
            return {
                addBtn: this.vaildData(this.permission.menu_add, false),
                viewBtn: this.vaildData(this.permission.menu_view, true),
                delBtn: this.vaildData(this.permission.menu_delete, false),
                editBtn: this.vaildData(this.permission.menu_edit, true)
            };
        },
        ids() {
            let ids = [];
            this.selectionList.forEach(ele => {
                ids.push(ele.lsoperDetailId);
            });
            return ids.join(",");
        }
    },
    methods: {
        suyuan(chipNo) {
            sessionStorage.setItem("chipNo", chipNo);
            this.$router.push({
                path: "/tracing/info-query"
            });
        },
        farmChange(farmId) {
            this.query.farmId = farmId;
            this.onLoad(this.page);
        },
        rowSave(row, loading, done) {
            // add(row).then(
            //     () => {
            //         loading();
            //         this.onLoad(this.page);
            //         this.$message({
            //             type: "success",
            //             message: "操作成功!"
            //         });
            //     },
            //     error => {
            //         done();
            //         console.log(error);
            //     }
            // );
        },
        rowUpdate(row, index, loading, done) {
            if (row.status == 4) {
                this.$message.error("畜禽状态暂不支持出栏");
                done();
            } else {
                getUpdate(row).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success("操作成功");
                        this.onLoad(this.page);
                    } else {
                        this.$message.error("操作失败");
                    }
                });
                loading();
            }
        },
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // return remove(row.lsoperDetailId);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                });
        },
        searchReset() {
            this.query = {};
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            this.onLoad(this.page, params);
            done();
        },
        selectionChange(list) {
            this.selectionList = list;
        },
        handleDelete() {
            if (this.selectionList.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // return remove(this.ids);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.$refs.crud.toggleSelection();
                });
        },
        beforeOpen(done, type) {
            done();
        },
        currentChange(currentPage) {
            this.page.currentPage = currentPage;
            this.onLoad(this.page);
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.onLoad(this.page);
        },
        onLoad(page, params = {}) {
            getList(
                page.currentPage,
                page.pageSize,
                Object.assign(params, this.query)
            ).then(res => {
                console.log(res)
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
            });
        },
        uploadBefore(file, done, loading, column) {
            if (
                !file.name.toLowerCase().includes(".jpg") &&
                !file.name.toLowerCase().includes(".png")
            ) {
                this.$message.error("文件扩展名需要为jpg或png");
                loading(false);
            } else if (file.size > 500 * 1024) {
                this.$message.error("文件大小不能超过500k");
                loading(false);
            } else {
                //如果你想修改file文件,由于上传的file是只读文件，必须复制新的file才可以修改名字，完后赋值到done函数里,如果不修改的话直接写done()即可
                //var newFile = new File([file], '1234', { type: file.type });
                done();
            }
        },
        uploadError(error, column) {
            console.log("uploadError");
            console.log(error, column);
        },
        uploadAfter(res, done, loading, column) {
            console.log("uploadAfter");
            console.log(res);
            done();
        }
    }
};
</script>

<style  lang="scss">
.el-image{
     height: 100%;
}
.livestock_info {
    .avue-crud__menu {
        display: none;
    }
}
</style>
