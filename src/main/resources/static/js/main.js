// main.js

// 📦 Importações de módulos usados na aplicação
import { checkLoginRedirect, setupLoginForm, logout } from "./auth.js"; // autenticação
import { showAlert, esconderTodas, destacarMenu } from "./ui.js"; // utilitários de interface
import {
  mostrarProdutos,
  setupFormularioProduto,
  filtrarPorNome,
  filtrarPorCategoria,
  mostrarKits,
  carregarProdutos,
  excluirProduto,
  editarProdutoUI
} from "./produtos.js";
import { inicializarVendaAvancada } from "./vendas.js"; // lógica de vendas
import {
  mostrarFuncionarios,
  setupFormularioFuncionario,
  excluirFuncionario // ✅ agora importado
} from "./funcionarios.js";

// ✅ Expõe funções globalmente para uso em onclick no HTML
window.excluirProduto = excluirProduto;
window.editarProdutoUI = editarProdutoUI;
window.excluirFuncionario = excluirFuncionario; // ✅ corrigido

document.addEventListener("DOMContentLoaded", () => {
  // 🔐 Protege rotas verificando se o usuário está autenticado
  checkLoginRedirect();

  const path = window.location.pathname;
  console.log("📄 Caminho atual:", path);

  // 🔐 Se estiver na tela de login, inicializa apenas o formulário
  if (path.includes("login.html")) {
    console.log("🧭 Página de login detectada");
    setupLoginForm(showAlert);
    return;
  }

  // Referências das seções
  const produtoSection = document.getElementById("produtoSection");
  const vendaSection = document.getElementById("vendaSection");
  const funcionarioSection = document.getElementById("funcionarioSection");

  console.log("Seções encontradas:", {
    produtoSection,
    vendaSection,
    funcionarioSection,
  });

  // Referências dos links de menu
  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const btnLogout = document.getElementById("btnLogout");

  // Função para alternar entre seções
  function mostrarSecao(idSecao, callback, menuId) {
    console.log(`🔄 Alternando para seção: ${idSecao}`);
    esconderTodas();
    destacarMenu(menuId);

    const secao = document.getElementById(idSecao);
    if (secao) {
      secao.style.display = "block";
      console.log(`✅ Seção ${idSecao} exibida`);
      if (typeof callback === "function") {
        console.log(`📦 Executando lógica da seção: ${idSecao}`);
        callback();
      }
    } else {
      console.warn(`⚠️ Seção ${idSecao} não encontrada`);
    }
  }

  // Adiciona eventos de filtro da seção produtos
  function adicionarEventosFiltros() {
    const btnBuscarNome = document.getElementById("btnBuscarNome");
    const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
    const btnVerKits = document.getElementById("btnMostrarKits");
    const btnTodos = document.getElementById("btnTodosProdutos");

    if (btnBuscarNome)
      btnBuscarNome.addEventListener("click", (e) => {
        e.preventDefault();
        filtrarPorNome();
      });

    if (btnBuscarCategoria)
      btnBuscarCategoria.addEventListener("click", (e) => {
        e.preventDefault();
        filtrarPorCategoria();
      });

    if (btnVerKits)
      btnVerKits.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("🔍 Botão 'Ver Kits' clicado");
        mostrarKits();
      });

    if (btnTodos)
      btnTodos.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("🧃 Botão 'Todos os Produtos' clicado");
        carregarProdutos();
      });
  }

  // Eventos de navegação
  linkProdutos?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Produtos clicado");
    mostrarSecao("produtoSection", () => {
      mostrarProdutos();
      setupFormularioProduto();

      // Espera botão de kits estar presente
      const esperaBotaoKits = setInterval(() => {
        if (document.getElementById("btnMostrarKits")) {
          adicionarEventosFiltros();
          clearInterval(esperaBotaoKits);
          console.log("✅ Eventos dos filtros adicionados com sucesso.");
        }
      }, 100);
    }, "linkProdutos");
  });

  linkVendas?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Vendas clicado");
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  });

  linkFuncionarios?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Funcionários clicado");
    mostrarSecao("funcionarioSection", () => {
      mostrarFuncionarios();
      setupFormularioFuncionario();
    }, "linkFuncionarios");
  });

  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔓 Logout solicitado");
    logout();
  });

  // Inicializa seções já visíveis no carregamento
  if (document.getElementById("formProduto")) {
    console.log("🧾 Formulário de produtos detectado — inicializando");
    setupFormularioProduto();
  }

  // Seção padrão ao carregar página
  if (vendaSection) {
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  } else if (funcionarioSection) {
    mostrarSecao("funcionarioSection", () => {
      mostrarFuncionarios();
      setupFormularioFuncionario();
    }, "linkFuncionarios");
  } else if (produtoSection) {
    mostrarSecao("produtoSection", () => {
      mostrarProdutos();
      setupFormularioProduto();
      setTimeout(() => {
        adicionarEventosFiltros();
      }, 300);
    }, "linkProdutos");
  }
});
