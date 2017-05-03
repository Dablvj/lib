var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='

var demo = new Vue({
  el:'#demo',
  data:{
    branches:['master','dev'],
    currentBranch:'master',
    commits:null
  },
  created:function(){
    this.fetchData()
  },
  watch:{
    currentBranch: 'fetchData'
  },
  methods:{
    fetchData:function(){
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET',apiURL + self.currentBranch)
      xhr.onload = function(){
        self.commits = JSON.parse(xhr.responseText)
        console.log(self.commits[0])
        console.log(self.commits[0].html_url)
        console.log(self.commits[0].sha.slice(0,7))
        console.log(self.commits[0].commit.message)
        console.log(self.commits[0].author.html_url)
        console.log(self.commits[0].commit.author.name)
        console.log(self.commits[0].commit.author.date)
      }
      xhr.send()
    }
  }
})
