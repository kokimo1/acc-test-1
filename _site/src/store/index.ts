import { createStore } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import router from '../router';

const url = `${process.env.VUE_APP_URL_PROTOCOL}://${process.env.VUE_APP_API_URL}/api/v1`;

const routes = {
  authenticate: `${url}/authenticate`,
  employee: `${url}/employee`,
  leaveTypes: `${url}/leave-types`,
  schedule: `${url}/schedule`,
  holidays: `${url}/holidays`,
  request: `${url}/request`,
  requests: `${url}/requests`,
  withdraw: `${url}/withdraw`,
  approve: `${url}/approve`,
  decline: `${url}/decline`,
  requestHistory: `${url}/request-history`,
  employees: `${url}/employees`,
  pendingRequests: `${url}/pending-requests`,
  processedRequests: `${url}/processed-requests`,
};

function redirectLogin() {
  const tokenExpiration = sessionStorage.getItem('groupToolTokenExpiration');
  const groupToolToken = sessionStorage.getItem('groupToolToken');
  const currentTime = String(moment().toDate());

  // Reroute to login page
  if (router.currentRoute.value.name !== 'Login' // Not on login and one of the following
  && (tokenExpiration === null
  || tokenExpiration === 'undefined'
  || tokenExpiration < currentTime
  || groupToolToken === null
  || groupToolToken === 'undefined')) {
    router.push('/login');
  }
}

