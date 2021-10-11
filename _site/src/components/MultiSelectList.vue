<template>

  <div class="r-grid container">
    <accordion-title :title="title"
    v-model:toggle="listToggle"
    @updateToggle="listToggle = $event"/>
  </div>

  <form class="r-grid" v-show="listToggle"
  @submit.prevent
  role="form"
  aria-label="view and edit pending requests">
    <ol>
      <li class="grid-container" v-for="item, index in userLeaveList" :key="index">

        <div class="checkbox-container">
          <input @change="toggleCheckboxLeave($event, item.uuid, item.duration_hours, )"
          type="checkbox"
          class="multi-select"
          ref="checkbox"
          aria-label="pending request"
          @click="item.boolean = !item.boolean"
          v-show="listToggle"
          role="checkbox"
          :key="index"
          :aria-checked="item.boolean"/>
        </div>

        <div class="status-color" :class="item.status"></div>

        <div class="info">

        <div class="date">{{ formatDate(item.date) }}</div>

        <div class="status" v-html="parseStatusTitle(item.status)"></div>

          <p>Leave Duration: {{ parseDurationType(item.duration_type, item.duration_hours) }}</p>
          <p>Leave Type: {{ processType(item.type) }}</p>
            <router-link
            :to="`/manage-employees/${$route.params.uin}/leave-item/${item.uuid}`"
            class="item-button">View Comment</router-link>

        </div>

      </li>
    </ol>

    <div v-if="userLeaveList && userLeaveList.length > 0"
    v-show="listToggle"
    class="calculate"
    @submit.prevent>
  <!--         <div>Selected:</div>
      <div v-for="key, value, index in sumHours"
      :key="index">
        {{ value }}: {{ key }} Hours
      </div> -->
      <p>Total {{ leavesArray.length }} selected.</p>
      <label>Supervisor Comment</label>
      <textarea class="comment" type="text"
      v-model="reviewerComment"
      aria-label="supervisor comment">
      </textarea>
      <button @click="approveRequest(leavesArray, reviewerComment)" class="item-button">
        Approve
      </button>
      <button @click="declineRequest(leavesArray, reviewerComment)" class="item-button">
        Decline
      </button>
    </div>

  </form>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AccordionTitle from '@/components/AccordionTitle.vue';

import arrowSVG from '@/components/svg/arrow.svg';

@Options({
  name: 'Multi Select List',
  props: [
    'title',
    'userLeaveList',
    'formatDate',
    'processType',
    'withdrawRequest',
    'deleteDeclined',
    'approveRequest',
    'declineRequest',
  ],
  components: {
    AccordionTitle,
  },
  data() {
    return {
      listToggle: true,
      arrowSVG,
      reviewerComment: null,
      leavesArray: [],
      sumHours: {
        Vacation: 1,
        Sick: 2,
        Floating: 1,
      },
    };
  },
  methods: {
    toggleCheckboxLeave(event: any, uuid: string) {
      if (this.leavesArray.includes(uuid) && event.target.checked === false) {
        const index = this.leavesArray.indexOf(uuid);
        this.leavesArray.splice(index, 1);
      } else if (event.target.checked === true) {
        this.leavesArray.push(uuid);
      }
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
    parseDurationType(type: string, hours: number) {
      let parsed;
      switch (type) {
        case 'full_day':
          parsed = `Full Day (${hours} Hours)`;
          break;
        case 'half_day':
          parsed = `Half Day (${hours} Hours)`;
          break;
        case 'custom':
          parsed = `Custom (${hours} Hours)`;
          break;
        default:
          parsed = 'Error';
      }
      return parsed;
    },
  },
})
export default class MultiSelectList extends Vue {}
</script>

<style lang="scss" scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 32px 16px auto;
    // grid-gap: 10px;
    // background-color: #2196F3;
    // padding: 10px;
  }

  .calculate {
    margin: 20px 0 20px;
    .comment {
      box-sizing: border-box;
    }
    .item-button {
      // min-width: 45.5%;
      text-align: center;
      background-color: #001E62;
      color: white;
      display: inline-block;
      text-decoration: none;
      font-weight: 500;
      height: 40px;
      line-height: 40px;
    }
    button.item-button {
      font: unset;
      padding: unset;
      border: none;
      font-weight: 500;
    }
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
    &.checkbox-container {
      height: 25px;
      background-color: unset;
      input {
        height: 25px;
        width: 25px;
        position: relative;
        top: -4px;
      }
    }
    &.info {
      // padding-top: 10px;
      // margin-left: 32px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      & .status {
        text-transform: capitalize;
      }
      & .date {
        // text-align: center;
        padding-left: 15px;
        width: 135px;
      }
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
        min-width: 100%;
        text-align: center;
        background-color: #001E62;
        color: white;
        display: inline-block;
        text-decoration: none;
        font-weight: 500;
      }
      .item-button:focus-visible {
        outline: 2px solid #2196F3;
      }
    }
  }

  .grid-container > div.more-info {
    grid-column: 1 / span 3;
  }

  $statusColors: (
    'approved': green,
    'pending-approval': yellow,
    'declined': red,
    'pending-withdrawal': purple
  );

  @each $status, $color in $statusColors {
    .#{$status}.status-color {
      background-color: $color;
      height: 40px;
    }
  }
</style>
