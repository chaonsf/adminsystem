<template>
<div class='editadd'>
    <div>
        <el-form label-width="120px" class='form'>
            <el-form-item label="输入标题">
                <el-input v-model="query.title"></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker v-model="query.publishTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options='startime'>
                </el-date-picker>
            </el-form-item>
            <el-form-item label='资讯类型'>
                <el-select v-model="query.type">
                    <el-option v-for='item in options' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='是否设为头条'>
                <el-checkbox v-model="query.top"></el-checkbox>
            </el-form-item>
            <el-form-item label="首页图片">
                <el-upload class="upload-demo" :action="uploadUrl" :headers="header" :limit="1" :on-success='success' :on-remove="remove" list-type="picture" :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
    <div class="content">
        <Rich ref='richtext' :cont='this.query.content'></Rich>

    </div>
    <div class='footer'>
        <el-button type='primary' @click='submit'>提交</el-button>
    </div>
</div>
</template>

<script>
import {
    getToken
} from '@/util/auth'
import {
    infotype,
    addnew,
    newdetail
} from '@/api/poverty'
import Rich from "@/components/newcomponent/richtext"
import {
    Loading
} from 'element-ui';
const startime = () => {
    return {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
        }
    }
}
export default {
    props: ['id'],
    components: {
        Rich
    },
    data() {
        return {
            query: {
                content: '',
                publishTime: '',
                title: '',
                imgUrl: '',
                type: '',
                top: 0
            },
            options: [],
            uploadUrl: '/api/alioss/imgupload',
            header: {
                'Blade-Auth': 'bearer ' + getToken()
            },
            fileList: [],
            startime: startime()
        }
    },
    created() {
        this.loadtype()
    },
    watch: {
        id() {
            if (this.id != 'a') {
                this.editload()
            } else {
                this.query = {
                    content: '',
                    publishTime: '',
                    title: '',
                    imgUrl: '',
                    type: ''
                }
                this.fileList = []
            }
        }
    },
    methods: {
        loadtype() {
            infotype().then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    let arr = []
                    for (let key in data) {
                        arr.push({
                            value: key,
                            label: data[key]
                        })
                    }
                    this.options = arr
                    if (this.id != "a") {
                        this.editload()
                    }
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        success(res, file) {
            this.query.imgUrl = file.response.data
        },
        remove(res, file) {
            this.query.imgUrl = ''
        },
        submit() {
            let rich = this.$refs.richtext;
            let query = this.query
            if (this.query.top) {
                this.query.top = 1
            } else {
                this.query.top = 0
            }
            let param = {
                ...query,
                content: rich.content,
                id: this.id == "a" ? "" : this.id,

            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            addnew(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    msg,
                    data
                } = res.data
                if (code == 200) {
                    this.$msg({
                        msg: "操作成功",
                        type: 'info'
                    })
                    this.$emit("close")
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        editload() {
            let param = {
                id: this.id
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            newdetail(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.query = {
                        content: data.info,
                        title: data.tile,
                        type: "" + data.type,
                        top: data.top == 1 ? true : false,
                        publishTime: data.publishTime.substring(0, 10)
                    }
                    this.fileList = []
                    if (data.imgUrl) {
                        this.fileList.push({
                            url: data.imgUrl
                        })
                    }

                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        }
    }

}
</script>

<style lang="scss">
.editadd {
    .content {
        margin-bottom: 20px;
    }

    .footer {
        text-align: center;

    }

    .form {
        .el-input__inner {
            width: 300px;
        }
    }
}
</style>
