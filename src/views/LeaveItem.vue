<template>

  <div v-if="leaveItemData">

    <div class="r-grid container">
      <h2>Leave Item</h2>
    </div>

    <form class="form-container"
    v-on:submit.prevent
    aria-label="review employee request">

      <label>Date</label>
      <input type="date"
      :value="formatDate(leaveItemData.date)"
      disabled>

      <label>Status</label>
      <p class="status" v-html="parseStatusTitle(leaveItemData.status)"></p>

      <label>
        Leave Type
        <span class="asterisk" v-if="leaveItemData.status === 'declined'">*</span>
      </label>
      <select v-model="leaveItemData.type"
      @change="leaveChange()"
      :disabled="checkDisabled || $route.name === 'Employee Leave Item'">
        <option v-for="item, index in leaveTypesData"
        :key="index"
        :value="item.type">
          {{ item.display_title }}
        </option>
        <option v-if="leaveItemData.type === 'workday'" value="workday">Workday</option>
      </select>

      <label>
        Duration
        <span class="asterisk" v-if="leaveItemData.status === 'declined'">*</span>
      </label>
      <select v-model="leaveItemData.duration_type"
      :disabled="checkDisabled || $route.name === 'Employee Leave Item'">
        <option value="full_day">Full Day</option>
        <option value="half_day" v-if="allowHalfDayType">Half Day</option>
        <option value="custom" v-if="allowCustomType">Custom</option>
      </select>

      <template v-if="leaveItemData.duration_type === 'custom'">
        <label>
          Hours
          <span class="asterisk" v-if="leaveItemData.status === 'declined'">*</span>
        </label>
        <input v-model="durationHours.hours"
        min="0"
        max="24"
        name="hours"
        type="number"
        step="1"
        @keypress="wholeNumber"
        :disabled="checkDisabled || $route.name === 'Employee Leave Item'"
        required/>
        <label>
          Minutes
          <span class="asterisk" v-if="leaveItemData.status === 'declined'">*</span>
        </label>
        <select v-model="durationHours.minutes"
        name="minutes"
        :disabled="checkDisabled || $route.name === 'Employee Leave Item'"
        required>
          <option v-for="number, index in [0, 15, 30, 45]"
          :key="index"
          :value="number"
          required>
            {{ number }}
          </option>
        </select>
      </template>

      <label>Employee Comment</label>
      <textarea class="comment"
      v-model="leaveItemData.submitter_comment"
      type="text"
      placeholder=""
      :disabled="checkDisabled || $route.name === 'Employee Leave Item'">
      </textarea>

      <template v-if="leaveItemData.reviewer_comment
      || $route.name == 'Employee Leave Item'">
        <label>Supervisor Comment</label>
        <span class="comment-name">{{ leaveItemData.reviewer_name }}</span>
        <textarea class="comment"
        v-model="leaveItemData.reviewer_comment"
        type="text"
        placeholder=""
        :disabled="checkDisabled && $route.name !== 'Employee Leave Item'">
        </textarea>
      </template>

      <template v-if="$route.name !== 'Employee Leave Item'
        && (leaveItemData.status === 'approved'
        || leaveItemData.status === 'pending-approval')">
        <button @click="withdrawRequest(currentUUID)">Withdraw</button>
      </template>
      <template v-else-if="$route.name !== 'Employee Leave Item'
      && leaveItemData.status === 'declined'">
        <button @click="deleteDeclined(currentUUID)">Delete</button>
        <button @click="updateRequest(currentUUID)">Update</button>
      </template>
      <template v-else-if="$route.name === 'Employee Leave Item'
        && leaveItemData.status !== 'approved'
        && leaveItemData.status !== 'declined'">
        <button @click="approveRequest(currentUUID)">Approve</button>
        <button @click="declineRequest(currentUUID)">Decline</button>
      </template>
      <template v-else-if="$route.name === 'Employee Leave Item'
        && leaveItemData.status === 'approved'">
        <button @click="declineRequest(currentUUID)">Decline</button>
      </template>

    </form>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

