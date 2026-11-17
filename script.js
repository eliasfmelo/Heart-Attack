/* =====================================================
   HeartGuard - Cardio Analytics
   Integração com a Base Heart Attack Prediction Dataset
===================================================== */

/* =====================================================
   DADOS DEMONSTRATIVOS (FALLBACK)
===================================================== */

const sampleData = [
    {
        Age: 34,
        Sex: "Male",
        Cholesterol: 182,
        BloodPressure: "118/76",
        HeartRate: 68,
        Diabetes: "No",
        FamilyHistory: "No",
        Smoking: "No",
        Obesity: "No",
        HeartAttackRisk: "No"
    },
    {
        Age: 42,
        Sex: "Female",
        Cholesterol: 205,
        BloodPressure: "126/80",
        HeartRate: 72,
        Diabetes: "No",
        FamilyHistory: "Yes",
        Smoking: "No",
        Obesity: "No",
        HeartAttackRisk: "No"
    },
    {
        Age: 48,
        Sex: "Male",
        Cholesterol: 238,
        BloodPressure: "138/88",
        HeartRate: 79,
        Diabetes: "Yes",
        FamilyHistory: "Yes",
        Smoking: "Yes",
        Obesity: "Yes",
        HeartAttackRisk: "Yes"
    },
    {
        Age: 55,
        Sex: "Female",
        Cholesterol: 226,
        BloodPressure: "142/90",
        HeartRate: 82,
        Diabetes: "No",
        FamilyHistory: "Yes",
        Smoking: "No",
        Obesity: "Yes",
        HeartAttackRisk: "No"
    },
    {
        Age: 61,
        Sex: "Male",
        Cholesterol: 254,
        BloodPressure: "150/94",
        HeartRate: 86,
        Diabetes: "Yes",
        FamilyHistory: "Yes",
        Smoking: "Yes",
        Obesity: "Yes",
        HeartAttackRisk: "Yes"
    },
    {
        Age: 39,
        Sex: "Female",
        Cholesterol: 190,
        BloodPressure: "120/78",
        HeartRate: 70,
        Diabetes: "No",
        FamilyHistory: "No",
        Smoking: "No",
        Obesity: "No",
        HeartAttackRisk: "No"
    },
    {
        Age: 67,
        Sex: "Male",
        Cholesterol: 267,
        BloodPressure: "156/96",
        HeartRate: 91,
        Diabetes: "Yes",
        FamilyHistory: "Yes",
        Smoking: "Yes",
        Obesity: "Yes",
        HeartAttackRisk: "Yes"
    },
    {
        Age: 52,
        Sex: "Female",
        Cholesterol: 218,
        BloodPressure: "134/84",
        HeartRate: 75,
        Diabetes: "No",
        FamilyHistory: "Yes",
        Smoking: "No",
        Obesity: "Yes",
        HeartAttackRisk: "No"
    },
    {
        Age: 45,
        Sex: "Male",
        Cholesterol: 210,
        BloodPressure: "130/82",
        HeartRate: 77,
        Diabetes: "No",
        FamilyHistory: "No",
        Smoking: "Yes",
        Obesity: "No",
        HeartAttackRisk: "No"
    },
    {
        Age: 58,
        Sex: "Female",
        Cholesterol: 231,
        BloodPressure: "144/88",
        HeartRate: 80,
        Diabetes: "Yes",
        FamilyHistory: "Yes",
        Smoking: "No",
        Obesity: "Yes",
        HeartAttackRisk: "Yes"
    },
    {
        Age: 72,
        Sex: "Male",
        Cholesterol: 280,
        BloodPressure: "160/100",
        HeartRate: 94,
        Diabetes: "Yes",
        FamilyHistory: "Yes",
        Smoking: "Yes",
        Obesity: "Yes",
        HeartAttackRisk: "Yes"
    },
    {
        Age: 42,
        Sex: "Female",
        Cholesterol: 204,
        BloodPressure: "128/82",
        HeartRate: 68,
        Diabetes: "No",
        FamilyHistory: "No",
        Smoking: "No",
        Obesity: "No",
        HeartAttackRisk: "No"
    }
];

/* =====================================================
   VARIÁVEIS DOS GRÁFICOS E CACHE DA BASE REAL
===================================================== */

let riskChart;
let sexChart;
let ageChart;
let cachedRealData = null;

/* =====================================================
   FUNÇÃO AUXILIAR PARA ELEMENTOS DO DOM
===================================================== */

const $ = (id) => document.getElementById(id);

/* =====================================================
   MÉDIA
===================================================== */

