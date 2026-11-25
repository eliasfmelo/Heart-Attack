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
   MÉDIA — compartilhada com analytics.js
===================================================== */

const avg = window.HeartGuardAnalytics.avg;

/* NORMALIZAÇÃO DE CHAVES — compartilhada com analytics.js */

const normalizeKey = window.HeartGuardAnalytics.normalizeKey;

/* BUSCA DE VALORES — compartilhada com analytics.js */

const getValue = window.HeartGuardAnalytics.getValue;

/* CONVERSÃO NUMÉRICA — compartilhada com analytics.js */

const parseNumber = window.HeartGuardAnalytics.parseNumber;

/* INTERPRETAÇÃO DE VALORES AFIRMATIVOS — compartilhada */

const yes = window.HeartGuardAnalytics.yes;

/* EXTRAÇÃO DE PRESSÃO — compartilhada com analytics.js */

const parsePressure = window.HeartGuardAnalytics.parsePressure;

/* NORMALIZA OS DADOS DA BASE — compartilhada com analytics.js */

const normalizeRows = window.HeartGuardAnalytics.normalizeRows;

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

/* LEITURA DE CSV — compartilhada com analytics.js */

const parseCSV = window.HeartGuardAnalytics.parseCSV;

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


/* =====================================================
   INTERAÇÃO COM O SIMULADOR DE IA
===================================================== */

function runSimulation() {
    if (typeof window.predictHeartRisk !== "function") {
        console.warn("Função predictHeartRisk ainda não carregada.");
        return;
    }

    const age = Number($("simAge").value);

    if (!Number.isInteger(age) || age < 18 || age > 100) {
        console.warn("Idade inválida. Informe uma idade entre 18 e 100.");
        return;
    }

    const patient = {
       Age: age,
        Sex: $("simSex").value,
        Cholesterol: parseNumber($("simChol").value) || 220,
        Systolic: parseNumber($("simSystolic").value) || 120,
        Diastolic: 80,
        HeartRate: parseNumber($("simHeart").value) || 75,
        Triglycerides: parseNumber($("simTrig").value) || 250,
        Smoking: $("simSmoking").value,
        Diabetes: $("simDiabetes").value,
        Obesity: $("simObesity").value,
        FamilyHistory: $("simFamHist").value,
        Stress: $("simStress").value === ""
  ? 5
  : parseNumber($("simStress").value),
       ExerciseHours: $("simExercise").value === "" 
  ? 3.0 
  : parseNumber($("simExercise").value)
    };

    const result = window.predictHeartRisk(patient);
    if (!result) return;

    // Atualiza percentual e cor
    const pctEl = $("resPercentage");
    pctEl.textContent = result.percentage + "%";
    pctEl.style.color = result.color;

    // Atualiza badge
    const badgeEl = $("resBadge");
    badgeEl.textContent = result.level;
    badgeEl.style.color = result.color;
    badgeEl.style.background = result.level.includes("Alto") 
        ? "rgba(255,110,121,.2)" 
        : (result.level.includes("Moderado") ? "rgba(255,180,91,.2)" : "rgba(66,214,163,.2)");

    // Atualiza fatores críticos
    const factorsEl = $("resFactors");
    if (result.factors.length > 0) {
        factorsEl.innerHTML = result.factors.map(function(f) {
            return `<span class="factor-tag">${f}</span>`;
        }).join("");
    } else {
        factorsEl.innerHTML = '<span class="factor-tag" style="background:rgba(66,214,163,.15); color:var(--green); border-color:rgba(66,214,163,.3);">Nenhum fator de alto risco identificado</span>';
    }
}

// Event listeners do simulador
if ($("btnPredict")) {
    $("btnPredict").addEventListener("click", runSimulation);
}

if ($("btnPresetHealthy")) {
    $("btnPresetHealthy").addEventListener("click", function() {
        $("simAge").value = 32;
        $("simSex").value = "Female";
        $("simChol").value = 175;
        $("simSystolic").value = 115;
        $("simHeart").value = 68;
        $("simTrig").value = 120;
        $("simSmoking").value = "0";
        $("simDiabetes").value = "0";
        $("simObesity").value = "0";
        $("simFamHist").value = "0";
        $("simStress").value = 3;
        $("simExercise").value = 6.0;
        runSimulation();
    });
}

if ($("btnPresetRisk")) {
    $("btnPresetRisk").addEventListener("click", function() {
        $("simAge").value = 67;
        $("simSex").value = "Male";
        $("simChol").value = 285;
        $("simSystolic").value = 158;
        $("simHeart").value = 88;
        $("simTrig").value = 460;
        $("simSmoking").value = "1";
        $("simDiabetes").value = "1";
        $("simObesity").value = "1";
        $("simFamHist").value = "1";
        $("simStress").value = 9;
        $("simExercise").value = 1.0;
        runSimulation();
    });
}

// Executa uma simulação inicial após carregamento completo
setTimeout(runSimulation, 400);
