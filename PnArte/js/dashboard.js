/* ============================================
   DASHBOARD.JS
   
   Responsável por:
   - Calcular e exibir totalizadores
   - Renderizar gráficos (Chart.js)
   - Atualizar dashboard em tempo real
   - Processar dados para relatórios
   ============================================ */

class Dashboard {
    constructor() {
        // Referências dos elementos do DOM
        this.totalEntradas = document.getElementById('totalEntradas');
        this.totalSaidas = document.getElementById('totalSaidas');
        this.lucroAtual = document.getElementById('lucroAtual');
        this.margemLucro = document.getElementById('margemLucro');
        this.qtdEntradas = document.getElementById('qtdEntradas');
        this.qtdSaidas = document.getElementById('qtdSaidas');
        this.totalMovimentacoes = document.getElementById('totalMovimentacoes');
        this.resumoFinanceiro = document.getElementById('resumoFinanceiro');

        // Instâncias dos gráficos
        this.chartComparacao = null;
        this.chartLucro = null;
        this.chartGastos = null;
    }

    /**
     * Atualiza todos os cards informativos
     */
    atualizarCards() {
        const totais = storage.calcularTotais();

        // Formata valores em moeda brasileira
        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        // Atualiza totalizadores
        this.totalEntradas.textContent = formatarMoeda(totais.totalEntradas);
        this.totalSaidas.textContent = formatarMoeda(totais.totalSaidas);
        this.lucroAtual.textContent = formatarMoeda(totais.lucro);

        // Calcula margem de lucro
        const margemPct = totais.totalEntradas > 0 
            ? ((totais.lucro / totais.totalEntradas) * 100).toFixed(1)
            : 0;
        this.margemLucro.textContent = `${margemPct}%`;

        // Atualiza contadores
        this.qtdEntradas.textContent = `${totais.qtdEntradas} movimentações`;
        this.qtdSaidas.textContent = `${totais.qtdSaidas} movimentações`;
        this.totalMovimentacoes.textContent = totais.totalMovimentacoes;

        // Cor do lucro
        const cardLucro = document.querySelector('.card-lucro');
        if (totais.lucro < 0) {
            cardLucro.style.borderLeftColor = '#e74c3c';
            this.lucroAtual.style.color = '#e74c3c';
        }

        // Atualiza resumo financeiro
        this.atualizarResumoFinanceiro(totais);
    }

    /**
     * Atualiza a seção de resumo financeiro
     */
    atualizarResumoFinanceiro(totais) {
        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        const resumoHTML = `
            <div class="resumo-item">
                <span class="resumo-label">
                    <i class="fas fa-arrow-down" style="color: #2ecc71;"></i>
                    Entradas
                </span>
                <span class="resumo-valor" style="color: #2ecc71;">
                    ${formatarMoeda(totais.totalEntradas)}
                </span>
            </div>
            <div class="resumo-item">
                <span class="resumo-label">
                    <i class="fas fa-arrow-up" style="color: #e74c3c;"></i>
                    Saídas
                </span>
                <span class="resumo-valor" style="color: #e74c3c;">
                    ${formatarMoeda(totais.totalSaidas)}
                </span>
            </div>
            <div class="resumo-item">
                <span class="resumo-label">
                    <i class="fas fa-coins" style="color: #3498db;"></i>
                    Lucro
                </span>
                <span class="resumo-valor" style="color: ${totais.lucro >= 0 ? '#3498db' : '#e74c3c'};">
                    ${formatarMoeda(totais.lucro)}
                </span>
            </div>
            <div class="resumo-item">
                <span class="resumo-label">
                    <i class="fas fa-percentage" style="color: #f39c12;"></i>
                    Margem
                </span>
                <span class="resumo-valor" style="color: #f39c12;">
                    ${((totais.lucro / totais.totalEntradas) * 100).toFixed(1)}%
                </span>
            </div>
        `;

        this.resumoFinanceiro.innerHTML = resumoHTML;
    }

