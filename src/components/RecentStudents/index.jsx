import "./styles.css";

const RecentStudents = ({ recentStudents }) => {
  return (
    <table className="performers-table">
      <thead className="performers-table-head">
        <tr>
          <th></th>
          <th className="fw-regular py-2" style={{ fontWeight: "400" }}>
            Name
          </th>
          <th className="fw-regular py-2" style={{ fontWeight: "400" }}>
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
              <span>2</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentStudents;
