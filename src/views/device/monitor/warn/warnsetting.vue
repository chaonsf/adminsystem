<template>
    <basic-container>
        <el-dialog
                title="请选择要复制的基地"
                :visible.sync="dialogVisible"
                width="30%"
                >
                <el-select v-model="sourceBase" placeholder="请选择原基地" class="db">
                    <el-option
                        v-for="item in sourceBaseData"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
                <el-select v-model="targetBase" placeholder="请选择要复制的基地" style='margin-top:10px' class='db'>
                    <el-option
                        v-for="item in targetBaseData"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="copy">确 定</el-button>
                </span>
            </el-dialog>
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
            <template slot-scope="farmIdScope" slot="farmIdSearch">
                <farm-select @callback="farmChange"></farm-select>
            </template>

            <template slot="menuLeft">
                <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    plain
                    v-if="permission.warnsetting_delete"
                    @click="handleDelete"
                    >删 除
                </el-button>
            </template>

            <template slot="menuLeft">
                <el-button type="danger" icon="el-icon-mobile-phone" size="medium" @click="dialogVisible = true">一键复制</el-button>
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
} from "@/api/monitor/warnsetting";
import { mapGetters } from "vuex";
import { validateNumOrDecimals } from "@/util/validate.js";
import FarmSelect from "@/components/farmSelect.vue";
import { getFarms,PostCopy } from '@/api/farm/diagram'

export default {
    components: {
        "farm-select": FarmSelect
    },
    data() {
        return {
            sourceBase:'',
            targetBase:'',
            sourceBaseData:[],
            targetBaseData:[],
            dialogVisible: false,
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
                        label: "预警上限",
                        prop: "upperLimit",
                        rules: [
                            {
                                required: true,
                                trigger: "blur",
                                validator: validateNumOrDecimals
                            }
                        ]
                    },
                    {
                        label: "预警下限",
                        prop: "lowerLimit",
                        rules: [
                            {
                                required: true,
                                trigger: "blur",
                                validator: validateNumOrDecimals
                            }
                        ]
                    },
                    {
                        label: "排序",
                        prop: "sort",
                        type: "number",
                        rules: [
                            {
                                required: false,
                                message: "请输入排序",
                                trigger: "blur"
                            }
                        ]
                    },
                    {
                        label: "备注",
                        prop: "remark",
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
                addBtn: true,
                viewBtn: true,
                delBtn: true,
                editBtn: true
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
    created(){
        getFarms().then(res=>{
            this.sourceBaseData = res.data
            this.targetBaseData = res.data
        })
    },
    methods: {
        copy(){
            if( this.sourceBase == '' || this.targetBase == '' ){
                this.$message.error('基地信息不能为空')
            }else if(this.sourceBase==this.targetBase){
                     this.$message.error('原基地和目标基地不能相同')
            }else{
                PostCopy({source:this.sourceBase,target:this.targetBase}).then(res=>{
                    if( res.data.code == 200 ){
                        this.$message.success('操作成功')
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
                this.dialogVisible = false
            }
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
        farmChange(farmId) {
            this.searchForm.farmId = farmId;
            this.onLoad(this.page);
        }
    }
};
</script>

<style lang="scss" scoped>
   .db{
       display: block;
   }
</style>
