import { getToken, authenticatedHeaders } from "./auth.js";
import { showAlert, esconderTodas } from "./ui.js";

const API_URL = "http://localhost:8080";

// Mostra a seção produtos, exibe a seção e carrega dados + configura filtros
export function mostrarProdutos() {
  esconderTodas();
  const section = document.getElementById("produtoSection");
  if (!section) return console.warn("❌ Seção produtoSection não encontrada");
  section.style.display = "block";

  carregarProdutos();  // Carrega todos os produtos
  adicionarEventosFiltros();
  setupFormularioProduto();
}

// Carrega produtos (todos ou com endpoint customizado)
export function carregarProdutos(endpoint = "/api/produtos") {
  fetch(`${API_URL}${endpoint}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao buscar produtos");
      }
      return res.json();
    })
    .then((produtos) => {
      renderizarTabela(produtos);
      vincularEventosAcoes(produtos);
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// --- Filtros ---
export function buscarPorCodigoOuNome() {
  const valor = document.getElementById("filtroCodigoNome")?.value.trim();
  if (!valor) return showAlert("Digite um código ou nome.", "warning");

  carregarProdutos(`/api/produtos/buscar?busca=${encodeURIComponent(valor)}`);
}

export function filtrarPorCategoria() {
  const categoria = document.getElementById("filtroCategoria")?.value;
  if (!categoria) return showAlert("Escolha uma categoria válida.", "warning");
  carregarProdutos(`/api/produtos/categoria?categoria=${encodeURIComponent(categoria)}`);
}

export function mostrarKits() {
  carregarProdutos("/api/produtos/kits");
}

// Adiciona eventos aos botões dos filtros — chamado dentro de mostrarProdutos
function adicionarEventosFiltros() {
  const btnBuscarCodigoNome = document.getElementById("btnBuscarCodigoNome");
  const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
  const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");
  const btnVerKits = document.getElementById("btnMostrarKits");
  const btnTodos = document.getElementById("btnTodosProdutos");

  btnBuscarCodigoNome?.addEventListener("click", buscarPorCodigoOuNome);
  btnBuscarCategoria?.addEventListener("click", filtrarPorCategoria);
  btnBuscarCodigo?.addEventListener("click", buscarPorCodigo);
  btnVerKits?.addEventListener("click", mostrarKits);
  btnTodos?.addEventListener("click", () => carregarProdutos());
}

// --- Formulário de cadastro / edição ---
export function setupFormularioProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.removeEventListener("submit", submitHandler);
  form.addEventListener("submit", submitHandler);
}

function submitHandler(e) {
  e.preventDefault();

  toggleBotaoSubmit(true);

  const form = e.target;
  const produto = capturarDadosFormulario();

  const validacao = validarProduto(produto);
  if (!validacao.valido) {
    toggleBotaoSubmit(false);
    return showAlert(validacao.mensagem, "warning");
  }

  const produtoId = form.getAttribute("data-edit-id");
  if (produtoId) {
    editarProduto(produtoId, produto);
  } else {
    cadastrarProduto(produto);
  }
}

function capturarDadosFormulario() {
  return {
    codigo: document.getElementById("produtoIdCadastro")?.value.trim(),
    nome: document.getElementById("produtoNome")?.value.trim(),
    descricao: document.getElementById("produtoDescricao")?.value.trim(),
    preco: parseFloat(document.getElementById("produtoPreco")?.value),
    estoque: parseInt(document.getElementById("produtoEstoque")?.value),
    categoria: document.getElementById("produtoCategoria")?.value.trim(),
    kit: document.getElementById("produtoKit")?.checked,
  };
}

function validarProduto(produto) {
  if (!produto.codigo) return { valido: false, mensagem: "Código é obrigatório." };
  if (!produto.nome) return { valido: false, mensagem: "Nome é obrigatório." };
  if (!produto.descricao) return { valido: false, mensagem: "Descrição é obrigatória." };
  if (isNaN(produto.preco) || produto.preco < 0) return { valido: false, mensagem: "Preço inválido." };
  if (isNaN(produto.estoque) || produto.estoque < 0) return { valido: false, mensagem: "Estoque inválido." };
  return { valido: true };
}

function cadastrarProduto(produto) {
  fetch(`${API_URL}/api/produtos`, {
    method: "POST",
    headers: {
      ...authenticatedHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  })
    .then(async (res) => {
      toggleBotaoSubmit(false);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao cadastrar produto");
      }
      return res.json();
    })
    .then(() => {
      showAlert("Produto cadastrado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch((err) => {
      toggleBotaoSubmit(false);
      showAlert("Erro: " + err, "danger");
    });
}

export function editarProduto(id, produto) {
  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "PUT",
    headers: {
      ...authenticatedHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  })
    .then(async (res) => {
      toggleBotaoSubmit(false);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao atualizar produto");
      }
      return res.json();
    })
    .then(() => {
      showAlert("Produto atualizado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch((err) => {
      toggleBotaoSubmit(false);
      showAlert("Erro: " + err, "danger");
    });
}

export function preencherFormularioParaEdicao(produto) {
  const form = document.getElementById("formProduto");
  if (!form) return;

  document.getElementById("produtoIdCadastro").value = produto.codigo || "";
  document.getElementById("produtoNome").value = produto.nome || "";
  document.getElementById("produtoDescricao").value = produto.descricao || "";
  document.getElementById("produtoPreco").value = produto.preco ?? "";
  document.getElementById("produtoEstoque").value = produto.estoque ?? "";
  document.getElementById("produtoCategoria").value = produto.categoria || "";
  document.getElementById("produtoKit").checked = produto.kit || false;

  form.setAttribute("data-edit-id", produto.id);
  form.querySelector("button[type=submit]").textContent = "Atualizar Produto";
}

function resetFormProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.reset();
  form.removeAttribute("data-edit-id");
  form.querySelector("button[type=submit]").textContent = "Cadastrar Produto";
}

function toggleBotaoSubmit(disable) {
  const form = document.getElementById("formProduto");
  if (!form) return;

  const btn = form.querySelector("button[type=submit]");
  if (disable) {
    btn.disabled = true;
    btn.textContent = "Carregando...";
  } else {
    btn.disabled = false;
    btn.textContent = form.hasAttribute("data-edit-id") ? "Atualizar Produto" : "Cadastrar Produto";
  }
}

// --- Exclusão ---
export function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "DELETE",
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao excluir produto");
      }
      showAlert("Produto excluído com sucesso!", "success");
      carregarProdutos();
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// --- Renderização tabela ---
function renderizarTabela(produtos) {
  const tabela = document.getElementById("listaProdutos");
  if (!tabela) return;
  tabela.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    tabela.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum produto encontrado.</td></tr>`;
    return;
  }

  produtos.forEach((p) => {
    tabela.innerHTML += `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>${p.descricao}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>${p.categoria || "-"}</td>
        <td>${p.kit ? "✅" : "❌"}</td>
        <td>
          <button id="editar-${p.id}" class="btn btn-sm btn-primary">Editar</button>
          <button id="excluir-${p.id}" class="btn btn-sm btn-danger">Excluir</button>
        </td>
      </tr>`;
  });
}

// Liga os eventos dos botões Editar e Excluir da tabela
function vincularEventosAcoes(produtos) {
  produtos.forEach((produto) => {
    const btnEditar = document.getElementById(`editar-${produto.id}`);
    const btnExcluir = document.getElementById(`excluir-${produto.id}`);

    btnEditar?.addEventListener("click", () => preencherFormularioParaEdicao(produto));
    btnExcluir?.addEventListener("click", () => excluirProduto(produto.id));
  });
}
