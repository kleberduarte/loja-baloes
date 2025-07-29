import { checkLoginRedirect, setupLoginForm, logout } from "./auth.js";
import { showAlert, esconderTodas, destacarMenu } from "./ui.js";
import {
  mostrarProdutos,
  setupFormularioProduto,
  carregarProdutos,
  filtrarPorCategoria,
  mostrarKits,
  excluirProduto,
  preencherFormularioParaEdicao,
  buscarPorCodigoOuNome,
} from "./produtos.js";
import { inicializarVendaAvancada } from "./vendas.js";
import {
  mostrarFuncionarios,
  setupFormularioFuncionario,
  excluirFuncionario,
} from "./funcionarios.js";

// Expor funções globais para uso no HTML (botões dinâmicos, etc)
window.excluirProduto = excluirProduto;
window.preencherFormularioParaEdicao = preencherFormularioParaEdicao;
window.excluirFuncionario = excluirFuncionario;

let eventosFiltrosAdicionados = false;

// Função que aguarda a presença de um elemento no DOM
function aguardarElemento(selector, callback, timeout = 5000) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
    return;
  }
  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (timeout > 0) {
    setTimeout(() => observer.disconnect(), timeout);
  }
}

// Adiciona os eventos aos botões de filtros
function adicionarEventosFiltros() {
  if (eventosFiltrosAdicionados) return;
  eventosFiltrosAdicionados = true;

  const btnBuscarCodigoNome = document.getElementById("btnBuscarCodigoNome");
  const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
  const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");
  const btnVerKits = document.getElementById("btnMostrarKits");
  const btnTodos = document.getElementById("btnTodosProdutos");

  // Chamando a função buscarPorCodigoOuNome para o botão de busca
  if (btnBuscarCodigoNome) btnBuscarCodigoNome.addEventListener("click", buscarPorCodigoOuNome);
  if (btnBuscarCategoria) btnBuscarCategoria.addEventListener("click", filtrarPorCategoria);
  if (btnBuscarCodigo) btnBuscarCodigo.addEventListener("click", buscarPorCodigo);
  if (btnVerKits) btnVerKits.addEventListener("click", mostrarKits);
  if (btnTodos) btnTodos.addEventListener("click", () => carregarProdutos());
}

// Função que exibe a seção apropriada
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

// Evento que ocorre quando o DOM é carregado
document.addEventListener("DOMContentLoaded", () => {
  checkLoginRedirect();

  const currentPage = window.location.pathname.split("/").pop();
  console.log("📄 Página atual:", currentPage);

  // Se for a página de login
  if (currentPage === "login.html") {
    console.log("🧭 Página de login detectada");
    setupLoginForm(showAlert);
    return;
  }

  // Obtendo as seções do produto, venda e funcionário
  const produtoSection = document.getElementById("produtoSection");
  const vendaSection = document.getElementById("vendaSection");
  const funcionarioSection = document.getElementById("funcionarioSection");

  console.log("Seções encontradas:", {
    produtoSection,
    vendaSection,
    funcionarioSection,
  });

  // Obtendo os links de navegação
  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const btnLogout = document.getElementById("btnLogout");

  // Eventos para os links de navegação
  linkProdutos?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Produtos clicado");
    mostrarSecao("produtoSection", () => {
      mostrarProdutos();
      setupFormularioProduto();
      aguardarElemento("#btnMostrarKits", () => {
        adicionarEventosFiltros();
        console.log("✅ Eventos dos filtros adicionados com sucesso.");
      });
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

  // Logout
  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔓 Logout solicitado");
    logout();
  });

  // Se estiver no formulário de produto já na carga
  if (document.getElementById("formProduto")) {
    console.log("🧾 Formulário de produtos detectado — inicializando");
    setupFormularioProduto();
  }

  // Ao carregar a página, mostrar a seção apropriada
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
      aguardarElemento("#btnMostrarKits", () => {
        adicionarEventosFiltros();
        console.log("✅ Eventos dos filtros adicionados com sucesso.");
      });
    }, "linkProdutos");
  }
});
