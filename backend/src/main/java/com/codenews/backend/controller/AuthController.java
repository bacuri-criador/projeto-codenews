package com.codenews.backend.controller;

import com.codenews.backend.model.Usuario;
import com.codenews.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario login) {

        Usuario usuario = usuarioRepository.findByLogin(login.getLogin());

        HashMap<String, Object> resposta = new HashMap<>();

        if (usuario != null && usuario.getSenha().equals(login.getSenha())) {
            resposta.put("status", "sucesso");
            resposta.put("token", "demo-token");
            resposta.put("usuario", usuario.getLogin());
            return ResponseEntity.ok(resposta);
        }

        resposta.put("status", "erro");
        resposta.put("mensagem", "Login ou senha inválidos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
    }
}
