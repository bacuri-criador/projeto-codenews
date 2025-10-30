function obterPacientes(){
  try{
    const dados = localStorage.getItem('pacientes');
    return dados ? JSON.parse(dados) : [];
  }catch(erro){
    console.error('Erro ao ler pacientes do localStorage', erro);
    return [];
  }
}

function salvarPacientes(array){
  try{
    localStorage.setItem('pacientes', JSON.stringify(array));
    window.dispatchEvent(new Event('pacientes-atualizados'));
  }catch(erro){
    console.error('Erro ao salvar pacientes no localStorage', erro);
  }
}

function adicionarPaciente(paciente){
  const array = obterPacientes();
  array.push(paciente);
  salvarPacientes(array);
}

function finalizarPaciente(id) {
  if (!confirm('Tem certeza que deseja finalizar o atendimento deste paciente?')) return;
  
  const pacientes = obterPacientes();
  const indicePaciente = pacientes.findIndex(p => p.id === id);
  
  if (indicePaciente === -1) {
    alert('Paciente não encontrado!');
    return;
  }
  
  pacientes[indicePaciente].situacao = 'Atendimento Finalizado';
  pacientes[indicePaciente].dataHoraSaida = new Date().toISOString();
  
  salvarPacientes(pacientes);
  alert('Atendimento finalizado com sucesso! O paciente foi movido para o histórico.');
  window.dispatchEvent(new Event('pacientes-atualizados'));
  if(window.location.pathname.includes('painel-hospitalar.html')) carregarPacientes();
}

window.editarPaciente = function(id) {
  if (!id) {
    alert('ID do paciente inválido!');
    return;
  }
  window.location.href = `editar-paciente.html?id=${id}`;
}

function excluirPaciente(id) {
  if(!confirm('Tem certeza que deseja excluir este paciente?')) return;

  let pacientes = obterPacientes();
  pacientes = pacientes.filter(p => p.id !== id);
  salvarPacientes(pacientes);
  alert('Paciente excluído com sucesso!');
  if(window.location.pathname.includes('painel-hospitalar.html')) carregarPacientes();
}

function inicializarToggleBarraLateral(){
  const barraLateral = document.getElementById('barraLateral');
  const botaoToggle = document.querySelector('.botao-toggle');
  if(!barraLateral || !botaoToggle) return;

  const recolhida = localStorage.getItem('barra-lateral-recolhida') === 'true';
  if(recolhida) barraLateral.classList.add('recolhida');

  botaoToggle.addEventListener('click', ()=> {
    barraLateral.classList.toggle('recolhida');
    localStorage.setItem('barra-lateral-recolhida', barraLateral.classList.contains('recolhida'));
  });
}

function inicializarCarrossel(){
  const elementoCarrossel = document.querySelector('.conteudo-carrossel');
  if(!elementoCarrossel) return;

  const slides = [
    { titulo: 'Política de Privacidade', texto: 'Clique em <a href="politica-privacidade.html" style="color: #3498db; text-decoration: underline;">Saiba mais.</a>' },
    { titulo: 'Termos de Uso', texto: 'Clique em <a href="termos-uso.html" style="color: #3498db; text-decoration: underline;">Saiba mais.</a>' }
  ];

  let indice = 0;
  function renderizar(){
    elementoCarrossel.innerHTML = `<div><h4>${slides[indice].titulo}</h4><p class="texto-pequeno">${slides[indice].texto}</p></div>`;
  }
  renderizar();

  setInterval(()=> {
    indice = (indice + 1) % slides.length;
    renderizar();
  }, 6000);
}

function quandoPacientesAtualizados(callback){
  window.addEventListener('pacientes-atualizados', ()=> callback(obterPacientes()));
  window.addEventListener('storage', evento=>{
    if(evento.key==='pacientes') callback(obterPacientes());
  });
}

function tempoDesde(dataHoraEntrada){
  try{
    const agora = new Date();
    const entao = new Date(dataHoraEntrada);
    const diferenca = Math.max(0, Math.floor((agora - entao)/1000));
    const minutos = Math.floor(diferenca / 60);
    const horas = Math.floor(minutos / 60);
    if(horas > 0) return `${horas}h ${minutos%60}m`;
    if(minutos > 0) return `${minutos} min`;
    return `${diferenca} s`;
  }catch(erro){
    return '-';
  }
}

