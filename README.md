# vuesqldesignerfrontend

> A Vue.js project

This project is a try to rewrite excellent application "wwwsqldesigner" created by ondras (https://github.com/ondras/wwwsqldesigner)
by using new framework "VUE".  
Repository "vuesqldesignerfrontend" (https://github.com/shaci/vuesqldesignerfrontend) consists front-end part of application.  
Server part is located in repository named "vuesqldesignerserver" (https://github.com/shaci/vuesqldesignerserver).  
Steps to run application:  
1. clone "vuesqldesignerfrontend" repository  
2. install dependencies - "npm install"  
3. run server for front-end part of application "npm run dev"  (serve with hot reload at localhost:8080)
4. clone "vuesqldesignerserver" repository  
5. run server part  
  Example for Apache:  
  5.1 create virtual hosts  
  ``` bash
  # create virtual hosts
  <VirtualHost *:80>
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "C:/xampp/htdocs/websqldesignerserver"
    ServerName websqldesignerserver
    ErrorLog "logs/dummy-host2.example.com-error.log"
    CustomLog "logs/dummy-host2.example.com-access.log" common
  </VirtualHost>
  ```
  5.2 Add record into hosts file  
    127.0.0.1 websqldesignerserver
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
