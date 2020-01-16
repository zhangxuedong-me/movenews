import Vue from 'vue'
import Vuex from 'vuex'
// 引入本地存储的方法
import { getItem, setItem } from '@/utils/storage.js'
// 引入第三方解析token的包
import decodeJwt from 'jwt-decode'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: getItem('user'),
    // 获取本地存储的评论信息数量
    comment: getItem('user-comment')
  },
  mutations: {
    setUserToken (state, data) {
      // 解析token获取用户的id
      if (data && data.token) {
        data.userId = decodeJwt(data.token).user_id
      }
      state.user = data
      setItem('user', state.user)
    },
    // 存储评论信息数量
    setCommentCount (state, num) {
      if ((typeof num) === 'number') {
        state.comment = num
        setItem('user-comment', state.comment)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
