window.onload = function () {
    const id = parseInt(localStorage.getItem("pacienteSelecionado"));
    const paciente = mockPacientes.find(p => p.id === id);

    if (!paciente) return;

    document.getElementById("paciente-nome").innerText = paciente.nome;
    document.getElementById("paciente-idade").innerText = paciente.idade;
    document.getElementById("paciente-diagnostico").innerText = paciente.diagnostico;
    document.getElementById("paciente-historico").innerText = paciente.historico;
};
