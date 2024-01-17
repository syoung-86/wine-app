"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "@/app/lib/trpc/trpc-client";

type Wine = {
  id: number;
  name: string;
  year: number;
  type: string;
  varietal: string;
  rating: number | null;
  consumed: boolean | null;
  date_consumed: Date | null;
};
export default function WineTable() {
const [wines, setWines] = useState<Wine[]>([]);

  const { data, isLoading, isError, error } = trpc.wines.getWines.useQuery();

  // Update the wines state when data is fetched
useEffect(() => {
  if (data) {
    const transformedData = data.map(wine => ({
      ...wine,
      rating: wine.rating !== null ? parseFloat(wine.rating) : null, 
      date_consumed: wine.date_consumed ? new Date(wine.date_consumed) : null, 
    }));
    setWines(transformedData);
  }
}, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wines</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Name</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Year</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Type</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Varietal</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Rating</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Consumed</th>
              <th className="px-4 py-2 font-medium text-gray-900 text-left">Date Consumed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wines.map((wine, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{wine.name}</td>
                <td className="px-4 py-2">{wine.year}</td>
                <td className="px-4 py-2">{wine.type}</td>
                <td className="px-4 py-2">{wine.varietal}</td>
                <td className="px-4 py-2">{wine.rating}</td>
                <td className="px-4 py-2">{wine.consumed ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{wine.date_consumed ? wine.date_consumed.toLocaleDateString() : 'N/A'}</td>
            </tr>
))}
</tbody>
</table>
</div>
</div>
);
}
