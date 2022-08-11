# Controle de estoque

## Entrada de estoque

Tela de entrada

![alt text](https://github.com/Hospital-Adventista-de-Manaus/controle_estoque_frontend/blob/main/img/tela.png)

Item duplicado

![alt text](https://github.com/Hospital-Adventista-de-Manaus/controle_estoque_frontend/blob/main/img/duplicado.png)

Remover item

![alt text](https://github.com/Hospital-Adventista-de-Manaus/controle_estoque_frontend/blob/main/img/remover.png)

Tela de envio

![alt text](https://github.com/Hospital-Adventista-de-Manaus/controle_estoque_frontend/blob/main/img/envio.png)

## Erro

1.
    An unhandled exception occurred: Transform failed with 1 error:
    error: Invalid version: "15.2-15.3"
    See "/tmp/ng-eL5u9i/angular-errors.log" for further details.


You can simply add

not ios_saf 15.2-15.3
not safari 15.2-15.3

in your .browserslistrc file of your project

2. 

Warning: bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 1.57 MB with a total of 2.06 MB.

Error: bundle initial exceeded maximum budget. Budget 1.00 MB was not met by 1.06 MB with a total of 2.06 MB.

https://stackoverflow.com/a/53995996/6754506

Open angular.json file and find budgets keyword.

It should look like:

    "budgets": [
       {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
       }
    ]
As you’ve probably guessed you can increase the maximumWarning value to prevent this warning, i.e.:

    "budgets": [
       {
          "type": "initial",
          "maximumWarning": "4mb", <===
          "maximumError": "5mb"
       }
    ]

## Htaccess

    RewriteEngine On
    # If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]

    # If the requested resource doesn't exist, use index.html
    RewriteRule ^ /controle-estoque/index.html

## Build

   ng build --configuration production --base-href /controle-estoque/
