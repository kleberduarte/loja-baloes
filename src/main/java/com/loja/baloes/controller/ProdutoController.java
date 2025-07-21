package com.loja.baloes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.loja.baloes.entity.Produto;
import com.loja.baloes.repository.ProdutoRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository repo;

    // 🧾 Listar todos os produtos
    @GetMapping
    public List<Produto> listar() {
        return repo.findAll();
    }

    // ➕ Cadastrar novo produto
    @PostMapping
    public Produto cadastrar(@RequestBody Produto p) {
        return repo.save(p);
    }

    // 🔍 Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return repo.findById(id)
                .map(produto -> ResponseEntity.ok(produto))
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔄 Atualizar estoque de um produto pelo ID
    @PutMapping("/{id}/estoque")
    public Produto atualizarEstoque(@PathVariable Long id, @RequestBody Integer novoEstoque) {
        Produto produto = repo.findById(id).orElseThrow();
        produto.setEstoque(novoEstoque);
        return repo.save(produto);
    }

    // 🔍 Buscar por nome (ex: /api/produtos/buscar?nome=balão)
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

    // 📁 Filtrar por categoria (ex: /api/produtos/categoria?categoria=doces)
    @GetMapping("/categoria")
    public List<Produto> buscarPorCategoria(@RequestParam String categoria) {
        return repo.findByCategoria(categoria);
    }

    // 🎯 Listar todos os produtos que fazem parte de um kit
    @GetMapping("/kits")
    public List<Produto> listarKits() {
        return repo.findByKitTrue();
    }

    // ❌ Excluir produto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable Long id) {
        return repo.findById(id)
                .map(produto -> {
                    repo.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
