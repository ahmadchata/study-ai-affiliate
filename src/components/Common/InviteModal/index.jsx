import { useMemo, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import "./styles.css";
import InfoIcon from "@mui/icons-material/Info";
import { EmailAPI } from "../../../api/EmailAPI";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InviteModal = ({
  isOpen,
  onClose,
  title = "Send Invites",
  placeholder = "Enter emails, separated by commas",
  initialValue = "",
}) => {
  const [value, setValue] = useState(initialValue);

  const mutation = useMutation({
    mutationFn: (emails) => {
      const response = EmailAPI.sendMail(emails, true);
      return response;
    },
    onSuccess: () => {
      enqueueSnackbar("Emails sent", {
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#0c7a50",
          color: "#f8ff06",
        },
      });
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue, isOpen]);

  const { validEmails, invalidEmails, exceedsLimit } = useMemo(() => {
    const emails = value
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    const validEmails = emails.filter((e) => emailRegex.test(e));
    const invalidEmails = emails.filter((e) => !emailRegex.test(e));
    const exceedsLimit = validEmails.length > 10;
    return { emails, validEmails, invalidEmails, exceedsLimit };
  }, [value]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (validEmails.length === 0) return;
    mutation.mutate({
      recipient_email: validEmails.join(","),
    });
  };

  const handleBackdrop = (e) => {
    if (e.target.classList.contains("invite-modal-backdrop")) {
      onClose?.();
    }
  };

  return (
    <div
      className="invite-modal-backdrop"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="invite-modal">
        <div className="invite-modal-header">
          <h6 className="m-0">{title}</h6>
          <button className="btn icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="invite-modal-body">
          <label className="invite-label">Emails</label>
          <textarea
            className="invite-textarea"
            rows={5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
          <small className="invite-hint d-flex align-items-center">
            <InfoIcon className="invite-info-icon" />A maximum of 10 emails can
            be sent at once
          </small>

          <small className="invite-hint d-flex align-items-center">
            <InfoIcon className="invite-info-icon" />A maximum of 50 emails can
            be sent in a day
          </small>

          {invalidEmails.length > 0 && (
            <div className="invite-invalid">
              Invalid: {invalidEmails.join(", ")}
            </div>
          )}

          {exceedsLimit && (
            <div className="invite-invalid">
              Maximum 10 emails allowed. You have {validEmails.length}.
            </div>
          )}
        </div>
        <div className="invite-modal-footer">
          <button
            className="btn default-btn py-2 px-5"
            onClick={handleSend}
            disabled={
              validEmails.length === 0 || mutation.isPending || exceedsLimit
            }
          >
            {mutation.isPending ? "Sending..." : "Send invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