export default createStore({
  state: {
    token: null,
    userInfoData: null,
    leaveTypesData: null,
    leaveItemData: null,
    userScheduleData: null,
    userHolidayData: null,
    userLeaveRequestsData: null,
    userLeaveHistoryData: null,
    employeePendingRequestsData: null,
    employeeProcessedRequestsData: null,
    employeesListData: null,
    error: null,
    success: null,
    warning: null,
    packageVersion: process.env.PACKAGE_VERSION || '0',
  },
  mutations: {
    loadToken(state, token) {
      state.token = token;
    },
    updateUserInfo(state, userInfoData) {
      state.userInfoData = userInfoData;
    },
    updateLeaveTypes(state, leaveTypesData) {
      state.leaveTypesData = leaveTypesData;
    },
    updateLeaveItem(state, leaveItemData) {
      state.leaveItemData = leaveItemData;
    },
    updateUserSchedule(state, userScheduleData) {
      state.userScheduleData = userScheduleData;
    },
    updateUserHoliday(state, userHolidayData) {
      state.userHolidayData = userHolidayData;
    },
    updateUserLeaveRequests(state, userLeaveRequestsData) {
      state.userLeaveRequestsData = userLeaveRequestsData;
    },
    updateUserLeaveHistory(state, userLeaveHistoryData) {
      state.userLeaveHistoryData = userLeaveHistoryData;
    },
    updateEmployeesList(state, employeesListData) {
      state.employeesListData = employeesListData;
    },
    updateEmployeePendingRequests(state, employeePendingRequestsData) {
      state.employeePendingRequestsData = employeePendingRequestsData;
    },
    updateEmployeeProcessedRequests(state, employeeProcessedRequestsData) {
      state.employeeProcessedRequestsData = employeeProcessedRequestsData;
    },
    updateSuccess(state, success) {
      state.success = success;
    },
    updateError(state, error) {
      state.error = error;
    },
    updateWarning(state, warning) {
      state.warning = warning;
    },
    resetError(state) {
      state.error = null;
    },
    resetSuccess(state) {
      state.success = null;
    },
    resetWarning(state) {
      state.warning = null;
    },
    resetToken(state) {
      state.token = null;
      state.userInfoData = null;
      state.leaveTypesData = null;
      state.leaveItemData = null;
      state.userScheduleData = null;
      state.userHolidayData = null;
      state.userLeaveRequestsData = null;
      state.userLeaveHistoryData = null;
      state.employeePendingRequestsData = null;
      state.employeeProcessedRequestsData = null;
      state.employeesListData = null;
      // state.error = null;
      // state.success = null;
      // state.warning = null;
    },
  },
  actions: {
    userLogin({ commit }, { netid, password }) {
      axios.post(routes.authenticate, {
        netid,
        password,
      }).then((response) => {
        const { token } = response.data;
        sessionStorage.setItem('groupToolToken', token);
        commit('loadToken', token);
        const tokenExpires: any = moment().add(30, 'm').toDate();
        sessionStorage.setItem('groupToolTokenExpiration', tokenExpires);
        // const location = sessionStorage.getItem('groupToolCurrentLocation');
        // if (location === null || location === '') {
        //   window.location.href = '/';
        // } else {
        //   window.location.href = location;
        // }
        router.push('/');
      }).catch((error) => {
        // localStorage.removeItem('user-token');
        if (error) {
          commit('updateError', error.response.data.error);
          // this.state.error = error.response.status;
        }
      });
    },
    userInfo({ commit, state }, { uin }) {
      let employeeURL;
      if (uin) {
        employeeURL = `${routes.employee}?uin=${uin}`;
      } else {
        employeeURL = routes.employee;
      }
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(employeeURL, config)
        .then((response) => {
          commit('updateUserInfo', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    userLeaveTypes({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.leaveTypes, config)
        .then((response) => {
          commit('updateLeaveTypes', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    userSchedule({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.schedule, config)
        .then((response) => {
          commit('updateUserSchedule', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    userHoliday({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.holidays, config)
        .then((response) => {
          commit('updateUserHoliday', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    newRequestSubmit({ commit, state },
      {
        startDate,
        endDate,
        durationType,
        durationHours,
        type,
        comment,
      }) {
      const data = {
        start_date: startDate,
        end_date: endDate,
        duration_type: durationType,
        duration_hours: durationHours,
        type,
        comment,
      };
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.post(routes.request, data, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          router.push('/');
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    leaveItem({ commit, state }, { uuid }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(`${routes.request}?uuid=${uuid}`, config)
        .then((response) => {
          commit('updateLeaveItem', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    updateRequest({ commit, state },
      {
        uuid,
        durationType,
        durationHours,
        type,
        comment,
      }) {
      const data = {
        duration_type: durationType,
        duration_hours: durationHours,
        type,
        comment,
      };
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.put(`${routes.request}?uuid=${uuid}`, data, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          router.push('/');
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    userLeaveRequests({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.requests, config)
        .then((response) => {
          commit('updateUserLeaveRequests', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    userLeaveHistory({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.requestHistory, config)
        .then((response) => {
          commit('updateUserLeaveHistory', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    withdrawRequest({ commit, state, dispatch }, { uuid }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.put(`${routes.withdraw}?uuid=${uuid}`, null, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          if (router.currentRoute.value.name === 'Home') {
            // Update all requests from database
            dispatch('userLeaveRequests');
            dispatch('userLeaveHistory');
            dispatch('userInfo', { uin: null });
          } else {
            // Redirect to home page
            router.push('/');
          }
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    deleteDeclined({ commit, state, dispatch }, { uuid }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.delete(`${routes.request}?uuid=${uuid}`, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          if (router.currentRoute.value.name === 'Home') {
            // Update all requests from database
            dispatch('userLeaveRequests');
            dispatch('userLeaveHistory');
            dispatch('userInfo', { uin: null });
          } else {
            // Redirect to home page
            router.push('/');
          }
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    employeesList({ commit, state }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(routes.employees, config)
        .then((response) => {
          commit('updateEmployeesList', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    employeePendingRequests({ commit, state }, { uin }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(`${routes.pendingRequests}?uin=${uin}`, config)
        .then((response) => {
          commit('updateEmployeePendingRequests', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    employeeProcessedRequests({ commit, state }, { uin }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      axios.get(`${routes.processedRequests}?uin=${uin}`, config)
        .then((response) => {
          commit('updateEmployeeProcessedRequests', response.data);
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
        });
    },
    approveRequest({ commit, state, dispatch }, { uuids, reviewerComment, uin }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      const data = {
        uuids,
        comment: reviewerComment,
      };
      axios.put(routes.approve, data, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          if (router.currentRoute.value.name === 'Manage Single Employee') {
            // Update all requests from database
            dispatch('employeePendingRequests', uin);
            dispatch('employeeProcessedRequests', uin);
            dispatch('userInfo', uin);
          } else {
            // Redirect to home page
            router.push(`/manage-employees/${router.currentRoute.value.params.uin}`);
          }
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
    declineRequest({ commit, state, dispatch }, { uuids, reviewerComment, uin }) {
      const config = {
        headers: {
          'x-access-token': state.token,
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      };
      const data = {
        uuids,
        comment: reviewerComment,
      };
      axios.put(routes.decline, data, config)
        .then((response) => {
          commit('updateSuccess', response.data);
          if (router.currentRoute.value.name === 'Manage Single Employee') {
            // Update all requests from database
            dispatch('employeePendingRequests', uin);
            dispatch('employeeProcessedRequests', uin);
            dispatch('userInfo', uin);
          } else {
            // Redirect to home page
            router.push(`/manage-employees/${router.currentRoute.value.params.uin}`);
          }
        }).catch((error) => {
          if (error) {
            commit('updateError', error.response.data.error);
          }
          redirectLogin();
        });
    },
  },
  // modules: {
  // },
  getters: {
    appVersion(state) {
      return state.packageVersion;
    },
  },
});
