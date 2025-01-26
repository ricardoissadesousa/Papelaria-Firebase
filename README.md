# CRUD de Banco de Dados com JavaScript, HTML, CSS e Firebase

Este projeto foi desenvolvido como parte da disciplina de Banco de Dados, criado pelos alunos **Ricardo** e **Erick**. É uma aplicação CRUD (Create, Read, Update, Delete) que utiliza JavaScript, HTML, CSS e Firebase.

## Funcionalidades

- **Criar**: Adicionar novos registros ao banco de dados.
- **Ler**: Exibir os registros armazenados.
- **Atualizar**: Modificar registros existentes.
- **Deletar**: Remover registros do banco de dados.

## Tecnologias Utilizadas

- **JavaScript**: Para a lógica de aplicação.
- **HTML**: Para a estrutura da página web.
- **CSS**: Para a estilização da página.
- **Firebase**: Para o banco de dados em tempo real.

## Instalação

1. Clone este repositório para o seu ambiente local:
    ```sh
    git clone https://github.com/username/repository.git
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd nome-do-diretorio
    ```
3. Abra o arquivo `index.html` no seu navegador para ver a aplicação em execução.

## Configuração do Firebase

1. Crie uma conta no [Firebase](https://firebase.google.com/).
2. Crie um novo projeto no Firebase.
3. No seu projeto do Firebase, acesse "Configurações do Projeto" e copie as configurações da sua aplicação.
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

## Estrutura do Projeto

```plaintext
├── index.html
├── style.css
├── script.js
└── README.md
