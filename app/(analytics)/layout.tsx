import React from "react";

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  trend: React.ReactNode;
  kpis: React.ReactNode;
  topPages: React.ReactNode;
  topLocations: React.ReactNode;
  topSources: React.ReactNode;
  topDevices: React.ReactNode;
  topBrowsers: React.ReactNode;
}

const AnalyticsLayout = ({
  children,
  trend,
  kpis,
  topPages,
  topLocations,
  topSources,
  topDevices,
  topBrowsers,
}: AnalyticsLayoutProps) => {
  return (
    <div className="min-h-screen px-5 py-5 text-sm leading-5 sm:px-10">
      <div className="flex flex-col gap-4 mx-auto max-w-7xl">
        {children}
        <div className="space-y-6 sm:space-y-10">
          <div className="grid grid-cols-2 gap-5 sm:gap-10 grid-rows-3-auto">
            <div className="col-span-2">{kpis}</div>
            <div className="col-start-1 col-span-2 lg:col-span-1 grid grid-cols-1 gap-5 sm:gap-10 grid-rows-3-auto">
              {trend}
              {topPages}
              {topLocations}
            </div>
            <div className="col-start-1 col-span-2 lg:col-start-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-10 grid-rows-2-auto lg:grid-rows-3-auto">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                {topSources}
              </div>
              {topDevices}
              {topBrowsers}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
