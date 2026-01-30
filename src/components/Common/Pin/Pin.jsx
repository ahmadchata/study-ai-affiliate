import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import "./Pin.css";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorSnackbar from "../../Common/Toast/ErrorSnackBar";
import OtpInput from "react-otp-input";
import SuccessSnackbar from "../Toast/SuccessSnackBar";

export default function SetPin({ close, existingPin }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(existingPin ? 0 : 1);
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const payload = existingPin
        ? { token: otp, new_pin: pin }
        : { new_pin: pin };
      const response = existingPin
        ? await DashboardAPI.verifyPin(payload, true)
        : await DashboardAPI.updatePin(payload, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{
              title: "Pin set successfully",
              text: "Your pin has been set successfully",
            }}
          />
        ),
      });
      close();
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar("", {
        content: (key) => (
          <ErrorSnackbar
            id={key}
            message={{
              title: "Error",
              text: error?.response?.data?.message,
            }}
          />
        ),
      });
    },
  });

  const goToConfirm = () => {
    if (pin?.length === 6) {
      setStep(2);
    }
  };

  const goToPin = () => {
    if (otp?.length === 6) {
      setStep(1);
    }
  };

  const onSubmit = async () => {
    if (pin !== confirmPin) {
      enqueueSnackbar("", {
        content: (key) => (
          <ErrorSnackbar
            id={key}
            message={{
              title: "Pins do not match",
              text: "Please make sure both pins are the same.",
            }}
          />
        ),
      });
      return;
    }

    mutation.mutate({ new_pin: pin });
  };

  return (
    <div className="pin-slider">
      <div
        className={`pin-slides ${
          step === 0
            ? "pin-slides--otp"
            : step === 1
              ? "pin-slides--pin"
              : "pin-slides--confirm"
        }`}
      >
        {existingPin && (
          <div className="pin-slide">
            <p className="text-center mb-4">
              Enter the OTP sent to your phone to verify your identity
            </p>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputStyle={"w-100 py-3 rounded-2 otp-input-box"}
              renderSeparator={<span className="me-3"></span>}
              renderInput={(props) => <input {...props} />}
            />
            <div className="d-flex justify-content-end">
              <button
                disabled={loading || otp?.length < 6}
                className="btn px-5 login-btn mt-5 d-flex align-items-center justify-content-center"
                onClick={goToPin}
                aria-busy={loading}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="pin-slide">
          <p className="text-center mb-4">
            Set your account pin. It will be required to complete payout
            request. Ensure it is saved securely.
          </p>
          <OtpInput
            value={pin}
            onChange={setPin}
            numInputs={6}
            inputStyle={"w-100 py-3 rounded-2 otp-input-box"}
            renderSeparator={<span className="me-3"></span>}
            renderInput={(props) => <input {...props} />}
          />
          <div className="d-flex justify-content-end">
            <button
              disabled={loading || pin?.length < 6}
              className="btn px-5 login-btn mt-5 d-flex align-items-center justify-content-center"
              onClick={goToConfirm}
              aria-busy={loading}
            >
              Continue
            </button>
          </div>
        </div>

        <div className="pin-slide">
          <p className="text-center mb-4">Confirm your pin</p>
          <OtpInput
            value={confirmPin}
            onChange={setConfirmPin}
            numInputs={6}
            inputStyle={"w-100 py-3 rounded-2 otp-input-box"}
            renderSeparator={<span className="me-3"></span>}
            renderInput={(props) => <input {...props} />}
          />
          {confirmPin?.length === 6 && pin !== confirmPin && (
            <p className="text-center text-danger mt-2">Pins do not match.</p>
          )}
          <div className="d-flex justify-content-end">
            <button
              disabled={
                loading ||
                pin?.length < 6 ||
                confirmPin?.length < 6 ||
                pin !== confirmPin
              }
              className="btn px-5 login-btn mt-5 d-flex align-items-center justify-content-center"
              onClick={onSubmit}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={18}
                    style={{ color: "#f8ff06", marginRight: 8 }}
                  />
                  <span>Setting pin...</span>
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
