/* ============================================
   FINANCEIRO.JS
   
   Responsável por:
   - Gerenciar entradas (adicionar, editar, deletar)
   - Gerenciar saídas (adicionar, editar, deletar)
   - Renderizar tabelas
   - Processar relatórios
   ============================================ */

class Financeiro {
    constructor() {
        // Elementos de formulário de ENTRADAS
        this.formEntrada = document.getElementById('formEntrada');
        this.formEntradaContainer = document.getElementById('formEntradaContainer');
        this.btnNovaEntrada = document.getElementById('btnNovaEntrada');
        this.cancelarEntrada = document.getElementById('cancelarEntrada');

        // Elementos de formulário de SAÍDAS
        this.formSaida = document.getElementById('formSaida');
        this.formSaidaContainer = document.getElementById('formSaidaContainer');
        this.btnNovaSaida = document.getElementById('btnNovaSaida');
        this.cancelarSaida = document.getElementById('cancelarSaida');

        // Tabelas
        this.tabelaEntradas = document.getElementById('tabelaEntradas').getElementsByTagName('tbody')[0];
        this.tabelaSaidas = document.getElementById('tabelaSaidas').getElementsByTagName('tbody')[0];

        // Modal
        this.modal = document.getElementById('modalConfirm');
        this.modalMessage = document.getElementById('modalMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Variáveis de controle
        this.modoEdicao = false;
        this.entradaEmEdicao = null;
        this.saidaEmEdicao = null;
        this.itemParaDeletar = null;
        this.tipoDelete = null; // 'entrada' ou 'saida'

        this.inicializarEventos();
        this.renderizarTabelas();
    }

    /**
     * Inicializa todos os listeners de eventos
     */
    inicializarEventos() {
        // ENTRADAS
        this.btnNovaEntrada.addEventListener('click', () => this.mostrarFormularioEntrada());
        this.cancelarEntrada.addEventListener('click', () => this.ocultarFormularioEntrada());
        this.formEntrada.addEventListener('submit', (e) => this.salvarEntrada(e));

        // SAÍDAS
        this.btnNovaSaida.addEventListener('click', () => this.mostrarFormularioSaida());
        this.cancelarSaida.addEventListener('click', () => this.ocultarFormularioSaida());
        this.formSaida.addEventListener('submit', (e) => this.salvarSaida(e));

        // MODAL
        this.confirmBtn.addEventListener('click', () => this.confirmarDelecao());
        this.cancelBtn.addEventListener('click', () => this.cancelarDelecao());
    }

    // ============================================
    // ENTRADAS
    // ============================================

    /**
     * Mostra o formulário de entrada
     */
    mostrarFormularioEntrada() {
        this.modoEdicao = false;
        this.entradaEmEdicao = null;

        // Limpa formulário
        this.formEntrada.reset();
        document.getElementById('entradaId').value = '';

        // Define data atual
        document.getElementById('entradaData').valueAsDate = new Date();

        // Mostra container
        this.formEntradaContainer.classList.remove('hidden');

        // Foca no primeiro campo
        document.getElementById('entradaData').focus();
    }

    /**
     * Oculta o formulário de entrada
     */
    ocultarFormularioEntrada() {
        this.formEntradaContainer.classList.add('hidden');
        this.formEntrada.reset();
    }

    /**
     * Salva uma entrada (nova ou editada)
     */
    salvarEntrada(e) {
        e.preventDefault();

        const dados = {
            data: document.getElementById('entradaData').value,
            descricao: document.getElementById('entradaDescricao').value,
            cliente: document.getElementById('entradaCliente').value,
            valor: parseFloat(document.getElementById('entradaValor').value),
            formaPagamento: document.getElementById('entradaFormaPagamento').value
        };

        const id = document.getElementById('entradaId').value;

        if (id) {
            // EDITAR
            storage.updateEntrada(parseInt(id), dados);
            this.mostrarToast('Entrada atualizada com sucesso!', 'success');
        } else {
            // ADICIONAR
            storage.addEntrada(dados);
            this.mostrarToast('Entrada adicionada com sucesso!', 'success');
        }

        this.ocultarFormularioEntrada();
        this.renderizarTabelaEntradas();
        dashboard.atualizar();
    }

    /**
     * Carrega entrada para edição
     */
    editarEntrada(id) {
        const entrada = storage.getEntradaById(id);
        if (!entrada) return;

        this.modoEdicao = true;
        this.entradaEmEdicao = entrada;

        // Preenche formulário
        document.getElementById('entradaId').value = entrada.id;
        document.getElementById('entradaData').value = entrada.data;
        document.getElementById('entradaDescricao').value = entrada.descricao;
        document.getElementById('entradaCliente').value = entrada.cliente;
        document.getElementById('entradaValor').value = entrada.valor;
        document.getElementById('entradaFormaPagamento').value = entrada.formaPagamento;

        this.formEntradaContainer.classList.remove('hidden');
        document.getElementById('entradaData').focus();
    }

    /**
     * Solicita confirmação para deletar entrada
     */
    confirmarDeleteEntrada(id) {
        this.itemParaDeletar = id;
        this.tipoDelete = 'entrada';
        const entrada = storage.getEntradaById(id);

        if (!entrada) {
            this.mostrarToast('Erro ao carregar entrada', 'error');
            return;
        }

        this.modalMessage.textContent = `Deseja realmente deletar a entrada "${entrada.descricao}" de ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(entrada.valor)}?`;

        this.modal.classList.remove('hidden');
        this.modal.classList.add('active');
    }

    /**
     * Renderiza tabela de entradas
     */
    renderizarTabelaEntradas() {
        const entradas = storage.getEntradas();
        this.tabelaEntradas.innerHTML = '';

        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        const formatarData = (data) => {
            return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
        };

        const formasPagamento = {
            'dinheiro': 'Dinheiro',
            'credito': 'Crédito',
            'debito': 'Débito',
            'transferencia': 'Transferência',
            'cheque': 'Cheque'
        };

        if (entradas.length === 0) {
            this.tabelaEntradas.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #95a5a6;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        Nenhuma entrada registrada
                    </td>
                </tr>
            `;
            return;
        }

        entradas.forEach(entrada => {
            const row = document.createElement('tr');
            
            // Constrói os botões de ação apenas se for admin
            let botoesAcao = '';
            if (typeof login !== 'undefined' && login && login.ehAdmin()) {
                botoesAcao = `
                    <div class="table-actions">
                        <button class="btn-edit" onclick="financeiro.editarEntrada(${entrada.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="financeiro.confirmarDeleteEntrada(${entrada.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }

            row.innerHTML = `
                <td class="data-formatada">${formatarData(entrada.data)}</td>
                <td>${entrada.descricao}</td>
                <td>${entrada.cliente}</td>
                <td class="valor-positivo">${formatarMoeda(entrada.valor)}</td>
                <td>
                    <span class="badge-pagamento badge-${entrada.formaPagamento}">
                        ${formasPagamento[entrada.formaPagamento] || entrada.formaPagamento}
                    </span>
                </td>
                <td>
                    ${botoesAcao}
                </td>
            `;
            this.tabelaEntradas.appendChild(row);
        });
    }

    // ============================================
    // SAÍDAS
    // ============================================

    /**
     * Mostra o formulário de saída
     */
    mostrarFormularioSaida() {
        this.modoEdicao = false;
        this.saidaEmEdicao = null;

        this.formSaida.reset();
        document.getElementById('saidaId').value = '';

        document.getElementById('saidaData').valueAsDate = new Date();
        this.formSaidaContainer.classList.remove('hidden');
        document.getElementById('saidaData').focus();
    }

    /**
     * Oculta o formulário de saída
     */
    ocultarFormularioSaida() {
        this.formSaidaContainer.classList.add('hidden');
        this.formSaida.reset();
    }

    /**
     * Salva uma saída (nova ou editada)
     */
    salvarSaida(e) {
        e.preventDefault();

        const dados = {
            data: document.getElementById('saidaData').value,
            categoria: document.getElementById('saidaCategoria').value,
            descricao: document.getElementById('saidaDescricao').value,
            valor: parseFloat(document.getElementById('saidaValor').value)
        };

        const id = document.getElementById('saidaId').value;

        if (id) {
            storage.updateSaida(parseInt(id), dados);
            this.mostrarToast('Saída atualizada com sucesso!', 'success');
        } else {
            storage.addSaida(dados);
            this.mostrarToast('Saída adicionada com sucesso!', 'success');
        }

        this.ocultarFormularioSaida();
        this.renderizarTabelaSaidas();
        dashboard.atualizar();
    }

    /**
     * Carrega saída para edição
     */
    editarSaida(id) {
        const saida = storage.getSaidaById(id);
        if (!saida) return;

        this.saidaEmEdicao = saida;
        document.getElementById('saidaId').value = saida.id;
        document.getElementById('saidaData').value = saida.data;
        document.getElementById('saidaCategoria').value = saida.categoria;
        document.getElementById('saidaDescricao').value = saida.descricao;
        document.getElementById('saidaValor').value = saida.valor;

        this.formSaidaContainer.classList.remove('hidden');
        document.getElementById('saidaData').focus();
    }

    /**
     * Solicita confirmação para deletar saída
     */
    confirmarDeleteSaida(id) {
        this.itemParaDeletar = id;
        this.tipoDelete = 'saida';
        const saida = storage.getSaidaById(id);

        this.modalMessage.textContent = `Deseja realmente deletar a saída "${saida.descricao}" (${saida.categoria}) de ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(saida.valor)}?`;

        this.modal.classList.remove('hidden');
        this.modal.classList.add('active');
    }

    /**
     * Renderiza tabela de saídas
     */
    renderizarTabelaSaidas() {
        const saidas = storage.getSaidas();
        this.tabelaSaidas.innerHTML = '';

        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        const formatarData = (data) => {
            return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
        };

        if (saidas.length === 0) {
            this.tabelaSaidas.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #95a5a6;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        Nenhuma saída registrada
                    </td>
                </tr>
            `;
            return;
        }

        saidas.forEach(saida => {
            const row = document.createElement('tr');
            
            // Constrói os botões de ação apenas se for admin
            let botoesAcao = '';
            if (typeof login !== 'undefined' && login && login.ehAdmin()) {
                botoesAcao = `
                    <div class="table-actions">
                        <button class="btn-edit" onclick="financeiro.editarSaida(${saida.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="financeiro.confirmarDeleteSaida(${saida.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }

            row.innerHTML = `
                <td class="data-formatada">${formatarData(saida.data)}</td>
                <td>
                    <span class="badge-categoria badge-${saida.categoria.toLowerCase()}">
                        ${saida.categoria}
                    </span>
                </td>
                <td>${saida.descricao}</td>
                <td class="valor-negativo">${formatarMoeda(saida.valor)}</td>
                <td>
                    ${botoesAcao}
                </td>
            `;
            this.tabelaSaidas.appendChild(row);
        });
    }

    // ============================================
    // MODAL E DELECÃO
    // ============================================

    /**
     * Confirma e executa a delecção
     */
    confirmarDelecao() {
        if (this.tipoDelete === 'entrada') {
            storage.deleteEntrada(this.itemParaDeletar);
            this.renderizarTabelaEntradas();
            this.mostrarToast('Entrada deletada com sucesso!', 'success');
        } else if (this.tipoDelete === 'saida') {
            storage.deleteSaida(this.itemParaDeletar);
            this.renderizarTabelaSaidas();
            this.mostrarToast('Saída deletada com sucesso!', 'success');
        }

        this.modal.classList.remove('active');
        this.modal.classList.add('hidden');
        dashboard.atualizar();
    }

    /**
     * Cancela a delecção
     */
    cancelarDelecao() {
        this.modal.classList.remove('active');
        this.modal.classList.add('hidden');
        this.itemParaDeletar = null;
        this.tipoDelete = null;
    }

    // ============================================
    // RENDERIZAÇÃO
    // ============================================

    /**
     * Renderiza ambas as tabelas
     */
    renderizarTabelas() {
        this.renderizarTabelaEntradas();
        this.renderizarTabelaSaidas();
    }

    // ============================================
    // UTILITÁRIOS
    // ============================================

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

// Cria instância global
const financeiro = new Financeiro();
