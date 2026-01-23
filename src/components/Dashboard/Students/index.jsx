import { useState, useEffect } from "react";
import Table from "../../Layout/Table";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import dayjs from "dayjs";
import "./styles.css";
import NoData from "../../Common/NoData/NoData";

const Students = () => {
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

  const { data: students, isFetching } = useQuery({
    queryKey: ["students", currentPage, debouncedSearchTerm],
    queryFn: () =>
      DashboardAPI.getStudents(currentPage, debouncedSearchTerm, true),
  });

  const data = students?.data;

  const getColumns = () => [
    {
      header: "Name",
      accessorKey: "student_name",
    },
    {
      header: "Date",
      accessorKey: "registered_date",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {dayjs(row.original.registered_date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      header: "Points earned",
      accessorKey: "points_earned",
    },
    {
      header: "Subscription plan",
      accessorKey: "subscription_type",
    },
  ];

  const columns = getColumns();

  return (
    <div className="px-lg-5 px-2">
      <div className="d-flex">
        <div className="my-5 d-flex justify-content-between justify-content-lg-start me-3">
          <button className="btn dsh-btn d-inline-flex align-items-center">
            <span className="icon-btn d-inline-flex align-items-center me-2">
              <PeopleOutlineIcon style={{ fontSize: "18px" }} />
            </span>
            Total Students:{" "}
            <span className="ms-2 green-text">{data?.length}</span>
          </button>
        </div>
        <div className="my-5 d-flex justify-content-between justify-content-lg-start">
          <button className="btn dsh-btn d-inline-flex align-items-center">
            <span className="icon-btn d-inline-flex align-items-center me-2">
              <LoyaltyIcon style={{ fontSize: "18px" }} />
            </span>
            Total points earned:{" "}
            <span className="ms-2 green-text">
              {students?.total_points_earned}
            </span>
          </button>
        </div>
      </div>
      <div className="content-wrapper p-4">
        <h6>Students</h6>
        {students?.total === 0 ? (
          <NoData
            icon={<PeopleOutlineIcon style={{ color: "#000" }} />}
            title="No students yet"
            text="You haven't added any student yet. Recent students you add will appear
        here"
          />
        ) : (
          <Table
            columns={columns}
            isFetching={isFetching}
            data={data || []}
            // statusAccessor="subscription_status"
            onSearch={setSearchTerm}
            searchValue={searchTerm}
          />
        )}

        {students?.total === 0 ? (
          ""
        ) : (
          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!students?.has_previous}
            >
              &lt; Previous
            </button>
            {Array.from(
              { length: students?.total_pages || 1 },
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
              disabled={!students?.has_next}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
