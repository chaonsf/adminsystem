<template>
<div class="typr">
    <el-form :inline="true">
        <el-form-item>
            <el-button type="primary" @click="add">添加新的险种</el-button>
        </el-form-item>
        <el-form-item label='状态'>
            <el-select placeholder="选择状态" v-model="zhuantai" @change="query">
                <el-option v-for='item in zhuantaidata' :key='item.value' :value='item.value' :label="item.label"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入关键词搜索" prefix-icon="el-icon-search" v-model="keyword" @keyup.enter.native='query'> </el-input>
        </el-form-item>
    </el-form>
    <div class="content">
        <ul class='ul'>
            <li v-for="item in list" :key='item.id'>
                <el-row :gutter="30">
                    <el-col :span='7'>
                        <div class="left">
                            <el-image :lazy='true' :src='item.image'></el-image>
                            <div>
                                <span class='detitle'>{{item.name}}</span>
                                <span class="f14 desc">{{item.description}}</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span='6'>
                        <div class="item">
                            保额:<span class='red'>{{item.unit_price}}</span>元/<span>{{item.unit}}</span>
                        </div>
                    </el-col>
                    <el-col :span='5'>
                        <div class='item'>
                            <span class="red">{{item.minimumAmount}}元</span>起
                        </div>
                    </el-col>
                    <el-col :span='6'>
                        <div class="item">
                            <span class='button' v-if='item.status==0' @click="pushshelf(item)">上架</span>
                            <span class='button' v-if='item.status==1' @click="pushshelf(item)">下架</span>
                            <span class='button' v-if='item.status==0' @click='editdetail(item)'>编辑</span>
                            <span class='button' v-if='item.status==1' @click='querydetail(item)'>查看</span>
                        </div>
                    </el-col>
                </el-row>

            </li>
        </ul>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='true' :page-sizes="[5, 10, 15, 20]"> </el-pagination>
    </div>
    <el-dialog :visible.sync='addbox' :title="title" width='1008px' class="addbox" :close-on-click-modal='false'>
        <el-form label-width="110px" :inline="true">
            <el-form-item label='保险名称:'>
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label='简称:'>
                <el-input v-model="form.shortName"></el-input>
            </el-form-item>
            <el-form-item label='承保单位:'>
                <el-input v-model="form.company"></el-input>
            </el-form-item>
            <el-form-item label='起保数量:'>
                <el-input v-model="form.minQuantity"></el-input>
            </el-form-item>
            <el-form-item label='保障金额：'>
                <el-input v-model="form.unitPrice" type='number'></el-input>
            </el-form-item>
            <el-form-item label='保障金额单位:'>
                <el-input v-model="form.unit"></el-input>
            </el-form-item>
            <el-form-item label='保费单价:'>
                <el-input v-model="form.unitCost" type='number'></el-input>
            </el-form-item>
            <el-form-item label='品类:'>
                <el-select placeholder="品类" v-model="form.category" @change='category'>
                    <el-option v-for='item in categorys' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='属性:'>
                <el-select placeholder="属性" v-model="form.property">
                    <el-option v-for='item in attrs' :key='item.value' :value='item.value' :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品图片:" class='upload'>
                <el-upload class="upload-demo" :action="uploadUrl" :headers="header" :limit="1" :on-success='success3' :on-remove="remove3" :file-list="fileList">
                    <el-button size="small" type="primary">上传保险产品主图</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label='保险资料上传:' class='upload'>
                <el-upload class="upload-demo" :action="uploadUrl" :headers="header" :limit="1" :on-success='success' :on-remove="remove" :file-list="fileList1">
                    <el-button size="small" type="primary">上传投保须知</el-button>
                </el-upload>
                <el-upload class="upload-demo" :action="uploadUrl" :headers="header" :limit="1" :on-success='success1' :on-remove="remove1" :file-list="fileList2">
                    <el-button size="small" type="primary">上传保险条款</el-button>
                </el-upload>
                <el-upload class="upload-demo" :action="uploadUrl" :headers="header" :limit="1" :on-success='success2' :on-remove="remove2" :file-list="fileList3">
                    <el-button size="small" type="primary">上传服务协议</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="保险内容简介:">
                <el-input type="textarea" :rows="3" v-model="form.intro" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="详细保障内容:">
                <el-input type="textarea" :rows="3" v-model="form.guaranteeContent"></el-input>
            </el-form-item>
            <el-form-item label="标的要求：">
                <el-input type="textarea" :rows="3" v-model="form.underlyingNofitication"></el-input>
            </el-form-item>
            <el-form-item label="保费计算方式：">
                <el-input type="textarea" :rows="3" v-model="form.premiumCal"></el-input>
            </el-form-item>
            <el-form-item label="优惠比例：">
                <el-input v-model="form.discount" type='number'>
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="保障期限：">
                <el-input type="textarea" :rows="3" v-model="form.guaranteePeriod"></el-input>
            </el-form-item>
            <el-form-item label="免责条款：">
                <el-input type="textarea" :rows="3" v-model="form.exceptionClause"></el-input>
            </el-form-item>
            <el-form-item label="理赔说明：">
                <el-input type="textarea" :rows="3" v-model="form.claimTemplate"></el-input>
            </el-form-item>
            <el-form-item label="情况告知：">
                <el-input type="textarea" :rows="3" v-model="form.conditionNotice"></el-input>
            </el-form-item>
        </el-form>
        <div class='area'>
            <el-button type="primary" @click="submit" class="submit">提交</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync='querybox' title="查看" width='1008px' class="addbox" :close-on-click-modal='false'>
        <!--         <el-row>
            <el-col :span='8'>保险名称:{{form.name}}</el-col>
            <el-col :span='8'>简称:{{form.shortName}}</el-col>
            <el-col :span='8'>承保单位:{{form.company}}</el-col>
            <el-col :span='8'>保障金额：{{form.unitPrice}}/{{form.unit}}</el-col>
            <el-col :span='8'>保费单价:{{form.unitCost}}</el-col>
            <el-col :span='24'>
                <label>产品图片:</label>
                <el-upload class="upload-demo" :file-list="fileList" :disabled='true'>
                </el-upload>
            </el-col>
            <el-col :span='24'>
                <label>保险资料:</label>
                <el-upload class="upload-demo" :file-list="fileList1" :disabled='true'>
                </el-upload>
                <el-upload class="upload-demo" :file-list="fileList2" :disabled='true'>
                </el-upload>
                <el-upload class="upload-demo" :file-list="fileList3" :disabled='true'>
                </el-upload>
            </el-col>
            <el-col :span='24'>保险内容简介:{{form.intro}}</el-col>
            <el-col :span='24'>详细保障内容:{{form.guaranteeContent}}</el-col>
            <el-col :span='24'>标的要求:{{form.underlyingNofitication}}</el-col>
            <el-col :span='24'>保费计算方式：{{form.premiumCal}}</el-col>
            <el-col :span='24'>优惠比例：{{form.discount}}%</el-col>
            <el-col :span='24'>保障期限：{{form.guaranteePeriod}}</el-col>
            <el-col :span='24'>免责条款：{{form.exceptionClause}}</el-col>
            <el-col :span='24'>理赔说明：{{form.claimTemplate}}</el-col>
            <el-col :span='24'>情况告知:{{form.conditionNotice}}</el-col>
        </el-row> -->
        <el-form label-width="110px" :inline="true">
            <el-form-item label='保险名称:'>
                <el-input v-model="form.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='简称:'>
                <el-input v-model="form.shortName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='承保单位:'>
                <el-input v-model="form.company" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='起保数量:'>
                <el-input v-model="form.minQuantity" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='保障金额：'>
                <el-input v-model="form.unitPrice" type='number' :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='保障金额单位:'>
                <el-input v-model="form.unit" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='保费单价:'>
                <el-input v-model="form.unitCost" type='number' :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label='品类:'>
                <el-select placeholder="品类" v-model="form.category" @change='category'>
                    <el-option v-for='item in categorys' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue" :disabled="true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='属性:'>
                <el-select placeholder="属性" v-model="form.property">
                    <el-option v-for='item in attrs' :key='item.value' :value='item.value' :label="item.name" :disabled="true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品图片:" class='upload'>
                <el-upload class="upload-demo" :file-list="fileList" :disabled="true">
                    <el-button size="small" type="primary">上传保险产品主图</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label='保险资料上传:' class='upload'>
                <el-upload class="upload-demo" :file-list="fileList1" :disabled="true">
                    <el-button size="small" type="primary">上传投保须知</el-button>
                </el-upload>
                <el-upload class="upload-demo" :file-list="fileList2" :disabled="true">
                    <el-button size="small" type="primary">上传保险条款</el-button>
                </el-upload>
                <el-upload class="upload-demo" :file-list="fileList3" :disabled="true">
                    <el-button size="small" type="primary">上传服务协议</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="保险内容简介:">
                <el-input type="textarea" :rows="3" v-model="form.intro" maxlength="30" show-word-limit :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="详细保障内容:">
                <el-input type="textarea" :rows="3" v-model="form.guaranteeContent" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="标的要求：">
                <el-input type="textarea" :rows="3" v-model="form.underlyingNofitication" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="保费计算方式：">
                <el-input type="textarea" :rows="3" v-model="form.premiumCal" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="优惠比例：">
                <el-input v-model="form.discount" type='number' :disabled="true">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="保障期限：">
                <el-input type="textarea" :rows="3" v-model="form.guaranteePeriod" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="免责条款：">
                <el-input type="textarea" :rows="3" v-model="form.exceptionClause" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="理赔说明：">
                <el-input type="textarea" :rows="3" v-model="form.claimTemplate" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="情况告知：">
                <el-input type="textarea" :rows="3" v-model="form.conditionNotice" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import {
    instype,
    shelf,
    insurstatus,
    addinsurance,
    dictionary,
    attribute,
    insurancedetail
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import {
    getToken
} from '@/util/auth'
export default {
    data() {
        return {
            keyword: "",
            list: [],
            zhuantai: ' ',
            zhuantaidata: [],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 5,
                pagerCount: 5,
            },
            addbox: false,
            querybox: false,
            categorys: [], //品类
            attrs: [], //属性
            insProdId: '',
            title: '添加新的险种',
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            form: {
                name: '',
                shortName: '',
                unitPrice: "",
                unit: "",
                company: '',
                minQuantity: '',
                intro: '',
                insNotice: '',
                insClause: '',
                serviceAgreement: '',
                guaranteeContent: '',
                underlyingNofitication: '',
                premiumCal: '',
                guaranteePeriod: '',
                exceptionClause: "",
                claimTemplate: '',
                conditionNotice: "",
                image: '',
                category: '', //品类id
                property: '', //属性id
                discount: '',
                unitCost: '',

            },
            uploadUrl: '/api/alioss/imgupload',
            header: {
                'Blade-Auth': 'bearer ' + getToken()
            },
        }
    },
    created() {
        this.loadstatus()
        this.category()
    },
    methods: {
        query() {
            let param = {
                keyword: this.keyword,
                current: this.page.currentPage,
                size: this.page.pageSize,
                status: this.zhuantai
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            instype(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.page.total = data.total
                    this.list = data.records
                    if (data.length == 0) {
                        this.$msg({
                            msg: '没有查询到数据'
                        })
                    }
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        currentChange(cur) {
            this.page.currentPage = cur
            this.query()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.query()
        },
        pushshelf(item) {
            let param = {
                insProdId: item.id,
                status: item.status == 0 ? '1' : '0'
            }
            shelf(param).then(res => {
                let {
                    code,
                    msg
                } = res.data
                if (code == 200) {
                    this.$msg({
                        msg,
                        type: 'info'
                    })
                    this.query()
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        loadstatus() {
            insurstatus().then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    let arr = [];
                    for (let key in data) {
                        arr.push({
                            value: key,
                            label: data[key]
                        })
                    }
                    arr.unshift({
                        value: ' ',
                        label: '全部'
                    })
                    this.zhuantaidata = arr
                    this.query()
                } else {
                    this.$msg({
                        msg
                    })
                }
            })

        },
        add() {
            this.title = '添加新的险种'
            this.addbox = true
            this.form = {
                name: '',
                shortName: '',
                unitPrice: "",
                unit: "",
                company: '',
                minQuantity: '',
                intro: '',
                insNotice: '',
                insClause: '',
                serviceAgreement: '',
                guaranteeContent: '',
                underlyingNofitication: '',
                premiumCal: '',
                guaranteePeriod: '',
                exceptionClause: "",
                claimTemplate: '',
                conditionNotice: "",
                image: '',
                category: '', //品类id
                property: '', //属性id
                discount: '',
                unitCost: '',
            }
            this.fileList = []
            this.fileList1 = []
            this.fileList2 = []
            this.fileList3 = []
        },
        success(res, file) {
            this.form.insNotice = file.response.data
        },
        remove(res, file) {
            this.form.insNotice = ''
        },
        success1(res, file) {
            this.form.insClause = file.response.data
        },
        remove1(res, file) {
            this.form.insClause = ''
        },
        success2(res, file) {
            this.form.serviceAgreement = file.response.data
        },
        remove2(res, file) {
            this.form.serviceAgreement = ''
        },
        success3(res, file) {
            this.form.image = file.response.data
        },
        remove3() {
            this.form.image = ''
        },
        submit() {
            let form = this.form
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            addinsurance(form).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.addbox = false
                    this.$msg({
                        msg: '提交成功',
                        type: 'info'
                    })
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        category() {
            let param = {
                code: "livestock"
            }
            this.form.property = ''
            this.attrs = []
            dictionary(param).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.categorys = data
                    this.shuxing()
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        shuxing() {
            let param = {
                category: this.form.category
            }
            attribute(param).then(res => {
                let {
                    code,
                    msg,
                    data
                } = res.data
                if (code == 200) {
                    this.attrs = data
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        editdetail(item) {
            this.title = '编辑品种'
            this.addbox = true
            this.other(item)

        },
        querydetail(item) {
            this.querybox = true;
            this.other(item)
        },
        other(item) {
            let id = item.id;
            let param = {
                insProdId: id
            }

            insurancedetail(param).then(res => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.form = Object.assign({}, this.form, data)
                    this.shuxing()
                    let a = data.image.split('/')
                    let b = data.insNotice.split('/')
                    let c = data.insClause.split('/')
                    let d = data.serviceAgreement.split('/')
                    this.fileList = [{
                        url: data.image,
                        name: a[a.length - 1]
                    }]
                    this.fileList1 = [{
                        name: b[b.length - 1],
                        url: data.insNotice
                    }]
                    this.fileList2 = [{
                        name: c[c.length - 1],
                        url: data.insClause
                    }]
                    this.fileList3 = [{
                        name: d[d.length - 1],
                        url: data.serviceAgreement
                    }]
                }
            })
        }
    }
}
</script>

<style lang="scss">
.typr {
    padding: 10px 20px;
    background: #fff;
    height: 100%;

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }

    ul,
    li {
        list-style: none;
    }

    .ul {
        li {
            min-height: 80px;
            font-size: 16px;
            color: #333;
            border-bottom: 1px #e6e6e6 solid;
            margin-top: 10px;

            .left {
                display: flex;
                flex-direction: row;
                overflow: hidden;

                .el-image {
                    width: 70px;
                    height: 70px;
                    margin-right: 20px;

                    .el-image__inner {
                        width: 70px;
                    }
                }
            }

            .red {
                color: #E93C47;
            }

            .f14 {
                font-size: 14px;
                color: #666;

            }

            .detitle {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }

            .desc {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                margin-top: 5px;
            }

            .item {
                line-height: 80px;

                .button {
                    display: inline-block;
                    background: #409EFF;
                    color: #fff;
                    border-radius: 4px;
                    height: 36px;
                    line-height: 36px;
                    font-size: 14px;
                    padding: 0 32px;
                    margin-right: 10px;
                    cursor: pointer;
                }
            }
        }
    }
}

.addbox {
    .el-dialog {
        height: 80%;
        overflow-y: scroll;
        padding-bottom: 150px;

        &::-webkit-scrollbar {
            display: none;
        }

        &__body {

            /*     height: 100%;
            padding-bottom: 150px;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                display: none;
            } 
 */
            .el-select {
                width: 182px;
            }

            .upload {
                .el-form-item__content {
                    min-width: 600px;
                }
            }

            .el-input-group--append {
                width: 182px;
            }

            .el-form-item__content {
                width: 182px;
            }

            .area {
                text-align: center;

                .submit {
                    width: 200px;
                }
            }

        }
    }
}
</style>