const avg = (arr) => {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
};

/* =====================================================
   NORMALIZAÇÃO DE CHAVES E COLUNAS
===================================================== */

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

function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
        return NaN;
    }
    const n = Number(
        String(value)
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
    );
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

/* =====================================================
   NORMALIZA OS DADOS DA BASE
===================================================== */

function normalizeRows(rows) {
    return rows.map(r => ({
        Age: parseNumber(
            getValue(r, ["Age", "Idade"])
        ),
        Sex: getValue(r, ["Sex", "Sexo"]),
        Cholesterol: parseNumber(
            getValue(r, ["Cholesterol", "Colesterol"])
        ),
        BloodPressure: getValue(
            r,
            ["Blood Pressure", "BloodPressure", "Pressão arterial", "Pressao arterial"]
        ),
        HeartRate: parseNumber(
            getValue(r, ["Heart Rate", "HeartRate", "Frequência cardíaca", "Frequencia cardiaca"])
        ),
        Diabetes: getValue(r, ["Diabetes"]),
        FamilyHistory: getValue(
            r,
            ["Family History", "Historico familiar", "Histórico familiar"]
        ),
        Smoking: getValue(r, ["Smoking", "Tabagismo"]),
        Obesity: getValue(r, ["Obesity", "Obesidade"]),
        HeartAttackRisk: getValue(
            r,
            ["Heart Attack Risk", "HeartAttackRisk", "Risco de Ataque Cardíaco", "Risco", "Heart Attack"]
        )
    })).filter(
        r =>
            Object.values(r).some(
                v => v !== "" && (Number.isFinite(v) || yes(v) || (typeof v === "string" && v.trim().length > 0))
            )
    );
}

/* =====================================================
   FORMATAÇÃO DE NÚMEROS
===================================================== */

