<template>
    <basic-container>
        <avue-crud
            :option="option"
            :table-loading="loading"
            :data="data"
            :page="page"
            :permission="permissionList"
            :before-open="beforeOpen"
            v-model="form"
            ref="crud"
            @row-update="rowUpdate"
            @row-save="rowSave"
            @row-del="rowDel"
            @search-change="searchChange"
            @search-reset="searchReset"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
        >
            <template slot-scope="scope" slot="farmIdSearch">
                <farm-select @callback="farmChange"></farm-select>
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
            <template slot-scope="{ row }" slot="deviceType">
                <el-tag>{{ row.deviceTypeName }}</el-tag>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from "@/api/device/sensor";
import FarmSelect from "@/components/farmSelect.vue";
import { mapGetters } from "vuex";
export default {
    components: {
        "farm-select": FarmSelect
    },
    data() {
        return {
            form: {},
            searchForm: {},
            query: {},
            loading: true,
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
                        label: "所属基地",
                        prop: "farmId",
                        type: "select",
                        search: true,
                        searchslot: true,
                        props: {
                            label: "name",
                            value: "code"
                        },
                        cascaderItem: ["sukkId"],
                        cascaderChange: true,
                        dicUrl: "/api/mkx-farm/farm/getFarms",
                        rules: [
                            {
                                required: true,
                                message: "请选择所属基地",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "所在棚舍",
                        prop: "sukkId",
                        type: "select",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        dicFlag: false,
                        dicUrl: "/api/mkx-sukkah/sukkah/getSukkahs/{{key}}",
                        rules: [
                            {
                                required: false,
                                message: "请选择所在棚舍",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "设备名称",
                        prop: "deviceName",
                        search: true,
                        rules: [
                            {
                                required: true,
                                message: "请输入设备名称",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "设备类型",
                        prop: "deviceType",
                        type: "select",
                        row: true,
                        search: true,
                        dicUrl:
                            "/api/blade-system/dict/dictionary?code=env_sensor",
                        props: {
                            label: "dictValue",
                            value: "dictKey"
                        },
                        slot: true,
                        rules: [
                            {
                                required: true,
                                message: "请选择设备类型",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "IP地址",
                        prop: "ipaddress",
                        rules: [
                            {
                                required: true,
                                message: "请输入IP地址",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "端口号",
                        prop: "port",
                        width: 80,
                        rules: [
                            {
                                required: true,
                                message: "请输入端口号",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "排序",
                        prop: "sort",
                        type: "number",
                        hide: true,
                        rules: [
                            {
                                required: true,
                                message: "请输入排序",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "备注",
                        prop: "remark",
                        hide: true
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
                addBtn: this.vaildData(this.permission.device_add, true),
                viewBtn: this.vaildData(this.permission.device_view, true),
                delBtn: this.vaildData(this.permission.device_delete, true),
                editBtn: this.vaildData(this.permission.device_edit, true)
            };
        },
        ids() {
            let ids = [];
            this.selectionList.forEach(ele => {
                ids.push(ele.id);
            });
            return ids.join(",");
        }
    },
    methods: {
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
                    return remove(row.id);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                });
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
            if (["edit", "view"].includes(type)) {
                getDetail(this.form.id).then(res => {
                    if (res.data.data.sukkId === -1)
                        res.data.data.sukkId = null;
                    this.form = res.data.data;
                });
            }
            done();
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
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
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
            this.loading = true;
            getList(
                page.currentPage,
                page.pageSize,
                Object.assign(params, this.query, this.searchForm)
            ).then(res => {
                for (var i = 0; i < res.data.data.records.length; i++) {
                    if (res.data.data.records[i].sukkId === -1)
                        res.data.data.records[i].sukkId = null;
                }
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            });
        },
        farmChange(farmId) {
            this.searchForm.farmId = farmId;
            this.onLoad(this.page);
        }
    }
};
</script>

<style></style>
