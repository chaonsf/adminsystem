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
                    v-if="permission.acqrfid_delete"
                    @click="handleDelete"
                    >删 除
                </el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import {
    getList,
    getDetail,
    add,
    update,
    remove
} from "@/api/device/rfid_data";
import { mapGetters } from "vuex";
import { dateFormatPattern } from "@/util/date.js";
import { startOfToday, endOfToday } from "date-fns";
import FarmSelect from "@/components/farmSelect.vue";
var padDate = function(value) {
    return value < 10 ? "0" + value : value;
};
var date = new Date();
var year = padDate(date.getFullYear());
var month = padDate(date.getMonth() + 1);
var day = padDate(date.getDate());
var todayTime = year + "-" + month + "-" + day;
export default {
    components: {
        "farm-select": FarmSelect
    },
    data() {
        return {
            form: {},
            searchForm: {},
            query: {
                beginTime: `${todayTime} 00:00:00`,
                endTime: `${todayTime} 23:59:59`
            },
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
                dateDefault: true,
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
                        dicUrl: "/api/mkx-farm/farm/getFarms"
                    },
                    {
                        label: "设备id",
                        prop: "deviceId",
                        hide: true,
                        display: false
                    },
                    {
                        label: "设备名称",
                        prop: "deviceName"
                    },
                    {
                        label: "天线编号",
                        prop: "antenna",
                        rules: [
                            {
                                required: true,
                                message: "请输入天线编号",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "品种",
                        prop: "varietyId",
                        type: "select",
                        dicUrl: "/api/breed/variety/getVarieties",
                        addDisplay: false,
                        props: {
                            label: "name",
                            value: "code"
                        }
                    },
                    {
                        label: "标签EPC",
                        prop: "acqValue",
                        search: true,
                        rules: [
                            {
                                required: true,
                                message: "请输入标签EPC",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "扫描时间",
                        prop: "acqTime",
                        type: "date",
                        searchSpan: 8,
                        searchRange: true,
                        search: true,
                        searchValue: [
                            `${todayTime} 00:00:00`,
                            `${todayTime} 23:59:59`
                        ],
                        rules: [
                            {
                                required: true,
                                message: "请选择扫描时间",
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
        },
        acqTimeSearchValue() {
            return this.searchValue.acqTime;
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
            debugger;
            if (params.acqTime && params.acqTime.length > 0) {
                let beginTime = params.acqTime[0];
                let endTime = params.acqTime[1];

                if (beginTime instanceof Date) {
                    params.beginTime = dateFormatPattern(
                        beginTime,
                        "yyyy-MM-dd 00:00:00"
                    );
                } else {
                    params.beginTime = beginTime;
                }
                if (endTime instanceof Date) {
                    params.endTime = dateFormatPattern(
                        endTime,
                        "yyyy-MM-dd 23:59:59"
                    );
                } else {
                    params.endTime = endTime;
                }

                params.acqTime = null;
            }
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
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            });
        },
        farmChange(farmId, scope) {
            this.searchForm.farmId = farmId;
            this.onLoad(this.page);
        }
    }
};
</script>

<style></style>
