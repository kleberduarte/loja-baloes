package com.loja.baloes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.loja.baloes.entity.Produto;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // 🔍 Buscar produtos por nome (caso queira implementar busca no frontend)
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // 📁 Filtrar produtos por categoria
    List<Produto> findByCategoria(String categoria);

    // 🎯 Buscar apenas produtos que são kits
    List<Produto> findByKitTrue();
}