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
  document.getElementById("formProduto")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const produto = {
      nome: document.getElementById("produtoNome")?.value,
      descricao: document.getElementById("produtoDescricao")?.value,
      preco: parseFloat(document.getElementById("produtoPreco")?.value),
      estoque: parseInt(document.getElementById("produtoEstoque")?.value),
      categoria: document.getElementById("produtoCategoria")?.value,
      kit: document.getElementById("produtoKit")?.checked
    };

    fetch(`${API_URL}/api/produtos`, {
      method: "POST",
      headers: authenticatedHeaders(),
      body: JSON.stringify(produto)
    })
      .then(res => res.ok ? res.json() : Promise.reject("Erro ao cadastrar produto"))
      .then(() => {
        showAlert("Produto cadastrado com sucesso!", "success");
        document.getElementById("formProduto").reset();
        carregarProdutos();
      })
      .catch(err => showAlert("Erro: " + err, "danger"));
  });
}

function renderizarTabela(produtos) {
  const tabela = document.getElementById("listaProdutos");
  if (!tabela) return;
  tabela.innerHTML = `
    <tr>
      <th>ID</th><th>Nome</th><th>Descrição</th><th>Preço</th>
      <th>Estoque</th><th>Categoria</th><th>Kit</th>
    </tr>`;
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
      </tr>`;
  });
}
