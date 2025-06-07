export const StatCard: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);
