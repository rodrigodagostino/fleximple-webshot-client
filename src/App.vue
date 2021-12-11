<template>
  <div class="container">
    <header class="site-header">
      <h1 class="site-title">Fleximple Webshot</h1>
    </header>
    <main class="site-main">
      <form @submit.prevent="requestScreenshot" class="form card">
        <div class="form-control">
          <label for="target-url" class="form-label">
            {{ t('label.siteUrl') }}
          </label>
          <div class="form-field-group">
            <select
              name="target-protocol"
              id="target-protocol"
              class="form-field"
              v-model="targetProtocol"
            >
              <option value="http">http://</option>
              <option value="https">https://</option>
            </select>
            <input
              type="text"
              name="target-url"
              id="target-url"
              class="form-field"
              placeholder="example.com"
              v-model="targetUrl"
              required
            />
          </div>
        </div>
        <div class="form-control">
          <label for="file-width" class="form-label">
            {{ t('label.fileWidth') }}
          </label>
          <input
            type="number"
            name="file-width"
            id="file-width"
            class="form-field"
            v-model="fileWidth"
          />
        </div>
        <div class="form-control">
          <label for="file-height" class="form-label">
            {{ t('label.fileHeight') }}
          </label>
          <input
            type="number"
            name="file-height"
            id="file-height"
            class="form-field"
            :disabled="fullPage"
            v-model="fileHeight"
          />
        </div>
        <div class="form-control">
          <label for="full-page" class="form-label">
            <input
              type="checkbox"
              name="full-page"
              id="full-page"
              class="form-field"
              v-model="fullPage"
            />
            {{ t('label.fullPage') }}
          </label>
        </div>
        <div class="form-control">
          <label for="file-type" class="form-label">
            {{ t('label.fileFormat') }}
          </label>
          <select
            name="file-type"
            id="file-type"
            class="form-field"
            v-model="fileType"
          >
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
        <div class="form-control">
          <label for="file-quality" class="form-label">
            {{ t('label.fileQuality') }}
          </label>
          <input
            type="number"
            name="file-quality"
            id="file-quality"
            class="form-field"
            v-model="fileQuality"
          />
        </div>
        <div class="form-control">
          <label for="capture-delay" class="form-label">
            {{ t('label.captureDelay') }}
          </label>
          <input
            type="number"
            name="capture-delay"
            id="capture-delay"
            class="form-field"
            v-model="captureDelay"
          />
        </div>
        <div class="form-control">
          <button type="submit" class="form-button">
            {{ t('label.submit') }}
          </button>
        </div>
      </form>

      <transition
        name="fade-slide-right"
        leave-active-class="fade-leave-active"
        mode="out-in"
      >
        <p v-if="fetchNotification" class="notification notification--fetching">
          {{ t('notification.generating') }}
        </p>
        <p
          v-else-if="successNotification"
          class="notification notification--success"
        >
          {{ t('notification.success') }}
        </p>
        <p
          v-else-if="errorNotification"
          class="notification notification--error"
        >
          {{ t('notification.error') }}
        </p>
      </transition>

      <transition name="fade-slide-up">
        <div v-if="!isFetching && fileName" class="card">
          <a :href="fileUrl" target="_blank" :download="fileName">
            <img
              :src="fileUrl"
              :width="fileWidth"
              :height="fileHeight"
              :alt="`${t('screenshot.alt')} ${targetUrl}`"
            />
          </a>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n({ useScope: 'global' })

locale.value = navigator.language

const targetProtocol = ref( 'http' )
const targetUrl = ref( '' )
const fileWidth = ref( 1200 )
const fileHeight = ref( 1600 )
const fullPage = ref( false )
const fileType = ref( 'jpeg' )
const fileQuality = ref( 80 )
const captureDelay = ref( 0 )

const fileName = ref( '' )
const fileUrl = computed( () => `/screenshots/${ fileName.value }` )

