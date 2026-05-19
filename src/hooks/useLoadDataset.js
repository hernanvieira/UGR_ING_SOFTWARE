import { useState, useCallback } from "react";
import { fetchRawCsv } from "../services/csvFetcher";
import { parseCsvToObjects } from "../utils/csvParser";

const MIN_LOADING_TIME = 300;

export default function useLoadDataset() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (key) => {
        setIsLoading(true);
        setError(null);

        const minTimePromise = new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));

        try {
            const [raw] = await Promise.all([
                fetchRawCsv(key),
                minTimePromise
            ]);

            const parsed = parseCsvToObjects(raw);
            setData(parsed);
            return parsed;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido cargando el dataset";
            setError(message);
            console.error(`Error cargando CSV: ${key}`, err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, error, execute };
}
