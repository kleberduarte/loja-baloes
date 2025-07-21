package com.loja.baloes.entity;

import javax.persistence.*;

import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Double preco;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private Integer estoque;

    @Column(length = 100)
    private String categoria; // Ex: "balão", "kit", "doces"

    private boolean kit; // true se fizer parte de um kit

    public void setEstoque(Integer novoEstoque) {
        this.estoque = novoEstoque;
    }
}