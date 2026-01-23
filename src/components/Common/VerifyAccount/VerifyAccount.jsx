import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../../api/AuthAPI";
import "./VerifyAccount.css";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorSnackbar from "../../Common/Toast/ErrorSnackBar";
import OtpInput from "react-otp-input";
import SuccessSnackbar from "../Toast/SuccessSnackBar";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

export default function VerifyAccount({
  identifier,
  handleBack,
  phone = "your phone",
}) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendOtp, setResendOtp] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const mutation = useMutation({
    mutationFn: async (data) => {
      setLoading(true);
      const response = await AuthAPI.verifyOtp(data, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{
              title: "Account verified successfully",
              text: "Your account has been verified successfully",
            }}
          />
        ),
      });
      navigate("/", { replace: true });
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
      setResendOtp(true);
      const response = await AuthAPI.resendOtp(
        { identifier: identifier },
        true
      );
      return response;
    },
    onSuccess: () => {
      setResendOtp(false);
      setCountdown(120);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{ title: "Code resent", text: "OTP resent successfully" }}
          />
        ),
      });
    },
    onError: (error) => {
      setResendOtp(false);
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

  return (
    <>
      <button
        className={`btn d-flex align-items-center`}
        onClick={handleBack}
        disabled={loading}
      >
        <ArrowBackIos /> Back
      </button>

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
              Enter the OTP sent to {phone}
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
            disabled={loading || otp?.length < 6}
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
              disabled={countdown > 0 || resendOtp}
            >
              {resendOtp ? (
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
