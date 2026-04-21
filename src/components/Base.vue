<template>
  <div class="baseBeverage" :style="{ backgroundColor: base.color }"></div>
</template>

<script setup lang="ts">
import type { BaseBeverageType } from "../types/beverage";

type Props = {
  base: BaseBeverageType;
};

defineProps<Props>();
</script>

<style scoped>
.baseBeverage {
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 0;
  animation: pour-tea 2s;
  z-index: 300;
  /* // border-radius: 0.05em 0.05em 2.2em 2.2em; */
}
</style>
