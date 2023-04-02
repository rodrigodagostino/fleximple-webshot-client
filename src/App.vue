<script setup>
import { computed } from 'vue'
import store from '@/store'
import { useI18n } from 'vue-i18n'
import BaseForm from './components/BaseForm.vue'
import BaseNotification from './components/BaseNotification.vue'

const { locale, t } = useI18n({ useScope: 'global' })
locale.value = navigator.language

const mainState = computed(() => store.getters.mainState())
const webshotSettings = computed(() => store.getters.webshotSettings())
const fileName = computed(() => store.getters.fileName())
const fileUrl = computed(() => `/screenshots/${fileName.value}`)
</script>

<template>
  <div class="container">
    <header class="site-header">
      <h1 class="site-title">Fleximple Webshot</h1>
    </header>
    <main class="site-main">
      <BaseForm />
      <transition
        name="fade-slide-right"
        leave-active-class="fade-leave-active"
        mode="out-in"
      >
        <BaseNotification :main-state="mainState" />
      </transition>
      <transition name="fade-slide-up">
        <div v-if="mainState !== 'generating' && fileName" class="card">
          <a :href="fileUrl" target="_blank" :download="fileName">
            <img
              :src="fileUrl"
              :width="webshotSettings.fileWidth"
              :height="webshotSettings.fileHeight"
              :alt="`${t('screenshot.alt')} ${webshotSettings.targetUrl}`"
            />
          </a>
        </div>
      </transition>
    </main>
  </div>
</template>

<style lang="scss">
@font-face {
  font-display: swap;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  src: url('./assets/fonts/poppins-v20-latin-500.woff2') format('woff2'),
    url('./assets/fonts/poppins-v20-latin-500.woff') format('woff');
}

@font-face {
  font-display: swap;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url('./assets/fonts/poppins-v20-latin-600.woff2') format('woff2'),
    url('./assets/fonts/poppins-v20-latin-600.woff') format('woff');
}

@font-face {
  font-display: swap;
  font-family: 'Rubik';
  font-style: normal;
  font-weight: 400;
  src: url('./assets/fonts/rubik-v26-latin-400.woff2') format('woff2'),
    url('./assets/fonts/rubik-v26-latin-400.woff') format('woff');
}

/**
 * Variables
 */
:root {
  --font-primary: 'Poppins', Avenir, Helvetica, Arial, sans-serif;
  --font-secondary: 'Rubik', Avenir, Helvetica, Arial, sans-serif;
  --color-main--lightest: #c7d2fe;
  --color-main--lighter: #a5b4fc;
  --color-main--light: #818cf8;
  --color-main: #6366f1;
  --color-main--dark: #4f46e5;
  --color-main--darker: #4338ca;
  --color-main--darkest: #3730a3;

  --red-100: #fee2e2;
  --red-800: #991b1b;
  --green-100: #dcfce7;
  --green-800: #166534;
  --sky-100: #e0f2fe;
  --sky-800: #075985;

  --white: #fff;
  --black: #000;

  --grey-050: #fcfcfd;
  --grey-100: #f5f5fa;
  --grey-150: #e5e5f1;
  --grey-200: #d5d5e6;
  --grey-300: #b6b7d5;
  --grey-400: #9698c3;
  --grey-500: #777aaf;
  --grey-600: #5a5e9a;
  --grey-700: #484c7a;
  --grey-800: #36395a;
  --grey-900: #23263b;

  --box-shadow-1: 0 1px 1px rgba(54, 57, 90, 0.1),
    0 2px 2px rgba(54, 57, 90, 0.1), 0 4px 4px rgba(54, 57, 90, 0.1),
    0 6px 8px rgba(54, 57, 90, 0.1), 0 8px 16px rgba(54, 57, 90, 0.1);
  --box-shadow-2: 0 1px 1px rgba(54, 57, 90, 0.1),
    0 2px 2px rgba(54, 57, 90, 0.1), 0 4px 4px rgba(54, 57, 90, 0.1),
    0 8px 8px rgba(54, 57, 90, 0.1), 0 16px 16px rgba(54, 57, 90, 0.1);
  --box-shadow-3: 0 2px 1px rgba(54, 57, 90, 0.1),
    0 4px 2px rgba(54, 57, 90, 0.1), 0 8px 4px rgba(54, 57, 90, 0.1),
    0 12px 8px rgba(54, 57, 90, 0.1), 0 24px 16px rgba(54, 57, 90, 0.1);
  --box-shadow-4: 0 2px 1px rgba(54, 57, 90, 0.1),
    0 4px 2px rgba(54, 57, 90, 0.1), 0 8px 4px rgba(54, 57, 90, 0.1),
    0 16px 8px rgba(54, 57, 90, 0.1), 0 32px 16px rgba(54, 57, 90, 0.1);
}

/**
 * Reset styles.
 */
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

::selection {
  background-color: var(--color-main--lightest);
}

/* Reset margins and paddings on most elements */
body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p,
pre,
blockquote,
figure,
hr {
  margin: 0;
  padding: 0;
}

a {
  color: var(--white);
  transition: outline 0.32s ease;
  outline: 1px dotted transparent;
}

a:focus {
  outline: 1px dotted var(--white);
}

/* Reset forms and buttons */
input,
textarea,
select,
button {
  color: inherit;
  font: inherit;
  border: 1px solid gray;
  letter-spacing: inherit;
  min-width: 0;
}

button {
  border-radius: 0;
  padding: 0.75em 1em;
  background-color: transparent;
  cursor: pointer;
}

button * {
  pointer-events: none;
}

/* Easy responsive for media elements */
embed,
iframe,
img,
object,
video {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Useful table styles */
table {
  table-layout: fixed;
  width: 100%;
}

/**
 * Base styles.
 */
body {
  font-family: var(--font-secondary);
  font-size: 1rem;
  color: var(--grey-600);
  background-color: var(--grey-100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-primary);
  font-weight: 600;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 30rem;
  margin: 10vh auto 5vh;
  padding: 1rem;
  position: relative;

  > * + * {
    margin-top: 2rem;
  }
}

.site-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

.site-main {
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 2rem;
  }
}

.card {
  background-color: var(--white);
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow-1);
  padding: 1.25rem;
}

.fade-slide-up-enter-active {
  animation: fade-slide-up 0.32s ease;
}

.fade-slide-up-leave-active {
  animation: fade-slide-up 0.32s ease reverse;
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translate3d(0, 2rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-slide-right-enter-active {
  animation: fade-slide-right 0.32s ease;
}

.fade-slide-right-leave-active {
  animation: fade-slide-right 0.32s ease reverse;
}

@keyframes fade-slide-right {
  from {
    opacity: 0;
    transform: translate3d(-4rem, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-enter-active {
  animation: fade 0.32s ease;
}

.fade-leave-active {
  animation: fade 0.32s ease reverse;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
