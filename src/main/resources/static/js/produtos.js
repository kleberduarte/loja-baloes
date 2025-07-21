// produtos.js
import { getToken, authenticatedHeaders } from "./auth.js";
import { showAlert, esconderTodas } from "./ui.js";

const API_URL = "http://localhost:8080";

export function mostrarProdutos() {
  esconderTodas();
  const section = document.getElementById("produtoSection");
  if (!section) return console.warn("❌ Seção produtoSection não encontrada");
  section.style.display = "block";
  carregarProdutos();
}

export function carregarProdutos(endpoint = "/api/produtos") {
  fetch(`${API_URL}${endpoint}`, {
    headers: authenticatedHeaders()
  })
    .then(res => res.ok ? res.json() : Promise.reject("Erro ao buscar produtos"))
    .then(renderizarTabela)
    .catch(err => showAlert("Erro: " + err, "danger"));
}

export function filtrarPorNome() {
  const nome = document.getElementById("filtroNome")?.value.trim();
  if (!nome) return showAlert("Digite um nome para buscar.", "warning");
  carregarProdutos(`/api/produtos/buscar?nome=${encodeURIComponent(nome)}`);
}

export function filtrarPorCategoria() {
  const categoria = document.getElementById("filtroCategoria")?.value;
  if (!categoria) return showAlert("Escolha uma categoria válida.", "warning");
  carregarProdutos(`/api/produtos/categoria?categoria=${encodeURIComponent(categoria)}`);
}

export function mostrarKits() {
  carregarProdutos("/api/produtos/kits");
}

export function setupFormularioProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Detecta se é atualização ou cadastro
    const produtoId = form.getAttribute("data-edit-id");

    const produto = {
      nome: document.getElementById("produtoNome")?.value,
      descricao: document.getElementById("produtoDescricao")?.value,
      preco: parseFloat(document.getElementById("produtoPreco")?.value),
      estoque: parseInt(document.getElementById("produtoEstoque")?.value),
      categoria: document.getElementById("produtoCategoria")?.value,
      kit: document.getElementById("produtoKit")?.checked
    };

    if (produtoId) {
      // Atualizar produto
      editarProduto(produtoId, produto);
    } else {
      // Cadastrar novo produto
      cadastrarProduto(produto);
    }
  });
}

// Função para cadastrar produto
function cadastrarProduto(produto) {
  fetch(`${API_URL}/api/produtos`, {
    method: "POST",
    headers: authenticatedHeaders(),
    body: JSON.stringify(produto)
  })
    .then(res => res.ok ? res.json() : Promise.reject("Erro ao cadastrar produto"))
    .then(() => {
      showAlert("Produto cadastrado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch(err => showAlert("Erro: " + err, "danger"));
}

// Função para editar produto
export function editarProduto(id, produto) {
  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "PUT",
    headers: {
      ...authenticatedHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
  })
    .then(res => {
      if (res.ok) return res.json();
      else return res.json().then(e => Promise.reject(e.message || "Erro ao atualizar produto"));
    })
    .then(() => {
      showAlert("Produto atualizado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch(err => showAlert("Erro: " + err, "danger"));
}

// Função para preencher o formulário para edição
export function preencherFormularioParaEdicao(produto) {
  const form = document.getElementById("formProduto");
  if (!form) return;

  document.getElementById("produtoNome").value = produto.nome || "";
  document.getElementById("produtoDescricao").value = produto.descricao || "";
  document.getElementById("produtoPreco").value = produto.preco || "";
  document.getElementById("produtoEstoque").value = produto.estoque || "";
  document.getElementById("produtoCategoria").value = produto.categoria || "";
  document.getElementById("produtoKit").checked = produto.kit || false;

  // Marca o formulário como edição com o id do produto
  form.setAttribute("data-edit-id", produto.id);

  // Trocar texto do botão para "Atualizar Produto"
  form.querySelector("button[type=submit]").textContent = "Atualizar Produto";
}

// Função para resetar formulário e voltar para cadastro
function resetFormProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.reset();
  form.removeAttribute("data-edit-id");
  form.querySelector("button[type=submit]").textContent = "Cadastrar Produto";
}

// Função para excluir produto pelo ID
export function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "DELETE",
    headers: authenticatedHeaders()
  })
    .then(res => {
      if (res.ok) {
        showAlert("Produto excluído com sucesso!", "success");
        carregarProdutos(); // Atualiza a lista após exclusão
      } else {
        return Promise.reject("Erro ao excluir produto");
      }
    })
    .catch(err => showAlert("Erro: " + err, "danger"));
}

function renderizarTabela(produtos) {
  const tabela = document.getElementById("listaProdutos");
  if (!tabela) return;

  // Limpa a tabela
  tabela.innerHTML = "";

  produtos.forEach(p => {
    tabela.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.descricao}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>${p.categoria || "-"}</td>
        <td>${p.kit ? "✅" : "❌"}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="editarProdutoUI(${p.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirProduto(${p.id})">Excluir</button>
        </td>
      </tr>`;
  });
}

// Função para buscar produto pelo id e abrir no formulário para edição (chamada pelo botão editar na tabela)
export function editarProdutoUI(id) {
  fetch(`${API_URL}/api/produtos/${id}`, {
    headers: authenticatedHeaders()
  })
    .then(res => res.ok ? res.json() : Promise.reject("Produto não encontrado"))
    .then(produto => {
      preencherFormularioParaEdicao(produto);
      // Mostra a seção de produtos (caso esteja oculta)
      const section = document.getElementById("produtoSection");
      if (section) section.style.display = "block";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => showAlert("Erro: " + err, "danger"));
}
