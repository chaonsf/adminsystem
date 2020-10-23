<template>
<div class='queryconsole'>
    <h3>{{title}}</h3>
    <quill-editor v-model="content" @focus="onEditorFocus($event)" class='queryq ql-editor'>

    </quill-editor>
</div>
</template>

<script>
import {
    newdetail
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
export default {
    props: ['id'],
    data() {
        return {
            content: '',
            title: ''
        }
    },
    created() {
        this.load()
    },
    watch: {
        id() {
            this.load()
        }
    },
    methods: {
        load() {
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
                    this.title = data.tile
                    this.content = data.info
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        onEditorFocus(event) {
            event.enable(false);
        }
    }
}
</script>

<style lang="scss">
.queryconsole {
    h3 {
        text-align: center;
    }

    .queryq {
        .ql-toolbar {
            display: none;
        }

        .ql-container.ql-snow {
            border: none;
        }
    }
}
</style>
