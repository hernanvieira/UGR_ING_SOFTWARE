export const parseCsvToObjects = (csvText) => {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return [];

    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            const val = values[index]?.trim();
            let parsedVal = val;
            if (val === 'true') {
                parsedVal = true;
            } else if (val === 'false') {
                parsedVal = false;
            } else if (val !== undefined && val !== '' && !isNaN(val)) {
                parsedVal = Number(val);
            }
            obj[header.trim()] = parsedVal;
            return obj;
        }, {});
    });
};
