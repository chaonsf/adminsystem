<template>
<div>
    <quill-editor v-model="content" class='ql-editor' ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    </quill-editor>
</div>
</template>

<script>
import Quill from "quill";
import ImageResize from "quill-image-resize-module";
import {
    ImageDrop
} from "quill-image-drop-module";
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);
var Font = Quill.import('formats/font');
var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
Font.whitelist = fonts; //将字体加入到白名单 
Quill.register(Font, true);

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
    [{
        header: 1
    }, {
        header: 2
    }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{
        list: "ordered"
    }, {
        list: "bullet"
    }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{
        script: "sub"
    }, {
        script: "super"
    }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{
        indent: "-1"
    }, {
        indent: "+1"
    }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{
        direction: "rtl"
    }], // 文本方向-----[{'direction': 'rtl'}]
    [{
        size: ["small", false, "large", "huge"]
    }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{
        header: [1, 2, 3, 4, 5, 6, false]
    }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{
        color: []
    }, {
        background: []
    }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{
        // font: []
        font: fonts
    }], // 字体种类-----[{ font: [] }]
    [{
        align: []
    }], // 对齐方式-----[{ align: [] }]
    ["clean"], // 清除文本格式-----['clean']
    ["image", "video"] // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
    props: ['cont'],
    data() {
        return {
            content: '',
            editorOption: { //  富文本编辑器配置
                modules: {
                    // toolbar: '#toolbar',
                    toolbar: toolbarOptions,
                    imageDrop: true,
                    imageResize: {
                        displayStyles: {
                            backgroundColor: "black",
                            border: "none",
                            color: "white"
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"]
                    },
                },
                theme: 'snow',
                placeholder: '请输入正文'
            },
        }
    },
    watch: {
        cont() {
            // e.container.querySelector('.ql-blank').innerHTML = this.cont
            this.content = this.cont
        }
    },
    methods: {
        onEditorBlur(ed) {
            //console.log('blur',this.content)
            let quill = this.$refs.myQuillEditor.quill
        },

        onEditorFocus() {
            // console.log('focus',this.content)
        },

        onEditorReady(e) {
            e.container.querySelector('.ql-blank').innerHTML = this.cont
            // console.log('ready',this.content)
        },
    }
}
</script>

<style lang="scss">
.ql-editor {
    min-height: 100px;
}

.editor {
    line-height: normal !important;
    height: 500px;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
    content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

/* .ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
} */
</style>
