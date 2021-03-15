import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  supportPinyinSearch,
  keepAlivePage: []
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  ADD_KEEP_ALIVE: (state, name) => {
    if (!state.keepAlivePage.includes(name)) {
      state.keepAlivePage = state.keepAlivePage.concat(name)
    }
    console.log('ADD_KEEP', state.keepAlivePage)
  },

  REMOVE_KEEP_ALIVE: (state, name) => {
    const keepAlivePage = state.keepAlivePage
    const index = keepAlivePage.indexOf(name)
    if (index > -1) {
      keepAlivePage.splice(index, 1)
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  // 添加需要被缓存的页面组件名
  addKeepAlivePage({ commit }, name) {
    commit('ADD_KEEP_ALIVE', name)
  },

  // 删除被缓存的页面组件名
  removeKeepAlive({ commit }, name) {
    commit('REMOVE_KEEP_ALIVE', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

