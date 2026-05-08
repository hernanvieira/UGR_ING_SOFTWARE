export const fetchRawCsv = async (fileName: string): Promise<string> => {
    const response = await fetch(`/data/${fileName}.csv`);
    if (!response.ok) throw new Error("No se pudo encontrar el archivo");
    return await response.text();
};
