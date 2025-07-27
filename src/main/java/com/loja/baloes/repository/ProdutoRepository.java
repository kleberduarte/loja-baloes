package com.loja.baloes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.loja.baloes.entity.Produto;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Busca produtos pelo nome (ignora case e faz busca parcial)
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // Busca produtos pela categoria exata
    List<Produto> findByCategoria(String categoria);

    // Busca produtos onde kit == true
    List<Produto> findByKitTrue();

    // Busca produto pelo código exato
    Optional<Produto> findByCodigo(String codigo);
}
