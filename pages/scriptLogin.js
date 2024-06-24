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
  // Executar GET para obter dados do usuário pelo email
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
        let senhaCriptografada = dadosUsuario[0].senha; // Senha está criptografada como SHA-256 no servidor

        // Função para calcular o hash da senha inserida pelo usuário
        async function hashSenha(senha) {
          const encoder = new TextEncoder();
          const data = encoder.encode(senha);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
          return hashHex;
        }

        // Hash da senha inserida pelo usuário
        hashSenha(password).then(function(hashDaSenha) {
          if (emailRetornado === email && hashDaSenha === senhaCriptografada) {

            // Verifica se o captcha foi verificado
            if ((grecaptcha.getResponse() == undefined) || (grecaptcha.getResponse() == null) || (grecaptcha.getResponse() == "")){
              alert("Por favor, confirme que você não é um robô (reCAPTCHA)");
            } else {
              // Obtém o código retornado pela verificação do captcha
              const captchaToken = grecaptcha.getResponse();

              // Chama a rota configurada para validar o Token na Google, passando o token obtido
              const requestCaptcha = new XMLHttpRequest();
              requestCaptcha.open('POST', '/api/captcha/', true);
              requestCaptcha.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              requestCaptcha.send(JSON.stringify({
                token: captchaToken
              }));

              requestCaptcha.onreadystatechange = function() {
                if (requestCaptcha.readyState == XMLHttpRequest.DONE) {
                  // Exibe no console o retorno da validação do captcha
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
          } else {
            alert("Email ou senha incorretos. Verifique suas credenciais de acesso.");
          }
        });
      }
    } 
  }
}

function limparLocalStorage(){
  localStorage.clear();
}

window.onload = limparLocalStorage;