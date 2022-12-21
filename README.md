# FindDev - Portas e adaptadores

[![codecov](https://codecov.io/gh/TCC-Gabriel-Danillo/FindDev_Ports_And_Adapters/branch/main/graph/badge.svg?token=7OHIEU88ME)](https://codecov.io/gh/TCC-Gabriel-Danillo/FindDev_Ports_And_Adapters) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=bugs)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=TCC-Gabriel-Danillo_FindDev_Ports_And_Adapters)

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


