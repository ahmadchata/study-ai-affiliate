import "./NoData.css";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const NoData = ({ icon, title, text }) => {
  const iconNode = icon ?? <PeopleOutlineIcon style={{ color: "#000" }} />;

  return (
    <div className="no-data text-center mt-5">
      <label className="dsh-btn" style={{ backgroundColor: "#F4F4F4" }}>
        {iconNode}
      </label>
      <h5 className="mt-3">{title}</h5>
      <p
        className="m-0 mx-auto no-data-text mt-4"
        style={{ maxWidth: "281px" }}
      >
        {text}
      </p>
    </div>
  );
};

export default NoData;