function aplicarCorRisco(cartaoRisco, risco) {
  cartaoRisco.classList.remove('emergencia', 'muito-urgente', 'urgente', 'pouco-urgente', 'nao-urgente');
  
  switch(risco) {
    case 'Emergência':
      cartaoRisco.classList.add('emergencia');
      break;
    case 'Muito Urgente':
      cartaoRisco.classList.add('muito-urgente');
      break;
    case 'Urgente':
      cartaoRisco.classList.add('urgente');
      break;
    case 'Pouco Urgente':
      cartaoRisco.classList.add('pouco-urgente');
      break;
    case 'Não Urgente':
      cartaoRisco.classList.add('nao-urgente');
      break;
    default:
      break;
  }
}

function renderizarDashboard(pacientes){
  const total = pacientes.length;
  document.getElementById('contadorTotal').innerText = total;

  const proximos = pacientes.filter(p => p.situacao === 'Em Atendimento' || p.situacao === 'A ser Atendido');

  const primeiro = proximos.length > 0 ? proximos[0] : null;

  if(primeiro){
    document.getElementById('nomePaciente').innerText = primeiro.nome;
    document.getElementById('infoPaciente').innerText = `Sala ${primeiro.sala} • ${primeiro.medico} • ${new Date(primeiro.dataHoraEntrada).toLocaleString('pt-BR')}`;
    document.getElementById('textoRisco').innerText = primeiro.risco;
    document.getElementById('emblemaRisco').innerText = primeiro.risco[0] || '!';
    
    const cartaoRisco = document.getElementById('cartaoRisco');
    aplicarCorRisco(cartaoRisco, primeiro.risco);
  } else {
    document.getElementById('nomePaciente').innerText = '—';
    document.getElementById('infoPaciente').innerText = 'Nenhum paciente em atendimento';
    document.getElementById('textoRisco').innerText = '-';
    document.getElementById('emblemaRisco').innerText = '-';
    
    const cartaoRisco = document.getElementById('cartaoRisco');
    cartaoRisco.classList.remove('emergencia', 'muito-urgente', 'urgente', 'pouco-urgente', 'nao-urgente');
  }

  if(proximos.length > 0){
    const totalMinutos = proximos.reduce((acumulador, p)=>{
      const diferencaMinutos = Math.floor((Date.now() - new Date(p.dataHoraEntrada))/60000);
      return acumulador + Math.max(0, diferencaMinutos);
    }, 0);
    const media = Math.round(totalMinutos / proximos.length);
    document.getElementById('tempoEsperaMedio').innerText = `${media} min`;
  } else {
    document.getElementById('tempoEsperaMedio').innerText = '-';
  }

  const listaElemento = document.getElementById('listaProximos');
  listaElemento.innerHTML = '';
  if(proximos.length === 0){
    listaElemento.innerHTML = '<div class="texto-pequeno">Nenhum paciente na fila.</div>';
  } else {
    proximos.forEach(p => {
      const item = document.createElement('div');
      item.className = 'item-paciente';
      item.innerHTML = `
        <div class="info-paciente">
          <div class="nome-paciente">${p.nome}</div>
          <div class="texto-pequeno">${p.risco} • Sala ${p.sala} • ${p.medico}</div>
        </div>
        <div class="tempo-paciente">
          <div class="tempo-espera">${tempoDesde(p.dataHoraEntrada)}</div>
          <div class="texto-pequeno">${p.situacao}</div>
        </div>
      `;
      listaElemento.appendChild(item);
    });
  }
}

