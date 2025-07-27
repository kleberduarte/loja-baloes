package com.loja.baloes.controller;

import java.util.List;
import java.util.Optional;

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

    // Listar todos os produtos
    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    // Cadastrar novo produto
    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody Produto p) {
        Produto salvo = produtoService.salvar(p);
        return ResponseEntity.ok(salvo);
    }

    // Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.listarTodos().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
        return produto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar produto por CÓDIGO
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Produto> buscarPorCodigo(@PathVariable String codigo) {
        Optional<Produto> produto = produtoService.buscarPorCodigo(codigo);
        return produto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar estoque de um produto pelo ID
    // ⚠️ Atenção: espera um corpo do tipo Integer (não comum) — pode causar problemas no frontend
    @PutMapping("/{id}/estoque")
    public ResponseEntity<Produto> atualizarEstoque(@PathVariable Long id, @RequestBody Integer novoEstoque) {
        try {
            Produto atualizado = produtoService.atualizarEstoque(id, novoEstoque);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Buscar produtos por nome (query param)
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoService.buscarPorNome(nome);
    }

    // Filtrar por categoria (query param)
    @GetMapping("/categoria")
    public List<Produto> buscarPorCategoria(@RequestParam String categoria) {
        return produtoService.buscarPorCategoria(categoria);
    }

    // Listar produtos que são kits
    @GetMapping("/kits")
    public List<Produto> listarKits() {
        return produtoService.listarKits();
    }

    // Excluir produto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.listarTodos().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();

        if (produto.isPresent()) {
            produtoService.excluir(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Atualizar produto com DTO (PUT /api/produtos/{id})
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
