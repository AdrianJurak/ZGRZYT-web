<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <footer class="w-full text-center p-6 text-sm text-gray-500 mt-auto">
    &copy; 2026 Zgrzyt Inc. {{ $t('footer.allRightsReserved') }}
  </footer>
</template>