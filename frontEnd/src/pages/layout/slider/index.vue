<template>
  <el-aside width="18rem" class="slideBar">
    <el-tree :props="props" :load="loadNode" lazy @node-click="nodeClick" node-key="id" :expand-on-click-node="false" :default-expanded-keys="expands" >
    </el-tree>
  </el-aside>
</template>
<script>
import {getArea, catchError, getProject} from '@/api/api'
import {mapGetters} from 'vuex'
export default {
  name: 'silderBar',
  data () {
    return {
      menu: [],
      props: {
        label: 'title',
        children: 'children',
        isLeaf: 'leaf'
      },
      expands: []
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters(['rootParentId'])
  },
  methods: {
    getArea (parentId, resolve) {
      getArea({per_page: 999, p: 1, parentId: parentId}).then(datas => {
        let {errno, data} = datas
        if (errno === 0) {
          if (data.length !== 0) {
            if (parentId === this.rootParentId) {
              this.expands = [...this.expands, data[0].id]
            }
            resolve(data)
          } else {
            return this.getProject(parentId, resolve)
          }
        }
      }).catch(e => catchError(e, this))
    },
    getProject (parentId, resolve) {
      getProject({per_page: 999, p: 1, area: parentId}).then(datas => {
        let {errno, data} = datas
        if (errno === 0) {
          for (let i = 0; i < data.length; i++) {
            data[i].leaf = true
          }
          resolve(data)
        }
      }).catch(e => catchError(e, this))
    },
    selectHandle (item) {
      this.$emit('changeItem', item)
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return this.getArea(this.rootParentId, resolve)
      } else if (!node.data.area) {
        return this.getArea(node.data.id, resolve)
      } else {
        resolve([])
      }
    },
    nodeClick (data, node) {
      if (node.level === 1) {
        this.selectHandle([data])
      } else {
        let temp = []
        do {
          temp.push(node.data)
          node = node.parent
        } while (node.level > 0)
        this.selectHandle(temp.reverse())
      }
    }
  },
  beforeMount () {
  }
}
</script>
<style lang="less">
.slideBar{
  padding: 1rem 0 1rem 1rem;
  border-right: solid 1px #e6e6e6;
  background: #f8fff7;
  .el-tree{
    background: #f8fff7;
    color: #000;

    .el-tree-node{
      &.is-current{
        .el-tree-node__content{
          color: #024093;
        }
      }
      .el-tree-node__content{
        height: 3rem;
      }
    }
    .el-tree-node__expand-icon{
      color: inherit;
      &.is-leaf:before{ content: "\E614";}
      /*&.el-icon-caret-right:before {
        content: "\e629";
    }*/
    }
  }
}
</style>
