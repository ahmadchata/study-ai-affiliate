import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const BanksAPI = {
  getBanks: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.list_banks`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getBanks.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  getAccountName: async function (accountNumber, bankCode, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.affiliate.resolve_account?account_number=${accountNumber}&bank_code=${bankCode}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAccountName.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },
};

const cancelApiObject = defineCancelApiObject(BanksAPI);
