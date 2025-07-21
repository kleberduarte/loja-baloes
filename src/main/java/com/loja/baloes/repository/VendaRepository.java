package com.loja.baloes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.loja.baloes.entity.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {
}