    /**
     * Renderiza gráfico de Entradas x Saídas
     */
    renderizarChartComparacao() {
        const ctx = document.getElementById('chartComparacao').getContext('2d');
        const totais = storage.calcularTotais();

        // Destrói gráfico anterior se existir
        if (this.chartComparacao) {
            this.chartComparacao.destroy();
        }

        this.chartComparacao = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Entradas', 'Saídas'],
                datasets: [{
                    label: 'Valores (R$)',
                    data: [totais.totalEntradas, totais.totalSaidas],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderColor: [
                        'rgb(46, 204, 113)',
                        'rgb(231, 76, 60)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Renderiza gráfico de Evolução do Lucro
     */
    renderizarChartLucro() {
        const ctx = document.getElementById('chartLucro').getContext('2d');
        const dados = this.getDadosEvolucaoLucro();

        // Destrói gráfico anterior se existir
        if (this.chartLucro) {
            this.chartLucro.destroy();
        }

        this.chartLucro = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: 'Lucro Acumulado (R$)',
                    data: dados.valores,
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(52, 152, 219)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Renderiza gráfico de Gastos por Categoria
     */
    renderizarChartGastos() {
        const ctx = document.getElementById('chartGastos').getContext('2d');
        const dados = this.getDadosGastosPorCategoria();

        // Destrói gráfico anterior se existir
        if (this.chartGastos) {
            this.chartGastos.destroy();
        }

        const cores = [
            '#9b59b6',  // Estoque
            '#3498db',  // Frete
            '#f39c12',  // Combustível
            '#2ecc71',  // Salários
            '#e74c3c',  // Energia
            '#1abc9c',  // Água
            '#34495e',  // Impostos
            '#95a5a6'   // Outros
        ];

        this.chartGastos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dados.labels,
                datasets: [{
                    data: dados.valores,
                    backgroundColor: cores.slice(0, dados.valores.length),
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Processa dados de evolução do lucro
     * Agrupa por data (últimos 30 dias)
     */
    getDadosEvolucaoLucro() {
        const entradas = storage.getEntradas();
        const saidas = storage.getSaidas();
        const diasAnteriores = 30;
        
        // Cria mapa de datas
        const map = {};
        let lucroAcumulado = 0;

        // Adiciona entradas
        entradas.forEach(e => {
            if (!map[e.data]) map[e.data] = 0;
            map[e.data] += parseFloat(e.valor || 0);
        });

        // Subtrai saídas
        saidas.forEach(s => {
            if (!map[s.data]) map[s.data] = 0;
            map[s.data] -= parseFloat(s.valor || 0);
        });

        // Ordena por data e calcula acumulado
        const labels = [];
        const valores = [];

        Object.keys(map).sort().forEach(data => {
            lucroAcumulado += map[data];
            const dataObj = new Date(data);
            labels.push(dataObj.toLocaleDateString('pt-BR'));
            valores.push(lucroAcumulado);
        });

        // Se não há dados, retorna arrays vazios
        return {
            labels: labels.length > 0 ? labels : ['Sem dados'],
            valores: valores.length > 0 ? valores : [0]
        };
    }

    /**
     * Processa dados de gastos por categoria
     */
    getDadosGastosPorCategoria() {
        const categorias = storage.getEstatisticasCategorias();
        const labels = Object.keys(categorias);
        const valores = Object.values(categorias);

        return {
            labels: labels.length > 0 ? labels : ['Sem dados'],
            valores: valores.length > 0 ? valores : [0]
        };
    }

    /**
     * Inicializa e renderiza todos os gráficos
     */
    renderizarGraficos() {
        this.renderizarChartComparacao();
        this.renderizarChartLucro();
        this.renderizarChartGastos();
    }

    /**
     * Atualiza todo o dashboard
     * Chamado sempre que há mudanças nos dados
     */
    atualizar() {
        this.atualizarCards();
        this.renderizarGraficos();
    }
}

// Cria instância global
const dashboard = new Dashboard();
