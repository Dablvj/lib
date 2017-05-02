// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  replace: true,
  // 如果设为 true（这是默认值），模板将覆盖挂载元素，并合并挂载元素和模板根节点的 attributes。
  // 如果设为 false 模板将覆盖挂载元素的内容，不会替换挂载元素自身。
  props: {
    data: Array,
    columns: Array,
    filterKey: String
    // 由于html的特性是不区分大小写（比如LI和li是一样的）.
    // 因此，html标签中要传递的值要写成短横线式的（如btn-test），以区分大小写.
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        //filter()方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
          // map():返回一个新的Array，每个元素为调用func的结果
          // filter():返回一个符合func条件的元素数组
          // some():返回一个boolean，判断是否有元素是否符合func条件
          // every():返回一个boolean，判断每个元素是否符合func条件
          // forEach():没有返回值，只是针对每个元素调用func
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
      console.log(data);
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 }
    ]
  }
})
