// main.js

import { checkLoginRedirect, setupLoginForm, logout } from "./auth.js";
import { showAlert, esconderTodas, destacarMenu } from "./ui.js";
import {
  mostrarProdutos,
  setupFormularioProduto,
  filtrarPorNome,
  filtrarPorCategoria,
  mostrarKits,
  carregarProdutos,
  excluirProduto,
  editarProdutoUI,
  buscarPorCodigo
} from "./produtos.js";
import { inicializarVendaAvancada } from "./vendas.js";
import {
  mostrarFuncionarios,
  setupFormularioFuncionario,
  excluirFuncionario
} from "./funcionarios.js";

window.excluirProduto = excluirProduto;
window.editarProdutoUI = editarProdutoUI;
window.excluirFuncionario = excluirFuncionario;

let eventosFiltrosAdicionados = false;

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

function adicionarEventosFiltros() {
  if (eventosFiltrosAdicionados) return;
  eventosFiltrosAdicionados = true;

  const btnBuscarNome = document.getElementById("btnBuscarNome");
  const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
  const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");
  const btnVerKits = document.getElementById("btnMostrarKits");
  const btnTodos = document.getElementById("btnTodosProdutos");

  if (btnBuscarNome)
    btnBuscarNome.addEventListener("click", () => filtrarPorNome());

  if (btnBuscarCategoria)
    btnBuscarCategoria.addEventListener("click", () => filtrarPorCategoria());

  if (btnBuscarCodigo)
    btnBuscarCodigo.addEventListener("click", () => {
      console.log("🔎 Busca por código acionada");
      buscarPorCodigo();
    });

  if (btnVerKits)
    btnVerKits.addEventListener("click", () => {
      console.log("🔍 Botão 'Ver Kits' clicado");
      mostrarKits();
    });

  if (btnTodos)
    btnTodos.addEventListener("click", () => {
      console.log("🧃 Botão 'Todos os Produtos' clicado");
      carregarProdutos();
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
  checkLoginRedirect();

  const currentPage = window.location.pathname.split("/").pop();
  console.log("📄 Página atual:", currentPage);

  if (currentPage === "login.html") {
    console.log("🧭 Página de login detectada");
    setupLoginForm(showAlert);
    return;
  }

  const produtoSection = document.getElementById("produtoSection");
  const vendaSection = document.getElementById("vendaSection");
  const funcionarioSection = document.getElementById("funcionarioSection");

  console.log("Seções encontradas:", {
    produtoSection,
    vendaSection,
    funcionarioSection,
  });

  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const btnLogout = document.getElementById("btnLogout");

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

  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔓 Logout solicitado");
    logout();
  });

  if (document.getElementById("formProduto")) {
    console.log("🧾 Formulário de produtos detectado — inicializando");
    setupFormularioProduto();
  }

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
