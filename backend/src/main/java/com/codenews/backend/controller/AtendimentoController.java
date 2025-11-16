package com.codenews.backend.controller;

import com.codenews.backend.model.Atendimento;
import com.codenews.backend.service.AtendimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;

    public AtendimentoController(AtendimentoService atendimentoService) {
        this.atendimentoService = atendimentoService;
    }

    @GetMapping
    public List<Atendimento> listarTodos() {
        return atendimentoService.listarTodos();
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Atendimento criar(@RequestBody Atendimento atendimento) {
        return atendimentoService.salvar(atendimento);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atendimento> buscarPorId(@PathVariable Long id) {
        return atendimentoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atendimento> atualizar(@PathVariable Long id, @RequestBody Atendimento atendimento) {
        try {
            Atendimento atualizado = atendimentoService.atualizar(id, atendimento);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        atendimentoService.deletar(id);
    }
}