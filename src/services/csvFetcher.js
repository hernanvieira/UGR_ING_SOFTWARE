export const fetchRawCsv = async (fileName) => {
    const response = await fetch(`/UGR_ING_SOFTWARE/data/${fileName}.csv`);
    if (!response.ok) throw new Error("No se pudo encontrar el archivo");
    return await response.text();
};
