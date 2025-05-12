"use client";

import {
  Activity,
  Book,
  FileVideo,
  Globe,
  Heart,
  LucideIcon,
  Music,
  ShoppingCart,
} from "lucide-react";

// Sample data for domain categories
const domainCategoriesData = {
  total: 45678,
  categories: [
    { name: "Educational", count: 15487, percentage: 33.9, icon: Book },
    { name: "Entertainment", count: 12450, percentage: 27.3, icon: FileVideo },
    { name: "Social Media", count: 8932, percentage: 19.6, icon: Heart },
    { name: "Shopping", count: 3245, percentage: 7.1, icon: ShoppingCart },
    { name: "Music & Audio", count: 2891, percentage: 6.3, icon: Music },
    { name: "News & Information", count: 2143, percentage: 4.7, icon: Globe },
    { name: "Other", count: 530, percentage: 1.1, icon: Activity },
  ],
  blocked: {
    entertainment: 65.2,
    socialMedia: 78.4,
    shopping: 42.3,
  },
};

type CategoryProps = {
  name: string;
  count: number;
  percentage: number;
  Icon: LucideIcon;
  isBlocked?: boolean;
  blockPercentage?: number;
};

function CategoryCard({
  name,
  count,
  percentage,
  Icon,
  isBlocked,
  blockPercentage,
}: CategoryProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <div className="mb-2 flex justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-500" />
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm">
          {count.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="mb-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {isBlocked && blockPercentage && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Block rate:</span>
          <span className="font-medium text-red-500">{blockPercentage}%</span>
        </div>
      )}
    </div>
  );
}

export default function DomainCategories() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Domain Categories</h4>
        <p className="text-sm text-muted-foreground">
          Categorized web access attempts across{" "}
          {domainCategoriesData.total.toLocaleString()} requests
        </p>
      </div>

      {/* Categories list */}
      <div className="space-y-3">
        {domainCategoriesData.categories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            count={category.count}
            percentage={category.percentage}
            Icon={category.icon}
            isBlocked={
              category.name === "Entertainment" ||
              category.name === "Social Media" ||
              category.name === "Shopping"
            }
            blockPercentage={
              category.name === "Entertainment"
                ? domainCategoriesData.blocked.entertainment
                : category.name === "Social Media"
                  ? domainCategoriesData.blocked.socialMedia
                  : category.name === "Shopping"
                    ? domainCategoriesData.blocked.shopping
                    : undefined
            }
          />
        ))}
      </div>

      {/* Insights section */}
      <div className="mt-6 rounded-lg border p-4">
        <h5 className="mb-2 font-medium">Key Insights</h5>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            u2022 Educational content represents the highest traffic category at
            33.9%
          </li>
          <li>
            u2022 Social media has the highest block rate at 78.4% of all
            attempts
          </li>
          <li>
            u2022 Shopping-related traffic is increasing but remains below 10%
          </li>
        </ul>
      </div>
    </div>
  );
}
