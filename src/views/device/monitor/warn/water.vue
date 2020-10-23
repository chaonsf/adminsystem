<template>
    <basic-container>
        <avue-crud
            :option="option"
            :table-loading="loading"
            :data="data"
            :page="page"
            :permission="permissionList"
            :before-open="beforeOpen"
            :row-style="rowStyle"
            v-model="form"
            ref="crud"
            @row-del="rowDel"
            @search-change="searchChange"
            @search-reset="searchReset"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
        >
            <template slot-scope="farmIdScope" slot="farmIdSearch">
                <farm-select @callback="farmChange"></farm-select>
            </template>
            <template slot-scope="scope" slot="menuLeft">
                <el-button type="primary" size="small" plain @click="markRead2">
                    全部设为已读
                </el-button>
            </template>
            <template slot-scope="scope" slot="menu">
                <!-- <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.status == 1"
                >
                    已读
                </el-button> -->
                <span v-if="scope.row.status == 1">---</span>
                <el-button
                    v-if="scope.row.status == 0"
                    type="danger"
                    size="small"
                    @click="markRead(scope.row)"
                >
                    设为已读
                </el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import { getList, remove, markRead } from "@/api/monitor/warninglog";
import { mapGetters } from "vuex";
import FarmSelect from "@/components/farmSelect.vue";

export default {
    components: {
        "farm-select": FarmSelect
    },
    data() {
        return {
            dataId: [],
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
                delBtn: false,
                selection: true,
                searchMenuSpan: 4,
                columnBtn: false,
                refreshBtn: false,
                searchBtn: false,
                column: [
                    {
                        label: "主键",
                        prop: "id",
                        hide: true,
                        display: false,
                        rules: [
                            {
                                required: true,
                                message: "请输入主键",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "基地",
                        prop: "farmId",
                        type: "select",
                        search: true,
                        searchslot: true,
                        props: {
                            label: "name",
                            value: "code"
                        },
                        dicUrl: "/api/mkx-farm/farm/getFarms",
                        rules: [
                            {
                                required: true,
                                message: "请输入基地ID",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "设备名称",
                        prop: "deviceName"
                    },
                    {
                        label: "报警类型",
                        type: "select",
                        prop: "warnType",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        dicUrl: "/api/mkx-warn/warnsetting/warnTypes",
                        rules: [
                            {
                                required: true,
                                message: "请输入报警类型",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "报警时间",
                        prop: "createTime",
                        rules: [
                            {
                                required: true,
                                message: "请输入报警时间",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "报警内容",
                        prop: "content",
                        width: 500,
                        rules: [
                            {
                                required: true,
                                message: "请输入报警内容",
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
                addBtn: false,
                viewBtn: true,
                delBtn: true,
                editBtn: false
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
        markRead(row) {
            markRead(row.id).then(() => {
                this.onLoad(this.page);
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
            });
        },
        markRead2() {
            let dataId = JSON.parse(JSON.stringify(this.dataId)).join(",");
            markRead(dataId).then(res => {
                this.onLoad(this.page);
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
            });
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
            params = Object.assign(params, this.query, this.searchForm);
            params.warnTypes = "5";
            this.loading = true;
            getList(page.currentPage, page.pageSize, params).then(res => {
                const data = res.data.data;
                const dataId = [];
                this.page.total = data.total;
                this.data = data.records;
                for (let i = 0; i < data.records.length; i++) {
                    dataId.push(data.records[i].id);
                }
                this.dataId = dataId;
                this.loading = false;
                this.selectionClear();
            });
        },
        rowStyle({ row, column, rowIndex }) {
            if (row.status == 0) {
                return {
                    fontWeight: "bold"
                };
            }
        },
        farmChange(farmId) {
            this.searchForm.farmId = farmId;
            this.onLoad(this.page);
        }
    }
};
</script>

<style></style>
