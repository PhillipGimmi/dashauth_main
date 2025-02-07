import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateData, GeographicDistributionProps, TooltipProps } from './security-types';
import GlobalSecurityView from './global-security-view';
import { CustomTooltip, RegionCard } from './tooltip-region-components';

const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ data: providedData }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showGlobal, setShowGlobal] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TooltipProps['content'] | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const securityData = useMemo(() => {
    const generatedData = generateData();
    return generatedData.map((region, index) => ({
      ...region,
      users: providedData[index]?.users || 0,
      mfaAdoption: providedData[index]?.mfaAdoption || 0,
    }));
  }, [providedData]);

  const handleTooltip = (content: TooltipProps['content'] | null, event?: React.MouseEvent) => {
    setTooltipContent(content);
    if (event) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    } else {
      setMousePosition(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltipContent) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <section
      className="relative h-[568px] w-full overflow-hidden rounded-xl bg-white/5 p-6"
      aria-label="Security Alerts Dashboard"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setTooltipContent(null);
        setMousePosition(null);
      }}
    >
      <button
        className="mb-8 flex w-full items-center justify-between"
        onClick={() => setShowGlobal(!showGlobal)}
        onKeyDown={(e) => e.key === 'Enter' && setShowGlobal(!showGlobal)}
      >
        <motion.h2 className="text-2xl font-medium text-white" layout>
          Security Alerts
        </motion.h2>
        <div className="text-sm text-green-500">Last 24h</div>
      </button>

      <AnimatePresence mode="wait">
        {showGlobal ? (
          <GlobalSecurityView data={securityData} onHover={handleTooltip} />
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-4">
            {securityData.map((region) => (
              <RegionCard
                key={region.region}
                data={region}
                isSelected={selectedRegion === region.region}
                onHover={handleTooltip}
                onClick={() =>
                  setSelectedRegion(selectedRegion === region.region ? null : region.region)
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CustomTooltip
        active={Boolean(tooltipContent && mousePosition)}
        content={tooltipContent || { value: '', description: '' }}
        mousePosition={mousePosition}
      />
    </section>
  );
};

export default GeographicDistribution;
