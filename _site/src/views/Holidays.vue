<template>
  <div>

    <!-- <p>{{ error }}</p> -->
<!-- {{userHolidayData}} -->
    <div class="r-grid container">
      <h2>Holidays</h2>
    </div>

    <div class="r-grid grid-container">
      <template v-for="item, index in userHolidayData" :key="index">
        <div class="date">{{ formatDate(item.date) }}</div>
        <div>{{ item.title }}</div>
        <div>{{ parseGroup(item.applies_to) }}</div>
        <!-- <div>{{ item.applies_to }}</div> -->
        <!-- <button @click="requestWorkday(item)">Request Workday</button> -->
      </template>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

@Options({
  name: 'Holidays',
  created() {
    this.$store.dispatch('userHoliday');
  },
  computed: {
    userHolidayData() {
      return this.$store.state.userHolidayData;
    },
  },
  methods: {
    formatDate(datetime: Date) {
      const newDatetime = moment(datetime, moment.ISO_8601, true).format('MM/DD/YYYY');
      return newDatetime;
    },
    requestWorkday(data: any) {
      console.log(data);
    },
    parseGroup(val: string) {
      let text = '';
      switch (val) {
        case 'groupA':
          text = 'Group A';
          break;
        case 'groupB':
          text = 'Group B';
          break;
        case 'groupA,groupB':
          text = 'Group A/B';
          break;
        default:
          break;
      }
      return text;
    },
  },
})
export default class Holidays extends Vue {}
</script>

<style lang="scss" scoped>
  // .grid-container {
  //   display: grid;
  //   grid-template-columns: auto auto auto 100px;
  //   // grid-gap: 10px;
  //   background-color: #2196F3;
  //   // padding: 10px;
  // }

  // .grid-container > div {
  //   text-align: left;
  //   background-color: rgba(255, 255, 255, 0.8);
  //   // border: 1px solid black;
  //   font-size: 30px;
  // }

  // .grid-container > div.more-info {
  //   grid-column: 1 / span 4;
  // }

  .grid-container {
    display: grid;
    grid-template-columns:135px auto 100px;
    // grid-gap: 10px;
    // background-color: #2196F3;
    // padding: 10px;
  }

  .grid-container > div {
    text-align: left;
    min-height: 40px;
    line-height: 40px;
    // text-align: center;
    // font-weight: 400;
    // background-color: rgba(255, 255, 255, 0.8);
    background-color: #f6f6f6;
    font-size: 18px;
    &:not(.more-info) {
      border-top: 2px solid white;
    }
    &.date {
      // text-align: center;
      padding-left: 15px;
    }
    &.status {
      text-transform: capitalize;
    }
    &.more-info {
      padding-top: 10px;
      margin-left: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      p {
        padding-left: 15px;
        margin: 0;
        line-height: initial;
        width: 100%;
        &:last-of-type {
          padding-bottom: 10px;
        }
      }
      .item-button {
        min-width: calc(50% - 1px);
        text-align: center;
        background-color: #001E62;
        color: white;
        display: inline-block;
        text-decoration: none;
      }
    }
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
</style>
