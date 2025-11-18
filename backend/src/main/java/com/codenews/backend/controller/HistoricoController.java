package com.codenews.backend.controller;

import com.codenews.backend.model.Atendimento;
import com.codenews.backend.service.AtendimentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {

    private final AtendimentoService service;

    public HistoricoController(AtendimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Atendimento> historico() {
        return service.listarTodos();
    }
}
