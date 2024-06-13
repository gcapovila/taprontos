function realizaLogin() {
  if(!document.getElementById('email').value){
    alert("Por favor, preencha o campo Email");
  } 
  else if(!document.getElementById('password').value){
    alert("Por favor, preencha o campo Senha");
  }  
  else{
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    validaLogin(email, password)  
  }
}

function validaLogin(email, password){
  // Executar GET para comparar email e senha
  const caminho = '/api/usuario/' + email;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', caminho);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();

  xmlhttp.onreadystatechange = function(){
    let dadosUsuario = "";

    if (xmlhttp.responseText != ""){
      dadosUsuario = JSON.parse(xmlhttp.responseText);
    }

    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){
      if (dadosUsuario[0] == undefined){
        alert("Email " + email + " não encontrado!")
      }
      else{
        let nomeRetornado = dadosUsuario[0].nome;
        let emailRetornado = dadosUsuario[0].email;
        let senhaRetornada = dadosUsuario[0].senha;

        if(emailRetornado == email && senhaRetornada == password){
          localStorage.setItem('email', emailRetornado);
          localStorage.setItem('nome', nomeRetornado);
          window.location.href = '/';
        }
        else{
          alert("Algo deu errado. Verifique suas credenciais de acesso");
        }
      }
    } 
  }
}