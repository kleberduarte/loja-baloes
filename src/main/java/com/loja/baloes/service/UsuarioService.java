package com.loja.baloes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.loja.baloes.entity.Usuario;
import com.loja.baloes.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    public Usuario salvar(Usuario usuario) {
        return repo.save(usuario);
    }

    public Usuario buscarPorUsernameESenha(String username, String password) {
        return repo.findByUsernameAndPassword(username, password);
    }
}
