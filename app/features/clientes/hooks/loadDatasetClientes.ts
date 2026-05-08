import { useEffect } from "react";
import useLoadDataset from "../../shared/hooks/useLoadDataset";
import type Cliente from "../types/Cliente";

export default function loadDatasetClientes() {
    const loadDataset = useLoadDataset<Cliente>();

    useEffect(() => {
        loadDataset.execute("dataset");
    }, [loadDataset.execute]);

    return loadDataset;
}