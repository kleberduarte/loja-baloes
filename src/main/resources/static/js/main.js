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
} from "./produtos.js";
import { inicializarVendaAvancada } from "./vendas.js"; // lógica de vendas
import {
  mostrarFuncionarios,
  setupFormularioFuncionario,
} from "./funcionarios.js";

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

  // 🔍 Log para verificar quais seções foram encontradas
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
    esconderTodas(); // esconde todas as seções visíveis
    destacarMenu(menuId); // destaca o menu ativo

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

  // 🧃 Função para adicionar eventos dos filtros na seção produtos
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

  // 🎯 Eventos de navegação do menu
  linkProdutos?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Produtos clicado");
    mostrarSecao("produtoSection", () => {
      mostrarProdutos();
      setupFormularioProduto();

      // Espera botão de kits estar disponível para adicionar os eventos
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
    mostrarSecao(
      "funcionarioSection",
      () => {
        mostrarFuncionarios();
        setupFormularioFuncionario();
      },
      "linkFuncionarios"
    );
  });

  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔓 Logout solicitado");
    logout();
  });

  // 🧾 Inicializa formulários se a seção estiver presente na página
  if (document.getElementById("formProduto")) {
    console.log("🧾 Formulário de produtos detectado — inicializando");
    setupFormularioProduto();
  }

  // 🚀 Define a seção padrão visível, priorizando vendaSection
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
