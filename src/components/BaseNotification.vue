<script setup>
import { useI18n } from 'vue-i18n'
import CheckIcon from '@/assets/icons/check.svg?component'
import SpinnerIcon from '@/assets/icons/spinner.svg?component'
import TimesIcon from '@/assets/icons/times.svg?component'

defineProps({
  mainState: {
    type: String,
    default: 'idle',
  },
})

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div
    v-if="mainState === 'generating'"
    :class="`notification notification--generating`"
  >
    <SpinnerIcon />
    <span>{{ t('notification.generating') }}</span>
  </div>
  <div
    v-else-if="mainState === 'success'"
    class="notification notification--success"
  >
    <CheckIcon />
    <span>{{ t('notification.success') }}</span>
  </div>
  <div
    v-else-if="mainState === 'error'"
    class="notification notification--error"
  >
    <TimesIcon />
    <span>{{ t('notification.error') }}</span>
  </div>
</template>

<style lang="scss">
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  padding: 1rem;
  box-shadow: var(--box-shadow-2);

  &--generating {
    color: var(--sky-800);
    background-color: var(--sky-100);

    .icon {
      animation: rotate 1.2s linear infinite;
    }
  }

  &--success {
    color: var(--green-800);
    background-color: var(--green-100);
  }

  &--error {
    color: var(--red-800);
    background-color: var(--red-100);
  }

  .icon {
    width: auto;
    height: 1rem;
    margin-right: 0.75rem;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
