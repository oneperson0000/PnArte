/* ============================================
   APP.JS
   
   Orquestrador Principal da Aplicação
   
   Responsável por:
   - Controlar navegação entre seções
   - Gerenciar eventos globais
   - Inicializar módulos
   - Exportar/importar dados
   - Responsabilidade pelas ações do usuário
   ============================================ */

class App {
    constructor() {
        // Elementos do DOM
        this.sections = document.querySelectorAll('.section');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.exportBtn = document.getElementById('exportBtn');
        this.limparBtn = document.getElementById('limparBtn');
        

        // Modais
        this.modal = document.getElementById('modalConfirm');
        this.modalMessage = document.getElementById('modalMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Variáveis de controle
        this.secaoAtual = 'dashboard';
        this.operacaoEmAguardo = null;

        this.inicializarEventos();
        this.irParaSecao('dashboard');
    }

    /**
     * Inicializa todos os event listeners
     */
    inicializarEventos() {
        // Navegação entre seções
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const secao = btn.getAttribute('data-section');
                this.irParaSecao(secao);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => login.fazerLogout());
        }

        // Exportar dados
        this.exportBtn.addEventListener('click', () => this.exportarDados());

        // Limpar tudo
        this.limparBtn.addEventListener('click', () => this.pedirConfirmacaoLimpeza());

        // Modal
        this.confirmBtn.addEventListener('click', () => this.executarOperacaoPendente());
        this.cancelBtn.addEventListener('click', () => this.fecharModal());

