<template>

  <div class="r-grid container">
      <h2>New Request</h2>
  </div>

  <form v-on:submit.prevent
  aria-label="create a new leave request">

    <div class="date-grouping">
      <label>
        Start Date
        <span class="asterisk">*</span>
      </label>
      <input v-model="newRequest.start_date"
      type="date"
      placeholder="Date"
      @change="startDaySelected()"
      required>
    </div>

    <div class="date-grouping">
      <label>
        End Date
        <span class="asterisk">*</span>
      </label>
      <input v-model="newRequest.end_date"
      type="date"
      placeholder="Date"
      @change="workdayCheck()"
      :min="newRequest.start_date"
      required>
    </div>

    <label>
      Leave Type
      <span class="asterisk">*</span>
    </label>
    <select v-model="newRequest.type"
    @change="leaveChange()"
    required>
      <option v-for="type, index in leaveTypesData"
        :key="index"
        :value="type.type">
        {{ type.display_title }}
      </option>
      <option v-if="workday" value="workday">Workday</option>
    </select>

    <label>
      Duration
      <span class="asterisk">*</span>
    </label>
    <select v-model="newRequest.duration_type" required>
      <option value="full_day">Full Day</option>
      <option v-if="allowHalfDayType" value="half_day">Half Day</option>
      <option v-if="allowCustomType" value="custom">Custom</option>
    </select>

    <template v-if="newRequest.duration_type === 'custom'">
      <label>
        Hours
        <span class="asterisk">*</span>
      </label>
      <input v-model="newRequest.hours"
      min="0"
      max="24"
      name="hours"
      type="number"
      step="1"
      @keypress="wholeNumber"
      placeholder="Hours"
      required/>
      <label>
        Minutes
        <span class="asterisk">*</span>
      </label>
      <select v-model="newRequest.minutes"
      name="minutes"
      placeholder="Minutes"
      required>
        <option v-for="number, index in [0, 15, 30, 45]"
        :key="index"
        :value="number"
        :selected="number === 0">
          {{ number }}
        </option>
      </select>
    </template>

    <label>Comment</label>
    <textarea class="comment"
    v-model="newRequest.comment"
    type="text"
    placeholder=""></textarea>

    <button @click="newRequestSubmit()" type="submit">Submit Request</button>

  </form>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

@Options({
  name: 'New Request',
  data() {
    return {
      workday: false,
      allowHalfDayType: true,
      allowCustomType: true,
      uin: null,
      exception: false,
      newRequest: {
        start_date: null,
        end_date: null,
        duration_type: null,
        hours: null,
        minutes: null,
        duration_hours: null,
        type: null,
        comment: null,
      },
    };
  },
  created() {
    const payload1 = {
      uid: this.uin,
    };
    this.$store.dispatch('userInfo', payload1);
    this.$store.dispatch('userLeaveTypes');
    this.$store.dispatch('userSchedule');
    this.$store.dispatch('userHoliday');
  },
  computed: {
    leaveTypesData() {
      return this.$store.state.leaveTypesData;
    },
    userInfoData() {
      return this.$store.state.userInfoData;
    },
    userScheduleData() {
      return this.$store.state.userScheduleData;
    },
    userHolidayData() {
      return this.$store.state.userHolidayData;
    },
  },
  methods: {
    newRequestSubmit() {
      if (this.newRequest.duration_type === 'custom') {
        const hours = parseInt(this.newRequest.hours, 10);
        const minutes = this.newRequest.minutes / 60;
        this.newRequest.duration_hours = hours + minutes;
      } else {
        this.newRequest.duration_hours = null;
      }
      const payload = {
        startDate: this.newRequest.start_date,
        endDate: this.newRequest.end_date,
        durationType: this.newRequest.duration_type,
        durationHours: this.newRequest.duration_hours,
        type: this.newRequest.type,
        comment: this.newRequest.comment,
      };
      this.$store.dispatch('newRequestSubmit', payload);
    },
    startDaySelected() {
      // prevent end date value being null or less than start date
      if (this.newRequest.start_date > this.newRequest.end_date
      || this.newRequest.end_date === null) {
        this.newRequest.end_date = this.newRequest.start_date;
      }
      // check if selected date allows for workday type
      // this.workdayCheck(); // Temporarily disablin
    },
    workdayCheck() {
      this.$store.dispatch('userHoliday');
      this.$store.dispatch('userSchedule');
      let holiday = false;
      let i;
      // parse schedule data
      const schedule = Object.values(this.userScheduleData);
      // get day of week from user start date selection
      // fiy: schedule endpoint first and second array item is uuid and uin, hense '+ 2'.
      const dow = moment(this.newRequest.start_date).day() + 2;
      // check if selected is holiday
      for (i = 0; i < this.userHolidayData.length; i += 1) {
        if (this.newRequest.start_date === moment(this.userHolidayData[i].date).format('YYYY-MM-DD')) {
          holiday = true;
        }
      }
      // check if weekend or holiday is selected
      // for workday to apply end date should match start date
      if ((schedule[dow] === 0 || holiday)
      && this.newRequest.start_date === this.newRequest.end_date) {
        this.workday = true;
      } else {
        this.workday = false;
      }
    },
    leaveChange() {
      switch (this.newRequest.type) {
        case 'floating_holiday':
        case 'parental_leave':
          this.newRequest.duration_type = 'full_day';
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
    'newRequest.type': {
      handler(newVal, oldVal) {
        if (this.exception === false
        && !newVal.includes('vessa')
        && !newVal.includes('fmla')
        && this.newRequest.duration_type === 'custom') {
          switch (oldVal) {
            case 'fmla_vacation':
            case 'fmla_sick':
            case 'fmla_no_pay':
            case 'vessa_vacation':
            case 'vessa_sick':
            case 'vessa_no_pay':
              this.newRequest.duration_type = 'full_day';
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
export default class NewRequest extends Vue {}
</script>

<style lang="scss" scoped>

  form {
    display: flex;
    flex-wrap: wrap;
    background-color: #f6f6f6;
    margin: 0 16px;
    padding: 15px;
    justify-content: space-between;
    input, select, textarea {
      width: 100%;
      margin: 10px 0;
      box-sizing: border-box;
    }
    label {
      width: 100%;
    }
    .comment {
      min-height: 100px;
    }
    button {
      width: 100%;
      height: 45px;
      background-color: #001E62;
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
    .date-grouping {
      width: 50%;
    }
  }

</style>
