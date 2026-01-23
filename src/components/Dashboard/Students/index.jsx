import { useState, useEffect } from "react";
import Table from "../../Layout/Table";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import dayjs from "dayjs";
import "./styles.css";

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
      accessorKey: "points",
    },
    {
      header: "Subscription plan",
      accessorKey: "",
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
            <span className="ms-2 green-text">{data?.length}</span>
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        isFetching={isFetching}
        data={data || []}
        // statusAccessor="subscription_status"
        onSearch={setSearchTerm}
        searchValue={searchTerm}
      />
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={!students?.has_previous}
        >
          &lt;
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
              backgroundColor: currentPage === page ? "#0c7a50" : "transparent",
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
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Students;
