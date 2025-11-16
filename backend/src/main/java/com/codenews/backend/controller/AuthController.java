package com.codenews.backend.controller;

import com.codenews.backend.dto.LoginRequest;
import com.codenews.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        boolean autenticado = authService.autenticar(
            loginRequest.getLogin(), 
            loginRequest.getSenha()
        );

        if (autenticado) {
            // Em um app real, retornaríamos um Token JWT
            return ResponseEntity.ok().body("Login bem-sucedido");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login ou senha inválidos");
        }
    }
}