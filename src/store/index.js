import { reactive } from 'vue'

// Clean up the storage if it’s undefined.
if (localStorage.getItem('webshotSettings') === 'undefined') {
  localStorage.removeItem('webshotSettings')
}

// Set default parameters if storage is empty.
if (!localStorage.getItem('webshotSettings')) {
  localStorage.setItem(
    'webshotSettings',
    JSON.stringify({
      targetProtocol: 'http',
      targetUrl: '',
      fileWidth: 1200,
      fileHeight: 1600,
      fullPage: false,
      fileType: 'jpeg',
      fileQuality: 80,
      captureDelay: 0,
    })
  )
}

const state = reactive({
  mainState: 'idle',
  webshotSettings: JSON.parse(localStorage.getItem('webshotSettings')),
  fileName: null,
})

const getters = {
  mainState: () => state.mainState,

  webshotSettings: () => {
    return state.webshotSettings
  },

  fileName: () => state.fileName,
}

const mutations = {
  setMainState: (newMainState) => (state.mainState = newMainState),

  setWebshotSettings(newWebshotSettings) {
    state.webshotSettings = newWebshotSettings
    localStorage.setItem('webshotSettings', JSON.stringify(newWebshotSettings))
  },

  setFileName: (newFileName) => (state.fileName = newFileName),
}

export default {
  state,
  getters,
  mutations,
}
