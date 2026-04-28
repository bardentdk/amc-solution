import { Database as DbIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: DbIcon;
  className?: string;
}

export const StatCard = ({ title, value, trend, icon: Icon, className = '' }: StatCardProps) => {
  return (
    <div className={`bg-white rounded-3xl shadow-bento p-6 flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Icon size={24} className="text-primary" />
        </div>
        {trend && (
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-dark/60 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-dark">{value}</p>
      </div>
    </div>
  );
};