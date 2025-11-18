package com.codenews.backend.controller;

import com.codenews.backend.model.Atendimento;
import com.codenews.backend.service.AtendimentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class AtendimentoDashboardController {

    private final AtendimentoService service;

    public AtendimentoDashboardController(AtendimentoService service) {
        this.service = service;
    }

    @GetMapping("/hoje")
    public Long totalHoje() {
        return service.totalHoje();
    }

    @GetMapping("/proximos")
    public List<Atendimento> proximos() {
        return service.proximos();
    }

    @GetMapping("/atual")
    public List<Atendimento> atual() {
        return service.pacienteAtual();
    }
}
