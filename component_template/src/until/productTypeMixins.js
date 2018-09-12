import {getProductType} from '@/api/api.js'
export const productTypeMixins = {
  mounted () {
    getProductType().then(data => {
      let newArry = []
      let resultArry = []
      for (let i = 0; i < data.data.length; i++) {
        let obj = {}
        obj.id = data.data[i].id
        obj.value = data.data[i].id
        obj.label = data.data[i].title
        obj.parentId = data.data[i].parentId
        newArry.push(obj)
      }
      for (let j = 0; j < newArry.length; j++) {
        if (newArry[j].parentId === 0) {
          resultArry.push(newArry[j])
        }
        for (let k = 0; k < newArry.length; k++) {
          if (newArry[k].parentId === newArry[j].id) {
            if (!newArry[j].children) {
              newArry[j].children = []
            }
            newArry[j].children.push(newArry[k])
          }
        }
      }
      this.options = resultArry
      if (this.options[0].children.length) {
        this.selectedOptions = [this.options[0].value, this.options[0].children[0].value]
      } else {
        this.selectedOptions = [this.options[0].value]
      }
    })
  }
}
