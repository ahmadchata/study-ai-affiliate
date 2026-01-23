import { useState, useEffect } from "react";
import Table from "../../Layout/Table";
import "./styles.css";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Link } from "react-router-dom";
import NoData from "../../Common/NoData/NoData";

const Payouts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: payouts, isFetching } = useQuery({
    queryKey: ["payouts", currentPage, debouncedSearchTerm],
    queryFn: () =>
      DashboardAPI.getPayouts(currentPage, debouncedSearchTerm, true),
  });

  const { data: payoutsSummary, isFetching: isFetchingSummary } = useQuery({
    queryKey: ["payoutsSummary"],
    queryFn: () => DashboardAPI.getPayoutsSummary(true),
  });

  const data = payouts?.data;

  const getColumns = () => [
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          ₦ {row.original.amount}
        </span>
      ),
    },
    {
      header: "Bank Name",
      accessorKey: "bank_name",
    },
    {
      header: "Date",
      accessorKey: "request_date",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {dayjs(row.original.request_date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            className={row.original.status !== null ? "green-dot" : "red-dot"}
          ></span>
          {row.original.status}
        </span>
      ),
    },
  ];

  const columns = getColumns();

  return (
    <div className="px-lg-5 px-2">
      <div className="row mt-4 mb-5 mx-0">
        <div className="col-12 col-lg-4 px-0">
          <div className="bg-white p-summary-card-1 p-3 d-flex flex-column flex-fill h-100 justify-content-between">
            <label className="h-label">Balance</label>
            {isFetchingSummary ? (
              <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />
            ) : (
              <div className="mt-4 d-flex align-items-center justify-content-between">
                <h5 className="b-text m-0 d-flex align-items-center flex-wrap">
                  {payoutsSummary?.available_balance_points} pts ={" "}
                  <span className="grey-text m-text ms-2">
                    ₦{payoutsSummary?.available_balance_amount}
                  </span>
                </h5>
                <h5 className="grey-text m-0 m-text">1pt = ₦1,000</h5>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 mt-3 mt-lg-0 px-0">
          <div className="bg-white p-summary-card-2 p-3 d-flex flex-column flex-fill h-100 justify-content-between">
            <label className="h-label">Last payout</label>
            {isFetchingSummary ? (
              <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />
            ) : (
              <div className="mt-4 d-flex align-items-center justify-content-between">
                <h5 className="b-text m-0 d-flex align-items-center">
                  {payoutsSummary?.last_payout?.amount ?? 0 / 1000} pts ={" "}
                  <span className="grey-text m-text ms-2">
                    ₦{payoutsSummary?.last_payout?.amount ?? 0}
                  </span>
                </h5>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 mt-3 mt-lg-0 px-0 ps-md-3">
          <div className="p-summary-card p-3 d-flex flex-column flex-fill h-100">
            <button
              disabled={payoutsSummary?.available_balance_points < 5}
              className="btn default-btn mx-auto py-2 px-4"
              style={{ maxWidth: "220px" }}
            >
              Withdraw earnings
            </button>

            <h5 className="grey-text text-center mt-5 m-text fw-normal">
              Minimum withdrawal: 5 points
            </h5>
          </div>
        </div>
      </div>
      <div className="content-wrapper p-4">
        <h6>Payout history</h6>
        {payouts?.total === 0 ? (
          <NoData
            icon={<ReceiptLongIcon style={{ color: "#000" }} />}
            title="No payout yet"
            text="You haven't requested any payout yet. Your payout hsitory appear here"
          />
        ) : (
          <Table
            columns={columns}
            data={data}
            isFetching={isFetching}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
          />
        )}

        {payouts?.total === 0 ? (
          ""
        ) : (
          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!payouts?.has_previous}
            >
              &lt; Previous
            </button>
            {Array.from(
              { length: payouts?.total_pages || 1 },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                className={`btn ${
                  currentPage === page ? "btn" : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: "32px",
                  padding: "4px 8px",
                  backgroundColor:
                    currentPage === page ? "#0c7a50" : "transparent",
                  color: currentPage === page ? "#fff" : "#000",
                  border: "1px solid #ddd",
                }}
              >
                {page}
              </button>
            ))}
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!payouts?.has_next}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payouts;
