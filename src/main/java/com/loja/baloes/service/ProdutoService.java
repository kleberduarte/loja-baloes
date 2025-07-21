package com.loja.baloes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.loja.baloes.dto.ProdutoDTO;
import com.loja.baloes.entity.Produto;
import com.loja.baloes.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repo;

    // 🧾 Listar todos os produtos
    public List<Produto> listarTodos() {
        return repo.findAll();
    }

    // ➕ Cadastrar novo produto
    public Produto salvar(Produto p) {
        return repo.save(p);
    }

    // 🔄 Atualizar estoque diretamente por ID
    public Produto atualizarEstoque(Long id, Integer novoEstoque) {
        Produto p = repo.findById(id).orElseThrow();
        p.setEstoque(novoEstoque);
        return repo.save(p);
    }

    // 🔍 Buscar por nome (ex: "kit de doces")
    public List<Produto> buscarPorNome(String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

    // 📁 Buscar por categoria (ex: "doces")
    public List<Produto> buscarPorCategoria(String categoria) {
        return repo.findByCategoria(categoria);
    }

    // 🎯 Listar todos os produtos que fazem parte de um kit
    public List<Produto> listarKits() {
        return repo.findByKitTrue();
    }

    // ✏️ Atualizar produto completo/parcialmente via DTO
    public Produto atualizarProduto(Long id, ProdutoDTO dto) {
        Optional<Produto> optionalProduto = repo.findById(id);

        if (optionalProduto.isEmpty()) {
            throw new RuntimeException("Produto com ID " + id + " não encontrado.");
        }

        Produto produto = optionalProduto.get();

        if (dto.getNome() != null) produto.setNome(dto.getNome());
        if (dto.getPreco() != null) produto.setPreco(dto.getPreco());
        if (dto.getDescricao() != null) produto.setDescricao(dto.getDescricao());
        if (dto.getEstoque() != null) produto.setEstoque(dto.getEstoque());
        if (dto.getCategoria() != null) produto.setCategoria(dto.getCategoria());
        if (dto.getKit() != null) produto.setKit(dto.getKit());

        return repo.save(produto);
    }

    // ❌ Excluir produto por ID
    public void excluir(Long id) {
        repo.deleteById(id);
    }
}
