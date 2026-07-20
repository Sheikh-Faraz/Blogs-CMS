"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// import { scaleLinear } from "d3-scale";

import {
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";


type CountryData = {
  x: string;
  y: number;
};

type TooltipData = {
  name: string;
  code: string;
  value: number;
  x: number;
  y: number;
};

type Props = {
  data: CountryData[];
};

export default function CountriesAnalytics({
  data,
}: Props) {
  const [tooltip, setTooltip] =
    useState<TooltipData | null>(null);

  /*
    🌍 Zoom state
  */
  const [position, setPosition] = useState({
    coordinates: [0, 20] as [number, number],
    zoom: 1,
  });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;

    setPosition((prev) => ({
      ...prev,
      zoom: prev.zoom * 1.5,
    }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;

    setPosition((prev) => ({
      ...prev,
      zoom: prev.zoom / 1.5,
    }));
  };

  const handleMoveEnd = (pos: typeof position) => {
    setPosition(pos);
  };

  /*
    📊 Fast lookup map
  */
//   const countryMap = useMemo(() => {
//     const map: Record<string, number> = {};

//     data.forEach((c) => {
//       map[c.x] = c.y;
//     });

//     return map;
//   }, [data]);


const countryMap = useMemo(() => {
  const map: Record<string, number> = {};

  data.forEach((c) => {
    map[c.x.toUpperCase()] = c.y;
  });

  return map;
}, [data]);

  /*
    🎨 Heat colors
  */
  const maxValue = Math.max(
    ...data.map((d) => d.y),
    1
  );

  // const colorScale = scaleLinear<string>()
  //   .domain([0, maxValue])
  //   .range(["#111827", "#3b82f6"]);

  /*
    📊 Sidebar sort
  */
//   const sorted = [...data].sort(
//     (a, b) => b.y - a.y
//   );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="rounded-2xl border-border/50 bg-background/70 backdrop-blur-xl">
        <CardHeader className="flex justify-between items-center">

        {/* Card title and text */}
        <div>
          <CardTitle className="text-xl">
            🌍 Global Traffic
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Visitor distribution by country
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="z-20 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomIn}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomOut}
                >
                  <Minus className="h-4 w-4" />
                </Button>
        </div>

        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* ================= MAP ================= */}
            <div className="relative h-125 w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20">

              {/* Zoom Controls */}
              {/* <div className="absolute right-4 top-4 z-20 flex flex-col gap-2"> */}
              {/* <div className="absolute right-4 top-4 z-20 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomIn}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomOut}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div> */}

              <ComposableMap
                projectionConfig={{
                  scale: 145,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates}
                  onMoveEnd={handleMoveEnd}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // const countryCode =
                        //   geo.properties.ISO_A2;

                        // const value =
                        //   countryMap[countryCode] || 0;

                        // const isActive =
                        //   value > 0;


                        const iso2 = countries.numericToAlpha2(
                        geo.id
                        );

                        const countryCode =
                        iso2?.toUpperCase() ?? "N/A";

                        // const value =
                        // countryCode
                        //     ? countryMap[countryCode] ?? 0
                        //     : 0;

                        const value =
                        countryCode !== "N/A"
                            ? countryMap[countryCode] ?? 0
                            : 0;

                        const isActive = value > 0;

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={(event) => {
                              setTooltip({
                                name:
                                  geo.properties.name || "Unknown",
                                //   geo.properties.NAME,
                                code: countryCode,
                                value,
                                x: event.clientX,
                                y: event.clientY,
                              });
                            }}
                            onMouseMove={(event) => {
                              setTooltip((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      x: event.clientX,
                                      y: event.clientY,
                                    }
                                  : null
                              );
                            }}
                            onMouseLeave={() =>
                              setTooltip(null)
                            }
                            style={{
                              default: {
                                // fill: isActive
                                //   ? colorScale(value)
                                //   : "#111827",
                                stroke: "#1f2937",
                                strokeWidth: 0.5,
                                outline: "none",
                                transition:
                                  "all 0.25s ease",
                              },

                              hover: {
                                fill: "#60a5fa",
                                outline: "none",
                                cursor: "pointer",
                              },

                              pressed: {
                                fill: "#2563eb",
                                outline: "none",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* ================= TOOLTIP ================= */}
              {tooltip && (
                <div
                  className="pointer-events-none fixed z-50 min-w-45 rounded-xl border border-border/50 bg-background/95 p-3 shadow-2xl backdrop-blur-xl"
                  style={{
                    left: tooltip.x + 16,
                    top: tooltip.y + 16,
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {tooltip.name}
                    </p>

                    {/* <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Country
                      </span>

                      <span>{tooltip.code}</span>
                    </div> */}

                    <div className="flex items-center justify-between text-sm gap-1">

                      <span className="text-muted-foreground">
                        Visitors:  
                      </span>

                      <span className="font-medium text-blue-500">
                        {tooltip.value}
                      </span>

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= SIDEBAR ================= */}
            {/* <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Top Countries
              </h3>

              <div className="space-y-3">
                {sorted.map((c, index) => (
                  <motion.div
                    key={c.x}
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
                  >
                    <span className="font-medium">
                      {c.x}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {c.y}
                      </span>

                      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${
                              (c.y / maxValue) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}