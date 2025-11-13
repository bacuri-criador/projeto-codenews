package com.codenews.service;

import com.codenews.model.Atendimento;
import com.codenews.repository.AtendimentoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AtendimentoService {

    private final AtendimentoRepository atendimentoRepository;

    public AtendimentoService(AtendimentoRepository atendimentoRepository) {
        this.atendimentoRepository = atendimentoRepository;
    }

    public List<Atendimento> listarTodos() {
        return atendimentoRepository.findAll();
    }

    public Atendimento salvar(Atendimento atendimento) {
        return atendimentoRepository.save(atendimento);
    }

    public Optional<Atendimento> buscarPorId(Long id) {
        return atendimentoRepository.findById(id);
    }

    public Atendimento atualizar(Long id, Atendimento atendimentoAtualizado) {
        return atendimentoRepository.findById(id)
            .map(atendimento -> {
                atendimento.setNome(atendimentoAtualizado.getNome());
                atendimento.setRisco(atendimentoAtualizado.getRisco());
                atendimento.setSala(atendimentoAtualizado.getSala());
                atendimento.setMedico(atendimentoAtualizado.getMedico());
                atendimento.setSituacao(atendimentoAtualizado.getSituacao());
                atendimento.setDataHoraEntrada(atendimentoAtualizado.getDataHoraEntrada());
                return atendimentoRepository.save(atendimento);
            }).orElseThrow(() -> new RuntimeException("Atendimento não encontrado"));
    }

    public void deletar(Long id) {
        atendimentoRepository.deleteById(id);
    }
}