function formatNumber(n, decimals = 0) {
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/* =====================================================
   CÁLCULO DE PORCENTAGEM
===================================================== */

function pct(rows, key) {
    if (!rows.length) return 0;
    return (rows.filter(r => yes(r[key])).length / rows.length) * 100;
}

/* =====================================================
   CRIA E ATUALIZA OS GRÁFICOS
===================================================== */

function createCharts(rows) {
    /* =========================
       DADOS NUMÉRICOS
    ========================== */

    const ages = rows.map(r => r.Age).filter(Number.isFinite);
    const cholesterol = rows.map(r => r.Cholesterol).filter(Number.isFinite);
    const heart = rows.map(r => r.HeartRate).filter(Number.isFinite);
    const pressure = rows.map(r => parsePressure(r.BloodPressure)).filter(Number.isFinite);

    /* =========================
       FAIXAS DE IDADE
    ========================== */

    const ageBuckets = [
        ages.filter(a => a < 40).length,
        ages.filter(a => a >= 40 && a < 50).length,
        ages.filter(a => a >= 50 && a < 60).length,
        ages.filter(a => a >= 60 && a < 70).length,
        ages.filter(a => a >= 70).length
    ];

    /* =========================
       FATORES DE RISCO
    ========================== */

    const riskLabels = [
        "Diabetes",
        "Tabagismo",
        "Obesidade",
        "Hist. familiar"
    ];

    const riskValues = [
        pct(rows, "Diabetes"),
        pct(rows, "Smoking"),
        pct(rows, "Obesity"),
        pct(rows, "FamilyHistory")
    ];

    /* =========================
       SEXO
    ========================== */

    const male = rows.filter(r => String(r.Sex).toLowerCase().startsWith("m")).length;
    const female = rows.filter(r => String(r.Sex).toLowerCase().startsWith("f")).length;
    const other = Math.max(0, rows.length - male - female);

    /* =========================
       DESTRÓI GRÁFICOS ANTERIORES
    ========================== */

    if (riskChart) riskChart.destroy();
    if (sexChart) sexChart.destroy();
    if (ageChart) ageChart.destroy();

    /* =========================
       GRÁFICO DE FATORES DE RISCO
    ========================== */

    riskChart = new Chart($("riskChart"), {
        type: "bar",
        data: {
            labels: riskLabels,
            datasets: [
                {
                    data: riskValues,
                    borderRadius: 6,
                    borderSkipped: false,
                    backgroundColor: [
                        "#8e7dff",
                        "#ff6e79",
                        "#ffb45b",
                        "#36a7ff"
                    ],
                    maxBarThickness: 28
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: c => ` ${formatNumber(c.raw, 1)}% da amostra`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: "#8195a9",
                        font: { size: 9 }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: "rgba(255,255,255,.06)" },
                    ticks: {
                        color: "#8195a9",
                        callback: value => value + "%"
                    }
                }
            }
        }
    });

    /* =========================
       GRÁFICO DE SEXO
    ========================== */

    sexChart = new Chart($("sexChart"), {
        type: "doughnut",
        data: {
            labels: ["Masculino", "Feminino", "Outro"],
            datasets: [
                {
                    data: [male, female, other],
                    backgroundColor: [
                        "#36a7ff",
                        "#8e7dff",
                        "#3dd7d0"
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "73%",
            plugins: {
                legend: { display: false }
            }
        }
    });

    /* =========================
       LEGENDA DE SEXO
    ========================== */

    $("sexTotal").textContent = formatNumber(rows.length);

    $("sexLegend").innerHTML = [
        ["#36a7ff", "Masculino", male],
        ["#8e7dff", "Feminino", female],
        ["#3dd7d0", "Outro", other]
    ]
    .filter(x => x[2] > 0)
    .map(x => `
        <div class="legend-row">
            <i style="background:${x[0]}"></i>
            <span>${x[1]}</span>
            <strong>${formatNumber(x[2])} (${formatNumber((x[2]/rows.length)*100, 1)}%)</strong>
        </div>
    `).join("");

    /* =========================
       GRÁFICO DE IDADE
    ========================== */

    ageChart = new Chart($("ageChart"), {
        type: "line",
        data: {
            labels: ["<40", "40–49", "50–59", "60–69", "70+"],
            datasets: [
                {
                    data: ageBuckets,
                    borderColor: "#3dd7d0",
                    backgroundColor: "rgba(61,215,208,.08)",
                    fill: true,
                    tension: .4,
                    pointRadius: 3,
                    pointBackgroundColor: "#3dd7d0"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: c => ` ${formatNumber(c.raw)} pacientes (${formatNumber((c.raw/rows.length)*100, 1)}%)`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#8195a9" }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(255,255,255,.06)" },
                    ticks: {
                        color: "#8195a9",
                        precision: 0
                    }
                }
            }
        }
    });

    /* =========================
       MÉDIAS
    ========================== */

    const aAge = avg(ages);
    const aChol = avg(cholesterol);
    const aHeart = avg(heart);
    const aPressure = avg(pressure);

    /* =========================
       ATUALIZA CARDS PRINCIPAIS
    ========================== */

    $("mPatients").textContent = formatNumber(rows.length);

    $("mAge").innerHTML = `
        ${formatNumber(aAge, 1)}
        <em>anos</em>
    `;

    $("mChol").innerHTML = `
        ${formatNumber(aChol, 0)}
        <em>mg/dL</em>
    `;

    $("mHeart").innerHTML = `
        ${formatNumber(aHeart, 0)}
        <em>bpm</em>
    `;

    /* =========================
       INDICADORES CLÍNICOS
    ========================== */

    $("cChol").innerHTML = `
        ${formatNumber(aChol, 0)}
        <small>mg/dL</small>
    `;

    $("cPressure").innerHTML = `
        ${formatNumber(aPressure, 0)}
        <small>mmHg</small>
    `;

    $("cHeart").innerHTML = `
        ${formatNumber(aHeart, 0)}
        <small>bpm</small>
    `;

    /* =========================
       BARRAS DE PROGRESSO
    ========================== */

    $("pChol").style.width = Math.min(100, (aChol / 300) * 100) + "%";
    $("pPressure").style.width = Math.min(100, (aPressure / 200) * 100) + "%";
    $("pHeart").style.width = Math.min(100, (aHeart / 140) * 100) + "%";

    /* =========================
       FATORES MODIFICÁVEIS
    ========================== */

    const mod = (pct(rows, "Diabetes") + pct(rows, "Smoking") + pct(rows, "Obesity")) / 3;
    $("modifiable").textContent = formatNumber(mod, 0) + "%";

    /* =========================
       RISCO DE ATAQUE CARDÍACO (ALVO DO MODELO DE IA)
    ========================== */

    if ($("aiRisk")) {
        const riskPercentage = pct(rows, "HeartAttackRisk");
        const riskCount = rows.filter(r => yes(r.HeartAttackRisk)).length;
        $("aiRisk").textContent = formatNumber(riskPercentage, 1) + "%";
        if ($("aiRiskCaption")) {
            $("aiRiskCaption").textContent = `${formatNumber(riskCount)} casos positivos (${formatNumber(riskPercentage, 1)}%)`;
        }
    }
}

/* =====================================================
   CARREGAR DADOS NO DASHBOARD
===================================================== */

function loadData(rows, mode = "real") {
    const normalized = normalizeRows(rows);

    if (!normalized.length) {
        alert("Não foram encontrados dados válidos no arquivo.");
        return;
    }

    createCharts(normalized);

    const isReal = mode === "real";
    const isDemo = mode === "demo";

    // Atualiza status na barra lateral
    const dotColor = isReal ? "var(--green)" : (isDemo ? "var(--orange)" : "var(--blue)");
    const statusText = isReal
        ? "Base conectada (8.763)"
        : (isDemo ? "Modo demonstrativo" : `CSV carregado (${formatNumber(normalized.length)})`);

    $("dataStatus").innerHTML = `
        <span class="status-dot" style="background:${dotColor}; box-shadow: 0 0 10px ${dotColor};"></span>
        <span>${statusText}</span>
    `;

    // Atualiza subtítulo do card de pacientes
    $("mPatientsDelta").textContent = isReal
        ? "base oficial de IA"
        : (isDemo ? "amostra demonstrativa" : "dados importados do CSV");

    // Atualiza caixa de aviso
    const noticeEl = $("notice");
    if (noticeEl) {
        noticeEl.style.display = "flex";
        if (isReal) {
            noticeEl.className = "notice success";
            if ($("noticeIcon")) $("noticeIcon").textContent = "✓";
            if ($("noticeContent")) {
                $("noticeContent").innerHTML = `
                    <strong>Base de Dados Integrada:</strong>
                    A base oficial <b>Heart Attack Prediction Dataset</b> está conectada com
                    <b>${formatNumber(normalized.length)} registros reais</b> de pacientes, alimentando todos os indicadores estatísticos e clínicos do projeto de IA.
                `;
            }
        } else if (isDemo) {
            noticeEl.className = "notice";
            if ($("noticeIcon")) $("noticeIcon").textContent = "i";
            if ($("noticeContent")) {
                $("noticeContent").innerHTML = `
                    <strong>Modo Demonstrativo:</strong>
                    Exibindo amostra demonstrativa de 12 registros.
                    Clique em <b>Base Completa (8.763)</b> para retornar à base de dados real.
                `;
            }
        } else {
            noticeEl.className = "notice success";
            if ($("noticeIcon")) $("noticeIcon").textContent = "✓";
            if ($("noticeContent")) {
                $("noticeContent").innerHTML = `
                    <strong>CSV Carregado:</strong>
                    Arquivo personalizado processado com sucesso.
                    <b>${formatNumber(normalized.length)} registros</b> carregados nos gráficos.
                `;
            }
        }
    }
}

/* =====================================================
   LEITOR DE CSV ROBUSTO
===================================================== */

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

/* =====================================================
   CARREGA BASE DE DADOS COMPLETA
===================================================== */

function loadRealDatabase() {
    if (cachedRealData && cachedRealData.length) {
        loadData(cachedRealData, "real");
        return;
    }

    if (window.HEART_DATASET_CSV) {
        const parsed = parseCSV(window.HEART_DATASET_CSV);
        if (parsed.length) {
            cachedRealData = parsed;
            loadData(parsed, "real");
            return;
        }
    }

    // Tenta fetch se aberto via HTTP
    fetch("heart_attack_prediction_dataset.csv")
        .then(res => {
            if (!res.ok) throw new Error("Status " + res.status);
            return res.text();
        })
        .then(csvText => {
            const parsed = parseCSV(csvText);
            if (parsed.length) {
                cachedRealData = parsed;
                loadData(parsed, "real");
            } else {
                loadData(sampleData, "demo");
            }
        })
        .catch(() => {
            loadData(sampleData, "demo");
        });
}

/* =====================================================
   EVENT LISTENERS
===================================================== */

// Botão carregar CSV externo
$("csvInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = parseCSV(text);
        loadData(data, "csv");
    } catch (err) {
        alert("Erro ao ler o arquivo CSV selecionado: " + err.message);
    }
});

// Botão Dados de Exemplo
$("demoBtn").addEventListener("click", () => {
    loadData(sampleData, "demo");
});

// Botão Base Completa
const realBtn = $("realDbBtn");
if (realBtn) {
    realBtn.addEventListener("click", () => {
        loadRealDatabase();
    });
}

// Fechar aviso
$("closeNotice").addEventListener("click", () => {
    $("notice").style.display = "none";
});

/* =====================================================
   INICIALIZAÇÃO DO DASHBOARD
===================================================== */

loadRealDatabase();
