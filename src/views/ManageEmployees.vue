<template>
  <div class="grid-container employee-list-container">

    <div class="container r-grid">
      <h2>Managed Employees With New Requests</h2>
    </div>
    <template v-for="employee, index in employeesListData"
    :key="index">
      <router-link v-if="employee.pending_requests > 0"
        class="employee-link r-grid"
        :to="`/manage-employees/${employee.uin}`">
        <div :class="{ 'pending-requests': employee.pending_requests > 0 }">
          {{ employee.pending_requests }}
        </div>
        <div class="employee-name">{{ employee.name }}</div>
      </router-link>
      <p v-else
      class="message r-grid"
      v-show="noRequests === 0 && index === 0"
      v-html="randomizeMessage(empty1)">
      </p>
    </template>

    <div class="container r-grid">
      <h2>Managed Employees</h2>
    </div>
    <template v-for="employee, index in employeesListData"
    :key="index">
      <router-link v-if="employee.pending_requests === 0"
        class="employee-link r-grid"
        :to="`/manage-employees/${employee.uin}`">
        <div class="no-pending-requests">
          {{ employee.pending_requests }}
        </div>
        <div class="employee-name">{{ employee.name }}</div>
      </router-link>
      <p class="message r-grid"
      v-show="employeesListData.length === noRequests && index === 0"
      v-html="randomizeMessage(empty2)">
      </p>
    </template>

  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'Manage Employees',
  data() {
    return {
      empty1: [
        'You are all caught up, sit back and relax.',
        'Looks like all your employees are keeping busy.',
      ],
      empty2: [
        'Your employees are keeping you busy.',
        'Looks like all your employees need you.',
      ],
    };
  },
  created() {
    this.$store.dispatch('employeesList');
  },
  computed: {
    employeesListData() {
      return this.$store.state.employeesListData;
    },
    noRequests() {
      let noRequests = 0;
      const employee = this.employeesListData;
      for (let i = 0; i < employee.length; i += 1) {
        if (employee[i].pending_requests > 0) {
          noRequests += 1;
        }
      }
      return noRequests;
    },
  },
  methods: {
    randomizeMessage(array: Array<string>) {
      return array[Math.floor(Math.random() * array.length)];
    },
  },
})
export default class ManageEmployee extends Vue {}
</script>

<style lang="scss" scoped>

  .employee-list-container > .employee-link {
    display: grid;
    grid-template-columns: 32px auto;
    text-decoration: none;
    color: #000;
    .pending-requests {
      background-color: yellow;
    }
    &:hover > .pending-requests {
      background-color: darken(yellow, 5%);
    }
    .employee-name {
      padding-left: 15px;
    }
    &:hover > .employee-name,
    &:hover > .no-pending-requests {
      background-color: darken(#f6f6f6, 5%);
    }
    .pending-requests,
    .no-pending-requests {
      text-align: center;
    }
  }

  .grid-container a > div {
    text-align: left;
    min-height: 40px;
    line-height: 40px;
    background-color: #f6f6f6;
    font-size: 18px;
    border-bottom: white 1px solid;
  }

</style>
