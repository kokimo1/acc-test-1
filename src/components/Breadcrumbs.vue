<template>

  <!-- gotta be a way to simplify the logic for breadcrumbs! -->
  <div>
    <img src="1234455664578">
  </div>
  <nav
  class="r-grid bread-crumb"
  aria-label="Breadcrumb"
  role="navigation">
    <ol>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link v-if="managedEmployeesPage" to="/manage-employees">
          <span aria-hidden="true"> > </span>
          Manage Employees
        </router-link>
      </li>
      <li>
        <router-link
        v-if="$route.name === 'Manage Single Employee'
        || $route.name === 'Employee Leave Item'"
        :to="`/manage-employees/${userInfoData.uin}`">
          <span aria-hidden="true"> > </span>
          {{ userInfoData.name }}
        </router-link>
      </li>
      <li>
        <router-link
        v-if="$route.name !== 'Home'
        && $route.name !== 'Manage Employees'
        && $route.name !== 'Manage Single Employee'"
        :to="$route.fullPath">
          <span aria-hidden="true"> > </span>
          {{ $route.name }}
        </router-link>
      </li>
    </ol>
  </nav>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'Breadcrumbs',
  created() {
    this.checkEmployee();
  },
  computed: {
    userInfoData() {
      return this.$store.state.userInfoData;
    },
    managedEmployeesPage() {
      const truthy = this.$route.path.includes('manage-employees');
      return truthy;
    },
  },
  methods: {
    checkEmployee() {
      if (this.$route.name === 'Manage Single Employee'
      || this.$route.name === 'Employee Leave Item') {
        this.uin = this.$route.params.uin;
      } else {
        this.uin = null;
      }
      const payload = {
        uin: this.uin,
      };
      this.$store.dispatch('userInfo', payload);
    },
  },
})
export default class Breadcrumbs extends Vue {}
</script>

<style lang="scss" scoped>

</style>
