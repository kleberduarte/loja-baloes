package com.loja.baloes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.loja.baloes.entity.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

	boolean existsByNomeAndCargo(String nome, String cargo);}
