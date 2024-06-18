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
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', '/api/usuarios/', true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.send(JSON.stringify({
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  }));

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 201){
      retorno = JSON.parse(xmlhttp.responseText);
      alert("Usuário cadastrado com sucesso");
      window.location.href = '/consultar_atendente';
    } 
    else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403){
      retorno = JSON.parse(xmlhttp.responseText);
      alert(retorno.message);        
    }
  }
}