function renderizarHistorico(pacientes){
  const corpoTabela = document.querySelector('#tabelaHistorico tbody');
  corpoTabela.innerHTML = '';

  if(!pacientes || pacientes.length === 0){
    corpoTabela.innerHTML = '<tr><td colspan="6" class="texto-pequeno">Nenhum registro encontrado.</td></tr>';
    return;
  }

  pacientes.sort((a,b)=> new Date(b.dataHoraEntrada) - new Date(a.dataHoraEntrada));

  for(const p of pacientes){
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.risco}</td>
      <td>${p.sala}</td>
      <td>${p.medico}</td>
      <td>${p.situacao}</td>
      <td>${new Date(p.dataHoraEntrada).toLocaleString('pt-BR')}</td>
    `;
    corpoTabela.appendChild(linha);
  }
}

const pacientesIniciais = [
  { 
    id: 1001, 
    nome: "Ana Souza", 
    risco: "Emergência", 
    sala: "3", 
    medico: "Dr. Gabriel Fernandes", 
    situacao: "Em Atendimento", 
    dataHoraEntrada: "2025-01-15T11:35:00" 
  },
  { 
    id: 1002, 
    nome: "Júlia Oliveira", 
    risco: "Urgente", 
    sala: "5", 
    medico: "Dr. Gabriel Fernandes", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:33:00" 
  },
  { 
    id: 1003, 
    nome: "Pedro Pereira", 
    risco: "Urgente", 
    sala: "2", 
    medico: "Dr. Letícia Andrade", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:31:00" 
  },
  { 
    id: 1004, 
    nome: "Antonio Costa", 
    risco: "Pouco Urgente", 
    sala: "1", 
    medico: "Dr. Letícia Andrade", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:28:00" 
  },
  { 
    id: 1005, 
    nome: "Marcos Silva", 
    risco: "Pouco Urgente", 
    sala: "4", 
    medico: "Dr. Letícia Andrade", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:27:00" 
  },
  { 
    id: 1006, 
    nome: "Fernanda Duarte", 
    risco: "Não Urgente", 
    sala: "7", 
    medico: "Dr. Clara Borges", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:27:00" 
  },
  { 
    id: 1007, 
    nome: "Lara Andrade", 
    risco: "Não Urgente", 
    sala: "8", 
    medico: "Dra. Rafael Batista", 
    situacao: "A ser Atendido", 
    dataHoraEntrada: "2025-01-15T11:20:00" 
  }
];

function inicializarDados() {
  const pacientesArmazenados = localStorage.getItem('pacientes');
  if (!pacientesArmazenados) {
    localStorage.setItem('pacientes', JSON.stringify(pacientesIniciais));
  }
}

function formatarDataHora(dataHoraString) {
  try {
    const data = new Date(dataHoraString);
    return data.toLocaleString('pt-BR');
  } catch (erro) {
    return dataHoraString;
  }
}

function carregarPacientes() {
  const pacientesArmazenados = localStorage.getItem('pacientes');
  const pacientes = pacientesArmazenados ? JSON.parse(pacientesArmazenados) : pacientesIniciais;
  
  const corpoTabela = document.getElementById('corpoTabelaPacientes');
  corpoTabela.innerHTML = '';

  const pacientesAtivos = pacientes.filter(paciente => paciente.situacao !== 'Atendimento Finalizado');

  if (pacientesAtivos.length === 0) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          <i class="fas fa-users me-2"></i>
          Nenhum paciente em atendimento
        </td>
      </tr>
    `;
    return;
  }

  pacientesAtivos.forEach(paciente => {
    const linha = document.createElement('tr');
    
    let classeRisco = '';
    switch(paciente.risco) {
      case 'Emergência':
        classeRisco = 'risco-emergencia';
        break;
      case 'Muito Urgente':
        classeRisco = 'risco-muito-urgente';
        break;
      case 'Urgente':
        classeRisco = 'risco-urgente';
        break;
      case 'Pouco Urgente':
        classeRisco = 'risco-pouco-urgente';
        break;
      case 'Não Urgente':
        classeRisco = 'risco-nao-urgente';
        break;
      default:
        classeRisco = '';
    }
    
    let classeSituacao = paciente.situacao === 'Em Atendimento' ? 'situacao-em-atendimento' : 'situacao-a-ser-atendido';
    
    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td><span class="${classeRisco}">${paciente.risco}</span></td>
      <td>${paciente.sala}</td>
      <td>${paciente.medico}</td>
      <td><span class="${classeSituacao}">${paciente.situacao}</span></td>
      <td>${formatarDataHora(paciente.dataHoraEntrada)}</td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-success btn-pequeno-painel" onclick="visualizarPaciente(${paciente.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-warning btn-pequeno-painel" onclick="editarPaciente(${paciente.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-finalizar btn-pequeno-painel" onclick="finalizarPaciente(${paciente.id})">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-danger btn-pequeno-painel" onclick="excluirPaciente(${paciente.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function pesquisarPacientes() {
  const termoPesquisa = document.getElementById('campoPesquisa').value.toLowerCase();
  const pacientesArmazenados = localStorage.getItem('pacientes');
  const pacientes = pacientesArmazenados ? JSON.parse(pacientesArmazenados) : pacientesIniciais;
  
  const pacientesFiltrados = pacientes.filter(paciente => 
    paciente.situacao !== 'Atendimento Finalizado' && (
      paciente.nome.toLowerCase().includes(termoPesquisa) || 
      paciente.medico.toLowerCase().includes(termoPesquisa) ||
      paciente.sala.toLowerCase().includes(termoPesquisa) ||
      paciente.risco.toLowerCase().includes(termoPesquisa)
    )
  );

  const corpoTabela = document.getElementById('corpoTabelaPacientes');
  corpoTabela.innerHTML = '';

  if (pacientesFiltrados.length === 0) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          <i class="fas fa-search me-2"></i>
          Nenhum paciente encontrado
        </td>
      </tr>
    `;
    return;
  }

  pacientesFiltrados.forEach(paciente => {
    const linha = document.createElement('tr');
    
    let classeRisco = '';
    switch(paciente.risco) {
      case 'Emergência':
        classeRisco = 'risco-emergencia';
        break;
      case 'Muito Urgente':
        classeRisco = 'risco-muito-urgente';
        break;
      case 'Urgente':
        classeRisco = 'risco-urgente';
        break;
      case 'Pouco Urgente':
        classeRisco = 'risco-pouco-urgente';
        break;
      case 'Não Urgente':
        classeRisco = 'risco-nao-urgente';
        break;
      default:
        classeRisco = '';
    }
    
    let classeSituacao = paciente.situacao === 'Em Atendimento' ? 'situacao-em-atendimento' : 'situacao-a-ser-atendido';
    
    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td><span class="${classeRisco}">${paciente.risco}</span></td>
      <td>${paciente.sala}</td>
      <td>${paciente.medico}</td>
      <td><span class="${classeSituacao}">${paciente.situacao}</span></td>
      <td>${formatarDataHora(paciente.dataHoraEntrada)}</td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-success btn-pequeno-painel" onclick="visualizarPaciente(${paciente.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-warning btn-pequeno-painel" onclick="editarPaciente(${paciente.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-finalizar btn-pequeno-painel" onclick="finalizarPaciente(${paciente.id})">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-danger btn-pequeno-painel" onclick="excluirPaciente(${paciente.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function visualizarPaciente(id) {
  const pacientesArmazenados = localStorage.getItem('pacientes');
  const pacientes = pacientesArmazenados ? JSON.parse(pacientesArmazenados) : pacientesIniciais;
  const paciente = pacientes.find(paciente => paciente.id === id);
  
  if (paciente) {
    const horaSaida = paciente.dataHoraSaida ? formatarDataHora(paciente.dataHoraSaida) : 'Em andamento';
    alert(`📋 DETALHES DO PACIENTE\n
👤 Nome: ${paciente.nome}
⚠️  Risco: ${paciente.risco}
🏥 Sala: ${paciente.sala}
👨‍⚕️ Médico: ${paciente.medico}
📊 Situação: ${paciente.situacao}
⏰ Entrada: ${formatarDataHora(paciente.dataHoraEntrada)}
🚪 Saída: ${horaSaida}`);
  }
}

function inicializarPaginasLegais() {
  if (window.location.pathname.includes('politica-privacidade.html') || 
      window.location.pathname.includes('termos-uso.html')) {
    inicializarToggleBarraLateral();
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  inicializarToggleBarraLateral();
  inicializarCarrossel();
  inicializarPaginasLegais();
  
  if (document.getElementById('gradeDashboard')) {
    renderizarDashboard(obterPacientes());
    quandoPacientesAtualizados((pacientes) => {
      renderizarDashboard(pacientes);
    });
    setInterval(()=> renderizarDashboard(obterPacientes()), 20000);
  }
  
  if (document.getElementById('tabelaHistorico')) {
    renderizarHistorico(obterPacientes());
    quandoPacientesAtualizados((pacientes) => renderizarHistorico(pacientes));
    
    document.getElementById('botaoLimpar').addEventListener('click', ()=>{
      if(confirm('Tem certeza que deseja apagar todo o histórico de pacientes? Esta ação não pode ser desfeita.')){
        salvarPacientes([]);
        alert('Histórico limpo.');
        renderizarHistorico([]);
      }
    });
  }
  
  if (document.getElementById('corpoTabelaPacientes')) {
    inicializarDados();
    carregarPacientes();
    
    document.getElementById('campoPesquisa').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        pesquisarPacientes();
      }
    });
  }
  
  if (document.getElementById('formularioLogin')) {
    document.getElementById('formularioLogin').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      if (email === 'admin@codenews.com' && senha === '12345678') {
        window.location.href = 'pag-inicial.html';
      } else {
        alert('E-mail ou senha incorretos!');
      }
    });
  }
  
  if (document.getElementById('formularioCadastro')) {
    document.getElementById('formularioCadastro').addEventListener('submit', function(e){
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const risco = document.getElementById('risco').value;
      const sala = document.getElementById('sala').value.trim();
      const medico = document.getElementById('medico').value.trim();
      const situacao = document.getElementById('situacao').value;

      if(!nome || !risco || !sala || !medico || !situacao){
        alert('Por favor preencha todos os campos obrigatórios.');
        return;
      }

      const novoPaciente = {
        id: Date.now(),
        nome,
        risco,
        sala,
        medico,
        situacao,
        dataHoraEntrada: (new Date()).toISOString()
      };

      adicionarPaciente(novoPaciente);
      window.location.href = 'painel-hospitalar.html';
    });
  }
});