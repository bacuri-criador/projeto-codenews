package com.codenews.backend.controller;

import com.codenews.backend.modelos.Usuario;
import com.codenews.backend.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")
@CrossOrigin(origins = "*")
public class UsuarioPerfilController {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    // GET - Obter perfil por ID
    @GetMapping("/{id}")
    public Usuario obterPerfil(@PathVariable Long id) {
        return usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    // PUT - Atualizar perfil
    @PutMapping("/atualizar/{id}")
    public Usuario atualizarPerfil(@PathVariable Long id, @RequestBody Usuario usuarioNovo) {
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(usuarioNovo.getNome());
        usuario.setEmail(usuarioNovo.getEmail());
        usuario.setSenha(usuarioNovo.getSenha());
        usuario.setFotoUrl(usuarioNovo.getFotoUrl());

        return usuarioRepositorio.save(usuario);
    }
}
