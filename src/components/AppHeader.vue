<template>

  <header role="banner">

    <div class="r-grid navigation">
      <a href="https://www.uic.edu/">
        <div class="logo">
          <img :src="circleLogoSVG" alt="UIC Circle Mark"/>
        </div>
      </a>

      <div class="accessibility-errors-intentional">
        <!-- missing alt attribute -->
        <img src="testing">

        <!-- missing title attribute -->
        <iframe src="testing">testing</iframe>

        <!-- missing label -->
        <input type="text">

        <!-- missing alt attribute -->
        <area shape="rect" coords="115,158,276,192" href="http://en.wikipedia.org/wiki/Mercury_%28planet%29">

        <!-- missing title attribute -->
        <svg role="img"><circle cx="30" cy="30" r="10" fill="brown"></circle><svg>
      </div>

      <nav aria-label="Primary" role="navigation">
        <button class="menu-button-wrapper" @click="menuOpen = !menuOpen"
        aria-label="toggle navigation menu">
          <div :class="{ 'active': menuOpen }" class="menu-button"></div>
        </button>
        <ul v-show="menuOpen"
        @click="menuOpen = !menuOpen"
        id="nav"
        aria-label="navigation menu">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/new-request">New Request</router-link>
          </li>
          <li>
            <router-link v-if="supervisor"
            to="/manage-employees">Manage Employees</router-link>
          </li>
          <li>
            <router-link to="/holidays">Holidays</router-link>
          </li>
          <li>
            <router-link to="/login" @click="loginStatus()"> {{ loginText }}</router-link>
          </li>
<!--           <router-link to="/report">Report Issue</router-link>
          <router-link to="/guide">User Guide</router-link> -->
        </ul>
      </nav>
    </div>

    <router-link class="banner" to="/">
      <h1 class="r-grid site-name">GoTime</h1>
    </router-link>

  </header>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

// SVGs
import circleLogoSVG from '@/components/svg/logo-circle.svg';

@Options({
  name: 'AppHeader',
  data() {
    return {
      accountStatusText: 'Login',
      circleLogoSVG,
      menuOpen: false,
      supervisor: false,
    };
  },
  computed: {
    tokenAvailable() {
      return this.$store.state.token;
    },
    employeesListData() {
      return this.$store.state.employeesListData;
    },
    loginText() {
      if (this.$store.state.token !== null) {
        this.accountStatusText = 'Logout';
      }
      return this.accountStatusText;
    },
  },
  methods: {
    loginStatus() {
      if (this.$store.state.token !== null) {
        sessionStorage.removeItem('groupToolToken');
        sessionStorage.removeItem('groupToolTokenExpiration');
        this.accountStatusText = 'Login';
        this.$store.commit('resetToken');
      }
    },
  },
  watch: {
    menuOpen(val) {
      if (val === true
      && this.employeesListData === null
      && this.$store.state.token !== null) {
        this.$store.dispatch('employeesList');
      }
    },
    employeesListData(val) {
      if (val !== null && val.length > 0) {
        this.supervisor = true;
      } else {
        this.supervisor = false;
      }
    },
  },
})
export default class AppHeader extends Vue {}
</script>

<style lang="scss" scoped>

  #nav {
    // padding: 30px;
    line-height: 60px;
    a {
      font-size: 27px;
      color: white;

      &.router-link-exact-active {
        color: white;
      }
    }
  }

  header {
    position: fixed;
    height: 100px;
    width: 100%;
    background-color: #f6f6f6;
    display: flex;
    flex-wrap: wrap;
    z-index: 1;
    .navigation {
      width: 100%;
    }
    a {
      text-decoration: none;
    }
    .banner {
      width: 100%;
    }
    h1.site-name {
      height: 40px;
      font-size: 24px;
      background-color: #001E62;
      color: white;
      font-weight: 500;
      line-height: 40px;
      margin-top: 0;
      margin-bottom: 0;
    }
    ul {
      top: 60px;
      position: fixed;
      width: 100%;
      padding: 0;
      margin: 0;
      left: 0;
      z-index: 100;
      a {
        padding-left: 32px;
        // padding-top: 13px;
        // padding-bottom: 13px;
        width: 100%;
        display: block;
      }
      li {
        // cursor: pointer;
        background-color: #001E62;
        list-style-type: none;
        &:hover {
          background-color: darken(#001E62, 5);
        }
      }
    }
  }

</style>
