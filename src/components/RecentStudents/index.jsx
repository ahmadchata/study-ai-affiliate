import "./styles.css";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import NoData from "../Common/NoData/NoData";

const RecentStudents = ({ recentStudents }) => {
  if (recentStudents?.length === 0) {
    return (
      <NoData
        icon={<PeopleOutlineIcon style={{ color: "#000" }} />}
        title="No students yet"
        text="You haven't added any student yet. Recent students you add will appear
        here"
      />
    );
  }
  return (
    <div
      className="bg-white summary-card mt-4"
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <table className="performers-table">
        <thead className="performers-table-head">
          <tr>
            <th scope="row"></th>
            <th className="fw-regular p-2" style={{ fontWeight: "400" }}>
              Name
            </th>
            <th
              className="fw-regular p-2 text-end"
              style={{ fontWeight: "400" }}
            >
              Points
            </th>
          </tr>
        </thead>
        <tbody className="performers-table-body">
          {recentStudents?.map((student, index) => (
            <tr className="performers-table-tr" key={student?.name}>
              <th scope="row">{index + 1}</th>
              <td>{student?.student_name}</td>
              <td>
                <span>{student?.points_earned}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentStudents;
