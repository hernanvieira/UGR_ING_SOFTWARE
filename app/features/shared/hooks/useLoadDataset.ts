import { useCallback, useState } from "react";
import { fetchRawCsv } from "../services/csvFetcher";
import { parseCsvToObjects } from "../utils/csvParser";

export default function useLoadDataset<T>() {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (key: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const raw = await fetchRawCsv(key);
            const parsed = parseCsvToObjects<T>(raw);
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