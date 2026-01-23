import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../../api/AuthAPI";
import "./VerifyAccount.css";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorSnackbar from "../../Common/Toast/ErrorSnackBar";
import OtpInput from "react-otp-input";
import SuccessSnackbar from "../Toast/SuccessSnackBar";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import SetPassword from "../../ForgotPassword/SetPassword";

export default function ChangePassword({ identifier, handleBack }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [showPasswordScreen, setShowPasswordScreen] = useState(false);

  //   console.log(identifier);

  const mutation = useMutation({
    mutationFn: async (data) => {
      setLoading(true);
      const response = await AuthAPI.verifyToken(data, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{
              title: "Success",
              text: "OTP Validated",
            }}
          />
        ),
      });
      setShowPasswordScreen(true);
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

  const onSubmit = async () => {
    mutation.mutate({ identifier: identifier, token: otp });
  };

  // start initial countdown (OTP was sent previously)
  useEffect(() => {
    if (countdown <= 0) return undefined;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await AuthAPI.resendOtp(
        { identifier: identifier },
        true
      );
      return response;
    },
    onSuccess: () => {
      setCountdown(120);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{ title: "Code sent", text: "OTP resent successfully" }}
          />
        ),
      });
    },
    onError: (error) => {
      enqueueSnackbar("", {
        content: (key) => (
          <ErrorSnackbar
            id={key}
            message={{ title: "Error", text: error?.response?.data?.message }}
          />
        ),
      });
    },
  });

  if (showPasswordScreen) return <SetPassword token={otp} />;

  return (
    <>
      <div className="ps-2">
        <button
          className={`btn d-flex align-items-center p-0 pt-2`}
          onClick={handleBack}
          disabled={loading}
        >
          <ArrowBackIos /> Back
        </button>
      </div>
      <div className="verify-container">
        <div className="verify-form">
          <div className="text-center">
            <img
              className="img-fluid logo"
              src="/assets/logo.svg"
              width={199}
              height={28}
              alt="logo"
              loading="lazy"
            />
            <h3>Verify your account</h3>
            <p className="mt-4 mb-4 p-0 fs-6 grey-text">
              Enter the OTP sent to your email / phone
            </p>
          </div>

          <div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputStyle={"w-100 py-3 rounded-2 otp-input-box"}
              renderSeparator={<span className="me-3"></span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <button
            disabled={loading}
            className="btn w-100 login-btn mt-5 mb-4 d-flex align-items-center justify-content-center"
            onClick={onSubmit}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={18}
                  style={{ color: "#f8ff06", marginRight: 8 }}
                />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify"
            )}
          </button>
          <div className="d-flex justify-content-center align-items-center">
            <p className="m-0">Didn't get code?</p>
            <button
              className="btn p-0 ms-2 text-center text-decoration-underline border-0"
              onClick={() => resendMutation.mutate()}
              disabled={countdown > 0 || resendMutation.isLoading}
            >
              {resendMutation.isLoading ? (
                <>
                  <CircularProgress
                    size={14}
                    style={{ color: "#0c7a50", marginRight: 8 }}
                  />
                  Resending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${String(Math.floor(countdown / 60)).padStart(
                  2,
                  "0"
                )}:${String(countdown % 60).padStart(2, "0")}`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
