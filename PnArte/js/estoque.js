/* ============================================
   ESTOQUE.JS
   
   Responsável por:
   - Gerenciar produtos de estoque
   - Adicionar, editar, deletar produtos
   - Calcular margem de lucro
   - Renderizar tabela de estoque
   ============================================ */

class Estoque {
    constructor() {
        // Elementos
        this.formEstoque = document.getElementById('formEstoque');
        this.formEstoqueContainer = document.getElementById('formEstoqueContainer');
        this.btnNovoProduto = document.getElementById('btnNovoProduto');
        this.cancelarEstoque = document.getElementById('cancelarEstoque');
        this.tabelaEstoque = document.getElementById('tabelaEstoque').getElementsByTagName('tbody')[0];

        // Modal
        this.modal = document.getElementById('modalConfirm');
        this.modalMessage = document.getElementById('modalMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Controle
        this.produtoParaDeletar = null;

        this.inicializarEventos();
        this.renderizarTabela();
    }

    /**
     * Inicializa listeners de eventos
     */
    inicializarEventos() {
        this.btnNovoProduto.addEventListener('click', () => this.mostrarFormulario());
        this.cancelarEstoque.addEventListener('click', () => this.ocultarFormulario());
        this.formEstoque.addEventListener('submit', (e) => this.salvarProduto(e));

        // Cálculo de margem em tempo real
        const inputCompra = document.getElementById('estoqueValorCompra');
        const inputVenda = document.getElementById('estoqueValorVenda');
        
        inputCompra.addEventListener('change', () => this.calcularMargem());
        inputVenda.addEventListener('change', () => this.calcularMargem());

        this.confirmBtn.addEventListener('click', () => this.confirmarDelecao());
        this.cancelBtn.addEventListener('click', () => this.cancelarDelecao());
    }

    /**
     * Mostra formulário de estoque
     */
    mostrarFormulario() {
        this.formEstoque.reset();
        document.getElementById('estoqueId').value = '';
        this.formEstoqueContainer.classList.remove('hidden');
        document.getElementById('estoqueCodigo').focus();
    }

    /**
     * Oculta formulário de estoque
     */
    ocultarFormulario() {
        this.formEstoqueContainer.classList.add('hidden');
        this.formEstoque.reset();
    }

    /**
     * Salva produto (novo ou editado)
     */
    salvarProduto(e) {
        e.preventDefault();

        const dados = {
            codigo: document.getElementById('estoqueCodigo').value,
            nome: document.getElementById('estoqueNome').value,
            quantidade: parseInt(document.getElementById('estoqueQuantidade').value),
            valorCompra: parseFloat(document.getElementById('estoqueValorCompra').value),
            valorVenda: parseFloat(document.getElementById('estoqueValorVenda').value)
        };

        // Validação
        if (dados.valorVenda < dados.valorCompra) {
            this.mostrarToast('Valor de venda não pode ser menor que valor de compra!', 'error');
            return;
        }

        const id = document.getElementById('estoqueId').value;

        if (id) {
            storage.updateProduto(parseInt(id), dados);
            this.mostrarToast('Produto atualizado com sucesso!', 'success');
        } else {
            storage.addProduto(dados);
            this.mostrarToast('Produto adicionado com sucesso!', 'success');
        }

        this.ocultarFormulario();
        this.renderizarTabela();
        dashboard.atualizar();
    }

    /**
     * Carrega produto para edição
     */
    editarProduto(id) {
        const produto = storage.getProdutoById(id);
        if (!produto) return;

        document.getElementById('estoqueId').value = produto.id;
        document.getElementById('estoqueCodigo').value = produto.codigo;
        document.getElementById('estoqueNome').value = produto.nome;
        document.getElementById('estoqueQuantidade').value = produto.quantidade;
        document.getElementById('estoqueValorCompra').value = produto.valorCompra;
        document.getElementById('estoqueValorVenda').value = produto.valorVenda;

        this.formEstoqueContainer.classList.remove('hidden');
        document.getElementById('estoqueCodigo').focus();
        this.calcularMargem();
    }

    /**
     * Solicita confirmação para deletar produto
     */
    confirmarDeleteProduto(id) {
        this.produtoParaDeletar = id;
        const produto = storage.getProdutoById(id);

        this.modalMessage.textContent = `Deseja realmente deletar o produto "${produto.nome}" (${produto.codigo})?`;
        this.modal.classList.remove('hidden');
        this.modal.classList.add('active');
    }

    /**
     * Confirma e executa delecção
     */
    confirmarDelecao() {
        if (this.produtoParaDeletar) {
            storage.deleteProduto(this.produtoParaDeletar);
            this.renderizarTabela();
            this.mostrarToast('Produto deletado com sucesso!', 'success');
            dashboard.atualizar();
        }
        this.modal.classList.remove('active');
        this.modal.classList.add('hidden');
        this.produtoParaDeletar = null;
    }

    /**
     * Cancela delecção
     */
    cancelarDelecao() {
        this.modal.classList.remove('active');
        this.modal.classList.add('hidden');
        this.produtoParaDeletar = null;
    }

    /**
     * Calcula margem de lucro em tempo real
     */
    calcularMargem() {
        const valorCompra = parseFloat(document.getElementById('estoqueValorCompra').value) || 0;
        const valorVenda = parseFloat(document.getElementById('estoqueValorVenda').value) || 0;

        if (valorCompra > 0 && valorVenda > 0) {
            const margem = ((valorVenda - valorCompra) / valorCompra) * 100;
            const margemResultado = document.querySelector('.margem-resultado');
            
            if (!margemResultado) {
                const div = document.createElement('div');
                div.className = 'margem-resultado show';
                div.innerHTML = `
                    <div class="margem-resultado-valor">
                        <strong>Lucro por unidade:</strong>
                        <span class="margem-resultado-percentual">
                            R$ ${(valorVenda - valorCompra).toFixed(2).replace('.', ',')} (${margem.toFixed(1)}%)
                        </span>
                    </div>
                `;
                this.formEstoque.appendChild(div);
            } else {
                margemResultado.classList.add('show');
                margemResultado.querySelector('.margem-resultado-percentual').textContent =
                    `R$ ${(valorVenda - valorCompra).toFixed(2).replace('.', ',')} (${margem.toFixed(1)}%)`;
            }
        }
    }

    /**
     * Renderiza tabela de estoque
     */
    renderizarTabela() {
        const estoque = storage.getEstoque();
        this.tabelaEstoque.innerHTML = '';

        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        };

        if (estoque.length === 0) {
            this.tabelaEstoque.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #95a5a6;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        Nenhum produto no estoque
                    </td>
                </tr>
            `;
            return;
        }

        estoque.forEach(produto => {
            const totalEstoque = produto.quantidade * produto.valorCompra;
            const margem = ((produto.valorVenda - produto.valorCompra) / produto.valorCompra) * 100;
            
            // Define classe de margem
            let classeMargem = 'margem-low';
            if (margem >= 50) classeMargem = 'margem-high';
            else if (margem >= 25) classeMargem = 'margem-medium';

            // Define classe de quantidade
            let classeQuantidade = 'quantidade-baixo';
            if (produto.quantidade >= 100) classeQuantidade = 'quantidade-alto';
            else if (produto.quantidade >= 50) classeQuantidade = 'quantidade-meio';

            // Constrói os botões de ação apenas se for admin
            let botoesAcao = '';
            if (typeof login !== 'undefined' && login && login.ehAdmin()) {
                botoesAcao = `
                    <div class="table-actions">
                        <button class="btn-edit" onclick="estoque.editarProduto(${produto.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="estoque.confirmarDeleteProduto(${produto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="col-codigo">${produto.codigo}</td>
                <td class="col-nome">${produto.nome}</td>
                <td class="col-quantidade">
                    <span class="${classeQuantidade}">${produto.quantidade} un.</span>
                </td>
                <td class="col-valor valor-compra">${formatarMoeda(produto.valorCompra)}</td>
                <td class="col-valor valor-venda">${formatarMoeda(produto.valorVenda)}</td>
                <td class="col-valor valor-total">${formatarMoeda(totalEstoque)}</td>
                <td class="col-margem">
                    <span class="${classeMargem}">${margem.toFixed(1)}%</span>
                </td>
                <td>
                    ${botoesAcao}
                </td>
            `;
            this.tabelaEstoque.appendChild(row);
        });
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

// Cria instância global
const estoque = new Estoque();
