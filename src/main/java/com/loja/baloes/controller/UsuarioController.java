package com.loja.baloes.controller;

import com.loja.baloes.entity.Usuario;
import com.loja.baloes.dto.UsuarioDTO;
import com.loja.baloes.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());
        Usuario salvo = service.salvar(usuario);
        return ResponseEntity.status(201).body(salvo);
    }
}
