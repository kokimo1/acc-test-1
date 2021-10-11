<template>

  <div class="r-grid container">
    <AccordionTitle :title="title"
    v-model:toggle="listToggle"
    @updateToggle="listToggle = $event"/>
  </div>

  <div class="r-grid message"
  v-show="listToggle"
  v-if="userLeaveList && userLeaveList.length === 0">
    No items to display.
  </div>

  <ol>
    <li class="r-grid grid-container"
    v-show="listToggle"
    v-for="item, index in userLeaveList"
    :key="index"
    :aria-expanded="item.boolean">
      <div @click="item.boolean = !item.boolean"
      class="status-color"
      :class="item.status"></div>
      <div @click="item.boolean = !item.boolean"
      class="date">{{ formatDate(item.date) }}</div>
      <div @click="item.boolean = !item.boolean"
      class="status"
      v-html="parseStatusTitle(item.status)"></div>

      <button @click="item.boolean = !item.boolean"
      :class="{ 'active': item.boolean }"
      class="toggle-button">
        <img :src="arrowSVG" alt="toggle"/>
      </button>

      <div class="more-info" v-show="item.boolean">
        <p>Leave Duration: {{ parseDurationType(item.duration_type, item.duration_hours) }}</p>
        <p>Leave Type: {{ processType(item.type) }}</p>
        <template v-if="$route.name != 'Manage Single Employee'
        && (item.status == 'approved'
        || item.status == 'pending-approval')">
          <button @click="withdrawRequest(item.uuid)" class="item-button">
            Withdraw
          </button>
<!--           <router-link class="item-button" :to="'/'"
          @click="withdrawRequest(item.uuid)">Withdraw</router-link> -->
          <router-link :to="`/leave-item/${item.uuid}`"
            class="item-button">View Comment</router-link>
        </template>
        <template v-else-if="$route.name != 'Manage Single Employee'
        && item.status == 'declined'">
          <button @click="deleteDeclined(item.uuid)" class="item-button">
            Delete
          </button>
<!--           <router-link class="item-button" :to="'/'"
          @click="deleteDeclined(item.uuid)">Delete</router-link> -->
          <router-link :to="`/leave-item/${item.uuid}`"
            class="item-button">Edit Details</router-link>
        </template>
        <template v-else-if="$route.name != 'Manage Single Employee'
        && item.status == 'pending-withdrawal'">
          <router-link :to="`/leave-item/${item.uuid}`"
            class="item-button">View Comments</router-link>
        </template>
        <template v-else-if="$route.name == 'Manage Single Employee'
        && item.status == 'approved'">
<!--           <router-link class="item-button" :to="'/'"
          @click="declineRequest([item.uuid])">Decline</router-link> -->
          <button @click="declineRequest([item.uuid])" class="item-button">
            Decline
          </button>
          <router-link
          :to="`/manage-employees/${$route.params.uin}/leave-item/${item.uuid}`"
            class="item-button">View Comment</router-link>
        </template>
        <template v-else-if="$route.name == 'Manage Single Employee'">
          <router-link
          :to="`/manage-employees/${$route.params.uin}/leave-item/${item.uuid}`"
            class="item-button">View Comment</router-link>
        </template>

      </div>
    </li>
  </ol>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AccordionTitle from '@/components/AccordionTitle.vue';

import arrowSVG from '@/components/svg/arrow.svg';

@Options({
  name: 'Leave List',
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
    };
  },
  methods: {
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
export default class LeaveList extends Vue {}
</script>

<style lang="scss" scoped>

  .grid-container {
    display: grid;
    grid-template-columns: 16px 135px auto 40px;
    // grid-gap: 10px;
    // background-color: #2196F3;
    // padding: 10px;
    & button {
      cursor: pointer;
    }
  }

  .grid-container > .toggle-button {
    background-color: #f6f6f6;
    border: unset;
    border-top: 2px solid white;
    width: 40px;
    position: relative;
    img {
      height: 12px;
      position: relative;
      transform: rotate(-90deg);
      transition-duration: 0.25s;
    }
    &.active {
      img {
        transform: rotate(0deg);
        transition-duration: 0.25s;
      }
    }
  }

  .grid-container > div:not(.more-info) {
    cursor: pointer;
  }

  .grid-container > div {
  // .grid-container > div:not(.toggle-button) {
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
        font-weight: 500;
      }
      button.item-button {
        font: unset;
        padding: unset;
        border: none;
        font-weight: 500;
      }
      .item-button:focus-visible {
        outline: 2px solid #2196F3;
      }
    }
  }

  .grid-container > div.more-info {
    grid-column: 1 / span 4;
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
    }
  }
</style>
