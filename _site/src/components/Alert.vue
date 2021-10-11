<template>

  <transition name="slide-fade">
    <div class="r-grid alert"
    :class="{
      'error': item.type === 'error',
      'success': item.type === 'success',
      'warning': item.type === 'warning',
    }">
      {{ item.value }}
      <img :src="plusSVG" @click="alerts.splice(index, 1);"/>
    </div>
  </transition>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import plusSVG from '@/components/svg/plus.svg';

@Options({
  name: 'Alert',
  props: ['alerts', 'item', 'index'],
  data() {
    return {
      plusSVG,
    };
  },
  mounted() {
    const yes = this.alerts.length;
    if (this.alerts.length > 1) {
      // this.alerts.splice(2, yes - 1);
      setTimeout(() => this.alerts.splice(0, 1), 500);
      // this.yes = true;
      // setTimeout(() => this.alerts.splice(2, yes - 1), 500);
    }
    // setTimeout(() => this.$refs.alert.classList.add('fade'), 5000);
    setTimeout(() => this.alerts.splice(0, 1), 5000);
  },
})
export default class Alert extends Vue {}
</script>

<style lang="scss" scoped>

.alert {
  position: relative;
  padding-top: 10px;
  padding-bottom: 10px;
  opacity: 1;
  transition: opacity 1s;
  &.error {
    background-color: lighten(red, 25%);
    // background-color: rgba(255, 128, 128, 0.5);
    // background-color: rgba(213, 0, 50, 0.5);
  }
  &.success {
    background-color: lighten(greenyellow, 25%);
  }
  &.warning {
    background-color: yellow;
  }
  img {
    height: 14px;
    transform: rotate(45deg);
    float: right;
  }
  &.fade {
    transition-delay: 1s;
    opacity: 0.5;
    transition: opacity 1s;
  }
}

</style>
