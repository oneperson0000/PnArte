/* ============================================
   STORAGE.JS
   
   Responsável por:
   - Salvar dados no LocalStorage
   - Carregar dados do LocalStorage
   - CRUD (Create, Read, Update, Delete)
   - Inicializar dados padrão
   
   CONCEITOS:
   - LocalStorage: banco de dados local do navegador
   - JSON: formato de dados (salva como texto)
   - CRUD: operações básicas de banco de dados
   ============================================ */

class Storage {
    constructor() {
        // Nomes das "tabelas" (chaves do localStorage)
        this.ENTRADAS_KEY = 'pnarte_entradas';
        this.SAIDAS_KEY = 'pnarte_saidas';
        this.ESTOQUE_KEY = 'pnarte_estoque';
        
        // Inicializa os dados
        this.init();
    }

    /**
     * Inicializa o armazenamento
     * Cria estrutura padrão se não existir dados
     */
    init() {
        // Se não existe dados, cria vazio
        if (!localStorage.getItem(this.ENTRADAS_KEY)) {
            this.setEntradas([]);
        }
        if (!localStorage.getItem(this.SAIDAS_KEY)) {
            this.setSaidas([]);
        }
        if (!localStorage.getItem(this.ESTOQUE_KEY)) {
            this.setEstoque([]);
        }
    }

    // ============================================
    // ENTRADAS - CREATE (Adicionar)
    // ============================================
    
    /**
     * Adiciona uma nova entrada
     * @param {Object} entrada - Dados da entrada
     * @returns {Object} Entrada criada com ID
     */
    addEntrada(entrada) {
        const entradas = this.getEntradas();
        
        // Gera ID único (timestamp)
        entrada.id = Date.now();
        
        // Adiciona no array
        entradas.push(entrada);
        
        // Salva no localStorage
        this.setEntradas(entradas);
        
        return entrada;
    }

    // ============================================
    // ENTRADAS - READ (Ler)
    // ============================================
    
    /**
     * Obtém todas as entradas
     * @returns {Array} Array de entradas
     */
    getEntradas() {
        const dados = localStorage.getItem(this.ENTRADAS_KEY);
        return dados ? JSON.parse(dados) : [];
    }

    /**
     * Obtém uma entrada pelo ID
     * @param {number} id - ID da entrada
     * @returns {Object|null} Entrada encontrada ou null
     */
    getEntradaById(id) {
        const entradas = this.getEntradas();
        return entradas.find(e => e.id === id) || null;
    }

    // ============================================
    // ENTRADAS - UPDATE (Atualizar)
    // ============================================
    
    /**
     * Atualiza uma entrada existente
     * @param {number} id - ID da entrada
     * @param {Object} novosDados - Novos dados
     * @returns {Object} Entrada atualizada
     */
    updateEntrada(id, novosDados) {
        const entradas = this.getEntradas();
        const index = entradas.findIndex(e => e.id === id);
        
        if (index !== -1) {
            // Mantém o ID e atualiza os dados
            entradas[index] = { ...entradas[index], ...novosDados, id };
            this.setEntradas(entradas);
            return entradas[index];
        }
        return null;
    }

    // ============================================
    // ENTRADAS - DELETE (Deletar)
    // ============================================
    
    /**
     * Remove uma entrada
     * @param {number} id - ID da entrada
     * @returns {boolean} True se deletado, false se não encontrado
     */
    deleteEntrada(id) {
        let entradas = this.getEntradas();
        const tamanhoAnterior = entradas.length;
        
        // Remove a entrada com ID específico
        entradas = entradas.filter(e => e.id !== id);
        
        this.setEntradas(entradas);
        
        // Retorna true se foi deletado
        return entradas.length < tamanhoAnterior;
    }

    // ============================================
    // HELPER INTERNO - Salvar Entradas
    // ============================================
    
    /**
     * Salva todas as entradas no localStorage
     * @param {Array} entradas - Array de entradas
     */
    setEntradas(entradas) {
        localStorage.setItem(this.ENTRADAS_KEY, JSON.stringify(entradas));
    }

    // ============================================
    // SAÍDAS - CRUD (mesmo padrão de Entradas)
    // ============================================
    
    addSaida(saida) {
        const saidas = this.getSaidas();
        saida.id = Date.now();
        saidas.push(saida);
        this.setSaidas(saidas);
        return saida;
    }

    getSaidas() {
        const dados = localStorage.getItem(this.SAIDAS_KEY);
        return dados ? JSON.parse(dados) : [];
    }

    getSaidaById(id) {
        const saidas = this.getSaidas();
        return saidas.find(s => s.id === id) || null;
    }

    updateSaida(id, novosDados) {
        const saidas = this.getSaidas();
        const index = saidas.findIndex(s => s.id === id);
        
        if (index !== -1) {
            saidas[index] = { ...saidas[index], ...novosDados, id };
            this.setSaidas(saidas);
            return saidas[index];
        }
        return null;
    }

