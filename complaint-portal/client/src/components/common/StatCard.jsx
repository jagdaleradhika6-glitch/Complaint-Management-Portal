const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="card">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
    </div>
  );
};

export default StatCard;
