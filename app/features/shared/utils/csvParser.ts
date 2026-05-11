export const parseCsvToObjects = <T>(csvText: string): T[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
        }, {} as any);
    }) as T[];
};