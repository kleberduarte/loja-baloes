package com.loja.baloes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.loja.baloes.dto.ProdutoDTO;
import com.loja.baloes.entity.Produto;
import com.loja.baloes.service.ProdutoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // 🧾 Listar todos os produtos
    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    // ➕ Cadastrar novo produto
    @PostMapping
    public Produto cadastrar(@RequestBody Produto p) {
        return produtoService.salvar(p);
    }

    // 🔍 Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.listarTodos().stream()
                .filter(produto -> produto.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔄 Atualizar estoque de um produto pelo ID
    @PutMapping("/{id}/estoque")
    public ResponseEntity<Produto> atualizarEstoque(@PathVariable Long id, @RequestBody Integer novoEstoque) {
        try {
            Produto atualizado = produtoService.atualizarEstoque(id, novoEstoque);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔍 Buscar por nome (ex: /api/produtos/buscar?nome=balão)
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoService.buscarPorNome(nome);
    }

    // 📁 Filtrar por categoria (ex: /api/produtos/categoria?categoria=doces)
    @GetMapping("/categoria")
    public List<Produto> buscarPorCategoria(@RequestParam String categoria) {
        return produtoService.buscarPorCategoria(categoria);
    }

    // 🎯 Listar todos os produtos que fazem parte de um kit
    @GetMapping("/kits")
    public List<Produto> listarKits() {
        return produtoService.listarKits();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable Long id) {
        return produtoService.listarTodos().stream()
                .filter(produto -> produto.getId().equals(id))
                .findFirst()
                .map(produto -> {
                    produtoService.excluir(id); // ✅ Corrigido: chama o método que realmente exclui
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // ✏️ Atualizar produto com DTO (PUT /api/produtos/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoDTO dto) {
        try {
            Produto atualizado = produtoService.atualizarProduto(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
