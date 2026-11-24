
(() => { function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((sum, n) => sum + n, 0) / arr.length;
}

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return NaN;

    const cleaned = String(value)
        .replace(',', '.')
        .replace(/[^\d.-]/g, '');

    if (cleaned === '') return NaN;

    const n = Number(cleaned);

    return Number.isFinite(n) ? n : NaN;
}

function yes(value) {
    const v = String(value ?? "").trim().toLowerCase();
    return ["yes", "sim", "1", "true", "y"].includes(v);
}

function parsePressure(value) {
    const match = String(value ?? "").match(/\d+(?:[.,]\d+)?/);
    return match ? parseNumber(match[0]) : NaN;
}

function normalizeKey(key) {
    return String(key ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function getValue(row, names) {
    const keys = Object.keys(row);
    const wanted = names.map(normalizeKey);
    const key = keys.find(k => wanted.includes(normalizeKey(k)));
    return key ? row[key] : "";
}

function normalizeRows(rows) {
    return rows.map(r => ({
        Age: parseNumber(getValue(r, ["Age", "Idade"])),
        Sex: getValue(r, ["Sex", "Sexo"]),
        Cholesterol: parseNumber(getValue(r, ["Cholesterol", "Colesterol"])),
        BloodPressure: getValue(r, ["Blood Pressure", "BloodPressure", "Pressão arterial", "Pressao arterial"]),
        HeartRate: parseNumber(getValue(r, ["Heart Rate", "HeartRate", "Frequência cardíaca", "Frequencia cardiaca"])),
        Diabetes: getValue(r, ["Diabetes"]),
        FamilyHistory: getValue(r, ["Family History", "Historico familiar", "Histórico familiar"]),
        Smoking: getValue(r, ["Smoking", "Tabagismo"]),
        Obesity: getValue(r, ["Obesity", "Obesidade"]),
        HeartAttackRisk: getValue(r, ["Heart Attack Risk", "HeartAttackRisk", "Risco de Ataque Cardíaco", "Risco", "Heart Attack"])
    })).filter(
        r =>
            Object.values(r).some(
                v => v !== "" && (Number.isFinite(v) || yes(v) || (typeof v === "string" && v.trim().length > 0))
            )
    );
}

function parseCSV(text) {
    if (!text || typeof text !== "string") return [];

    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(";") ? ";" : ",";

    const headers = lines[0].split(delimiter).map(h =>
        h.trim().replace(/^"|"$/g, "")
    );

    const rows = [];
    for (let l = 1; l < lines.length; l++) {
        const line = lines[l];
        const values = [];
        let current = "";
        let quoted = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                quoted = !quoted;
            } else if (char === delimiter && !quoted) {
                values.push(current.trim().replace(/^"|"$/g, ""));
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current.trim().replace(/^"|"$/g, ""));

        const row = {};
        for (let i = 0; i < headers.length; i++) {
            row[headers[i]] = values[i] ?? "";
        }
        rows.push(row);
    }

    return rows;
}

const analytics = {
    avg,
    parseNumber,
    yes,
    parsePressure,
    normalizeKey,
    getValue,
    normalizeRows,
    parseCSV
};

// Node.js — utilizado pelos testes
if (typeof module !== "undefined" && module.exports) {
    module.exports = analytics;
}

// Navegador — utilizado pelo HeartGuard
if (typeof window !== "undefined") {
    window.HeartGuardAnalytics = analytics;
}
})();