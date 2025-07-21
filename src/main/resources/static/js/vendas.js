// vendas.js
import { authenticatedHeaders } from "./auth.js";  // Autenticação com token
import { showAlert } from "./ui.js";               // Alerta na UI

const API_URL = "http://localhost:8080";           // Backend API URL

// Função principal que inicializa a lógica da tela de vendas
export function inicializarVendaAvancada() {
  const itensVenda = [];  // Armazena os itens da venda
  let totalVenda = 0;     // Soma total da venda

  const totalVendaSpan = document.getElementById("totalVenda");

  // Verifica se elemento #totalVenda existe no DOM
  if (!totalVendaSpan) {
    console.warn("⚠️ Elemento #totalVenda não encontrado. VendaAvancada não será inicializada.");
    return;
  }

  console.log("✅ inicializarVendaAvancada() iniciada");

  // 🔄 Evento: carregar dados do produto ao selecionar o ID
  document.getElementById("produtoId")?.addEventListener("change", async function () {
    const id = this.value;
    console.log("🔍 Produto selecionado:", id);

    try {
      const res = await fetch(`${API_URL}/api/produtos/${id}`, {
        headers: authenticatedHeaders(),
      });

      if (!res.ok) throw new Error("Produto não encontrado");

      const p = await res.json();

      // Preenche os campos com os dados do produto
      document.getElementById("vendaNome").value = p.nome;
      document.getElementById("vendaPreco").value = p.preco.toFixed(2);
      document.getElementById("vendaDescricao").value = p.descricao;
      document.getElementById("vendaCategoria").value = p.categoria;
      document.getElementById("vendaKit").value = p.kit ? "Sim" : "Não";

    } catch (error) {
      showAlert("Produto não encontrado", "warning");
      console.error("❌ Erro ao buscar produto:", error);
    }
  });

  // 🧮 Evento: atualizar total do item quando quantidade muda
  document.getElementById("quantidade")?.addEventListener("input", function () {
    const qtd = parseInt(this.value) || 0;
    const preco = parseFloat(document.getElementById("vendaPreco").value) || 0;
    document.getElementById("totalItem").value = (qtd * preco).toFixed(2);
  });

  // ➕ Evento: adicionar item à venda
  document.getElementById("formVenda")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const produtoId = parseInt(document.getElementById("produtoId").value);
    const nome = document.getElementById("vendaNome").value;
    const preco = parseFloat(document.getElementById("vendaPreco").value.replace(",", "."));
    const qtd = parseInt(document.getElementById("quantidade").value);
    const total = qtd * preco;

    console.log("🧾 Adicionando item:", { produtoId, nome, preco, qtd, total });

    if (!produtoId || !qtd || !preco) {
      return showAlert("Preencha todos os campos corretamente.", "warning");
    }

    itensVenda.push({ produtoId, quantidade: qtd });

    document.getElementById("tabelaItens").innerHTML += `
      <tr>
        <td>${nome}</td>
        <td>${qtd}</td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td>R$ ${total.toFixed(2)}</td>
      </tr>
    `;

    // Atualiza total geral da venda
    totalVenda += total;
    totalVendaSpan.innerText = totalVenda.toFixed(2);
    console.log("💰 Total atualizado:", totalVenda.toFixed(2));

    // Limpa formulário e campos de exibição
    this.reset();
    ["vendaNome", "vendaPreco", "vendaDescricao", "vendaCategoria", "vendaKit", "totalItem"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  });

  // ✅ Evento: finalizar venda
  document.getElementById("finalizarVenda")?.addEventListener("click", async function () {
    console.log("🛒 Botão 'Finalizar Venda' clicado");

    if (!itensVenda.length) {
      return showAlert("Adicione pelo menos um item antes de finalizar.", "warning");
    }

    try {
      const res = await fetch(`${API_URL}/api/vendas`, {
        method: "POST",
        headers: {
          ...authenticatedHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ itens: itensVenda })
      });

      if (!res.ok) throw new Error("Erro ao registrar venda.");

      showAlert(`Venda registrada com sucesso! Total: R$ ${totalVenda.toFixed(2)}`, "success");
      console.log("✅ Venda registrada:", itensVenda);

      // Reset total e interface
      totalVenda = 0;
      totalVendaSpan.innerText = "0.00";

      setTimeout(() => {
        location.reload();
      }, 5000);

    } catch (error) {
      console.error("❌ Erro ao finalizar venda:", error);
      showAlert("Erro ao registrar venda.", "danger");
    }
  });
}
