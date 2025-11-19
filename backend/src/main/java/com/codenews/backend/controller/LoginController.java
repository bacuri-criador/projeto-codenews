@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginModel login) {

    Usuario usuario = usuarioRepositorio.findByEmail(login.getEmail());

    if (usuario == null) {
        return ResponseEntity.status(401).body("Usuário não encontrado");
    }

    if (!senhaService.verificarSenha(login.getSenha(), usuario.getSenha())) {
        return ResponseEntity.status(401).body("Senha incorreta");
    }

    LoginResponse resposta = new LoginResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            "Login realizado com sucesso"
    );

    return ResponseEntity.ok(resposta);
}
