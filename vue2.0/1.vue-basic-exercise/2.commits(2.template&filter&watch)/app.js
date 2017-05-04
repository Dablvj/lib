var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='

/**
 * Actual demo
 */

var demo = new Vue({

  el: '#demo',

  data: {
    branches: ['master', 'dev'],
    currentBranch: 'master',
    commits: null
  },

  created: function () {
    this.fetchData()
  },

  watch: {
    currentBranch: 'fetchData'
  },

  filters: {
    truncate: function (v) {
      var newline = v.indexOf('\n')
      return newline > 0 ? v.slice(0, newline) : v
    },
    formatDate: function (v) {
      return v.replace(/T|Z/g, ' ')
    }
  },

  methods: {
    fetchData: function () {
      var xhr = new XMLHttpRequest()// 创建XMLHttpRequest对象用于与后台服务器交换数据
      var self = this
      //在使用XHR对象时，必须先调用open()方法，进行连接，
	    //它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
      xhr.open('GET', apiURL + self.currentBranch)
      //接收
      //XHR1
      // xhr.onreadystatechange = function(){
      //   if( xhr.readyState == 4 && xhr.status == 200 ) { // readyState==4说明请求已完成
      // 　    alert( xhr.responseText ) ;
      // 　}else{
      // 　    alert( xhr.statusText ) ;
      //   }
      // };
      //XHR2（XMLHttpRequest Level 2）
      //新版本的一些功能扩充：设置HTTP请求的时限。　
      // xhr.timeout = 3000 ;
      // xhr.ontimeout = function(event){
      //     alert('请求超时！');
      // } ;
      // xhr.onerror = function(){
      //     alert('error!')
      // }
      xhr.onload = function () {
        self.commits = JSON.parse(xhr.responseText)
        console.log(self.commits)
      }
      //发送
      xhr.send()
    }
  }
})
