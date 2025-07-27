// produtos.js
import { getToken, authenticatedHeaders } from "./auth.js";
import { showAlert, esconderTodas } from "./ui.js";

const API_URL = "http://localhost:8080";

// Mostra a seção de produtos e carrega os dados
export function mostrarProdutos() {
  esconderTodas();
  const section = document.getElementById("produtoSection");
  if (!section) return console.warn("❌ Seção produtoSection não encontrada");
  section.style.display = "block";
  carregarProdutos();
}

// Carrega produtos, aceita endpoint personalizado para filtros
export function carregarProdutos(endpoint = "/api/produtos") {
  fetch(`${API_URL}${endpoint}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.message || "Erro ao buscar produtos";
        return Promise.reject(msg);
      }
      return res.json();
    })
    .then((produtos) => {
      renderizarTabela(produtos);
      vincularEventosAcoes(produtos);
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// Filtrar por nome
export function filtrarPorNome() {
  const nome = document.getElementById("filtroNome")?.value.trim();
  if (!nome) return showAlert("Digite um nome para buscar.", "warning");
  carregarProdutos(`/api/produtos/buscar?nome=${encodeURIComponent(nome)}`);
}

// Filtrar por categoria
export function filtrarPorCategoria() {
  const categoria = document.getElementById("filtroCategoria")?.value;
  if (!categoria) return showAlert("Escolha uma categoria válida.", "warning");
  carregarProdutos(`/api/produtos/categoria?categoria=${encodeURIComponent(categoria)}`);
}

// Buscar por código (único produto)
export function buscarPorCodigo() {
  const codigo = document.getElementById("filtroCodigo")?.value.trim();
  if (!codigo) return showAlert("Digite um código para buscar.", "warning");

  fetch(`${API_URL}/api/produtos/codigo/${encodeURIComponent(codigo)}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 404) throw "Produto não encontrado";
      const errorData = await res.json().catch(() => null);
      throw errorData?.message || "Erro ao buscar por código";
    })
    .then((produto) => {
      renderizarTabela([produto]);
      vincularEventosAcoes([produto]);
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// Mostrar apenas kits
export function mostrarKits() {
  carregarProdutos("/api/produtos/kits");
}

// Configura o formulário para cadastro/edição
export function setupFormularioProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  // Remover listener antigo para evitar duplicação
  form.removeEventListener("submit", submitHandler);
  form.addEventListener("submit", submitHandler);
}

// Handler separado para submit
function submitHandler(e) {
  e.preventDefault();

  toggleBotaoSubmit(true); // bloqueia botão para evitar múltiplos submits

  const form = e.target;
  const produto = capturarDadosFormulario();

  const validacao = validarProduto(produto);
  if (!validacao.valido) {
    toggleBotaoSubmit(false); // libera botão se validação falha
    return showAlert(validacao.mensagem, "warning");
  }

  const produtoId = form.getAttribute("data-edit-id");
  if (produtoId) {
    editarProduto(produtoId, produto);
  } else {
    cadastrarProduto(produto);
  }
}

// Captura dados do formulário no objeto
function capturarDadosFormulario() {
  const codigoInput = document.getElementById("produtoIdCadastro");
  const codigo = codigoInput?.value.trim();

  console.log("🧪 INPUT ELEMENT:", codigoInput);
  console.log("📦 Valor capturado do campo 'Código':", `"${codigo}"`);

  return {
    codigo,
    nome: document.getElementById("produtoNome")?.value.trim(),
    descricao: document.getElementById("produtoDescricao")?.value.trim(),
    preco: parseFloat(document.getElementById("produtoPreco")?.value),
    estoque: parseInt(document.getElementById("produtoEstoque")?.value),
    categoria: document.getElementById("produtoCategoria")?.value.trim(),
    kit: document.getElementById("produtoKit")?.checked,
  };
}

// Validação básica dos campos do produto
function validarProduto(produto) {
  if (!produto.codigo) return { valido: false, mensagem: "Código é obrigatório." };
  if (!produto.nome) return { valido: false, mensagem: "Nome é obrigatório." };
  if (!produto.descricao) return { valido: false, mensagem: "Descrição é obrigatória." };
  if (isNaN(produto.preco) || produto.preco < 0) return { valido: false, mensagem: "Preço inválido." };
  if (isNaN(produto.estoque) || produto.estoque < 0) return { valido: false, mensagem: "Estoque inválido." };
  return { valido: true };
}

// Cadastrar novo produto
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

// Editar produto existente
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

// Preenche formulário com dados para edição
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

// Reseta o formulário para o estado inicial
function resetFormProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.reset();
  form.removeAttribute("data-edit-id");
  form.querySelector("button[type=submit]").textContent = "Cadastrar Produto";
}

// Habilita/desabilita botão submit e mostra spinner
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

// Excluir produto com confirmação
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

// Renderiza a tabela de produtos no DOM
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
          <button id="editar-${p.id}" class="btn btn-sm btn-primary me-1">Editar</button>
          <button id="excluir-${p.id}" class="btn btn-sm btn-danger">Excluir</button>
        </td>
      </tr>`;
  });
}

// Vincula eventos aos botões Editar e Excluir da tabela
function vincularEventosAcoes(produtos) {
  produtos.forEach((p) => {
    const btnEditar = document.getElementById(`editar-${p.id}`);
    const btnExcluir = document.getElementById(`excluir-${p.id}`);

    btnEditar?.addEventListener("click", () => editarProdutoUI(p.id));
    btnExcluir?.addEventListener("click", () => excluirProduto(p.id));
  });
}

// Buscar produto e preencher formulário para edição
export function editarProdutoUI(id) {
  fetch(`${API_URL}/api/produtos/${id}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Produto não encontrado");
      }
      return res.json();
    })
    .then((produto) => {
      preencherFormularioParaEdicao(produto);
      const section = document.getElementById("produtoSection");
      if (section) section.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}
