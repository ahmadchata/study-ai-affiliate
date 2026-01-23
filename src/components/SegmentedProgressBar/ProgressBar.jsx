import "./ProgressBar.css";

// Segmented progress bar that displays totalSteps segments with a tiny gap between them.
// Props:
// - step: current progress (can be fractional, will partially fill the current segment)
// - totalSteps: number of segments
// - height: CSS size for bar thickness
// - color: fill color for completed/active segments
const ProgressBar = ({
  step,
  totalSteps,
  height = "6px",
  color = "#0c7a50",
}) => {
  const safeTotal = Math.max(1, Number(totalSteps) || 1);
  const safeStep = Math.max(0, Math.min(Number(step) || 0, safeTotal));

  // Determine fill for each segment (0..1)
  const fullSegments = Math.floor(safeStep);
  const partial = safeStep - fullSegments; // 0..1

  const segments = Array.from({ length: safeTotal }, (_, i) => {
    if (i < fullSegments) return 1;
    if (i === fullSegments) return partial;
    return 0;
  });

  return (
    <div className="progress-wrapper">
      <div className="progress-bar-track segmented" style={{ height }}>
        {segments.map((fill, idx) => (
          <div className="progress-segment" key={idx} style={{ height }}>
            <div
              className="progress-segment-fill"
              style={{ width: `${fill * 100}%`, backgroundColor: color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
