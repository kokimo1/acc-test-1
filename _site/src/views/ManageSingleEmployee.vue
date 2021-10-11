<template>
  <div class="single-employee" v-if="leaveTypesData">

    <multi-select-list :title="'Pending Requests'"
    :userLeaveList="employeePendingRequestsData"
    :processType="processType"
    :formatDate="formatDate"
    :approveRequest="approveRequest"
    :declineRequest="declineRequest"
    :key="leavePendingKey"/>

    <leave-list :title="'Processed Requests'"
    :userLeaveList="employeeProcessedRequestsData"
    :processType="processType"
    :formatDate="formatDate"
    :declineRequest="declineRequest"
    :key="leaveProcessedKey"/>

  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

import LeaveList from '@/components/LeaveList.vue';
import MultiSelectList from '@/components/MultiSelectList.vue';

@Options({
  name: 'Manage Single Employee',
  components: {
    LeaveList,
    MultiSelectList,
  },
  data() {
    return {
      leavePendingKey: 0,
      leaveProcessedKey: 0,
    };
  },
  created() {
    this.$store.dispatch('userLeaveTypes');
    this.dispatchPendingRequests();
    this.dispatchProcessedRequests();
  },
  computed: {
    payload() {
      return { uin: this.$route.params.uin };
    },
    leaveTypesData() {
      return this.$store.state.leaveTypesData;
    },
    employeePendingRequestsData() {
      return this.$store.state.employeePendingRequestsData;
    },
    employeeProcessedRequestsData() {
      return this.$store.state.employeeProcessedRequestsData;
    },
  },
  methods: {
    dispatchPendingRequests() {
      this.$store.dispatch('employeePendingRequests', this.payload);
    },
    dispatchProcessedRequests() {
      this.$store.dispatch('employeeProcessedRequests', this.payload);
    },
    approveRequest(uuids: any, reviewerComment: string) {
      const payload = {
        uuids,
        reviewerComment,
        uin: this.payload,
      };
      this.$store.dispatch('approveRequest', payload);
    },
    declineRequest(uuids: any, reviewerComment: string) {
      const payload = {
        uuids,
        reviewerComment,
        uin: this.payload,
      };
      this.$store.dispatch('declineRequest', payload);
    },
    formatDate(datetime: Date) {
      const newDatetime = moment(datetime, moment.ISO_8601, true).format('MM/DD/YYYY');
      return newDatetime;
    },
    processType(type: string) {
      let i: number;
      let displayTitle = '';
      for (i = 0; i < this.leaveTypesData.length; i += 1) {
        if (type === this.leaveTypesData[i].type) {
          displayTitle = this.leaveTypesData[i].display_title;
        } else if (type === 'workday') {
          displayTitle = 'Workday';
        }
      }
      return displayTitle;
    },
  },
  watch: {
    employeePendingRequestsData() {
      // Update commponent
      this.leavePendingKey += 1;
    },
    employeeProcessedRequestsData() {
      // Update commponent
      this.leaveProcessedKey += 1;
    },
  },
})
export default class ManageSingleEmployee extends Vue {}
</script>

<style lang="scss" scoped>
</style>
