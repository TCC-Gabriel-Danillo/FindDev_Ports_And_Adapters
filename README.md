# FindDev

[![codecov](https://codecov.io/gh/TCC-Gabriel-Danillo/FindDev_Ports_And_Adapters/branch/main/graph/badge.svg?token=7OHIEU88ME)](https://codecov.io/gh/TCC-Gabriel-Danillo/FindDev_Ports_And_Adapters)

### Encontre incríveis desenvolvedores próximos a você. 

Esse é um aplicativo destinado para comunidade de desenvolvedores encontrar outros desenvolvedores próximos. 

<div style="display: flex; flex-direction: row; margin: 0 0 50px 0">
  <img src="assets/screen1.png" width="200px" style="margin: 0 5px"/> 
  <img src="assets/screen2.png" width="200px" style="margin: 0 5px"/> 
  <img src="assets/screen3.png" width="200px" style="margin: 0 5px"/> 
</div>



### Requisitos

- Instalar o expo local e em seu smatphone [Expo](https://expo.dev/)
- Configurar um projeto no [firebase](https://firebase.google.com/) 

### Configucação

Adicione dentro da pasta src/Ui/src/config/ um arquivo chamado config.json com o seguinte formato: 

````
{
    "apiKey": "",
    "authDomain": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": "",
    "measurementId": ""
  }
  ````
Os dados acima são obtivos após a criação de um novo projeto no Firebase. 

### Executar

Para executar o projeto, basta entrar na pasta src/Ui e executar o seguinte comando

````
  expo start 
````


