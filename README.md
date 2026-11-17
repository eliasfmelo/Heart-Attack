# ❤ HeartGuard - Cardio Analytics & Análise de Risco Cardíaco

> **Projeto Acadêmico de Análise de Dados e Inteligência Artificial**  
> Dashboard interativo para visualização e análise dos principais fatores clínicos associados ao risco cardiovascular.

🌐 **Acesso Online (GitHub Pages):** [https://eliasfmelo.github.io/Heart-Attack/](https://eliasfmelo.github.io/Heart-Attack/)

---

## 📌 Sobre o Projeto

O **HeartGuard** é uma aplicação web interativa desenvolvida para explorar, analisar e visualizar estatísticas da base oficial **Heart Attack Prediction Dataset** (8.763 registros). A aplicação foi arquitetada para demonstrar de forma visual e intuitiva como fatores clínicos, hábitos de vida e biomarcadores se correlacionam com a possibilidade de infarto e risco cardiovascular avaliados por modelos preditivos de Inteligência Artificial.

---

## 🚀 Funcionalidades

- **Base de Dados 100% Integrada:** Carregamento automático de **8.763 pacientes reais** com 26 atributos clínicos.
- **Gráficos Dinâmicos com Chart.js:**
  - *Fatores de Risco:* Percentual de pacientes com Diabetes, Tabagismo, Obesidade e Histórico Familiar.
  - *Distribuição Demográfica:* Análise por Sexo (Masculino/Feminino) e Distribuição por Faixa Etária (<40, 40-49, 50-59, 60-69, 70+).
- **Indicadores Clínicos em Tempo Real:**
  - Colesterol médio (mg/dL) e barra comparativa de referência.
  - Pressão arterial sistólica média (mmHg).
  - Frequência cardíaca média (bpm).
  - Índice de fatores de risco modificáveis (Diabetes + Tabagismo + Obesidade).
  - Prevalência do modelo de IA para risco de ataque cardíaco (**35,8%** dos pacientes da base).
- **Controles Interativos:**
  - **Base Completa (8.763):** Recarrega instantaneamente a base de dados oficial.
  - **Carregar CSV:** Permite importar novos arquivos CSV personalizados.
  - **Dados de Exemplo:** Alterna para a amostra demonstrativa de 12 registros para testes.
- **Execução Offline e Online:** Funciona em qualquer navegador via `file:///` direto no computador ou hospedado via HTTP/GitHub Pages.

---

## 📊 Estatísticas da Amostra Integrada

| Métrica | Valor da Base Real |
| :--- | :--- |
| **Pacientes Analisados** | 8.763 |
| **Idade Média** | 53,7 anos |
| **Colesterol Médio** | 260 mg/dL |
| **Pressão Arterial Sistólica Média** | 135 mmHg |
| **Frequência Cardíaca Média** | 75 bpm |
| **Prevalência de Tabagismo** | 89,7% |
| **Prevalência de Diabetes** | 65,2% |
| **Prevalência de Obesidade** | 50,1% |
| **Histórico Familiar Cardiovascular** | 49,3% |
| **Casos Positivos de Risco (Alvo IA)** | 3.139 pacientes (35,8%) |

---

## 📁 Estrutura de Arquivos

```text
Heart-Attack/
├── index.html                           # Interface visual principal
├── script.js                            # Lógica de cálculo estatístico e Chart.js
├── styles.css                           # Folha de estilos responsiva com tema escuro
├── database.js                          # Base de dados oficial embutida para suporte offline
├── heart_attack_prediction_dataset.csv  # Arquivo bruto da base de dados (8.763 linhas)
├── abrir_dashboard.bat                  # Inicializador em 1 clique para Windows
└── README.md                            # Documentação completa do projeto
```

---

## 💻 Como Executar Localmente

### Método 1: Abertura Direta (Sem dependências)
Dê um duplo clique no arquivo `abrir_dashboard.bat` (ou no `index.html`). O painel abrirá automaticamente no seu navegador com a base real carregada.

### Método 2: Servidor Local Python
```bash
python -m http.server 8000
```
Acesse no seu navegador: `http://localhost:8000`

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3 Moderno:** Layout flexível com CSS Grid, Flexbox e variáveis customizadas.
- **JavaScript (ES6+):** Normalização de chaves, parsing de CSV, agregação estatística e manipulação do DOM.
- **Chart.js (v4):** Biblioteca de gráficos vetoriais interativos (barras, rosca e linhas).
- **Google Fonts:** Tipografias *Inter* e *Outfit*.
- **Git & GitHub Pages:** Versionamento e hospedagem contínua.

---

## ⚖️ Aviso Legal
*Os indicadores e gráficos exibidos possuem finalidade acadêmica e estatística, não substituindo diagnósticos ou acompanhamento médico profissional.*
