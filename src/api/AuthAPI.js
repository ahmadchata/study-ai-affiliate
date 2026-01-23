import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const AuthAPI = {
  create: async function (user, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.signup.create_account`,
      method: "POST",
      data: user,
      signal: cancel
        ? cancelApiObject[this.create.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },

  verifyOtp: async function (data, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.signup.verify_email`,
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[this.verifyOtp.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  verifyToken: async function (data, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.verify_otp`,
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[this.verifyToken.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  checkAuth: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.check_auth?type=Affiliate`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.checkAuth.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  login: async function (user, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.login`,
      method: "POST",
      data: user,
      signal: cancel
        ? cancelApiObject[this.login.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },

  changePassword: async function (password, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.reset_password`,
      method: "POST",
      data: password,
      signal: cancel
        ? cancelApiObject[this.changePassword.name].handleRequestCancellation()
            .signal
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

const cancelApiObject = defineCancelApiObject(AuthAPI);
