
function consultaPedidos() {

  limpaTabela('tabela_pedidos');

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '/api/pedidos/');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {

    let listaPedidos = JSON.parse(xmlhttp.responseText);

    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {

      for (i = 0; i < listaPedidos.length; i++) {
        adicionarNaTabela(listaPedidos[i].id, listaPedidos[i].senha_pedido, listaPedidos[i].status, listaPedidos[i].itens, 'tabela_pedidos');
      }

    }
  }
}

function adicionarNaTabela(id, senha, status, itens, idTabela) {

  let tabela = document.getElementById(idTabela);
  let novaLinha = tabela.insertRow(-1); // -1 = inserir ao final da tabela

  // Adicionar colunas
  let c1 = novaLinha.insertCell(0);
  let c2 = novaLinha.insertCell(1);
  let c3 = novaLinha.insertCell(2);
  let c4 = novaLinha.insertCell(3);
  let c5 = novaLinha.insertCell(4);
  let c6 = novaLinha.insertCell(5);

  // Atribuir valores
  c1.innerText = id;
  c2.innerText = senha;
  // status 1 = fila de espera | 2 = em preparação | 3 = pronto | 4 = entregue
  if (status == 1) {
    c3.innerText = "Na fila de espera"
  } else if (status == 2) {
    c3.innerText = "Em preparação"
  } else if (status == 3) {
    c3.innerText = "Pronto"
  } else if (status == 4) {
    c3.innerText = "Entregue"
  }
  c4.innerText = itens;
  c5.innerHTML = "<button class='btn btn-secondary' onclick='redirecionaParaAlterarPedido(" + id + ")' >Alterar status</button>"
  c6.innerHTML = "<button class='btn btn-secondary' onclick='removePedido(" + id + ")' >Excluir pedido</button>"

}

function limpaTabela(idTabela) {

  var tabela = document.getElementById(idTabela);

  while ((tabela.rows.length) > 1) {
    tabela.deleteRow(-1); // Remove a última linha da tabela
  }

}

function redirecionaParaAlterarPedido(idPedido) {
  localStorage.setItem('idPedido', idPedido);
  window.location.href = '/altera_status';
}

function carregaDetalhesPedido(){
  
  idPedido = localStorage.getItem('idPedido');

  // Executando get para exibir os dados do pedido
  const caminho = '/api/pedidos/' + idPedido;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', caminho);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {

    let pedidoRetornado = "";

    if (xmlhttp.responseText != ""){
      pedidoRetornado = JSON.parse(xmlhttp.responseText);
    }

    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {

      if (pedidoRetornado[0] == undefined) {
        
        alert("Pedido de id " + idPedido + " não encontrado!")
        
      } else {
      
        let campoId = document.getElementById("id_pedido");
        let senha = document.getElementById("senha");
        let status = document.getElementById("status");
        let itens = document.getElementById("itens");
  
        campoId.innerText = pedidoRetornado[0].id;
        senha.innerText = pedidoRetornado[0].senha_pedido;
        status.value = pedidoRetornado[0].status;
        itens.innerText = pedidoRetornado[0].itens;

      }
    } 
  }
  localStorage.setItem('idPedido', "");
}

function alteraStatus(){

  idPedido = document.getElementById("id_pedido").innerText;
  comboStatus = document.getElementById('status');

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('PATCH', '/api/pedidos/' + idPedido);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.send(JSON.stringify({
    status: document.getElementById('status').value
  }));

  xmlhttp.onreadystatechange = function(){
    
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 201){
      
      retorno = JSON.parse(xmlhttp.responseText);
      alert(retorno.message + "\n\nNovo status: " + comboStatus.options[comboStatus.selectedIndex].text);
      window.location.href = '/lista_pedidos';
      
    } else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403) {

      retorno = JSON.parse(xmlhttp.responseText);
      alert(retorno.message);      
    }    
  }  
}

function removePedido(idPedido){
  
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('DELETE', '/api/pedidos/' + idPedido);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
      
      let retorno = JSON.parse(xmlhttp.responseText)
      
      consultaPedidos();
      
      alert(retorno.message)

    } else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403) {

      let retorno = JSON.parse(xmlhttp.responseText);
      alert(retorno.message);      
    }
  }  
}

function removeTodosPedidos(){

  if (confirm('Você tem certeza que deseja excluir TODOS os pedidos existentes?')) {
    
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('DELETE', '/api/pedidos/');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();

    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
        
        let retorno = JSON.parse(xmlhttp.responseText)
        
        consultaPedidos();
        
        alert(retorno.message)
  
      } else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403) {
  
        let retorno = JSON.parse(xmlhttp.responseText);
        alert(retorno.message);        
      }  
    }
  }
}

function incluiPedido() {

  if(
    (!document.getElementById('itens').value) ||
    (!document.getElementById('senha').value)
    ){
    alert("Por favor, preencha todos os campos!");
  
  } else {
  
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/api/pedidos/', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.send(JSON.stringify({
      itens: document.getElementById('itens').value,
      senha_pedido: document.getElementById('senha').value,
      status: 1
    }));

    xmlhttp.onreadystatechange = function() {

      if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 201) {
        
        retorno = JSON.parse(xmlhttp.responseText);
        alert(retorno.message + "\nID: " + retorno.data.id + "\nSenha: " + retorno.data.senha_pedido + 
          "\n\nRedirecionando para a tela de gerenciar pedidos");
        window.location.href = '/lista_pedidos';
        
      } else if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 403) {

        retorno = JSON.parse(xmlhttp.responseText);
        alert(retorno.message);        
      }
    }
  }
}

function geraSenha() {

  let listaDeSenhasExistentes = [];

  // Fazendo get nos pedidos existentes para que não repita a senha
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '/api/pedidos/');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {

    let listaPedidos = JSON.parse(xmlhttp.responseText);

    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {

      // O bloco abaixo vai retornar um inteiro entre 1 e 9999 (inclusive esses valores)
      //    FÓRMULA:    Math.floor(Math.random() * (max - min + 1) + min)
      let senhaGerada = Math.floor(Math.random() * (9999 - 1 + 1) + 1);
      // O bloco abaixo formata a senha para que fique com 4 casas no total, preenchendo com zeros à esquerda
      senhaGerada = String(senhaGerada).padStart(4, '0');

      for (i = 0; i < listaPedidos.length; i++) {
        listaDeSenhasExistentes.push(listaPedidos[i].senha_pedido);
      }

      for (i = 0; i < listaDeSenhasExistentes.length; i++) {

        // Se a senha gerada for igual a alguma outra senha existente, gera uma nova senha
        if (senhaGerada.toString() == listaDeSenhasExistentes[i].toString()) {
          // Repete os blocos de gerar e formatar senha
          senhaGerada = Math.floor(Math.random() * (9999 - 1 + 1) + 1);
          senhaGerada = String(senhaGerada).padStart(4, '0');
        }
      }

      // Insere o valor da senha gerada no campo "Senha"
      document.getElementById('senha').value = senhaGerada;
    }
  }
}

function limpaCamposInclusao() {  
  document.getElementById("itens").value = "";
  document.getElementById("senha").value = "";
}