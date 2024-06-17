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
  const caminho = '/api/usuarios/' + email;

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

        // Somente realiza o bloco abaixo se o email e senha estiverem corretos
        if(emailRetornado == email && senhaRetornada == password){

          // Se o captcha não foi verificado, exibe alerta na tela
          if ((grecaptcha.getResponse() == undefined) || (grecaptcha.getResponse() == null) || (grecaptcha.getResponse() == "")){
            alert("Por favor, confirme que você não é um robô (reCAPTCHA)");
          }
          else {

            // Obtém o código retornado pela verificação quando o usuário confirma as imagens do captcha
            const captchaToken = grecaptcha.getResponse();

            // Chama a rota configurada para validar o Token na Google, passando o token obtido acima
            const requestCaptcha = new XMLHttpRequest();
            requestCaptcha.open('POST', '/api/captcha/', true);
            requestCaptcha.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            requestCaptcha.send(JSON.stringify({
              token: captchaToken
            }));

            requestCaptcha.onreadystatechange = function() {

              if (requestCaptcha.readyState == XMLHttpRequest.DONE) {
                
                // Exibe no console o retorno da requisição da rota que valida o captcha
                if (requestCaptcha.responseText.trim() != '') {                
                  responseCaptcha = JSON.parse(requestCaptcha.responseText);
                  console.log("Resultado da validação do captcha:\n\tStatus da requisição: " + requestCaptcha.status + "\n\tMensagem retornada: '" + responseCaptcha.message + "'");
                }

                // Se o captch retornar sucesso, redireciona para a página inicial, senão exibe alerta de erro
                if (requestCaptcha.status == 200) {

                  localStorage.setItem('email', emailRetornado);
                  localStorage.setItem('nome', nomeRetornado);
                  window.location.href = '/';

                } else {
                  alert("Ocorreu um erro ao tentar validar o 'Não sou um robô' (reCAPTCHA)")     
                }
                
              }
            }            
          }

        }
        else{
          alert("Algo deu errado. Verifique suas credenciais de acesso");
        }
      }
    } 
  }
}

function limparLocalStorage(){
  localStorage.clear();
}

window.onload = limparLocalStorage;