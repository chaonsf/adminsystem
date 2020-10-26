<template>
    <div>
        <basic-container>
            <el-form :inline="true" class="selection-bar">
                <farm-select label="基地" @callback="farmChange"></farm-select>
            </el-form>
            <avue-crud
                :option="option"
                :data="data"
                :page="page"
                @row-del="rowDel"
                v-model="form"
                :permission="permissionList"
                @row-update="rowUpdate"
                @row-save="rowSave"
                :before-close="beforeClose"
                @search-change="searchChange"
                @search-reset="searchReset"
                @selection-change="selectionChange"
                @current-change="currentChange"
                @size-change="sizeChange"
                @on-load="onLoad"
                @upload-after="uploadAfter"
            >
                <template slot-scope="scope" slot="lsListForm">
                    <div>
                        <el-button
                            v-if="selectLsList.length === 0"
                            type="primary"
                            @click="lsSelectDialogVisible = true"
                            >选择
                        </el-button>
                        <el-button
                            v-else
                            type="primary"
                            @click="lsSelectDialogVisible = true"
                            >已选择{{ selectLsList.length }}只畜禽
                        </el-button>
                    </div>
                </template>
                <template slot-scope="{}" slot="lsListLabel">
                    <span>畜禽&nbsp;&nbsp;</span>
                </template>

                <template slot="menuLeft">
                    <el-button
                        type="danger"
                        size="small"
                        icon="el-icon-delete"
                        plain
                        @click="handleDelete"
                        >删 除
                    </el-button>
                </template>
            </avue-crud>
        </basic-container>
        <ls-select-dialog
            :visible="lsSelectDialogVisible"
            :lsList="selectLsList"
            @dialogClose="dialogClose"
        ></ls-select-dialog>
    </div>
</template>

<script>
import { getList, remove, update, add } from "@/api/breed/slaughter.js";
import { mapGetters } from "vuex";
import lsSelectDialog from "./ls_select_dialog.vue";
import FarmSelect from "@/components/farmSelect.vue";

export default {
    components: {
        "ls-select-dialog": lsSelectDialog,
        "farm-select": FarmSelect
    },
    data() {
        return {
            lsSelectDialogVisible: false, // 自定义畜禽选择组件
            selectLsList: [], // 子组件选中的畜禽
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
                        prop: "lsoperDetailId",
                        hide: "true",
                        display: false,
                        disabled: true
                    },
                    {
                        prop: "lsList",
                        hide: "true",
                        type: "array",
                        editDisplay: false,
                        viewDisplay: false,
                        formslot: true,
                        labelslot: true
                    },
                    {
                        label: "芯片号",
                        prop: "chipNo",
                        addDisplay: false,
                        disabled: true
                    },
                    {
                        label: "基地",
                        prop: "srcFarmId",
                        type: "select",
                        addDisplay: false,
                        disabled: true,
                        props: {
                            label: "name",
                            value: "code"
                        },
                        cascaderItem: ["sukkId"],
                        dicUrl: "/api/mkx-farm/farm/getFarms"
                    },
                    // {
                    //     label: "棚舍",
                    //     prop: "srcSukkId",
                    //     type: "select",
                    //     addDisplay: false,
                    //     disabled: true,
                    //     props: {
                    //         label: "name",
                    //         value: "code"
                    //     },
                    //     dicFlag: false,
                    //     dicUrl: "/api/mkx-sukkah/sukkah/getSukkahs/{{key}}"
                    // },
                    {
                        label: "品种",
                        prop: "varietyId",
                        addDisplay: false,
                        disabled: true,
                        type: "select",
                        dicUrl: "/api/breed/variety/getVarieties",
                        props: {
                            label: "name",
                            value: "code"
                        }
                    },
                    {
                        label: "性别",
                        prop: "sex",
                        type: "select",
                        editDisplay:false,
                        addDisplay:false,
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
                        label: "出栏重量(克)",
                        prop: "weight",
                        rules: [
                            {
                                required: true,
                                message: "请输入重量",
                                trigger: "blur"
                            }
                        ]
                    },                   
                    {
                        label: "出栏时间",
                        prop: "operTime",
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        rules: [
                            {
                                required: true,
                                message: "请选择出栏时间",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "收购人",
                        prop: "buyer",
                        rules: [
                            {
                                required: true,
                                message: "请输入收购人",
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
            // 选中数据赋值
            row.lsIds = this.selectLsList.map(ls => ls.liveStockId).join(",");
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
        beforeClose(done) {
            this.selectLsList = [];
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
        uploadAfter(res, done) {
            done();
        },
        dialogClose(list) {
            this.selectLsList = list;
            this.lsSelectDialogVisible = false;
        }
    }
};
</script>

<style>
@import url("../../../styles/selectionbar.scss");
</style>
