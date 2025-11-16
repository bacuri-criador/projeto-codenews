package com.codenews.backend.service;

import com.codenews.backend.model.Usuario;
import com.codenews.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public boolean autenticar(String login, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByLogin(login);
        if (usuarioOpt.isEmpty()) {
            return false; // Usuário não encontrado
        }
        
        Usuario usuario = usuarioOpt.get();
        // ATENÇÃO: Comparação simples. O ideal é usar BCrypt!
        return usuario.getSenha().equals(senha);
    }
}