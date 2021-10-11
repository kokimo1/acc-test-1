<template>

  <template v-if="userInfoData">
    <div class="r-grid container">
      <accordion-title :title="userInfoData.name"
      v-model:toggle="userToggle"
      @updateToggle="userToggle = $event"/>
      <p v-show="userToggle">Title: {{ userInfoData.title }}</p>
      <p v-show="userToggle">Unit: {{ userInfoData.unit }}</p>
      <p v-show="userToggle">Supervisor: {{ userInfoData.supervisor_name }}</p>
      <p v-show="userToggle">Alt Supervisor: {{ userInfoData.alt_supervisor_name }}</p>
    </div>

    <div class="r-grid container">
      <accordion-title title="Leave Balance"
      v-model:toggle="balanceToggle"
      @updateToggle="balanceToggle = $event"/>
      <p v-show="balanceToggle">Vacation: {{ userInfoData.vacation_hours }} hours</p>
      <p v-show="balanceToggle">
        Vacation Transfer: {{ userInfoData.vacation_transfer_hours }} hours
      </p>
      <p v-show="balanceToggle">Sick: {{ userInfoData.sick_hours }} hours</p>
      <p v-show="balanceToggle && userInfoData.sicn_eligible">
        Sick Noncumulative: {{ userInfoData.sicn_hours }} hours
      </p>
      <p v-show="balanceToggle && userInfoData.sicnEligible">
        Sick (Non-Cumulative): {{ userInfoData.sickn_hours }} hours
      </p>
      <p v-show="balanceToggle">Floating Holiday: {{ userInfoData.floating_hours }} hours</p>
    </div>
  </template>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AccordionTitle from '@/components/AccordionTitle.vue';

@Options({
  name: 'User Info',
  components: {
    AccordionTitle,
  },
  data() {
    return {
      userToggle: false,
      balanceToggle: true,
      uin: null,
    };
  },
  created() {
    this.checkEmployee();
  },
  computed: {
    userInfoData() {
      return this.$store.state.userInfoData;
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
export default class UserInfo extends Vue {}
</script>

<style lang="scss" scoped>

</style>