    deleteSaida(id) {
        let saidas = this.getSaidas();
        const tamanhoAnterior = saidas.length;
        saidas = saidas.filter(s => s.id !== id);
        this.setSaidas(saidas);
        return saidas.length < tamanhoAnterior;
    }

    setSaidas(saidas) {
        localStorage.setItem(this.SAIDAS_KEY, JSON.stringify(saidas));
    }

    // ============================================
    // ESTOQUE - CRUD
    // ============================================
    
    addProduto(produto) {
        const estoque = this.getEstoque();
        produto.id = Date.now();
        estoque.push(produto);
        this.setEstoque(estoque);
        return produto;
    }

    getEstoque() {
        const dados = localStorage.getItem(this.ESTOQUE_KEY);
        return dados ? JSON.parse(dados) : [];
    }

    getProdutoById(id) {
        const estoque = this.getEstoque();
        return estoque.find(p => p.id === id) || null;
    }

    updateProduto(id, novosDados) {
        const estoque = this.getEstoque();
        const index = estoque.findIndex(p => p.id === id);
        
        if (index !== -1) {
            estoque[index] = { ...estoque[index], ...novosDados, id };
            this.setEstoque(estoque);
            return estoque[index];
        }
        return null;
    }

    deleteProduto(id) {
        let estoque = this.getEstoque();
        const tamanhoAnterior = estoque.length;
        estoque = estoque.filter(p => p.id !== id);
        this.setEstoque(estoque);
        return estoque.length < tamanhoAnterior;
    }

    setEstoque(estoque) {
        localStorage.setItem(this.ESTOQUE_KEY, JSON.stringify(estoque));
    }

    // ============================================
    // UTILITÁRIOS
    // ============================================
    
    /**
     * Calcula totais financeiros
     * @returns {Object} Objeto com totais
     */
    calcularTotais() {
        const entradas = this.getEntradas();
        const saidas = this.getSaidas();
        
        const totalEntradas = entradas.reduce((sum, e) => sum + parseFloat(e.valor || 0), 0);
        const totalSaidas = saidas.reduce((sum, s) => sum + parseFloat(s.valor || 0), 0);
        const lucro = totalEntradas - totalSaidas;
        
        return {
            totalEntradas,
            totalSaidas,
            lucro,
            qtdEntradas: entradas.length,
            qtdSaidas: saidas.length,
            totalMovimentacoes: entradas.length + saidas.length
        };
    }

    /**
     * Exporta todos os dados como JSON
     * @returns {Object} Objeto com todos os dados
     */
    exportarDados() {
        return {
            entradas: this.getEntradas(),
            saidas: this.getSaidas(),
            estoque: this.getEstoque(),
            dataExportacao: new Date().toISOString()
        };
    }

    /**
     * Importa dados (restaura backup)
     * @param {Object} dados - Dados a importar
     */
    importarDados(dados) {
        if (dados.entradas) this.setEntradas(dados.entradas);
        if (dados.saidas) this.setSaidas(dados.saidas);
        if (dados.estoque) this.setEstoque(dados.estoque);
    }

    /**
     * Limpa TODOS os dados
     * CUIDADO: Essa ação é irreversível!
     */
    limparTudo() {
        localStorage.removeItem(this.ENTRADAS_KEY);
        localStorage.removeItem(this.SAIDAS_KEY);
        localStorage.removeItem(this.ESTOQUE_KEY);
        this.init();
    }

    /**
     * Obtém estatísticas por categoria
     * @returns {Object} Estatísticas de saídas por categoria
     */
    getEstatisticasCategorias() {
        const saidas = this.getSaidas();
        const categorias = {};
        
        saidas.forEach(saida => {
            const categoria = saida.categoria || 'Outros';
            categorias[categoria] = (categorias[categoria] || 0) + parseFloat(saida.valor || 0);
        });
        
        return categorias;
    }

    /**
     * Filtro entradas por período
     * @param {string} dataInicio - Data início (YYYY-MM-DD)
     * @param {string} dataFim - Data fim (YYYY-MM-DD)
     * @returns {Array} Entradas filtradas
     */
    getEntradasPeriodo(dataInicio, dataFim) {
        const entradas = this.getEntradas();
        return entradas.filter(e => e.data >= dataInicio && e.data <= dataFim);
    }

    /**
     * Filtro saídas por período
     * @param {string} dataInicio - Data início (YYYY-MM-DD)
     * @param {string} dataFim - Data fim (YYYY-MM-DD)
     * @returns {Array} Saídas filtradas
     */
    getSaidasPeriodo(dataInicio, dataFim) {
        const saidas = this.getSaidas();
        return saidas.filter(s => s.data >= dataInicio && s.data <= dataFim);
    }
}

// ============================================
// INSTÂNCIA GLOBAL
// ============================================

// Cria uma instância global chamada 'storage'
// Pode ser acessada em qualquer lugar como: storage.getEntradas()
const storage = new Storage();
