import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./Login.css";
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorSnackbar from "../Common/Toast/ErrorSnackBar";
import VerifyAccount from "../Common/VerifyAccount/VerifyAccount";

export default function Login() {
  const { login, authenticated, loading: authLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const [phone, setPhone] = useState("your phone");

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, navigate]);

  const validationSchema = Yup.object().shape({
    usr: Yup.string().required("Email/Phone is required"),
    pwd: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const userName = watch("usr");

  const mutation = useMutation({
    mutationFn: async ({ usr, pwd }) => {
      setLoading(true);
      const response = await login(usr, pwd);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      navigate("/dashboard");
    },
    onError: (error) => {
      setPhone(error.response.data.phone);
      if (error.status === 422) {
        setVerify(true);
      }
      setLoading(false);
      if (error.response.data.exc_type === "CSRFTokenError") {
        enqueueSnackbar("", {
          content: (key) => (
            <ErrorSnackbar
              id={key}
              message={{
                title: "There was an error",
                text: "You are logged in on another tab",
              }}
            />
          ),
        });
      } else {
        enqueueSnackbar("", {
          content: (key) => (
            <ErrorSnackbar
              id={key}
              message={{
                title: "There was an error",
                text: error?.response?.data?.message,
              }}
            />
          ),
        });
      }
    },
  });

  if (verify) {
    return (
      <VerifyAccount
        identifier={userName}
        phone={phone}
        handleBack={() => setVerify(false)}
      />
    );
  }

  const onSubmit = async (data) => {
    mutation.mutate({ usr: data.usr, pwd: data.pwd });
  };

  if (authLoading) {
    return <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />;
  }

  return (
    <div className="login-container">
      <div className="login-form px-3">
        <div className="text-center">
          <img
            className="img-fluid logo"
            src="/assets/logo.svg"
            alt="logo"
            loading="lazy"
          />
          <p className="m-0 p-0 fs-6">
            <span className="green-text">Welcome back</span>, enter your details
          </p>
        </div>

        <div className="row mx-0 px-0 mt-4">
          <div className={`col-6 m-0 p-0 py-2 pe-2`}>
            <div
              className={`selection-card py-3 px-2 pointer d-flex align-items-center`}
              onClick={() => {
                window.location.href = "https://dashboard.study-ai.org";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.location.href = "https://dashboard.study-ai.org";
                }
              }}
            >
              <div className="flex-fill text-truncate d-flex align-items-center">
                <span>Student</span>
              </div>
              <div>
                <input
                  type="radio"
                  readOnly
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`col-6 m-0 p-0 py-2 ps-2`}>
            <div
              className={`selection-card py-3 px-2 pointer d-flex align-items-center selected`}
              role="button"
              tabIndex={0}
            >
              <div className="flex-fill text-truncate d-flex align-items-center">
                <span>Affiliates</span>
              </div>
              <div>
                <input
                  type="radio"
                  checked
                  readOnly
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="row mx-0 mt-2">
          <div className="login mt-4 mb-4 col-12 form-control form-field">
            <input
              disabled={loading}
              type="text"
              className="w-100"
              placeholder="Enter email address or Phone number"
              {...register("usr")}
            />
            <div className={`${errors.usr ? "is-invalid" : ""}`}></div>

            {errors?.usr && (
              <div className="invalid-feedback">{errors.usr.message}</div>
            )}
          </div>

          <div className={`col-12 px-0`}>
            <div className="login d-flex justify-content-between form-control form-field">
              <input
                disabled={loading}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-100 me-2"
                {...register("pwd")}
              />
              <div className="pointer" onClick={handleClickShowPassword}>
                {showPassword ? (
                  <VisibilityOff sx={{ color: "#929292" }} />
                ) : (
                  <Visibility sx={{ color: "#929292" }} />
                )}
              </div>
            </div>
            <div className={`${errors.pwd ? "is-invalid" : ""}`}></div>
            {errors?.pwd && (
              <div className="invalid-feedback">{errors.pwd.message}</div>
            )}
          </div>
          <Link to="/forgot-password" className={`text-dark mt-2`}>
            <label className="text-end pointer w-100">Forgot password?</label>
          </Link>
          <button
            disabled={loading}
            className="btn login-btn mt-5 mb-4 d-flex align-items-center justify-content-center"
            type="submit"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={18}
                  style={{ color: "#f8ff06", marginRight: 8 }}
                />
                <span>Logging in...</span>
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
        <Link to="/sign-up" className={`text-dark`}>
          <label className="text-center pointer w-100">
            Don't have an account? <span className="green-text">Sign up</span>
          </label>
        </Link>
      </div>
    </div>
  );
}
