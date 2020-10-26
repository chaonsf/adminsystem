<template>
    <basic-container>
        <el-form :inline="true" class="selection-bar">
            <farm-select label="基地" @callback="farmChange"></farm-select>
        </el-form>
        <avue-crud
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
            <template>
                <el-select>选择</el-select>
            </template>
            <template slot="menuLeft">
                <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    plain
                    @click="handleDelete"
                    >删 除</el-button
                >
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import { getList, remove, update, add } from "@/api/breed/livestock.js";
import { mapGetters } from "vuex";
import { validateNumOrDecimals } from "@/util/validate.js";
import FarmSelect from "@/components/farmSelect.vue";

export default {
    components: {
        "farm-select": FarmSelect
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
                selection: true,
                searchMenuSpan: 4,
                column: [
                    {
                        label: "批次号",
                        prop: "batchno",
                        hide: "true",
                        addDisplay: false,
                        disabled: true,
                        row: true
                    },
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
                        cascaderItem: ["sukkId"],
                        props: {
                            label: "name",
                            value: "code"
                        },
                        dicUrl: "/api/mkx-farm/farm/getFarms"
                    },
                    // {
                    //     label: "棚舍",
                    //     prop: "sukkId",
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
                        label: "重量(克)",
                        prop: "weight",
                        rules: [
                            {
                                required: false,
                                trigger: "blur",
                                validator: validateNumOrDecimals
                            }
                        ]
                    },
                    {
                        label: "来源",
                        prop: "source",
                        type: "select",
                        hide: true,
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
                        label: "入栏时间",
                        prop: "operTime",
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss",
                        rules: [
                            {
                                required: true,
                                message: "请选择入栏时间",
                                trigger: "blur"
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
                    {
                        label: "状态",
                        prop: "status",
                        type: "number",
                        hide: true,
                        rules: [
                            {
                                required: false,
                                message: "请输入状态",
                                trigger: "blur"
                            }
                        ]
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
                addBtn: this.vaildData(this.permission.menu_add, true),
                viewBtn: this.vaildData(this.permission.menu_view, true),
                delBtn: this.vaildData(this.permission.menu_delete, true),
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
        farmChange(farmId) {
            this.query.farmId = farmId;
            this.onLoad(this.page);
        },
        rowSave(row, loading, done) {
            add(row).then(
                () => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                },
                error => {
                    done();
                    console.log(error);
                }
            );
        },
        rowUpdate(row, index, loading, done) {
            update(row).then(
                () => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                },
                error => {
                    done();
                    console.log(error);
                }
            );
        },
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return remove(row.lsoperDetailId);
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
                    return remove(this.ids);
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
            // if (["edit", "view"].includes(type)) {
            //   getVariety(this.form.id).then(res => {
            //     this.form = res.data.data;
            //   });
            // }
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
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
            });
        },
        uploadBefore(file, done, loading,column) {
            if(!file.name.toLowerCase().includes(".jpg") && !file.name.toLowerCase().includes(".png")) {
                this.$message.error('文件扩展名需要为jpg或png')
                loading(false)
            }else if(file.size > 500*1024) {
                this.$message.error('文件大小不能超过500k')
                loading(false)
            }else {
                done()
            }
        },
        uploadError(error, column) {
            console.log('uploadError')
            console.log(error, column)
        },
        uploadAfter(res, done, loading, column) {
            console.log('uploadAfter')
            console.log(res)
            done()
        },
    }
};
</script>

<style></style>
