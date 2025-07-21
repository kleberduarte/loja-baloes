package com.loja.baloes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.loja.baloes.entity.Produto;
import com.loja.baloes.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repo;

    public List<Produto> listarTodos() {
        return repo.findAll();
    }

    public Produto salvar(Produto p) {
        return repo.save(p);
    }

    public Produto atualizarEstoque(Long id, Integer novoEstoque) {
        Produto p = repo.findById(id).orElseThrow();
        p.setEstoque(novoEstoque);
        return repo.save(p);
    }

    // 🔍 Busca por nome (ex: "kit de doces")
    public List<Produto> buscarPorNome(String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

    // 📁 Busca por categoria (ex: "doces")
    public List<Produto> buscarPorCategoria(String categoria) {
        return repo.findByCategoria(categoria);
    }

    // 🎯 Retorna produtos que fazem parte de kit
    public List<Produto> listarKits() {
        return repo.findByKitTrue();
    }
}