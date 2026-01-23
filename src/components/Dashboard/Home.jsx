import "./styles.css";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RecentStudents from "../RecentStudents";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../api/DashboardAPI";
import LoadingTracker from "../Common/Loading";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { enqueueSnackbar } from "notistack";
import referralCode from "../../store/zustand/referralCode";
import EarningsChart from "../Common/Chart";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InviteModal from "../Common/InviteModal";
import LinkIcon from "@mui/icons-material/Link";

const Home = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: overview, isFetching } = useQuery({
    queryKey: ["overview"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.overview(true),
  });

  const { setReferralCode } = referralCode();

  useEffect(() => {
    if (overview?.referral_code) {
      setReferralCode(overview.referral_code);
    }
  }, [overview, setReferralCode]);

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
    enqueueSnackbar("Referral link copied", {
      autoHideDuration: 1000,
      style: {
        backgroundColor: "#fff",
        color: "#0c7a50",
      },
    });
  };

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    <div className="px-lg-5 px-2 py-3 py-lg-5">
      <div className="d-flex justify-content-end justify-content-xl-between align-items-center">
        <h6 className="d-none d-xl-block">Today</h6>
        <Link
          className={`text-decoration-none text-success`}
          to={"/dashboard/refer-and-earn"}
        >
          <button className="mb-4 btn gradient-btn">
            Refer and earn{" "}
            <PaymentsIcon style={{ marginLeft: "5px", color: "#0c7a50" }} />
          </button>
        </Link>
      </div>
      <div className="summary-b">
        <div className="row mt-3 mx-0">
          <div className="col-12 col-lg-4 px-0">
            <div className="bg-white summary-card p-3 d-flex flex-column flex-fill h-100">
              <label>Total points</label>
              <div className="mt-4 d-flex align-items-center justify-content-between">
                <h5 className="">{overview?.total_earnings}</h5>
                <div className="dsh-btn">
                  <SpeakerGroupIcon style={{ color: "#000" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-3 mt-lg-0 px-0 px-lg-3">
            <div className="bg-white summary-card p-3 d-flex flex-column flex-fill h-100">
              <label>Total students</label>
              <div className="mt-4 d-flex align-items-center justify-content-between">
                <h5 className="">{overview?.total_students}</h5>
                <div className="dsh-btn">
                  <PeopleOutlineIcon style={{ color: "#000" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-3 mt-lg-0 px-0">
            <div className="summary-card d-flex flex-column flex-fill h-100">
              <div className="referral-card d-flex justify-content-center align-items-center">
                <label className="text-center text-white">Referral link</label>
              </div>

              <div className="mt-3 d-block d-md-flex align-items-center justify-content-between p-3">
                <h5 className="m-0 ref-link text-truncate py">
                  <LinkIcon className="hm-icons" /> {overview?.referral_link}
                </h5>
                <div className="d-flex justify-content-around ms-md-3 ps-md-3 mt-4 mt-md-0 ref-actions">
                  <button
                    className="btn actn-btns me-2"
                    onClick={() => copyToClipboard(overview?.referral_link)}
                  >
                    <ContentCopyOutlinedIcon className="hm-icons" />
                    Copy
                  </button>
                  <button
                    className="btn actn-btns"
                    onClick={() => setInviteOpen(true)}
                  >
                    <IosShareOutlinedIcon className="hm-icons" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Share invite link"
        placeholder="name@example.com, user@domain.com"
      />

      <div className="row mx-0 mt-5">
        <div className="d-none d-xl-block col-12 col-xl-7 bg-white summary-card p-3 me-4">
          <h6>Earnings</h6>
          <EarningsChart />
        </div>

        <div className="summary-bg col-12 col-lg p-4">
          <h6>Recent Students</h6>
          <RecentStudents recentStudents={overview?.recent_students} />
        </div>
      </div>
    </div>
  );
};

export default Home;
