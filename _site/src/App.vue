<template>

  <div class="main-container">

  <AppHeader/>

  <UpdateApp/>

  <main role="main">

    <div class="alert-container">
      <alert v-for="item, index in alerts"
      :key="index"
      :alerts="alerts"
      :item="item"
      :index="index"
      v-show="alerts.length > 0"/>
    </div>

    <Breadcrumbs v-if="$store.state.userInfoData"/>

    <router-view name="UserInfo" :key="$route.name"/>

    <router-view/>

  </main>

  <footer>
    <div class="r-grid">
      <span>
        © {{ new Date().getFullYear() }} The Board of Trustees of the University of Illinois
      </span>
      <span class="pipe">|</span>
      <span>UIC GoTime v{{ $store.getters.appVersion }}</span>
    </div>
  </footer>

  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

// Components
import AppHeader from '@/components/AppHeader.vue';
import Alert from '@/components/Alert.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import UpdateApp from '@/components/UpdateApp.vue';

@Options({
  name: 'GoTime',
  components: {
    AppHeader,
    Breadcrumbs,
    Alert,
    UpdateApp,
  },
  data() {
    return {
      alerts: [],
    };
  },
  computed: {
    appVersion() {
      return this.$store.getters.appVersion;
    },
    error() {
      interface Properties {
        type?: string;
        value?: string;
      }
      const error: Properties = {
        type: 'error',
        value: this.$store.state.error,
      };
      return error;
    },
    success() {
      interface Properties {
        type?: string;
        value?: string;
      }
      const success: Properties = {
        type: 'success',
        value: this.$store.state.success,
      };
      return success;
    },
    warning() {
      interface Properties {
        type?: string;
        value?: string;
      }
      const warning: Properties = {
        type: 'warning',
        value: this.$store.state.warning,
      };
      return warning;
    },
  },
  watch: {
    error(val) {
      if (this.$store.state.error !== null) {
        this.alerts.push(val);
        this.$store.commit('resetError');
      }
    },
    success(val) {
      if (this.$store.state.success !== null) {
        this.alerts.push(val);
        this.$store.commit('resetSuccess');
      }
    },
    warning(val) {
      if (this.$store.state.warning !== null) {
        this.alerts.push(val);
        this.$store.commit('resetWarning');
      }
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    // color: #2c3e50;
    color: #000000;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .main-container {
    position: relative;
    min-height: 100vh;
  }

  main {
    padding-top: 100px; // Height of the header
    padding-bottom: 120px; // Height of the footer
  }

  footer {
    // margin-top: 40px;
    padding: 30px 0;
    text-align: center;
    border-top: 1px #f6f6f6 solid;
    // color: #ffffff;
    font-weight: 500;
    font-size: 14px;
    // background-color: #001E62;
    // background-color: #f6f6f6;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .pipe {
    margin: 0 .5em;
  }

  ol {
    list-style-type: unset;
    margin-block-start: unset;
    margin-block-end: unset;
    margin-inline-start: unset;
    margin-inline-end: unset;
    padding-inline-start: unset;
  }

  .bread-crumb {
    font-size: 20px;
    line-height: 20px;
    padding: 5px 0;
    li {
      display: inline;
      a {
        color: #001E62;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }

  .r-grid {
    padding-left: 16px;
    padding-right: 16px;
  }

  .container {
    border-top: 1px solid #f6f6f6;
    &:last-child {
      border-bottom: 1px solid #f6f6f6;
    }
    a {
      text-decoration: none;
      color: unset;
    }
    h2 {
      font-size: 24px;
      line-height: 40px;
      // height: 40px;
      margin: 2px 0;
      padding: 0;
      font-weight: 400;
    }
    .accordion-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      cursor: pointer;
      .toggle-button {
        width: 40px;
        border: 0;
        background-color: transparent;
        img {
          height: 14px;
          position: relative;
          transform: rotate(0deg);
          transition-duration: 0.25s;
        }
        &:not(.active) img {
          transform: rotate(-90deg);
          transition-duration: 0.25s;
        }
      }
    }
    p {
      font-size: 18px;
      margin: 0;
      padding: 0 0 0 21px;
      &:last-child {
        padding-bottom: 10px;
      }
    }
  }

  input, select, textarea {
    border: 1px solid #d8d8d8;
    background-color: white;
    padding: 5px 4px;
    font-size: 16px;
  }

  label {
    // padding: 5px 4px;
    font-size: 16px;
    margin: 5px 0 0;
    // margin-right: 100px;
  }

  .logo {
    height: 52px;
    width: 52px;
    display: inline-block;
    float: left;
    top: 4px;
    position: relative;
    // img {
    //   height: 94%;
    // }
  }

  .menu-button-wrapper {
    height: 62px;
    float: right;
    cursor: pointer;
    background: transparent;
    border: none;
    margin-top: -2px;
    margin-right: -4px;

    .menu-button {
      background: #001e62;
      height: 3px;
      position: relative;
      top: 4px;
      -webkit-transition: all .3s ease-out;
      transition: all .3s ease-out;
      width: 37px;
      left: 2px;
      &::before, &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        background: #001e62;
        -webkit-transition: all .3s ease-out;
        transition: all .3s ease-out;
      }
      &::before {
        top: auto;
        bottom: 9px;
      }
      &::after {
        top: 9px;
      }
      &.active {
        background: transparent;
        &:before {
          transform: rotate(45deg);
          bottom: 0;
        }
        &:after {
          transform: rotate(-45deg);
          top: 0;
        }
      }
    }
  }

  svg {
    fill: white;
  }

form {
  &.form-container {
    display: flex;
    // display: grid;
    // grid-template-columns: auto auto;
    display: flex;
    flex-wrap: wrap;
    // grid-template-columns: auto auto;
    background-color: #f6f6f6;
    flex-wrap: wrap;
    margin: 0 16px;
    background-color: #f6f6f6;
    padding: 15px;
    margin: 0 16px;
    justify-content: space-between;
    padding: 15px;
    justify-content: space-between;
  }
  input, select, textarea {
    width: 100%;
    margin: 10px 0;
    &[type=date] {
      // padding: -28px;
      width: 47%;
    }
  }
  label {
    width: 100%;
    // &:nth-child(-n+3) {
    //   width: 50%;
    // }
  }
  .comment {
    min-height: 100px;
  }
  button {
    min-width: 50%;
    height: 45px;
    background-color: #001E62;
    color: white;
    font-size: 16px;
    // font-weight: 500;
    border: none;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background-color: #001648;
    }
    &:first-of-type {
      border-right: 1px solid white;
    }
  }
}

.alert-container {
  z-index: 99;
  position: fixed;
  width: 100%;
}

.asterisk {
  color: #D50032;
}

.message {
  margin: 40px 0;
  text-align: center;
  color: #58595b;
  font-style: italic;
}

</style>