@Options({
  name: 'Leave Item',
  data() {
    return {
      currentUUID: this.$router.currentRoute.value.params.uuid,
      allowHalfDayType: true,
      allowCustomType: true,
      exception: false,
      durationHours: {
        hours: 0,
        minutes: 0,
      },
    };
  },
  created() {
    this.$store.dispatch('userLeaveTypes');
    this.leaveItem();
  },
  computed: {
    userInfoData() {
      return this.$store.state.userInfoData;
    },
    leaveItemData() {
      return this.$store.state.leaveItemData;
    },
    leaveTypesData() {
      return this.$store.state.leaveTypesData;
    },
    checkDisabled() {
      let boolean;
      switch (this.leaveItemData.status) {
        case 'declined':
          boolean = false;
          break;
        case 'pending-approval':
        case 'withdraw-approval':
        case 'approved':
        default:
          boolean = true;
      }
      return boolean;
    },
  },
  methods: {
    withdrawRequest(uuid: string) {
      const payload = {
        uuid,
      };
      this.$store.dispatch('withdrawRequest', payload);
    },
    approveRequest(uuids: string) {
      const payload = {
        uuids: [uuids],
        reviewerComment: this.leaveItemData.reviewer_comment,
      };
      this.$store.dispatch('approveRequest', payload);
    },
    declineRequest(uuids: string) {
      const payload = {
        uuids: [uuids],
        reviewerComment: this.leaveItemData.reviewer_comment,
      };
      this.$store.dispatch('declineRequest', payload);
    },
    leaveItem() {
      const payload = {
        uuid: this.currentUUID,
      };
      this.$store.dispatch('leaveItem', payload);
    },
    deleteDeclined(uuid: string) {
      const payload = {
        uuid,
      };
      this.$store.dispatch('deleteDeclined', payload);
    },
    updateRequest(uuid: string) {
      if (this.leaveItemData.duration_type === 'custom') {
        const hours = parseInt(this.durationHours.hours, 10);
        const minutes = this.durationHours.minutes / 60;
        this.leaveItemData.duration_hours = hours + minutes;
      } else {
        this.leaveItemData.duration_hours = null;
      }
      const payload = {
        uuid,
        durationType: this.leaveItemData.duration_type,
        durationHours: this.leaveItemData.duration_hours,
        type: this.leaveItemData.type,
        comment: this.leaveItemData.submitter_comment,
      };
      this.$store.dispatch('updateRequest', payload);
    },
    formatDate(date: string) {
      return moment(date).format('YYYY-MM-DD');
    },
    parseStatusTitle(status: string) {
      let parsed;
      switch (status) {
        case 'pending-approval':
          parsed = 'Pending Approval';
          break;
        case 'pending-withdrawal':
          parsed = 'Pending Withdrawal';
          break;
        default:
          parsed = status;
      }
      return parsed;
    },
    leaveChange() {
      switch (this.leaveItemData.type) {
        case 'floating_holiday':
        case 'parental_leave':
          this.leaveItemData.duration_type = 'full_day';
          this.allowHalfDayType = false;
          this.allowCustomType = false;
          break;
        case 'fmla_vacation':
        case 'fmla_sick':
        case 'fmla_no_pay':
          this.allowHalfDayType = true;
          this.allowCustomType = true;
          this.$store.commit(
            'updateWarning',
            'FMLA must be pre-approved by your department Human Resources before submitting a FMLA leave.',
          );
          break;
        case 'vessa_vacation':
        case 'vessa_sick':
        case 'vessa_no_pay':
          this.allowHalfDayType = true;
          this.allowCustomType = true;
          this.$store.commit(
            'updateWarning',
            'VESSA must be pre-approved by your department Human Resources before submitting a VESSA leave.',
          );
          break;
        default:
          this.allowHalfDayType = true;
          this.allowCustomType = this.exception;
      }
    },
    wholeNumber(event: any) {
      if (event.key === '.' || event.key === ',') {
        event.preventDefault();
      }
    },
  },
  watch: {
    userInfoData() {
      if (this.userInfoData.type === 'nonExempt') {
        this.exception = true;
        this.leaveChange();
      }
    },
    leaveItemData() {
      this.leaveChange();
      if (this.leaveItemData.duration_type === 'custom' && this.leaveItemData.duration_hours) {
        const durationHours = this.leaveItemData.duration_hours;
        this.durationHours.hours = Math.floor(durationHours);
        this.durationHours.minutes = 60 * (durationHours - Math.floor(durationHours));
      }
    },
    'leaveItemData.type': {
      handler(newVal, oldVal) {
        if (this.exception === false
        && !newVal.includes('vessa')
        && !newVal.includes('fmla')
        && this.leaveItemData.duration_type === 'custom') {
          switch (oldVal) {
            case 'fmla_vacation':
            case 'fmla_sick':
            case 'fmla_no_pay':
            case 'vessa_vacation':
            case 'vessa_sick':
            case 'vessa_no_pay':
              this.leaveItemData.duration_type = 'full_day';
              break;
            default:
              break;
          }
        }
      },
      deep: true,
    },
  },
})
export default class LeaveItem extends Vue {}
</script>

<style lang="scss" scoped>
p.status {
  text-transform: capitalize;
  font-weight: 800;
}

.comment-name {
  font-weight: 600;
  padding: 5px 0
}

</style>
