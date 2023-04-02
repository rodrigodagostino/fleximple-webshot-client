import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import en from './locales/en.json'
import es from './locales/es.json'

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: 'en', // set locale
  // fallbackLocale: 'es', // set fallback locale
  messages: {
    en,
    es,
  },
})

createApp(App).use(i18n).mount('#app')
