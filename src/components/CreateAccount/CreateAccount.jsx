import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./CreateAccount.css";
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SuccessSnackbar from "../Common/Toast/SuccessSnackBar";
import ErrorSnackbar from "../Common/Toast/ErrorSnackBar";
import ProgressBar from "../SegmentedProgressBar/ProgressBar";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import VerifyAccount from "../Common/VerifyAccount/VerifyAccount";

export default function CreateAccount({ data }) {
  const { createAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [identifierState, setIdentifierState] = useState(null);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);

  // Form validation rules
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^(\+)?\d{10,14}$/i, "Enter a valid phone number"),
    usr: Yup.string()
      .transform((val) => (val === "" ? undefined : val))
      .email("Enter a valid email")
      .notRequired(),
    full_name: Yup.string()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be at most 50 characters"),
    pwd: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("password is required"),
    c_pwd: Yup.string()
      .oneOf([Yup.ref("pwd"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const mutation = useMutation({
    mutationFn: (details) => {
      setLoading(true);
      const response = createAccount(details, data);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{
              title: "Account created succesfully",
              text: "Check phone number for OTP",
            }}
          />
        ),
      });
      setStep(3);
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

  // Submit form for signing up
  const onSubmit = async (details) => {
    setIdentifierState(details?.phone || null);
    mutation.mutate(details);
  };

  const handleNext = async () => {
    // Validate only step 1 fields before moving forward
    const isValid = await trigger(["phone", "full_name"]);
    if (isValid) setStep(2);
  };

  const handleBack = () => setStep(1);

  if (step === 3)
    return (
      <VerifyAccount
        identifier={identifierState}
        handleBack={() => setStep(2)}
      />
    );

  return (
    <div className="onboarding-container">
      <div className="fill create-container">
        <div className="signup-form">
          <div className="text-center">
            <img
              className="img-fluid logo"
              src="/assets/logo.svg"
              width={199}
              height={28}
              alt="logo"
              loading="lazy"
            />
          </div>
          <div className="row mx-0 align-items-center">
            {step === 2 && (
              <div className="col-2 p-0">
                <button
                  className={`btn btn-back me-3 ${
                    step > 1 ? "d-block" : "d-none"
                  }`}
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowBackIos />
                </button>
              </div>
            )}
            <div className="col-7 p-0">
              <p className="m-0 p-0 fs-5 fw-normal">Create your account</p>
            </div>
            <div className="col p-0">
              <ProgressBar step={step} totalSteps={2} />
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step === 1) {
                e.preventDefault();
                handleNext();
              }
            }}
            className="row mt-1 m-0"
          >
            {step === 1 && (
              <>
                <div className="col-12 px-0 mt-3 mb-4">
                  <input
                    type="tel"
                    maxLength={14}
                    className="form-control form-field"
                    placeholder="Enter phone number"
                    {...register("phone")}
                  />
                  <div className={`${errors.phone ? "is-invalid" : ""}`}></div>

                  {errors?.phone && (
                    <div className="invalid-feedback">
                      {errors.phone.message}
                    </div>
                  )}
                </div>

                <div className="col-12 px-0">
                  <input
                    type="email"
                    className="form-control form-field"
                    placeholder="Enter email address (optional)"
                    {...register("usr")}
                  />
                  {/* <label className="optional">(Optional)</label> */}
                  <div className={`${errors.usr ? "is-invalid" : ""}`}></div>
                  {errors?.usr && (
                    <div className="invalid-feedback">{errors.usr.message}</div>
                  )}
                </div>

                <div className="col-12 px-0 my-4">
                  <input
                    type="text"
                    maxLength={50}
                    className="form-control form-field"
                    placeholder="Enter full name"
                    {...register("full_name")}
                  />
                  <div
                    className={`${errors.full_name ? "is-invalid" : ""}`}
                  ></div>

                  {errors?.full_name && (
                    <div className="invalid-feedback">
                      {errors.full_name.message}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn default-btn my-4"
                  onClick={handleNext}
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className={`col-12 px-0 my-4`}>
                  <div className="createForm d-flex justify-content-between form-control form-field">
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

                <div className={`col-12 px-0`}>
                  <div className="createForm d-flex justify-content-between form-control form-field">
                    <input
                      disabled={loading}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="w-100 me-2"
                      {...register("c_pwd")}
                    />
                    <div
                      className="pointer"
                      onClick={handleClickShowConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ color: "#929292" }} />
                      ) : (
                        <Visibility sx={{ color: "#929292" }} />
                      )}
                    </div>
                  </div>
                  <div className={`${errors.c_pwd ? "is-invalid" : ""}`}></div>
                  {errors?.c_pwd && (
                    <div className="invalid-feedback">
                      {errors.c_pwd.message}
                    </div>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="btn default-btn my-4"
                  type="submit"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </>
            )}
          </form>
          <Link to="/" className={`text-dark`}>
            <label className="text-center pointer w-100">
              Already have an account?{" "}
              <span className="green-text">Log in</span>
            </label>
          </Link>
        </div>
      </div>
    </div>
  );
}
