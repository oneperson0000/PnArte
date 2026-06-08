/* ============================================
   LOGIN.JS
   
   Responsável por:
   - Gerenciar autenticação de usuários
   - Verificar permissões
   - Fazer logout
   ============================================ */

class Login {
    constructor() {
        // Usuários hardcoded (em produção seria no backend)
        this.usuarios = {
            'usuario': {
                nome: 'Usuário',
                senha: '123456',
                tipo: 'usuario' // Pode apenas lançar entradas/saídas
            },
            'admin': {
                nome: 'Administrador',
                senha: 'admin123',
                tipo: 'admin' // Acesso total
            }
        };

        // Elementos do formulário de login
        this.loginContainer = document.getElementById('loginContainer');
        this.loginForm = document.getElementById('loginForm');
        this.loginUsuario = document.getElementById('loginUsuario');
        this.loginSenha = document.getElementById('loginSenha');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginError = document.getElementById('loginError');

        // Elementos da aplicação
        this.appContainer = document.getElementById('container');

        this.inicializarEventos();
        this.verificarSessao();
    }

    /**
     * Inicializa listeners de eventos
     */
    inicializarEventos() {
        this.loginForm.addEventListener('submit', (e) => this.fazerLogin(e));
    }

    /**
     * Verifica se há uma sessão ativa
     */
    verificarSessao() {
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        
        if (usuarioLogado) {
            try {
                const usuario = JSON.parse(usuarioLogado);
                this.usuarioAtual = usuario;
                this.abrirAplicacao();
            } catch (e) {
                this.mostrarTelaLogin();
            }
        } else {
            this.mostrarTelaLogin();
        }
    }

    /**
     * Faz login do usuário
     */
    fazerLogin(e) {
        e.preventDefault();

        const usuario = this.loginUsuario.value.toLowerCase();
        const senha = this.loginSenha.value;

        // Valida credenciais
        if (!this.usuarios[usuario]) {
            this.mostrarErro('Usuário não encontrado');
            return;
        }

        if (this.usuarios[usuario].senha !== senha) {
            this.mostrarErro('Senha incorreta');
            return;
        }

        // Login bem-sucedido
        const usuarioData = {
            login: usuario,
            nome: this.usuarios[usuario].nome,
            tipo: this.usuarios[usuario].tipo
        };

        this.usuarioAtual = usuarioData;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));

        this.loginError.classList.add('hidden');
        this.abrirAplicacao();
    }

    /**
     * Mostra a tela de login
     */
    mostrarTelaLogin() {
        this.loginContainer.classList.remove('hidden');
        this.appContainer.classList.add('hidden');
        this.loginForm.reset();
    }

    /**
     * Abre a aplicação
     */
    abrirAplicacao() {
     console.log("loginContainer:", this.loginContainer);
console.log("appContainer:", this.appContainer);

this.loginContainer.classList.add('hidden');
this.appContainer.classList.remove('hidden');

        // Atualiza informações do usuário na interface
        this.atualizarInfoUsuario();

        // Restringe elementos baseado no tipo de usuário
        this.aplicarRestricoes();
    }

    /**
     * Atualiza informações do usuário na interface
     */
    atualizarInfoUsuario() {
        const userInfo = document.getElementById('userInfo');
        const userType = this.usuarioAtual.tipo === 'admin' ? 'Administrador' : 'Operador';
        userInfo.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${this.usuarioAtual.nome} (${userType})</span>
        `;
    }

    /**
     * Aplica restrições baseado no tipo de usuário
     */
    aplicarRestricoes() {
        if (this.usuarioAtual.tipo === 'admin') {
            return; // Admin tem acesso a tudo
        }

        // Usuários normais
        const estoque = document.querySelector('[data-section="estoque"]');
        const btnLimpar = document.getElementById('btnLimpar');
        const btnExportar = document.getElementById('exportBtn');

        // Esconde acesso a estoque
        if (estoque) {
            estoque.style.display = 'none';
        }

        // Esconde botão de limpar
        if (btnLimpar) {
            btnLimpar.style.display = 'none';
        }

        // Nota: Os botões de editar/deletar serão controlados dinamicamente na renderização
    }

    /**
     * Mostra mensagem de erro
     */
    mostrarErro(mensagem) {
        this.loginError.textContent = mensagem;
        this.loginError.classList.remove('hidden');
        setTimeout(() => {
            this.loginError.classList.add('hidden');
        }, 4000);
    }

    /**
     * Faz logout do usuário
     */
    fazerLogout() {
        localStorage.removeItem('usuarioLogado');
        this.usuarioAtual = null;
        
        // Limpa instâncias globais
        if (window.app) {
            window.app = null;
        }
        
        this.mostrarTelaLogin();
        this.loginForm.reset();
    }

    /**
     * Verifica se o usuário é administrador
     */
    ehAdmin() {
        return this.usuarioAtual && this.usuarioAtual.tipo === 'admin';
    }

    /**
     * Verifica se o usuário pode editar/deletar
     */
    podeEditar() {
        return this.ehAdmin();
    }
}

// Cria instância global APENAS quando o DOM está pronto
let login = null;

document.addEventListener('DOMContentLoaded', () => {
    login = new Login();
    window.login = login;
});
