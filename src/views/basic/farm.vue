<template>
<basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" :upload-before="uploadBefore" :upload-after="uploadAfter">
        <template slot="menuLeft">
            <el-button type="danger" size="small" icon="el-icon-delete" v-if="true" @click="handleDelete" plain>删 除</el-button>
            <el-button size="small" type="warning" icon="el-icon-view" @click="handleLiveButton" plain>视频直播</el-button>
        </template>
        <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          plain
          class="none-border"
          @click.stop="handleLive(scope.row)"
        >直播</el-button>
      </template> -->
        <template slot-scope="{row}" slot="farmerId">
            <el-tag v-show="row.farmerName">{{row.farmerName}}</el-tag>
        </template>
    </avue-crud>
    <el-dialog customClass="customWidth" title="视频直播" :visible.sync="dialogVisible">
        <div class="dialog-content" style="margin-bottom:-55px">
            <iframe :src="frameUrl" frameborder="0" width="100%" height="460px"></iframe>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="dialogVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
</basic-container>
</template>

<script>
import {
    getList,
    getDetail,
    add,
    update,
    remove
} from "@/api/basic/farm";
import {
    mapGetters
} from "vuex";
import {
    getUserTree
} from "@/api/system/user";

export default {
    data() {
        return {
            dialogVisible: false,
            form: {},
            query: {},
            loading: true,
            frameUrl: "live.html",
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            selectionList: [],
            init: {
                userTree: []
            },
            option: {
                addBtn: true,
                tip: false,
                border: true,
                index: true,
                viewBtn: true,
                selection: true,
                searchMenuSpan: 4,
                column: [{
                        label: "基地名称",
                        prop: "farmName",
                        search: true,
                        rules: [{
                            required: true,
                            message: "请输入基地名称",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: "场主",
                        prop: "farmerId",
                        multiple: true,
                        type: "tree",
                        dicData: [],
                        props: {
                            label: "title"
                        },
                        slot: true,
                        rules: [{
                            required: false,
                            message: "请选择场主",
                            trigger: "click"
                        }]
                    },
                    {
                        label: "性质",
                        width: 120,
                        prop: "attribute",
                        type: "select",
                        dicData: [{
                                label: "独资",
                                value: "独资"
                            },
                            {
                                label: "合资",
                                value: "合资"
                            },
                            {
                                label: "政府扶持",
                                value: "政府扶持"
                            },
                            {
                                label: "资金注入",
                                value: "资金注入"
                            },
                            {
                                label: "联营",
                                value: "联营"
                            },
                            {
                                label: "合作",
                                value: "合作"
                            },
                            {
                                label: "其他",
                                value: "其他"
                            }
                        ],
                        rules: [{
                            required: true,
                            message: "请选择基地性质",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: "省份",
                        prop: "provinceCode",
                        type: "select",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        slot: true,
                        hide: true,
                        // cascaderItem: ["city", "regid"],
                        cascaderItem: ["cityCode", "countyCode"],
                        cascaderChange: true,
                        dicUrl: "/api/mkx-farm/farm/getProvince",
                        rules: [{
                            required: true,
                            message: "请选择省份",
                            trigger: "click"
                        }]
                    },
                    {
                        label: "城市",
                        prop: "cityCode",
                        type: "select",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        slot: true,
                        hide: true,
                        defaultIndex: 0,
                        dicFlag: false,
                        dicUrl: "/api/mkx-farm/farm/getCity/{{key}}",
                        rules: [{
                            required: true,
                            message: "请选择城市",
                            trigger: "click"
                        }]
                    },
                    {
                        label: "区县",
                        //  prop: "regid",
                        prop: 'countyCode',
                        type: "select",
                        props: {
                            label: "name",
                            value: "code"
                        },
                        slot: true,
                        hide: true,
                        defaultIndex: 0,
                        dicFlag: false,
                        dicUrl: "/api/mkx-farm/farm/getArea/{{key}}",
                        rules: [{
                            required: true,
                            message: "请选择区县",
                            trigger: "click"
                        }]
                    },
                    {
                        label: "所在地区",
                        prop: "regname",
                        display: false
                    },
                    {
                        label: "详细地址",
                        prop: "address",
                        rules: [{
                            required: true,
                            message: "请输入详细地址",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: "联系方式",
                        prop: "telephone",
                        rules: [{
                            required: false,
                            message: "请输入联系方式",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: '经纬度',
                        prop: "coords",
                        rules: [{
                            required: false,
                            message: "请输入经纬度",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: "规模",
                        prop: "scale",
                        hide: true
                    },
                    {
                        label: "合作社",
                        prop: "cooperative",
                        hide: true,
                        rules: [{
                            required: false,
                            message: "请输入合作社",
                            trigger: "blur"
                        }]
                    },
                    /*         {
                                label: "排序",
                                prop: "sort",
                                type: "number",
                                hide: true,
                                rules: [{
                                    required: true,
                                    message: "请输入排序",
                                    trigger: "blur"
                                }]
                            }, */
                    {
                        label: "备注",
                        prop: "remark",
                        hide: true,
                        rules: [{
                            required: false,
                            message: "请输入备注",
                            trigger: "blur"
                        }]
                    },
                    {
                        label: "状态",
                        prop: "status",
                        hide: true,
                        display: false
                    },
                    {
                        label: '图片',
                        prop: 'photourl',
                        dataType: 'string',
                        type: 'upload',
                        propsHttp: {
                            url: 'data'
                        },
                        span: 24,
                        listType: 'picture-card',
                        tip: '只能上传jpg/png文件，且不超过1Mb',
                        action: '/api/alioss/imgupload'
                    }
                ]
            },
            data: [{}]
        };
    },
    computed: {
        ...mapGetters(["permission"]),
        permissionList() {
            return {
                addBtn: this.vaildData(this.permission.farm_add, true),
                viewBtn: this.vaildData(this.permission.farm_view, true),
                delBtn: this.vaildData(this.permission.farm_delete, true),
                editBtn: this.vaildData(this.permission.farm_edit, true)
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
            if (row.$regid != undefined) {
                row.regname = row.$province + row.$city + row.$regid;
            }
            row.farmerId = row.farmerId.join(",");
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
            if (row.$regid != undefined) {
                row.regname = row.$province + row.$city + row.$regid;
            }
            row.farmerId = row.farmerId.join(",");
            console.log(row);
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
                    res.data.data.province = res.data.data.regid.substring(0, 2) + "0000";
                    res.data.data.city = res.data.data.regid.substring(0, 4) + "00";
                    this.form = res.data.data;

                    this.form.farmerId = this.form.farmerId.split(",");
                    this.form.farmerId.forEach((ele, index) => {
                        this.form.farmerId[index] = Number(ele);
                    });
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
        handleLiveButton() {
            this.$router.push('/device/camera/livevideo');
        },
        handleLive(row) {
            //this.$router.push({path:'/report/test4',query:{id:row.id}});

            var url =
                "http://hls01open.ys7.com/openlive/7b6fab0620714d349cbd838e06baa742.hd.m3u8";
            if (row.id === 4)
                url =
                "http://hls01open.ys7.com/openlive/b8dec2f4941346559ecc41fae38b9509.hd.m3u8";
            else if (row.id === 10)
                url =
                "http://hls.open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.m3u8";

            this.frameUrl = "live.html?url=" + url;
            this.dialogVisible = true;
            // copy(row.id).then(() => {
            //   this.onLoad(this.page);
            //   this.$message({
            //     type: "success",
            //     message: "复制成功!"
            //   });
            // });
        },
        onLoad(page, params = {}) {
            this.loading = true;
            getList(
                page.currentPage,
                page.pageSize,
                Object.assign(params, this.query)
            ).then(res => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            });
            //角色代码 2（养殖基地场主）
            getUserTree("2").then(res => {
                // const index = this.$refs.crud.findColumnIndex("farmerId");
                // this.option.column[index].dicData = res.data.data;
                console.log(res)
                const column = this.findObject(this.option.column, "farmerId");
                column.dicData = res.data.data;
            });
        },
        uploadBefore(file, done, loading, column) {
            if (!file.name.toLowerCase().includes(".jpg") && !file.name.toLowerCase().includes(".png")) {
                this.$message.error('文件扩展名需要为jpg或png')
                loading(false)
            } else if (file.size > 1024 * 1024) {
                this.$message.error('文件大小不能超过1M')
                loading(false)
            } else {
                done()
            }
        },
        uploadAfter(res, done, loading, column) {
            console.log('uploadAfter')
            console.log(res)
            done()
        }
    }
};
</script>

<style>
.customWidth {
    max-width: 800px;
    width: 100%;
}
</style>
