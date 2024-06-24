function consultaAtendentes(){
  limpaTabela('tabela_atendentes');

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '/api/usuarios/');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){

    let listaAtendentes = JSON.parse(xmlhttp.responseText);

    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){
      for (i = 0; i < listaAtendentes.length; i++){
        montaTabela(listaAtendentes[i].nome, listaAtendentes[i].email, 'tabela_atendentes');
      }
    }
  }
}

function montaTabela(nome, email, idTabela){
  let tabela = document.getElementById(idTabela);
  let novaLinha = tabela.insertRow(-1); // -1 = inserir ao final da tabela

  // Adicionar colunas
  let c1 = novaLinha.insertCell(0);
  let c2 = novaLinha.insertCell(1);
  let c3 = novaLinha.insertCell(2);

  // Atribuir valores
  c1.innerText = nome;
  c2.innerText = email;
  c3.innerHTML = "<div class='btn-group' role='group'><button class='btn btn-warning' onclick=\"alteraAtendente('" + email + "')\">Alterar</button><button class='btn btn-danger' onclick=\"removeAtendente('" + email + "')\">Excluir</button></div>";
}

function limpaTabela(idTabela){
  var tabela = document.getElementById(idTabela);
  while ((tabela.rows.length) > 1){
    tabela.deleteRow(-1); // Remove a última linha da tabela
  }
}

function alteraAtendente(email){
  localStorage.setItem('emailAlteracao', email);
  window.location.href = '/alterar_atendente';
}

function removeAtendente(email){
  localStorage.setItem('emailExclusao', email);
  window.location.href = '/excluir_atendente';
}

function incluiAtendente(){
  if(!document.getElementById('nome').value){
    alert("Por favor, preencha o campo Nome");
  } 
  else if(!document.getElementById('email').value){
    alert("Por favor, preencha o campo Email");
  }  
  else if(!document.getElementById('senha').value){
    alert("Por favor, preencha o campo Senha");
  } 
  else{
    const id = geraId();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    // Função para calcular o hash da senha
    async function hashSenha(senha) {
      const encoder = new TextEncoder();
      const data = encoder.encode(senha);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  
    // Função para enviar o usuário para o servidor
    async function enviarUsuarioComHash() {
      const senhaHash = await hashSenha(senha);
  
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', '/api/usuarios/', true);
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
      xmlhttp.send(JSON.stringify({
        id: id,
        nome: nome,
        email: email,
        senha: senhaHash // Envie o hash da senha ao invés da senha em texto plano
      }));
  
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 201){
          const retorno = JSON.parse(xmlhttp.responseText);
          alert("Usuário cadastrado com sucesso");
          window.location.href = '/consultar_atendente';
        } 
        else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403){
          const retorno = JSON.parse(xmlhttp.responseText);
          alert(retorno.message);        
        }
      }
    }  
    enviarUsuarioComHash();
  }
}


function geraId() {
  let resultado = '';
  const caracteres = '0123456789'; // Caracteres permitidos para o número aleatório

  for (let i = 0; i < 10; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }

  return resultado;
}

function buscaDadosAtendente(){
  
  emailAtendente = localStorage.getItem('emailAlteracao');
  const caminho = '/api/usuarios/' + emailAtendente;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', caminho);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    let usuarioRetornado = "";

    if(xmlhttp.responseText != ""){
        usuarioRetornado = JSON.parse(xmlhttp.responseText);
    }

    if(xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){

      if (usuarioRetornado[0] == undefined){
        alert("Usuário de email " + emailAtendente + " não encontrado!")
      } 
      else{
        document.getElementById("spanNome").innerHTML = "<input id='nome' value='"+usuarioRetornado[0].nome +"'></input>";
        document.getElementById("spanEmail").innerHTML = "<input id='email' value='"+usuarioRetornado[0].email+"'></input>";
        document.getElementById("spanSenha").innerHTML = "<input id='senha' type='password'></input>";
      }
    } 
  }
}

function confirmaAlteracaoAtendente(){
  if(!document.getElementById('nome').value){
    alert("Por favor, preencha o campo Nome");
  } 
  else if(!document.getElementById('email').value){
    alert("Por favor, preencha o campo Email");
  }  
  else if(!document.getElementById('senha').value){
    alert("Por favor, preencha o campo Senha");
  } 
  else{  
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    // Função para calcular o hash da nova senha
    async function hashSenha(senha) {
      const encoder = new TextEncoder();
      const data = encoder.encode(senha);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  
    // Função para enviar a alteração do usuário para o servidor
    async function enviarAlteracaoComHash() {
      const senhaHash = await hashSenha(senha);
  
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('PATCH', '/api/usuarios/' + localStorage.getItem('emailAlteracao'), true);
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
      xmlhttp.send(JSON.stringify({
        nome: nome,
        email: email,
        senha: senhaHash 
      }));
  
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 201){
          const retorno = JSON.parse(xmlhttp.responseText);
          alert("Usuário alterado com sucesso");
          window.location.href = '/consultar_atendente';
        } 
        else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403){
          const retorno = JSON.parse(xmlhttp.responseText);
          alert(retorno.message);        
        }
      }
    }
    enviarAlteracaoComHash();
  }
}


function buscaDadosAtendenteExclusao(){
  emailAtendente = localStorage.getItem('emailExclusao'); 
  document.getElementById("mensagem").innerText = "Confirma a exclusão do usuário com o seguinte email: " + emailAtendente + "?";
}

function confirmaExclusaoAtendente() {
  const emailAtendente = localStorage.getItem('emailExclusao');

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        const retorno = JSON.parse(xmlhttp.responseText);
        alert(retorno.message);
        window.location.href = '/consultar_atendente';
      } 
      else if (xmlhttp.status == 403) {
        const retorno = JSON.parse(xmlhttp.responseText);
        alert(retorno.message);
      } 
      else {
        alert('Erro ao excluir atendente. Status: ' + xmlhttp.status);
      }
    }
  };

  xmlhttp.open('DELETE', '/api/usuarios/' + emailAtendente);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();
}
