package com.loja.baloes.dto;

import lombok.Data;

@Data
public class ProdutoDTO {
    private String nome;
    private Double preco;
    private String descricao;
    private Integer estoque;
    private String categoria;
    private Boolean kit;
}
