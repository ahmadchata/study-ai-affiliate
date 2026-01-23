import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const EmailAPI = {
  sendMail: async function (emails, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.send_referral_link`,
      method: "POST",
      data: emails,
      signal: cancel
        ? cancelApiObject[this.sendMail.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },
};

const cancelApiObject = defineCancelApiObject(EmailAPI);
