<template>

  <div class="accordion-title" @click="updateToggle">
    <h2>{{ title }}</h2>
    <button :class="{ 'active': toggle }"
    class="toggle-button"
    :aria-expanded="toggle">
      <img :src="arrowSVG" alt="toggle"/>
    </button>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import arrowSVG from '@/components/svg/arrow.svg';

@Options({
  name: 'AccordionTitle',
  props: ['title', 'toggle'],
  data() {
    return {
      arrowSVG,
    };
  },
  methods: {
    updateToggle() {
      this.$emit('updateToggle', !this.toggle);
    },
  },
})
export default class AccordionTitle extends Vue {}
</script>

<style lang="scss" scoped>

</style>
