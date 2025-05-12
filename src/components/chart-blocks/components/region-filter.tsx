"use client";

import { ChevronDown } from "lucide-react";
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

// Types for region filter options
type RegionType = "all" | "state" | "district" | "university";
type RegionOption = {
  id: string;
  name: string;
};

// Sample region options
const regionOptions = {
  state: [
    { id: "karnataka", name: "Karnataka" },
    { id: "tamil-nadu", name: "Tamil Nadu" },
    { id: "maharashtra", name: "Maharashtra" },
    { id: "delhi", name: "Delhi" },
  ],
  district: [
    { id: "bangalore-urban", name: "Bangalore Urban" },
    { id: "mumbai", name: "Mumbai" },
    { id: "chennai", name: "Chennai" },
    { id: "new-delhi", name: "New Delhi" },
    { id: "pune", name: "Pune" },
    { id: "hyderabad", name: "Hyderabad" },
  ],
  university: [
    { id: "bangalore-university", name: "Bangalore University" },
    { id: "mumbai-university", name: "Mumbai University" },
    { id: "anna-university", name: "Anna University" },
    { id: "delhi-university", name: "Delhi University" },
    { id: "manipal-university", name: "Manipal University" },
    { id: "amity-university", name: "Amity University" },
  ],
};

export function RegionFilter() {
  // State for the filter values
  const [regionType, setRegionType] = useState<RegionType>("all");
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(
    null,
  );

  // Handle region type change
  const handleRegionTypeChange = (type: RegionType) => {
    setRegionType(type);
    setSelectedRegion(null); // Reset selection when changing type
  };

  // Handle region selection
  const handleRegionSelect = (option: RegionOption) => {
    setSelectedRegion(option);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Region Type Selector - Now using simple buttons */}
      <div className="inline-flex rounded-md border border-input bg-background">
        <Button
          variant={regionType === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleRegionTypeChange("all")}
          className="rounded-r-none"
        >
          All
        </Button>
        <Button
          variant={regionType === "state" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleRegionTypeChange("state")}
          className="rounded-none border-l border-l-input"
        >
          State
        </Button>
        <Button
          variant={regionType === "district" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleRegionTypeChange("district")}
          className="rounded-none border-l border-l-input"
        >
          District
        </Button>
        <Button
          variant={regionType === "university" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleRegionTypeChange("university")}
          className="rounded-l-none border-l border-l-input"
        >
          University
        </Button>
      </div>

      {/* Region Selection Dropdown */}
      {regionType !== "all" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex min-w-[180px] items-center justify-between"
              size="sm"
            >
              {selectedRegion ? selectedRegion.name : `Select ${regionType}`}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{`Select ${regionType}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {regionOptions[regionType]?.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => handleRegionSelect(option)}
                  className="cursor-pointer"
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