        // Atualizar relatórios quando houver mudanças
        const botoesRelatorio = document.querySelectorAll('.relatorio-filtros .btn-secondary');
        botoesRelatorio.forEach(btn => {
            btn.addEventListener('click', (e) => this.filtrarRelatorio(e.target));
        });
    }

    /**
     * Navega para uma seção
     */
    irParaSecao(nomeDaSecao) {
        // Remove ativa de todas as seções
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove ativa de todos os botões
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Ativa a seção selecionada
        const secao = document.getElementById(nomeDaSecao);
        if (secao) {
            secao.classList.add('active');
        }

        // Ativa o botão correspondente
        const btn = document.querySelector(`[data-section="${nomeDaSecao}"]`);
        if (btn) {
            btn.classList.add('active');
        }

        // Atualiza header
        this.atualizarHeader(nomeDaSecao);

        // Atualiza dashboard se for a seção
        if (nomeDaSecao === 'dashboard') {
            dashboard.atualizar();
        }

        // Renderiza relatórios se for a seção
        if (nomeDaSecao === 'relatorios') {
            this.renderizarRelatorios('diario');
        }

        this.secaoAtual = nomeDaSecao;
    }

    /**
     * Atualiza o header com informações da seção
     */
    atualizarHeader(secao) {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        const titulos = {
            'dashboard': {
                titulo: 'Dashboard',
                subtitulo: 'Visão geral financeira'
            },
            'entradas': {
                titulo: 'Controle de Entradas',
                subtitulo: 'Gerencie suas receitas'
            },
            'saidas': {
                titulo: 'Controle de Saídas',
                subtitulo: 'Gerencie suas despesas'
            },
            'estoque': {
                titulo: 'Controle de Estoque',
                subtitulo: 'Gerencie seus porcelanatos'
            },
            'relatorios': {
                titulo: 'Relatórios Financeiros',
                subtitulo: 'Análise detalhada do período'
            }
        };

        const info = titulos[secao] || titulos['dashboard'];
        pageTitle.textContent = info.titulo;
        pageSubtitle.textContent = info.subtitulo;
    }

    /**
     * Exporta todos os dados para PDF (como planilha)
     */
    exportarDados() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const dataExportacao = new Date();
        const titulo = `PnArte - Relatório Completo - ${dataExportacao.toLocaleDateString('pt-BR')}`;

        // Título
        doc.setFontSize(16);
        doc.text(titulo, 14, 22);

        // Data e hora
        doc.setFontSize(10);
        doc.text(`Exportado em: ${dataExportacao.toLocaleString('pt-BR')}`, 14, 30);

        let yPosition = 40;

        // ====== TABELA DE ENTRADAS ======
        const entradas = storage.getEntradas();
        if (entradas.length > 0) {
            doc.setFontSize(12);
            doc.text('ENTRADAS', 14, yPosition);
            yPosition += 8;

            const entradasData = entradas.map(e => [
                this.formatarData(new Date(e.data)),
                e.descricao,
                e.cliente,
                `R$ ${parseFloat(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                e.formaPagamento
            ]);

            doc.autoTable({
                startY: yPosition,
                head: [['Data', 'Descrição', 'Cliente', 'Valor', 'Forma Pagamento']],
                body: entradasData,
                theme: 'grid',
                headStyles: {
                    fillColor: [46, 204, 113],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: 0
                },
                margin: { left: 14, right: 14 }
            });

            yPosition = doc.lastAutoTable.finalY + 15;
        }

        // ====== TABELA DE SAÍDAS ======
        const saidas = storage.getSaidas();
        if (saidas.length > 0) {
            doc.setFontSize(12);
            doc.text('SAÍDAS', 14, yPosition);
            yPosition += 8;

            const saidasData = saidas.map(s => [
                this.formatarData(new Date(s.data)),
                s.categoria,
                s.descricao,
                `R$ ${parseFloat(s.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ]);

            doc.autoTable({
                startY: yPosition,
                head: [['Data', 'Categoria', 'Descrição', 'Valor']],
                body: saidasData,
                theme: 'grid',
                headStyles: {
                    fillColor: [231, 76, 60],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: 0
                },
                margin: { left: 14, right: 14 }
            });

            yPosition = doc.lastAutoTable.finalY + 15;
        }

        // ====== TABELA DE ESTOQUE ======
        const estoque = storage.getEstoque();
        if (estoque.length > 0) {
            doc.setFontSize(12);
            doc.text('ESTOQUE', 14, yPosition);
            yPosition += 8;

            const estoqueData = estoque.map(p => {
                const margem = ((p.valorVenda - p.valorCompra) / p.valorCompra) * 100;
                return [
                    p.codigo,
                    p.nome,
                    p.quantidade.toString(),
                    `R$ ${parseFloat(p.valorCompra).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    `R$ ${parseFloat(p.valorVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    `${margem.toFixed(1)}%`
                ];
            });

            doc.autoTable({
                startY: yPosition,
                head: [['Código', 'Nome', 'Qtd', 'Valor Compra', 'Valor Venda', 'Margem']],
                body: estoqueData,
                theme: 'grid',
                headStyles: {
                    fillColor: [155, 89, 182],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: 0
                },
                margin: { left: 14, right: 14 }
            });
        }

        // ====== RESUMO FINANCEIRO ======
        const totais = storage.calcularTotais();
        const ultimoY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yPosition;
        
        doc.addPage();
        doc.setFontSize(14);
        doc.text('RESUMO FINANCEIRO', 14, 20);

        const resumoData = [
            ['Total de Entradas', `R$ ${parseFloat(totais.totalEntradas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ['Total de Saídas', `R$ ${parseFloat(totais.totalSaidas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ['LUCRO LÍQUIDO', `R$ ${parseFloat(totais.lucro).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ['Margem de Lucro', `${((totais.lucro / totais.totalEntradas) * 100).toFixed(1)}%`],
            ['Quantidade de Entradas', totais.qtdEntradas.toString()],
            ['Quantidade de Saídas', totais.qtdSaidas.toString()],
            ['Total de Movimentações', totais.totalMovimentacoes.toString()]
        ];

        doc.autoTable({
            startY: 30,
            head: [['Descrição', 'Valor']],
            body: resumoData,
            theme: 'grid',
            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: 'bold'
            },
            bodyStyles: {
                textColor: 0
            },
            margin: { left: 14, right: 14 }
        });

        // Download do PDF
        const nomeArquivo = `PnArte_${dataExportacao.toISOString().split('T')[0]}.pdf`;
        doc.save(nomeArquivo);

        this.mostrarToast('PDF exportado com sucesso!', 'success');
    }

    /**
     * Pede confirmação para limpar todos os dados
     */
    pedirConfirmacaoLimpeza() {
    console.log('BOTÃO LIMPAR CLICADO');
    this.operacaoEmAguardo = 'limpar';
    this.modalMessage.textContent = '⚠️ ATENÇÃO! Isso irá deletar TODOS os dados da aplicação. Essa ação é irreversível! Deseja continuar?';
    this.modal.classList.remove('hidden');
    this.modal.classList.add('active');

}
    /**
     * Executa a operação pendente (no caso, limpar dados)
     */
    executarOperacaoPendente() {
        if (this.operacaoEmAguardo === 'limpar') {
            storage.limparTudo();
            
            // Limpa UI
            financeiro.renderizarTabelas();
            estoque.renderizarTabela();
            dashboard.atualizar();
            
            this.mostrarToast('Todos os dados foram deletados!', 'success');
            this.irParaSecao('dashboard');
        }
        
        this.fecharModal();
        this.operacaoEmAguardo = null;
    }

    /**
     * Fecha o modal
     */
    fecharModal() {
        this.modal.classList.remove('active');
    }

    // ============================================
    // RELATÓRIOS
    // ============================================

    /**
     * Filtra relatórios por período
     */
    filtrarRelatorio(btn) {
        // Remove ativo de todos
        document.querySelectorAll('.relatorio-filtros .btn-secondary').forEach(b => {
            b.classList.remove('active');
        });

        // Ativa o clicado
        btn.classList.add('active');

        const periodo = btn.getAttribute('data-periodo');
        this.renderizarRelatorios(periodo);
    }

    /**
     * Renderiza relatórios por período
     */
    renderizarRelatorios(periodo) {
        const container = document.getElementById('relatorioConteudo');
        const hoje = new Date();
        let dataInicio, dataFim;

        // Define período
        switch (periodo) {
            case 'diario':
                dataInicio = this.formatarData(hoje);
                dataFim = this.formatarData(hoje);
                break;

            case 'semanal':
                dataInicio = new Date(hoje);
                dataInicio.setDate(hoje.getDate() - hoje.getDay());
                dataFim = this.formatarData(hoje);
                dataInicio = this.formatarData(dataInicio);
                break;

            case 'mensal':
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                dataFim = this.formatarData(hoje);
                dataInicio = this.formatarData(dataInicio);
                break;

            case 'anual':
                dataInicio = new Date(hoje.getFullYear(), 0, 1);
                dataFim = this.formatarData(hoje);
                dataInicio = this.formatarData(dataInicio);
                break;
        }

        // Filtra dados
        const entradas = storage.getEntradasPeriodo(dataInicio, dataFim);
        const saidas = storage.getSaidasPeriodo(dataInicio, dataFim);

        // Calcula totais
        const totalEntradas = entradas.reduce((sum, e) => sum + parseFloat(e.valor || 0), 0);
        const totalSaidas = saidas.reduce((sum, s) => sum + parseFloat(s.valor || 0), 0);
        const lucro = totalEntradas - totalSaidas;

        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        // Renderiza HTML
        let html = `
            <div class="resumo-periodo">
                <h4>Período: ${dataInicio} a ${dataFim}</h4>
                <div class="resumo-periodo-grid">
                    <div class="resumo-periodo-item">
                        <span class="resumo-periodo-label">Total Entradas</span>
                        <span class="resumo-periodo-valor" style="color: #2ecc71;">
                            ${formatarMoeda(totalEntradas)}
                        </span>
                    </div>
                    <div class="resumo-periodo-item">
                        <span class="resumo-periodo-label">Total Saídas</span>
                        <span class="resumo-periodo-valor" style="color: #e74c3c;">
                            ${formatarMoeda(totalSaidas)}
                        </span>
                    </div>
                    <div class="resumo-periodo-item">
                        <span class="resumo-periodo-label">Lucro</span>
                        <span class="resumo-periodo-valor" style="color: ${lucro >= 0 ? '#3498db' : '#e74c3c'};">
                            ${formatarMoeda(lucro)}
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Tabela de entradas
        html += '<h4 style="margin: 2rem 0 1rem; color: #2c3e50;">Entradas</h4>';
        if (entradas.length > 0) {
            html += '<table class="table"><thead><tr><th>Data</th><th>Descrição</th><th>Cliente</th><th>Valor</th></tr></thead><tbody>';
            entradas.forEach(e => {
                html += `
                    <tr>
                        <td>${this.formatarData(new Date(e.data))}</td>
                        <td>${e.descricao}</td>
                        <td>${e.cliente}</td>
                        <td style="color: #2ecc71; font-weight: bold;">${formatarMoeda(e.valor)}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        } else {
            html += '<p style="color: #95a5a6; text-align: center;">Nenhuma entrada neste período</p>';
        }

        // Tabela de saídas
        html += '<h4 style="margin: 2rem 0 1rem; color: #2c3e50;">Saídas</h4>';
        if (saidas.length > 0) {
            html += '<table class="table"><thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>';
            saidas.forEach(s => {
                html += `
                    <tr>
                        <td>${this.formatarData(new Date(s.data))}</td>
                        <td><span class="badge-categoria badge-${s.categoria.toLowerCase()}">${s.categoria}</span></td>
                        <td>${s.descricao}</td>
                        <td style="color: #e74c3c; font-weight: bold;">${formatarMoeda(s.valor)}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        } else {
            html += '<p style="color: #95a5a6; text-align: center;">Nenhuma saída neste período</p>';
        }

        container.innerHTML = html;
    }

    /**
     * Formata data para string DD/MM/YYYY
     */
    formatarData(data) {
        if (typeof data === 'string') {
            data = new Date(data + 'T00:00:00');
        }
        return data.toLocaleDateString('pt-BR');
    }

    /**
     * Mostra notificação toast
     */
    mostrarToast(mensagem, tipo = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = mensagem;
        toast.classList.remove('hidden', 'error', 'warning', 'info');
        toast.classList.add(tipo);

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Aguarda login ser inicializado
    const inicializarApp = setInterval(() => {
        if (typeof login !== 'undefined' && login !== null) {
            clearInterval(inicializarApp);
            
            // Cria instância global da app
            const app = new App();
            
            // Torna disponível globalmente para debugging
            window.app = app;
            window.storage = storage;
            window.dashboard = dashboard;
            window.financeiro = financeiro;
            window.estoque = estoque;
            
            console.log('PnArte iniciado com sucesso! 🚀');
        }
    }, 50);
    
    // Timeout para evitar espera infinita
    setTimeout(() => clearInterval(inicializarApp), 10000);
});

    console.log('%c✅ PnArte Sistema Financeiro Iniciado', 'color: #2ecc71; font-size: 14px; font-weight: bold;');
    console.log('%cObjetos globais disponíveis:', 'color: #3498db; font-size: 12px;');
    console.log('- app (controlador principal)');
    console.log('- storage (persistência de dados)');
    console.log('- dashboard (lógica do dashboard)');
    console.log('- financeiro (entradas e saídas)');
    console.log('- estoque (gestão de estoque)');
