# Interfaces de Usuario 

Este proyecto contiene componentes desarrollados en React, los cuales son embebidos mediante la construcción de archivos bundle. Esta técnica permite compilar componentes desarrollados en React Native o Typescript, de manera que puedan ser usados directamente en las páginas web del Cliente, que en este caso es WordPress. Un ejemplo de esta técnica se explica en el siguiente [link](https://direflow.io/).

# Sistema Remoto

Ejecución de interfaces de usuario para Sistema Remoto:
1. `cd /sistema-remoto`
2. Para despliegue: `npm start`
3. Para compilación: `npm run build`
4. Webpack compilado en archivo bundle: `/sistema-remoto/build/SRComponentBundle.js`
5. Reemplazar el compilado en plataforma web de WordPress en la dirección: `/componentes-cenace/sistema-remoto/SRComponentBundle.js` 
6. Utilizar en páginas web o blogs de Wordpress mediante HTML personalizado: 
- `<script src="/componentes-cenace/sistema-remoto/SRComponentBundle.js"></script>`
- `<div id="component" class="component-container"></div>`
- `<nombre-componente></nombre-componente>`

# Sistema Central

Ejecución de interfaces de usuario para Sistema Remoto:
1. `cd /sistema-central`
2. Para despliegue: `npm start`
3. Para compilación: `npm run build`
4. Webpack compilado en archivo bundle: `/sistema-central/build/SCComponentBundle.js`
5. Reemplazar el compilado en plataforma web de WordPress en la dirección: `/componentes-cenace/sistema-remoto/SCComponentBundle.js` 
6. Utilizar en páginas web o blogs de Wordpress mediante HTML personalizado: 
- `<script src="/componentes-cenace/sistema-central/SCComponentBundle.js"></script>`
- `<div id="component" class="component-container"></div>`
- `<nombre-componente></nombre-componente>`

# Wordpress Plugin
Este plugin permite compartir información propia de Wordpress con los componentes web desarrollados. De esta manera se puede compartir variables del ambiente WordPress para modificar las lógicas internas de los componentes web desarrollados.
1. Modificar el plugin en [/wordpress-plugin/consignaciones-indisponibilidad.php](/wordpress-plugin/consignaciones-indisponibilidad.php)
2. Colocar variables a compartir en [/wordpress-plugin/js/custom.js](/wordpress-plugin/js/custom.js)
3. El plugin debe ser aceptado en la plataforma WordPress **https:/web-wodpress/wp-admin/plugins.php**
4. Cada componente puede hacer uso de estas variables mediante: `localStorage.getItem("variable")` 