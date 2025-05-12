"use client";

import { Battery, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for battery consumption
const batteryConsumptionData = {
  average: 18.5, // Average percentage per day
  byDeviceType: [
    { type: "SM-T290", percentage: 15.2 },
    { type: "SM-T500", percentage: 17.8 },
    { type: "SM-T220", percentage: 19.3 },
    { type: "SM-T350", percentage: 21.5 },
  ],
  byRegion: {
    Karnataka: 17.9,
    "Tamil Nadu": 18.2,
    Maharashtra: 19.1,
    Delhi: 18.7,
  },
};

export default function BatteryConsumption() {
  const [selectedDeviceType, setSelectedDeviceType] =
    useState<string>("average");

  // Find the display value based on selection
  const displayValue =
    selectedDeviceType === "average"
      ? batteryConsumptionData.average
      : batteryConsumptionData.byDeviceType.find(
          (d) => d.type === selectedDeviceType,
        )?.percentage || 0;

  // Calculate color based on battery consumption
  const getColorClass = (value: number) => {
    if (value < 15) return "text-green-500";
    if (value < 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex h-[300px] flex-col items-center justify-center p-4">
      <div className="mb-6 flex w-full justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              {selectedDeviceType === "average"
                ? "Average All Devices"
                : selectedDeviceType}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Device Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setSelectedDeviceType("average")}
                className="cursor-pointer"
              >
                Average All Devices
              </DropdownMenuItem>
              {batteryConsumptionData.byDeviceType.map((device) => (
                <DropdownMenuItem
                  key={device.type}
                  onClick={() => setSelectedDeviceType(device.type)}
                  className="cursor-pointer"
                >
                  {device.type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Battery className="mb-4 h-24 w-24" />
        <div className="mb-2 flex items-end text-4xl font-bold">
          <span className={getColorClass(displayValue)}>{displayValue}%</span>
          <span className="ml-2 text-base text-muted-foreground">/ day</span>
        </div>
        <p className="text-center text-muted-foreground">
          Average battery consumption rate per day
          {selectedDeviceType !== "average" && ` for ${selectedDeviceType}`}
        </p>
      </div>
    </div>
  );
}
