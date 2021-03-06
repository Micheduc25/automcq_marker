import { createStore } from 'vuex';
import axios from 'axios';

const apiUrl = "http://127.0.0.1:8001/api";
export default createStore({
  state: ()=>{
    return {
      isFirstRun:true,
      currentSheet:{},
      sheetsToCorrect:{},
      quizes:[],
      user:null,
      token:'',
      isLoggedIn:false,
      letters:['A','B','C','D','E'],
      roman:['i','ii','iii','iv','v'],
      numeric:['1','2','3','4','5'],
    }
  },
  mutations: {
    setIsFirstRunMut(state,value){
      state.isFirstRun = value;
    },
    setCurrentSheetMut(state,formData){
      Object.assign(state.currentSheet,formData);
    },
    sheetsToCorrect(state,sheets){
      Object.assign(state.sheetsToCorrect,sheets);
      console.log("sheets set to ==>", state.sheetsToCorrect);
    },

    setUserMut(state,newuser){
      state.user = newuser;
    },
    setTokenMut(state,token){
      state.token = token;
    },
    setIsLoggedInMut(state,val){
      state.isLoggedIn=val;
    },
    setQuizesMut(state,quizes){
      state.quizes = quizes;
    },
    clearUserDataMut(state){
      state.user=null;
      state.isLoggedIn = false;
      state.currentSheet = {};
      state.sheetsToCorrect = {};
      state.quizes = [];
      
    }
  },
  actions: {
    setIsFirstRun({commit,state},value){
      if(state.isFirstRun!==value)commit("setIsFirstRunMut",value);
    },

    setCurrentSheet({commit},formData){
      commit('setCurrentSheetMut',formData);
    },

    async getUser({commit,state},token){

      return new Promise((resolve,reject)=>{
        axios.get(`${apiUrl}/me/`,{
          headers:{
            Authorization: `Token ${token||state.token}`,
            
          }
        })
        .then(res=>{
          commit("setUserMut",res.data);

          resolve(res.data)
        })
        .catch(err=>{
          reject(err);
        });
      });
    },
    
    setIsLoggedIn({commit},value){
      commit("setIsLoggedInMut",value);
    },
     async login({commit},{username,password}){

      return new Promise((resolve,reject)=>{
         axios.post(`${apiUrl}/auth-token/`,{username,password}).then(res=>{
            // console.log('user obtained',res.data);
            commit('setUserMut',res.data.user);
            commit('setTokenMut',res.data.token);
            commit('setIsLoggedInMut',true);
            resolve({token:res.data.token, user:res.data.user});
          }).catch(err=>{
            reject(err.response);
          })
      });
    },
    


    // eslint-disable-next-line no-unused-vars
    signup({commit},{username, email, password}){
      return new Promise((resolve,reject)=>{
        axios.post(`${apiUrl}/users/`,{username,email,password}).then(user=>{
           console.log('user created==>',user);
          //  commit('setUserMut',user);
           resolve(user.data);
         }).catch(err=>{
           console.log(err);
           reject(err.response);
         })
    })
  }
  ,

  generateChoicesOptions({state},quiz){
    const choiceNums = parseInt(quiz.choices);
    if(quiz.choiceLabels==="A-B-C"){
        return state.letters.slice(0,choiceNums);
    }
    else if(quiz.choiceLabels==="i-ii-iii"){
        return state.roman.slice(0,choiceNums);
    }
    else {
        return state.numeric.slice(0,choiceNums);
    }
},


  getQuizList({commit,state}){
    return new Promise((resolve,reject)=>{
      axios.get(
        `${apiUrl}/quizes/`,
        {
          headers:{
            Authorization:`Token ${state.token||localStorage.getItem('auth-token')}` 
          }
        }
      ).then(res=>{
         commit('setQuizesMut',res.data);
         resolve(res.data);
       }).catch(err=>{
         console.log(err);
         reject(err.response);
       })
  })
  },
  getQuiz({state,dispatch},qid){
    return new Promise((resolve,reject)=>{
      axios.get(
        `${apiUrl}/quizes/${qid}`,
        {
          headers:{
            Authorization:`Token ${state.token||localStorage.getItem('auth-token')}` 
          }
        }
      ).then(res=>{
          let finalObj = {...res.data, choiceList:dispatch('generateChoicesOptions',res.data)};
                    
          dispatch('setCurrentSheet',finalObj);

         resolve(finalObj);
       }).catch(err=>{
         reject(err.response);
       })
  })
  },

  createQuiz({commit,state},quizData){
    return new Promise((resolve,reject)=>{
      console.log(quizData,localStorage.getItem('auth-token'), state);
       axios.post(`${apiUrl}/quizes/`,quizData,{
         headers:{
           'Authorization': `Token ${state.token||localStorage.getItem('auth-token')}`
         }
       })
       .then((res)=>{
         console.log(res);
         const finalObj = {...res.data,...quizData}
         commit('setCurrentSheetMut',finalObj);
         resolve(finalObj);
       }).catch(err=>{
         reject(err.response);
       })
    });
  },

  // eslint-disable-next-line no-unused-vars
  editQuiz({commit,state, dispatch},{id,editData}){
    return new Promise((resolve,reject)=>{
       axios.put(`${apiUrl}/quizes/${id}`,editData,{
         headers:{
           'Authorization': `Token ${state.token||localStorage.getItem('auth-token')}`
         }
       })
       .then((res)=>{
         let finalObj = {...res.data, choiceList:dispatch('generateChoicesOptions',res.data)};
                    
         commit('setCurrentSheetMut',finalObj);
         resolve(finalObj);
       }).catch(err=>{
         reject(err.response);
       })
    });
  },

  deleteQuiz({state},qid){

    return new Promise((resolve,reject)=>{
      axios.delete(
        `${apiUrl}/quizes/${qid}`,
      {
        headers:{
          'Authorization': `Token ${state.token||localStorage.getItem('auth-token')}`
        }
      }
      ).then(res=>{
        resolve(res);
      }).catch(err=>{reject(err.response);})
    });
  },

  // eslint-disable-next-line no-unused-vars
  uploadAnswerSheets({commit,state},data){

    return new Promise((resolve,reject)=>{
      axios.post(`${apiUrl}/upload-sheets/`,data,{
        headers:{
          "Content-Type":"multipart/form-data",
          'Authorization': `Token ${state.token||localStorage.getItem('auth-token')}`,

        }
      }).then(res=>resolve(res)).catch(err=>reject(err));
      // commit('');
    });
  },

  // eslint-disable-next-line no-unused-vars
  saveQuizImages({commit,state},formData){
    return new Promise((resolve,reject)=>{
      axios.post(`${apiUrl}/images/`,formData,{
        headers:{
          'Authorization': `Token ${state.token||localStorage.getItem('auth-token')}`,
          "Content-Type":"multipart/form-data"
        }
      }).then(res=>{
        const data = res.data;
        console.log(data);
        resolve(data);
      
      })
      .catch(err=>reject(err.response));
      // commit('');
    });
  },

  logoutUser({commit}){
    localStorage.removeItem('auth-token');
    commit('clearUserDataMut');
  }
},

  getters:{
    isFirstRun:(state)=>state.isFirstRun,
    user:(state)=>state.user,
    isLoggedIn:(state)=>state.isLoggedIn,
    currentSheet:(state)=>state.currentSheet,
    quizes:(state)=>state.quizes
  },
  modules: {
  }
})