const fetchNotification = ref( false )
const successNotification = ref( false )
const errorNotification = ref( false )
const isFetching = ref( false )

const requestScreenshot = async () => {
  isFetching.value = true
  fetchNotification.value = true

  const settings = JSON.stringify({
    targetProtocol: targetProtocol.value,
    targetUrl: targetUrl.value,
    fileWidth: fileWidth.value,
    fileHeight: fileHeight.value,
    fullPage: fullPage.value,
    fileType: fileType.value,
    fileQuality: fileQuality.value,
    captureDelay: captureDelay.value,
  })

  localStorage.setItem( 'webshotSettings', settings )

  const response = await fetch( '/screenshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: settings,
  })
    .then( data => {
      isFetching.value = false
      fetchNotification.value = false
      successNotification.value = true
      return data.json()
    })
    .catch( error => {
      isFetching.value = false
      fetchNotification.value = false
      errorNotification.value = true
      console.error( 'Error:', error )
    })

  if ( response ) {
    fileName.value = response.fileName
  }
}

onMounted( () => {
  const settings = JSON.parse( localStorage.getItem( 'webshotSettings' ) )

  if ( settings ) {
    targetProtocol.value = settings.targetProtocol
    targetUrl.value = settings.targetUrl
    fileWidth.value = settings.fileWidth
    fileHeight.value = settings.fileHeight
    fullPage.value = settings.fullPage
    fileType.value = settings.fileType
    fileQuality.value = settings.fileQuality
    captureDelay.value = settings.captureDelay
  }
})
</script>

<style lang="scss">
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
  --green-100: #dcfce7;
  --sky-100: #e0f2fe;

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
  /* Inherit box-sizing to make it easier to change the property for components that leverage other behavior;
  see http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */
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

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-control {
  &:first-child,
  &:nth-child(4) {
    grid-column: 1/-1;
  }

  &:nth-child(7),
  &:nth-child(8) {
    grid-column: 1/-1;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;

    & + .form-field,
    & + .form-field-group {
      margin-top: 0.25rem;
    }
  }

  .form-field:not([type='checkbox']) {
    border: 1px solid var(--grey-200);
    border-radius: 0.25rem;
    width: 100%;
    height: 2.25rem;
    padding: 0.25rem 0.5rem;
    outline: none;
    transition: color 0.24s ease, background-color 0.24s ease, border 0.24s ease;

    &::placeholder {
      color: var(--grey-400);
    }

    &:focus {
      border-color: var(--color-main);
      box-shadow: 0 0 0 0.25rem var(--color-main--lightest);
      z-index: 1;
    }

    &:disabled {
      color: var(--grey-400);
      background-color: var(--grey-100);
    }
  }

  .form-field-group {
    display: flex;

    .form-field {
      &:first-child {
        width: auto;
        margin-right: -1px;
        border-radius: 0.25rem 0 0 0.25rem;
      }

      &:last-child {
        flex: 1;
        border-radius: 0 0.25rem 0.25rem 0;
      }
    }
  }

  .form-button {
    grid-column: 1/-1;
    width: 100%;
    font-family: var(--font-primary);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--white);
    text-transform: uppercase;
    background-color: var(--grey-800);
    border-color: var(--grey-800);
    border-radius: 0.25rem;
    outline: none;
    transition: background-color 0.24s ease, border 0.24s ease;

    &:focus {
      box-shadow: 0 0 0 0.25rem var(--color-main--lightest);
    }

    &:focus,
    &:hover {
      background-color: var(--color-main);
      border-color: var(--color-main);
    }

    &:active {
      background-color: var(--color-main--dark);
      border-color: var(--color-main--dark);
    }
  }
}

.notification {
  text-align: center;
  border-radius: 0.25rem;
  padding: 1rem;
  box-shadow: var(--box-shadow-2);

  &--fetching {
    background-color: var(--sky-100);
  }

  &--success {
    background-color: var(--green-100);
  }

  &--error {
    background-color: var(--red-100);
  }
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
