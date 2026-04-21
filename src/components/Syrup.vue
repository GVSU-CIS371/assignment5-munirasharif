<template>
  <div class="syrup" :style="syrupStyle"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SyrupType } from "../types/beverage";

type Props = {
  syrup: SyrupType;
};

const props = defineProps<Props>();

const syrupStyle = computed(() => {
  if (props.syrup.name === "No Syrup") {
    return {
      background: "transparent",
    };
  }

  return {
    background: `repeating-linear-gradient(
      45deg,
      ${props.syrup.color},
      ${props.syrup.color} 10px,
      rgba(255,255,255,0.2) 10px,
      rgba(255,255,255,0.2) 20px
    )`,
  };
});
</script>

<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  background-color: #c6c6c6;
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
}
</style>
