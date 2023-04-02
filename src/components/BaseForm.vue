<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import _ from 'lodash'

import { computed, ref } from 'vue'
import store from '@/store'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n({ useScope: 'global' })
locale.value = navigator.language

const mode = import.meta.env.VITE_MODE
const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY

const webshotSettings = computed(() => store.getters.webshotSettings())

const setWebshotSetting = ({ target }) => {
  const propName = _.camelCase(target.name)
  const propValue = target.type === 'checkbox' ? target.checked : target.value

  store.mutations.setWebshotSettings({
    ...webshotSettings.value,
    [propName]: propValue,
  })
}

const isVerified = ref(false)
const hasExpired = ref(false)
const token = ref('')
const eKey = ref('')
const error = ref('')

const onVerify = (tokenStr, ekey) => {
  isVerified.value = true
  token.value = tokenStr
  eKey.value = ekey
}

const onExpire = () => {
  isVerified.value = false
  token.value = null
  eKey.value = null
  hasExpired.value = true
}

const onError = (err) => {
  token.value = null
  eKey.value = null
  error.value = err
}

const requestScreenshot = async () => {
  if (mode !== 'development' && !isVerified.value) return

  store.mutations.setMainState('generating')

  const response = await fetch('/screenshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webshotSettings.value),
  })
    .then((data) => {
      store.mutations.setMainState('success')
      return data.json()
    })
    .catch((error) => {
      store.mutations.setMainState('error')
      console.error('Error:', error)
    })

  if (response) store.mutations.setFileName(response.fileName)
}
</script>

<template>
  <form class="form card" @submit.prevent="requestScreenshot">
    <div class="form-control full-width">
      <label for="target-url" class="form-label">
        {{ t('label.siteUrl') }}
      </label>
      <div class="form-field-group">
        <select
          id="target-protocol"
          name="target-protocol"
          class="form-field"
          :value="webshotSettings.targetProtocol"
          @change="setWebshotSetting"
        >
          <option value="http">http://</option>
          <option value="https">https://</option>
        </select>
        <input
          id="target-url"
          type="text"
          name="target-url"
          class="form-field"
          placeholder="example.com"
          :value="webshotSettings.targetUrl"
          required
          @change="setWebshotSetting"
        />
      </div>
    </div>
    <div class="form-control">
      <label for="file-width" class="form-label">
        {{ t('label.fileWidth') }}
      </label>
      <input
        id="file-width"
        type="number"
        name="file-width"
        class="form-field"
        :value="webshotSettings.fileWidth"
        @change="setWebshotSetting"
      />
    </div>
    <div class="form-control">
      <label for="file-height" class="form-label">
        {{ t('label.fileHeight') }}
      </label>
      <input
        id="file-height"
        type="number"
        name="file-height"
        class="form-field"
        :disabled="fullPage"
        :value="webshotSettings.fileHeight"
        @change="setWebshotSetting"
      />
    </div>
    <div class="form-control full-width">
      <label for="full-page" class="form-label">
        <input
          id="full-page"
          type="checkbox"
          name="full-page"
          class="form-field"
          :value="webshotSettings.fullPage"
          @change="setWebshotSetting"
        />
        {{ t('label.fullPage') }}
      </label>
    </div>
    <div class="form-control">
      <label for="file-type" class="form-label">
        {{ t('label.fileFormat') }}
      </label>
      <select
        id="file-type"
        name="file-type"
        class="form-field"
        :value="webshotSettings.fileType"
        @change="setWebshotSetting"
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
        id="file-quality"
        type="number"
        name="file-quality"
        class="form-field"
        :disabled="fileType === 'png'"
        :value="webshotSettings.fileQuality"
        @change="setWebshotSetting"
      />
    </div>
    <div class="form-control full-width">
      <label for="capture-delay" class="form-label">
        {{ t('label.captureDelay') }}
      </label>
      <input
        id="capture-delay"
        type="number"
        name="capture-delay"
        class="form-field"
        :value="webshotSettings.captureDelay"
        @change="setWebshotSetting"
      />
    </div>
    <div
      v-if="mode !== 'development'"
      class="form-control full-width align-center"
    >
      <VueHcaptcha
        :sitekey="hcaptchaSiteKey"
        size="normal"
        @verify="onVerify"
        @expired="onExpire"
        @challenge-expired="onExpire"
        @error="onError"
      ></VueHcaptcha>
    </div>
    <div class="form-control full-width">
      <button
        type="submit"
        class="form-button"
        :disabled="mode !== 'development' && !isVerified"
      >
        {{ t('label.submit') }}
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-control {
  &.full-width {
    grid-column: 1/-1;
  }

  &.align-center {
    justify-self: center;
  }

  .form-label {
    display: inline-block;
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
    transition: background-color 0.24s ease, border 0.24s ease,
      opacity 0.24s ease;

    &:focus {
      box-shadow: 0 0 0 0.25rem var(--color-main--lightest);
    }

    &:focus:not(:disabled),
    &:hover:not(:disabled) {
      background-color: var(--color-main);
      border-color: var(--color-main);
    }

    &:active:not(:disabled) {
      background-color: var(--color-main--dark);
      border-color: var(--color-main--dark);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }
}
</style>
