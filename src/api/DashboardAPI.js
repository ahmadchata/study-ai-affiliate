import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const DashboardAPI = {
  getPayouts: async function (page = 1, search, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_payouts?page=${page}&page_size=20&search=${search}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getPayouts.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getPayoutsSummary: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_payout_summary`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getPayoutsSummary.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  updateProfile: async function (name, phone, email, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.update_organization_profile?contact_person=${name}&contact_number=${phone}&contact_person_email=${email}`,
      method: "PUT",
      signal: cancel
        ? cancelApiObject[this.updateProfile.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  overview: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_affiliate_profile`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.overview.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.message;
  },

  getStudents: async function (page = 1, search, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_affiliate_students?page=${page}&page_size=${20}&search=${search}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getStudents.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getProfile: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_affiliate_profile`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getProfile.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.message;
  },

  getEarnings: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.get_earnings`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getEarnings.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },

  login: async function (user, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.login`,
      method: "POST",
      data: user,
      signal: cancel
        ? cancelApiObject[this.login.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },

  delete: async function (email, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.logout`,
      method: "POST",
      data: email,
      signal: cancel
        ? cancelApiObject[this.delete.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },
};

const cancelApiObject = defineCancelApiObject(DashboardAPI);
