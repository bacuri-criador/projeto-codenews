package com.codenews.backend.controller;

import com.codenews.backend.model.Atendimento;
import com.codenews.backend.service.AtendimentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final AtendimentoService service;

    public PacienteController(AtendimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Atendimento> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Atendimento a) {
        Atendimento salvo = service.salvar(a);
        return ResponseEntity.status(201).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @RequestBody Atendimento a) {
        Atendimento atualizado = service.atualizar(id, a);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
