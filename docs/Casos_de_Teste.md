CASOS DE TESTE - HEARTGUARD

TESTES UNITÁRIOS

Total de testes unitários implementados: 41

CT-001
Objetivo:
Calcular média de números.

Entrada:
[10, 20, 30]

Resultado esperado:
20

--------------------------------------------------

CT-002

Objetivo:
Retornar zero para lista vazia.

Entrada:
[]

Resultado esperado:
0

--------------------------------------------------

CT-003

Objetivo:
Converter string numérica para número.

Entrada:
"120"

Resultado esperado:
120

--------------------------------------------------

CT-004

Objetivo:
Converter decimal com vírgula.

Entrada:
"120,5"

Resultado esperado:
120.5

--------------------------------------------------

CT-005

Objetivo:
Reconhecer respostas positivas.

Entrada:
"sim", "yes", "true"

Resultado esperado:
True

--------------------------------------------------

CT-006

Objetivo:
Extrair pressão sistólica.

Entrada:
"120/80"

Resultado esperado:
120

--------------------------------------------------

CT-007

Objetivo:
Remover acentos e caracteres especiais.

Entrada:
"Pressão"

Resultado esperado:
"pressao"

--------------------------------------------------

CT-008

Objetivo:
Buscar valores usando nomes equivalentes.

Entrada:
{"idade": 30}

Resultado esperado:
30

--------------------------------------------------

CT-009

Objetivo:
Normalizar dados do paciente.

Resultado esperado:
Campos convertidos corretamente.

--------------------------------------------------

CT-010

Objetivo:
Interpretar CSV separado por vírgulas.

Resultado esperado:
Registro carregado corretamente.

--------------------------------------------------

CT-011

Objetivo:
Interpretar CSV separado por ponto e vírgula.

Resultado esperado:
Registro carregado corretamente.

--------------------------------------------------

CT-012

Objetivo:
Preservar vírgulas dentro de campos entre aspas.

Resultado esperado:
Valor do campo preservado.

--------------------------------------------------

TESTES DE INTEGRAÇÃO

Total de testes de integração implementados: 3

TI-001

Objetivo:
Integrar leitura CSV e normalização dos pacientes.

Resultado esperado:
Dados processados corretamente.

--------------------------------------------------

TI-002

Objetivo:
Integrar CSV com cabeçalhos alternativos.

Resultado esperado:
Mapeamento correto dos campos.

--------------------------------------------------

TI-003

Objetivo:
Processar CSV contendo apenas cabeçalho.

Resultado esperado:
Lista vazia.

--------------------------------------------------

TESTES DE SISTEMA

Total de testes de sistema implementados: 12

TS-001

Objetivo:
Validar carregamento da página inicial.

Resultado esperado:
Página exibida corretamente.

--------------------------------------------------

TS-002

Objetivo:
Validar carregamento da base de pacientes.

Resultado esperado:
Base disponível para processamento.

--------------------------------------------------

TS-003

Objetivo:
Validar carregamento do módulo Analytics.

Resultado esperado:
Funções disponíveis no navegador.

--------------------------------------------------

TS-004

Objetivo:
Validar renderização dos gráficos.

Resultado esperado:
Canvas renderizados corretamente.

--------------------------------------------------

TS-005

Objetivo:
Validar presença do simulador.

Resultado esperado:
Campo de idade visível.

--------------------------------------------------

TS-006

Objetivo:
Executar preset de baixo risco.

Resultado esperado:
Predição exibida.

--------------------------------------------------

TS-007

Objetivo:
Executar preset de alto risco.

Resultado esperado:
Fatores críticos identificados.

--------------------------------------------------

TS-008

Objetivo:
Aplicar valores padrão quando campos estiverem vazios.

Resultado esperado:
Valores padrão utilizados.

--------------------------------------------------

TS-009

Objetivo:
Preservar zero horas de exercício.

Resultado esperado:
Valor zero mantido.

--------------------------------------------------

TS-010

Objetivo:
Preservar valor zero para estresse.

Resultado esperado:
Valor zero mantido.

--------------------------------------------------

TS-011

Objetivo:
Validar idade mínima permitida.

Resultado esperado:
Predição bloqueada para idade menor que 18.

--------------------------------------------------

TS-012

Objetivo:
Validar idade máxima permitida.

Resultado esperado:
Predição bloqueada para idade maior que 100.

--------------------------------------------------

RESUMO

Testes Unitários: 41

Testes de Integração: 3

Testes de Sistema: 12

Total Geral: 56 Casos de Teste