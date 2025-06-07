import { StatCard } from "../StatCard";

type Stats = {
  totalPlants: number;
  todaySchedules: number;
  pendingWatering: number;
  monthlyWatering: number;
};

type Props = {
  stats: Stats;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export const Header = ({ isDarkMode, onToggleTheme, stats }: Props) => {
  return (
    <div className="header">
      <button className="theme-toggle" onClick={onToggleTheme}>
        <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i>
      </button>
      <h1>
        <i className="fas fa-seedling"></i> Bitki Sulama Takvimi{" "}
        <i className="fas fa-tint"></i>
      </h1>
      <p>6 Haziran 2025'ten başlayarak özel sulama programınız</p>

      <div className="stats-bar">
        <StatCard value={stats.totalPlants} label="Toplam Bitki" />
        <StatCard value={stats.monthlyWatering} label="Bu Ay Sulama" />
        <StatCard value={stats.pendingWatering} label="Sulama Bekleyen" />
        <StatCard value={stats.todaySchedules} label="Bugün Sulama" />
      </div>
    </div>
  );
};
