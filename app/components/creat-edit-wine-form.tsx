"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/app/lib/trpc/trpc-client";
import AddVarietals from "./add-varietals";
import { WineType, createWineSchema, updateWineSchema } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

type Wine = {
  id: number;
  name: string;
  year: number;
  type: string;
  rating: number | null;
  consumed: boolean | null;
  date_consumed: Date | null;
};

export default function CreateEditWineForm({ id }: { id: number | null }) {
  const [wine, setWine] = useState<Wine | null>(null);
  const [selectedVarietalIds, setSelectedVarietalIds] = useState<number[]>([]);
  const [isConsumed, setIsConsumed] = useState(wine?.consumed || false); // Initialize with the value from wine or false if it's not available
  const updateWineMutation = trpc.wines.updateWine.useMutation();
  const createWineMutation = trpc.wines.createWine.useMutation();
  const {
data: wineData,
          isLoading: wineIsLoading,
          isError: wineIsError,
          error: wineError,
  } = trpc.wines.getWine.useQuery({ id: id as number }, {enabled: id != null});
        useEffect(() => {
        if (wineData) {
        const transformedData = {
        ...wineData,
        rating: wineData.rating !== null ? parseFloat(wineData.rating) : null,
        date_consumed: wineData.date_consumed
        ? new Date(wineData.date_consumed)
        : null,
        };
        setWine(transformedData);
        } else if (wineIsError) {
        console.error("Error fetching wine:", wineError);
        }
        }, [wineData]);

if(wineIsLoading){
    return (<p>Loading...</p>);
}
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dateConsumedValue = event.currentTarget.date_consumed?.value;
    const dateConsumed = !isNaN(Date.parse(dateConsumedValue))
        ? new Date(dateConsumedValue)
        : null;
    if(id){
        console.log("id");
  const formValues=  {
    id: id,
    name: (event.currentTarget.querySelector('#name') as HTMLInputElement)?.value,
    year: parseInt(event.currentTarget.year.value, 10),
    type: event.currentTarget.type.value, // Assuming WineType is a specific type for wine types
    varietals: selectedVarietalIds,
    rating: parseFloat(event.currentTarget.rating.value),
    consumed: event.currentTarget.consumed.checked,
    date_consumed: dateConsumed,
  };
try {
    const validData = updateWineSchema.parse(formValues);
    updateWineMutation.mutate(validData);
    const router = useRouter();
    router.push(`/list`);
  } catch (error) {
    console.error("Validation failed", error);
  }
  } else{
  const formValues=  {
    name: (event.currentTarget.querySelector('#name') as HTMLInputElement)?.value,
    year: parseInt(event.currentTarget.year.value, 10),
    type: event.currentTarget.type.value, // Assuming WineType is a specific type for wine types
    varietals: selectedVarietalIds,
    rating: parseFloat(event.currentTarget.rating.value),
    consumed: event.currentTarget.consumed.checked,
    date_consumed: dateConsumed,
  };
try {
    const validData = createWineSchema.parse(formValues);
    createWineMutation.mutate(validData);
    const router = useRouter();
    router.push(`/list`);
  } catch (error) {
    console.error("Validation failed", error);
  }

  }

}
const handleConsumedChange = () => {
    setIsConsumed(!isConsumed); // Toggle the consumed state when the checkbox is clicked
}
      return (
        <>
          <h1 className="text-3xl font-semibold mb-4">Create / Edit Wine</h1>
          <form
            onSubmit={handleSubmit}
            id="wineForm"
            className="w-1/2 mx-auto mt-8 p-4 border border-gray-300 rounded-lg"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-2">
                Name:
              </label>
              <input
                defaultValue={wine?.name ||  ''}
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="year" className="block font-semibold mb-2">
                Year:
              </label>
              <input
                defaultValue={wine?.year}
                type="number"
                id="year"
                name="year"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block font-semibold mb-2">
                Type:
              </label>
              <select
                defaultValue={wine?.type}
                id="type"
                name="type"
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="Red">Red</option>
                <option value="White">White</option>
                <option value="Rosé">Rosé</option>
                <option value="White Blend">White Blend</option>
                <option value="Red Blend">Red Blend</option>
              </select>
            </div>

            <div className="mb-4">
        <AddVarietals
                id={id}
                selectedVarietalIds={selectedVarietalIds}
                setSelectedVarietalIds={setSelectedVarietalIds}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="rating" className="block font-semibold mb-2">
                Rating (1-5):
              </label>
              <input
                defaultValue={wine?.rating?.toString()}
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="consumed" className="block font-semibold mb-2">
                Consumed:
              </label>
              <input
                onChange={handleConsumedChange}
                checked={wine?.consumed || isConsumed}
                type="checkbox"
                id="consumed"
                name="consumed"
                className="mr-2"
              />
            </div>

            {isConsumed && (
              <div className="mb-4">
                <label
                  htmlFor="date_consumed"
                  className="block font-semibold mb-2"
                >
                  Date Consumed:
                </label>
                <input
                  type="date"
                  defaultValue={
                    wine?.date_consumed
                      ? new Date(wine.date_consumed).toISOString().substr(0, 10)
                      : ""
                  }
                  id="date_consumed"
                  name="date_consumed"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            )}

            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg mr-2"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      );
}
