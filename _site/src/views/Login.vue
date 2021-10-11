<template>

  <form class="form-container"
  @submit.prevent
  aria-label="Gotime login">
    <label for="netid">NetID</label>
    <input v-model="netid" id="netid" placeholder="Enter Username" required>
    <label for="password">Password</label>
    <input v-model="password" id="password" type="password" placeholder="Enter Password" required>
    <button @click="userLogin()" type="submit">Login</button>
  </form>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'Login',
  data() {
    return {
      netid: null,
      password: null,
    };
  },
  created() {
    this.$store.commit('resetToken');
  },
  methods: {
    userLogin() {
      const payload = {
        netid: this.netid,
        password: this.password,
      };
      // this.$store.commit('')
      this.$store.dispatch('userLogin', payload);
      // const { username, password } = this
      // this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
      //   this.$router.push('/')
      // })
    },
  },
})
export default class Login extends Vue {}
</script>

<style scoped lang="scss">

form {
  button {
    width: 100%;
  }
}

</style>
