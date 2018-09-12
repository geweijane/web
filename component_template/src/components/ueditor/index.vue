<template>
  <div style="line-height: normal;">
    <script :id="id" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: 'UE',
  data () {
    return {
      editor: null
    }
  },
  props: {
    id: {
      type: String,
      default: 'editor'
    },
    value: {
      type: String
    },
    config: {
      type: Object
    }
  },
  mounted () {
    const _this = this
    this.editor = window.UE.getEditor(this.id, this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.value) // 确保UE加载完成后，放入内容。
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>
