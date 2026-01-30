import "./styles.css";
import { useState } from "react";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingTracker from "../../Common/Loading";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { useQuery } from "@tanstack/react-query";
import OtpInput from "react-otp-input";
import { useSnackbar } from "notistack";

const Requests = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [points, setPoints] = useState("");
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { data: profile, isFetching } = useQuery({
    queryKey: ["profile"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.getProfile(true),
  });

  const handleContinue = () => {
    if (step === 3) {
      // Submit the payout request
      mutation.mutate({
        amount: calculatedCash,
        bank_code: profile?.bank_code,
        withdrawal_pin: pin,
      });
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = parseInt(value) || 0;
      if (numValue <= profile?.current_balance) {
        setPoints(value);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: (details) => {
      const response = DashboardAPI.requestPayout(details, true);
      return response;
    },
    onSuccess: () => {
      enqueueSnackbar("Success", {
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#fff",
          color: "#0c7a50",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/dashboard/payouts");
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  const calculatedCash = points ? parseInt(points) * 1000 : "";

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    <div className="container px-3 py-2 py-lg-4">
      <span
        onClick={() => navigate(-1)}
        className="p-0 d-flex align-items-center pointer mb-4"
      >
        <KeyboardArrowLeft /> Back
      </span>
      <div className="mx-auto" style={{ maxWidth: "879px" }}>
        <div
          className={`${step === 3 ? "d-none" : "d-flex"} justify-content-between align-items-center`}
        >
          <h5>Request payout</h5>
        </div>
        <div className="refer-info mt-4 p-3">
          <div className="request-slider">
            <div
              className={`request-slides ${
                step === 2
                  ? "request-slides--step2"
                  : step === 3
                    ? "request-slides--step3"
                    : ""
              }`}
            >
              <div className="request-slide">
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label label-font">Points</label>
                    <label className="form-label label-font">
                      Balance: {profile?.current_balance}pts
                    </label>
                  </div>
                  <input
                    type="number"
                    className="form-control request-input py-2 fs-3"
                    value={points}
                    onChange={handlePointsChange}
                    placeholder="0"
                  />
                </div>
                <label className="hint-label mt-3 mb-4">
                  Rate: 1 point ~ ₦1,000
                </label>
                <div>
                  <label className="form-label label-font">Cash</label>
                  <div className="input-group">
                    <span className="input-group-text naira-prefix">₦</span>
                    <input
                      type="number"
                      className="form-control request-input px-0 py-2 fs-3"
                      value={calculatedCash}
                      disabled
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="request-slide">
                <div className="mb-3">
                  <label className="form-label label-font mb-3">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text naira-prefix">₦</span>
                    <input
                      type="text"
                      className="form-control request-input px-0 py-2 fs-3"
                      value={calculatedCash}
                      disabled
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mt-4">
                    <label className="form-label label-font m-0">
                      Bank Details
                    </label>
                    {/* <button
                      className="btn edit-profile">
                      Edit bank details
                    </button> */}
                  </div>
                  <div className="request-input bg-white p-3 mt-3">
                    <div className="d-flex flex-column">
                      <label className="label-font">Account name</label>
                      <label className="grey-text text-uppercase mt-2">
                        {profile?.account_name}
                      </label>
                    </div>

                    <div className="d-flex flex-column my-4">
                      <label className="label-font">Bank name</label>
                      <label className="grey-text text-uppercase mt-2">
                        {profile?.bank}
                      </label>
                    </div>

                    <div className="d-flex flex-column mt-2">
                      <label className="label-font">Account number</label>
                      <label className="grey-text text-uppercase mt-2">
                        {profile?.account_number}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="request-slide mx-auto"
                style={{ maxWidth: "400px" }}
              >
                <div className="text-center">
                  <label className="label-font fs-3 mb-3">
                    Confirm transaction
                  </label>
                  <p className="text-muted small mb-4 fs-6">
                    Enter your pin to confirm your transaction
                  </p>
                  <OtpInput
                    value={pin}
                    onChange={setPin}
                    numInputs={6}
                    inputStyle={"w-100 py-2 rounded-2 otp-input-box"}
                    renderSeparator={<span className="me-3"></span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`d-flex mt-4 ${step === 3 ? "justify-content-center" : "justify-content-end"}`}
        >
          <button
            className="btn default-btn px-5"
            onClick={handleContinue}
            disabled={
              calculatedCash === 0 ||
              (step === 1 && !points) ||
              (step === 3 && pin?.length < 6) ||
              mutation.isPending
            }
          >
            {mutation.isPending
              ? "Processing..."
              : step === 3
                ? "Request payout"
                : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Requests;
