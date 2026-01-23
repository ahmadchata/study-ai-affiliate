import "./Header.css";
import { useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Sidebar from "../SideBar/Sidebar";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuLogo from "../../../assets/menu-white.svg";
import refferal from "../../../store/zustand/referralCode";
import { useAuth } from "../../../Context/AuthContext";
import InfoIcon from "@mui/icons-material/Info";
import { enqueueSnackbar } from "notistack";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const sideBarRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();
  const { referralCode } = refferal();

  const currentPage = {
    "/dashboard": "Overview",
    "/dashboard/students": "Students",
    "/dashboard/payouts": "Payout",
    "/dashboard/account": "Account",
    "/dashboard/refer-and-earn": "Refer and earn",
  };

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    enqueueSnackbar("Referral code copied", {
      autoHideDuration: 1000,
      style: {
        backgroundColor: "#fff",
        color: "#0c7a50",
      },
    });
  };

  return (
    <header
      className="header-bg m-0 p-0 d-flex align-items-center px-lg-5 px-2 py-4"
      style={{ minHeight: "65px" }}
    >
      <div className="position-relative w-100">
        <div className="d-block d-lg-flex justify-content-between align-items-center">
          <div>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <Link to={"/dashboard"}>
                <img
                  src="/assets/logo-white.svg"
                  alt="Study AI logo"
                  className="img-fluid"
                />
              </Link>
              <button className="btn d-lg-none" onClick={toggleSidebar}>
                <img src={MenuLogo} alt="Menu" className="img-fluid" />
              </button>
            </div>
            <div className="text-white mt-4">
              <label className="header-label">
                {currentPage[location.pathname] ?? ""}
              </label>
            </div>
          </div>
          <div>
            <div className="d-none d-lg-flex justify-content-between align-items-center">
              <div className="header-tabs">
                <Link
                  className={`text-decoration-none text-white ${
                    location.pathname === "/dashboard"
                      ? "header-active"
                      : "header"
                  }`}
                  to={"/dashboard"}
                >
                  <WorkspacesIcon
                    style={{ color: "#fff", marginRight: "10px" }}
                  />
                  Overview
                </Link>

                <Link
                  className={`text-decoration-none text-white mx-3 ${
                    location.pathname === "/dashboard/students"
                      ? "header-active"
                      : "header"
                  }`}
                  to={"/dashboard/students"}
                >
                  <GroupIcon style={{ color: "#fff", marginRight: "10px" }} />
                  Students
                </Link>

                <Link
                  className={`text-decoration-none text-white me-3 ${
                    location.pathname.includes("/dashboard/payouts")
                      ? "header-active"
                      : "header"
                  }`}
                  to={"/dashboard/payouts"}
                >
                  <SpeakerGroupIcon
                    style={{ color: "#fff", marginRight: "10px" }}
                  />
                  Payout
                </Link>

                <div className="d-flex align-items-center mb-lg-0 border-start">
                  <button className="btn header ms-3" onClick={toggleSidebar}>
                    <PersonIcon style={{ color: "#fff" }} />
                    <KeyboardArrowDownIcon
                      style={{ color: "#fff", marginLeft: "10px" }}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center mt-4">
              <div className="code-btn d-flex align-items-center">
                <Tooltip
                  arrow
                  title="This is your referral code. When applied upon checkout, you'll get the corresponding commission in your account."
                >
                  <IconButton>
                    <InfoIcon className="info-icon" />
                  </IconButton>
                </Tooltip>
                <label className="text-white me-2">{referralCode}</label>
                <button
                  className="text-white code-actn-btn px-3"
                  onClick={() => copyToClipboard(referralCode)}
                >
                  <ContentCopyOutlinedIcon
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      marginRight: "5px",
                    }}
                  />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
        <CSSTransition
          in={sidebar}
          timeout={300}
          classNames="sidebar"
          nodeRef={sideBarRef}
          unmountOnExit
        >
          <Sidebar
            ref={sideBarRef}
            onClose={toggleSidebar}
            orgName={user?.user?.full_name}
          />
        </CSSTransition>
      </div>
    </header>
  );
};
export default Header;
