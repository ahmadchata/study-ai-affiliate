import "./styles.css";
import { useState } from "react";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import IosShareIcon from "@mui/icons-material/IosShare";
import About from "../../Common/About";
import Terms from "../../Common/Terms";
import InviteModal from "../../Common/InviteModal";

const Refer = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container px-3 py-3 py-lg-4">
      <span
        onClick={() => navigate(-1)}
        className="p-0 d-flex align-items-center pointer mb-4"
      >
        <KeyboardArrowLeft /> Back
      </span>
      <div className="mx-auto" style={{ maxWidth: "879px" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5>Refer and earn</h5>
          <button
            className="d-flex align-items-center btn default-btn p-2"
            onClick={() => setInviteOpen(true)}
          >
            Share invite link
            <IosShareIcon
              style={{
                color: "#fff",
                fontSize: "16px",
                marginLeft: "3px",
              }}
            />
          </button>
        </div>
        <InviteModal
          isOpen={inviteOpen}
          onClose={() => setInviteOpen(false)}
          title="Share invite link"
          placeholder="name@example.com, user@domain.com"
        />
        <div className="refer-info mt-4">
          <header>
            <button
              className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`tab-btn ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => setActiveTab("terms")}
            >
              Terms and conditions
            </button>
          </header>
          <div className="tab-content">
            {activeTab === "about" ? <About /> : <Terms />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Refer;
