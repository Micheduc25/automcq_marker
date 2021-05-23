import { createStore } from 'vuex'

export default createStore({
  state: ()=>{
    return {
      isFirstRun:true
    }
  },
  mutations: {
    setIsFirstRunMut(state,value){
      state.isFirstRun = value;
    }
  },
  actions: {
    setIsFirstRun({commit,state},value){
      if(state.isFirstRun!==value)commit("setIsFirstRunMut",value);
    }
  },
  modules: {
  }
})
