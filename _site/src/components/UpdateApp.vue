<template>

  <!-- Service Worker update pop-up -->
  <template v-if="updateExists">
    <a @click="refreshApp()" class="sw-update-bg">
    </a>
    <div @click="refreshApp()" class="sw-update">
      An update is available, click anywhere to continue.
    </div>
  </template>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'UpdateApp',
  data() {
    return {
      // refresh variables
      refreshing: false,
      registration: null,
      updateExists: false,
      supervisor: false,
    };
  },
  created() {
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true });

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      // Here the actual reload of the page occurs
      window.location.reload();
    });
  },
  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event: any) {
      this.registration = event.detail;
      this.updateExists = true;
    },
    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
  },
})
export default class UpdateApp extends Vue {}
</script>

<style lang="scss" scoped>

.sw-update-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.5;
  background-color: #000;
  z-index: 999999;
}
.sw-update {
  position: fixed;
  bottom: 25%;
  text-align: center;
  left: 0;
  right: 0;
  max-width: 380px;
  margin: 0 auto;
  background-color: #D50032;
  padding: 20px;
  color: #ffffff;
  font-weight: 500;
  z-index: 1000000;
  button {
    margin-left: 5px;
    padding: 10px;
  }
}

</style>
