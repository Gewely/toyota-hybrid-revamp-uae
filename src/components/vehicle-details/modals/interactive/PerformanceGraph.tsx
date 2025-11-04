import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

interface PerformanceGraphProps {
  className?: string;
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ className }) => {
  // Power and Torque curve data points
  const powerData = [
    { rpm: 0, value: 0 },
    { rpm: 1000, value: 120 },
    { rpm: 2000, value: 180 },
    { rpm: 3000, value: 220 },
    { rpm: 4000, value: 260 },
    { rpm: 5000, value: 280 },
    { rpm: 6000, value: 275 },
    { rpm: 7000, value: 250 },
  ];

  const torqueData = [
    { rpm: 0, value: 0 },
    { rpm: 1000, value: 280 },
    { rpm: 2000, value: 360 },
    { rpm: 3000, value: 400 },
    { rpm: 4000, value: 410 },
    { rpm: 5000, value: 390 },
    { rpm: 6000, value: 350 },
    { rpm: 7000, value: 300 },
  ];

  const generatePath = (data: typeof powerData, maxValue: number) => {
    const width = 600;
    const height = 200;
    const padding = 40;

    const scaleX = (width - padding * 2) / 7000;
    const scaleY = (height - padding * 2) / maxValue;

    const points = data.map(
      (point) =>
        `${padding + point.rpm * scaleX},${height - padding - point.value * scaleY}`
    );

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Graph Container */}
      <div className="bg-gradient-to-br from-accent/30 to-background rounded-2xl p-6 border-2 border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Power & Torque Curves</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm">Power (HP)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm">Torque (Nm)</span>
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="relative">
          <svg
            viewBox="0 0 600 200"
            className="w-full h-auto"
            style={{ maxHeight: '300px' }}
          >
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40"
                y1={40 + i * 40}
                x2="560"
                y2={40 + i * 40}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* X-axis labels (RPM) */}
            {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000].map((rpm, i) => (
              <text
                key={rpm}
                x={40 + i * (520 / 7)}
                y="195"
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
              >
                {rpm}
              </text>
            ))}

            {/* Y-axis label */}
            <text
              x="20"
              y="100"
              textAnchor="middle"
              transform="rotate(-90 20 100)"
              className="text-[10px] fill-muted-foreground"
            >
              HP / Nm
            </text>

            {/* Torque Curve (Blue) */}
            <motion.path
              d={generatePath(torqueData, 410)}
              fill="none"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {/* Power Curve (Primary) */}
            <motion.path
              d={generatePath(powerData, 410)}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Peak Power Marker */}
            <motion.circle
              cx={40 + 5000 * (520 / 7000)}
              cy={160 - 280 * (120 / 410)}
              r="5"
              fill="hsl(var(--primary))"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, type: 'spring' }}
            />

            {/* Peak Torque Marker */}
            <motion.circle
              cx={40 + 4000 * (520 / 7000)}
              cy={160 - 410 * (120 / 410)}
              r="5"
              fill="hsl(217, 91%, 60%)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.2, type: 'spring' }}
            />
          </svg>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Peak Power',
            value: '280 HP',
            subtext: '@ 5,000 RPM',
            icon: Zap,
            color: 'text-primary',
          },
          {
            label: 'Peak Torque',
            value: '410 Nm',
            subtext: '@ 4,000 RPM',
            icon: TrendingUp,
            color: 'text-blue-500',
          },
          {
            label: '0-100 km/h',
            value: '7.2s',
            subtext: 'Acceleration',
            icon: Zap,
            color: 'text-primary',
          },
          {
            label: 'Top Speed',
            value: '190 km/h',
            subtext: 'Maximum',
            icon: TrendingUp,
            color: 'text-blue-500',
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-accent/50 p-4 rounded-xl border border-border"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold mb-1">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.subtext}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
