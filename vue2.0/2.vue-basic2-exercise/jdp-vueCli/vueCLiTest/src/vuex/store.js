import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  count:3,
}

const mutations = {
  add(state,n){
    state.count++;
  },
  reduce(state){
    state.count--;
  }
}

const getters = {
  count:function(state){
    return state.count += 100
  }
}

const actions ={
  addAction(context){
    context.commit('add',10)
    setTimeOut(()=>{context.commit(reduce)},3000);
    console.log('我比reduce提前执行');
  },
  reduceAction({commit}){
    commit('reduce')

  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
