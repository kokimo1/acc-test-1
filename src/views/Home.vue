<template>
  <div class="home" v-if="leaveTypesData">

    <div class="r-grid container">
      <router-link to="/new-request">
        <div class="accordion-title">
          <h2>New Request</h2>
          <div class="toggle-button">
            <img :src="plusSVG" class="plus" alt="link"/>
          </div>
        </div>
      </router-link>
    </div>

    <leave-list :title="'Active'"
    :userLeaveList="userLeaveRequestsData"
    :processType="processType"
    :formatDate="formatDate"
    :withdrawRequest="withdrawRequest"
    :deleteDeclined="deleteDeclined"
    :key="leaveRequestKey"/>

    <leave-list :title="'History'"
    :userLeaveList="userLeaveHistoryData"
    :processType="processType"
    :formatDate="formatDate"
    :withdrawRequest="withdrawRequest"
    :deleteDeclined="deleteDeclined"
    :key="leaveHistoryKey"/>

  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

import LeaveList from '@/components/LeaveList.vue';

import plusSVG from '@/components/svg/plus.svg';

@Options({
  name: 'Home',
  components: {
    LeaveList,
  },
  data() {
    return {
      plusSVG,
      leaveRequestKey: 0,
      leaveHistoryKey: 0,
    };
  },
  created() {
    this.$store.dispatch('userLeaveTypes');
    this.$store.dispatch('userLeaveHistory');
    this.$store.dispatch('userLeaveRequests');
  },
  computed: {
    userLeaveHistoryData() {
      return this.$store.state.userLeaveHistoryData;
    },
    userLeaveRequestsData() {
      return this.$store.state.userLeaveRequestsData;
    },
    leaveTypesData() {
      return this.$store.state.leaveTypesData;
    },
  },
  methods: {
    withdrawRequest(uuid: string) {
      const payload = {
        uuid,
      };
      this.$store.dispatch('withdrawRequest', payload);
    },
    deleteDeclined(uuid: string) {
      const payload = {
        uuid,
      };
      this.$store.dispatch('deleteDeclined', payload);
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
    userLeaveRequestsData() {
      // Update commponent
      this.leaveRequestKey += 1;
    },
    userLeaveHistoryData() {
      // Update commponent
      this.leaveHistoryKey += 1;
    },
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 25px auto auto 50px;
    // grid-gap: 10px;
    background-color: #2196F3;
    // padding: 10px;
  }

  .grid-container > div {
    text-align: left;
    background-color: rgba(255, 255, 255, 0.8);
    // border: 1px solid black;
    font-size: 30px;
  }

  .grid-container > div.more-info {
    grid-column: 1 / span 4;
  }

  $statusColors: ('approved': green, 'pending': yellow, 'declined': red, 'withdrawn': purple);

  @each $status, $color in $statusColors {
    .#{$status}.status-color {
      background-color: $color;
    }
  }

  .toggle-button {
    img {
      height: 16px !important;
    }
    img.plus {
      top: 12px;
      left: 12px;
    }
  }
</style>
