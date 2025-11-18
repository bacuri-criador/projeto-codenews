package com.codenews.backend.service;

import com.codenews.backend.model.Atendimento;
import com.codenews.backend.repository.AtendimentoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AtendimentoService {

    private final AtendimentoRepository repo;

    public AtendimentoService(AtendimentoRepository repo) {
        this.repo = repo;
    }

    // ==============================
    // LISTAR TODOS (página painel + histórico)
    // ==============================
    public List<Atendimento> listarTodos() {
        return repo.findAll();
    }

    // ==============================
    // CADASTRAR
    // ==============================
    public Atendimento salvar(Atendimento a) {

        // Garante que todos os campos essenciais existem
        padronizarCampos(a);

        // Se o front não enviar dataHoraEntrada, gera agora
        if (a.getDataHoraEntrada() == null) {
            a.setDataHoraEntrada(LocalDateTime.now());
        }

        return repo.save(a);
    }

    // ==============================
    // ATUALIZAR
    // ==============================
    public Atendimento atualizar(Long id, Atendimento dadosAtualizados) {

        Atendimento existente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        // Atualiza apenas os campos enviados pelo front
        if (dadosAtualizados.getNome() != null)
            existente.setNome(dadosAtualizados.getNome());

        if (dadosAtualizados.getRisco() != null)
            existente.setRisco(dadosAtualizados.getRisco());

        if (dadosAtualizados.getSala() != null)
            existente.setSala(dadosAtualizados.getSala());

        if (dadosAtualizados.getMedico() != null)
            existente.setMedico(dadosAtualizados.getMedico());

        if (dadosAtualizados.getSituacao() != null)
            existente.setSituacao(dadosAtualizados.getSituacao());

        // CPF e idade são opcionais
        if (dadosAtualizados.getCpf() != null)
            existente.setCpf(dadosAtualizados.getCpf());

        if (dadosAtualizados.getIdade() != null)
            existente.setIdade(dadosAtualizados.getIdade());

        return repo.save(existente);
    }

    // ==============================
    // DELETAR
    // ==============================
    public void deletar(Long id) {
        repo.deleteById(id);
    }

    // ==============================
    // DASHBOARD — Próximos pacientes
    // ==============================
    public List<Atendimento> proximos() {
        return repo.findTop10BySituacaoOrderByDataHoraEntradaAsc("A ser Atendido");
    }

    // ==============================
    // DASHBOARD — Paciente em atendimento
    // ==============================
    public List<Atendimento> pacienteAtual() {
        return repo.findTop10BySituacaoOrderByDataHoraEntradaAsc("Em Atendimento");
    }

    // ==============================
    // DASHBOARD — Total de hoje
    // ==============================
    public Long totalHoje() {

        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fim = inicio.plusDays(1);

        return repo.countByDataHoraEntradaBetween(inicio, fim);
    }

    // ==============================
    // MÉTODO INTERNO DE PADRONIZAÇÃO
    // ==============================
    private void padronizarCampos(Atendimento a) {

        // Evita campos nulos que quebram o front
        if (a.getRisco() == null || a.getRisco().isBlank())
            a.setRisco("Não informado");

        if (a.getSituacao() == null || a.getSituacao().isBlank())
            a.setSituacao("A ser Atendido");

        if (a.getMedico() == null || a.getMedico().isBlank())
            a.setMedico("Não informado");

        if (a.getSala() == null || a.getSala().isBlank())
            a.setSala("-");
    }
}
