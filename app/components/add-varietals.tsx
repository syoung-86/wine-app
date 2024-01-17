import React, { useEffect, useState } from "react";
import { trpc } from "@/app/lib/trpc/trpc-client";

type Varietal = {
    id: number;
    name: string;
}

type WineVarietal = {
    varietal: {
        id: number;
        name: string;
    };
    wineId: number,
    varietalId: number,
}
interface AddVarietalsProps {
    id: number | null;
    selectedVarietalIds: number[];
    setSelectedVarietalIds: (ids: number[]) => void;
}
const AddVarietals: React.FC<AddVarietalsProps> = ({
    id,
    selectedVarietalIds,
    setSelectedVarietalIds,
}) => {
    const [selectedVarietals, setSelectedVarietals] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [varietals, setVarietals] = useState<Varietal[] | null>(null);
    const [wineVarietals, setWineVarietals] = useState<WineVarietal[] | null>(null);
    const [isSelectVisible, setIsSelectVisible] = useState(false); // Initially hidden

    const {
        data: varietalData,
        isLoading: varietalIsLoading,
        isError: varietalIsError,
        error: varietalError,
    } = trpc.wines.getVarietals.useQuery();

    useEffect(() => {
        if (varietalData) {
            setVarietals(varietalData);
        } else if (varietalIsError) {
            console.error("Error fetching wine:", varietalError);
        }
    }, [varietalData, varietalError, varietalIsError]);

    const {
        data: varietalWineData,
        isLoading: varietalWineIsLoading,
        isError: varietalWineIsError,
        error: varietalWineError,
    } = trpc.wines.getWineVarietals.useQuery({ id: id as number }, { enabled: id != null });

    useEffect(() => {
        if (varietalWineData) {
            setWineVarietals(varietalWineData);

            if (wineVarietals) {
                const varietalNames = wineVarietals.map((wineVarietal) => wineVarietal.varietal.name);
                const varietalIds = wineVarietals.map((wineVarietal) => wineVarietal.varietal.id);
                setSelectedVarietals(varietalNames);
                setSelectedVarietalIds(varietalIds);
            }
        } else if (varietalWineIsError) {
            console.error("Error fetching varietal wine:", varietalWineError);
        }
    }, [varietalWineData]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsSelectVisible(true); // Show the select list when input changes
    };

    const handleVarietalSelect = (varietal: { name: string; id: number }) => {
        if (!selectedVarietals.includes(varietal.name)) {
            setSelectedVarietals([...selectedVarietals, varietal.name]);
            setSelectedVarietalIds([...selectedVarietalIds, varietal.id]);
            setInputValue("");
            setIsSelectVisible(false); // Hide the select list when an item is added
        }
    };

    const handleRemoveVarietal = (varietal: string) => {
        setSelectedVarietals(selectedVarietals.filter((v) => v !== varietal));
    };
    const handleInputClick = () => {
        setIsSelectVisible(true); // Show the select list when input is clicked
    };

    return (
        <div className="mb-4">
            <label htmlFor="varietals" className="block font-semibold mb-2">
                Varietals:
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="varietals"
                    name="varietals"
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    placeholder="Select varietals..."
                    className="w-full border border-gray-300 rounded-lg p-2 pr-8"
                />
                {isSelectVisible && varietalIsLoading && (
                    <p>Loading...</p>
                )}

                {isSelectVisible && !varietalIsLoading && (
                    <ul className="absolute z-10 mt-2 w-full border border-gray-300 rounded-lg bg-white shadow-md">
                        {varietals &&
                            varietals
                                .filter((varietal) => !selectedVarietals.includes(varietal.name.toLowerCase()))
                                .filter((varietal) => varietal.name.toLowerCase().includes(inputValue.toLowerCase()))
                                .map((varietal) => (
                                    <li
                                        key={varietal.id}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleVarietalSelect({ name: varietal.name.toLowerCase(), id: varietal.id })}
                                    >
                                        {varietal.name}
                                    </li>
                                ))}
                    </ul>
                )}
            </div>
            {selectedVarietals.length > 0 && (
                <div className="mt-2">
                    <span className="block font-semibold mb-2">Selected Varietals:</span>
                    <div className="flex">
                        {selectedVarietals.map((varietal) => (
                            <div key={varietal} className="bg-gray-100 p-1 rounded-lg">
                                <span >{varietal}</span>
                                <button
                                    onClick={() => handleRemoveVarietal(varietal)}
                                    className="ml-1 text-red-500 hover:text-red-600"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default AddVarietals;
