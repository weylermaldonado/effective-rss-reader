# Reporte de desempeño

> Elaborado por: 
> * Weyler Maldonado
> * José May

## Introducción

El presente proyecto, consiste en un lector de canales RSS de **5 diferentes sitios web**, estos son:
* [Blog de Medium de Soldai](https://medium.com/soldai/soldai-8e239bb0eb7)
* [El diario de Yucatán](https://www.yucatan.com.mx/)
* [Cog blog](http://web.colby.edu/cogblog/)
* [EDTeam Blog](https://ed.team/blog)
* [New York Times](https://www.nytimes.com/es/)

El sistema cuanta con cuatro componentes[Figura 1], el servicio web, el cliente, la base de datos y los respectivos canales RSS de los sitios web. El cliente siendo una extensión del navegador Google Chrome, consulta a dos diferentes _end points_, siendo estos: `/webhooks/feed` y `/webhooks/feed?refresh_all=false`. El primer end point se carga automáticamente al abrir la extensión, mientras que el otro se ejecuta cuando se toca el botón de _refrescar_. 

La arquitectura de ambos lados del proyecto se describe en las secciones siguientes.

## Descripción de lado del cliente
De lado del cliente fue construido utilizando HTML plano, Materialize CSS para la maquetación y JQuery para la interacción entre el cliente y el servicio web. Para la optimización de esta parte, se utilizó únicamente un _CDN_ que es de una fuenta de google que pide la documentación de Materialize CSS. Mientras que las tecnologías antes mencionadas (Materialize CSS y JQuery) fueran descargadas y puestas localmente junto con el proyecto, usando la versión minimificada de cada una; así como los propios estilos, el archivo HTML y los archivos Javascript fueron minimificados.

Se optó el **no** usar usar algún framework y/o librería para construir el cliente, puesto que, se consideró bastante pesado para este proyecto, dado que el manejador de dependencias de algún framework Javascript (node_modules) es bastante pesado para empaquetar en una extensión de Google Chrome.


## Descripción de lado del servidor
Este proyecto fue construido, de lado del servidor, usando la tecnología de **NodeJS** teniendo como dependencias _core_ **ExpressJS**, **Mysql** y **RSS-Parser**. Se optó por una base de datos relacional dado que las sentencias de búsqueda son más flexibles en comparación a las base de datos no relacionales; dicho esto, las funciones de búsqueda e inserción de datos en la base de datos cumplen con la complejidad `O(N)`. Como ya se dijo, el servidor cuenta con dos end points principales `/webhooks/feed` y `/webhooks/feed?refresh_all=false`, a continuación de describen puntualmente el funcionamiento de cada uno: 
* `/webhooks/feed?refresh_all=false` : Consulta directamente la base de datos, sin actualizarla y sin consultar los feeds de los sitios web, por lo que devuelve la última información insertada en la base de datos.  
* `/webhooks/feed` : Primero consulta cada feed de los sitios web, los guarda en la base de datos, luego consulta la base de datos devolviendo la información más reciente.

Dado que el servidor fue construido usando funciones asíncronas, la omptimización únicamente se dio con simplemente minimizar el meter éstas funciones dentro de bucles y el modulalizar cada función lo máximo posible, así como se optó por la transferencia entre cliente-servidor mediante JSON, por la flexibilidad y ligereza de los mismos. Por otro lado, en cuanto a la base de datos, se optó por devolver únicamente 10 resultados en las búsquedas para optimizar el tiempo de respuesta de estos mismos; de igual manera se usó como llave única el título del artículo, dicho esto la sentencia que actualiza fue `ON DUPLICATE KEY` dado que, como el nombre lo indica en cada incidencia sólamente actualiza los mismos campos del dato, se consideró el usar `INSERT IGNORE` pero dado a la cantidad de consultas que se pueden llegar a dar, al sólo lanzar advertencias al encontrar incidencias, esto mismo causaba errores en algún punto del desempeño del proyecto.

## Desempeño
Para la prueba de desempeño se utlizó el software **JMeter**, se utilizó como paramétros en la suite de pruebas lo siguiente:
### Endpoint a probar `/webhooks/feed?refresh_all=false`:
* **Prueba 1:** Se relizaron 100 peticiones en un lapso de 10 segundos, se puede observar que el promedio de respuesta sin ninguna petición fallida fue de 0.005 segundos. A continuación se muestran los resultados:
![](evidencia2.png)
* **Prueba 2:** Se relizaron 100 peticiones en un lapso de 100 segundos,  se puede observar que el promedio de respuesta sin ninguna petición fallida fue de 0.006 segundos. A continuación se muestran los resultados:
![](evidencia1.png)
### Endpoint a probar `/webhooks/feed`:
* **Prueba 1:** Se relizaron 100 peticiones en un lapso de 10 segundos, se puede observar que el promedio de respuesta con cuatro peticiones fallidas fue de 47.909 segundos. A continuación se muestran los resultados:
![](evidencia4.png)
* **Prueba 2:** Se relizaron 100 peticiones en un lapso de 100 segundos,  se puede observar que el promedio de respuesta sin ninguna petición fallida fue de 4.399 segundos. A continuación se muestran los resultados:
![](evidencia3.png)
## Trabajo futuro
A continuación se enlistan ideas de mejoras del proyecto:

* Se propone llevar a cabo una versión de este proyecto utilizando sockets, dado que así se minimizaría la demora entre el cliente-servidor al igual que mejoraría la experiencia de usuario al eliminar el botón de _actualizar_, dado que crearía una pila de noticias nuevas y entrantes (al estilo de twitter). 
* Se propone una reestruturación del proyecto, a tal punto que se puedan consultar N cantidad de canales RSS de sitios web, únicamente leyéndoles de un archivo JSON.

## Anexos