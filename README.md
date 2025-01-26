# CRUD com JavaScript, HTML, CSS e Firebase

Este projeto, desenvolvido por **Ricardo** e **Erick**, é uma aplicação CRUD (Create, Read, Update, Delete) que utiliza JavaScript, HTML, CSS e Firebase para o banco de dados em tempo real.

## Funcionalidades

- **Criar**: Adicionar novos registros
- **Ler**: Exibir registros
- **Atualizar**: Modificar registros existentes
- **Deletar**: Remover registros

## Tecnologias Utilizadas

- **JavaScript**
- **HTML**
- **CSS**
- **Firebase**

## Configuração do Firebase

1. Crie uma conta no [Firebase](https://firebase.google.com/).
2. Crie um novo projeto no Firebase.
3. Acesse as "Configurações do Projeto" e copie as configurações da sua aplicação.
4. Adicione as configurações do Firebase no seu projeto:

    ```javascript
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SEU_APP_ID",
        measurementId: "SEU_MEASUREMENT_ID"
    };
    firebase.initializeApp(firebaseConfig);
    ```

---

Espero que tenha ficado mais bonito e direto ao ponto! 😊
