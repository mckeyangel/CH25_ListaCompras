let txtNombre = document.getElementById("Name");
let txtNumber = document.getElementById("Number");

let btnAgregar = document.getElementById("btnAgregar");
let btnClear = document.getElementById("btnClear");

let alertValidaciones = document.getElementById("alertValidaciones");
let alertValidacionesTexto = document.getElementById("alertValidacionesTexto");

let tabla = document.getElementById("tablaListaCompras");
let cuerpoTabla = tabla.getElementsByTagName("tbody");//Busca solo dentro de la tabla al Elemento tbody

let contadorProductos = document.getElementById("contadorProductos");//Llama
let productosTotal = document.getElementById("productosTotal");
let precioTotal = document.getElementById("precioTotal");

let isValid = true;//Variable para validar campos en el btn agregar
let idTimeout;
let precio = 0;
let contador = 0;
let totalEnProductos = 0;
let costoTotal = 0;

let datos = [];//Aquí se alamacenrán los datos de la tabla
// Limpiar Campos
btnClear.addEventListener("click", function (event) {
    event.preventDefault();
    txtNombre.value = "";
    txtNumber.value = "";
    cuerpoTabla[0].innerHTML = "";

    contador = 0;
    totalEnProductos = 0;
    costoTotal = 0;
    contadorProductos.innerTex = "0";
    productosTotal.innerText = "0";
    precioTotal.innerText = "$ 0";

    localStorage.setItem("contadorProductos", contador);
    localStorage.setItem("totalEnProductos", totalEnProductos);
    localStorage.setItem("costoTotal", costoTotal.toFixed(2));

});//click btnClear

function validarCantidad() {
    if (txtNumber.value.length == 0) {
        return false;
    }//if para validar contenido

    if (isNaN(txtNumber.value)) {
        return false;
    }//if para saber si es un número

    if (parseFloat(txtNumber.value) <= 0) {
        return false;
    }//if para evitar que sea negativo un número

    return true;
}//validarCantidad

function getPrecio() {
    return Math.floor(Math.random() * 50 * 100) / 100;//Math.random crea un num al azar se multiplica por *50 y *100 para crear un numero entero se divide /100 y .floor redondea hacia abajo para dejar con 2 decimales
}//getPrecio genera un precio aleatorio

btnAgregar.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(getPrecio());
    isValid = true;
    clearTimeout(idTimeout);
    alertValidacionesTexto.innerHTML = "";
    alertValidaciones.style.display = "none";
    let lista = "Los siguientes campos deben ser llenados correctamente:<ul>";
    if (txtNombre.value.length < 2) {
        txtNombre.style.border = "solid thin red";//Agrega borde en rojo
        lista += "<li>Se debe escribir un campo válido</li>";
        alertValidaciones.style.display = "block";
        isValid = false;
    } else {
        txtNombre.style.border = "";
    }//if txtNombre

    if (!validarCantidad()) {// ! negación de la función
        txtNumber.style.border = "solid thin red";//Agrega borde en rojo
        lista += "<li>Se debe escribir una cantidad válida";
        alertValidaciones.style.display = "block";
        isValid = false;
    } else {
        txtNumber.style.border = "";
    }//if txtNumber
    lista += "</ul>";
    alertValidacionesTexto.insertAdjacentHTML("beforeend", lista);
    idTimeout = setTimeout(function () {
        alertValidaciones.style.display = "none";
    }, 5000);//setTimeout da un tiempo determinado en milisegundos para realizar una función 
    if (isValid) {
        precio = getPrecio();
        contador++;
        let row = `<tr>
                  <th>${contador}</th>
                  <td>${txtNombre.value}</td>
                  <td>${txtNumber.value}</td>
                  <td>$ ${precio}</td>
              </tr>`;

        let elemento = `{
                       "id": ${contador},
                       "nombre" : "${txtNombre.value}",
                       "cantidad" : "${txtNumber.value}",
                       "precio" : "${precio}"
                       }`; //Se crea JSON para el arreglo datos
        datos.push(JSON.parse(elemento));//Se agregan elementos al arreglo//Se convierte JSON a objeto 

        localStorage.setItem("datos", JSON.stringify(datos));//Se guarda en navegador//JSON.stringify convierte el arreglo a string

        cuerpoTabla[0].insertAdjacentHTML("beforeend", row);//Insertar dentro del cuerpo de la tabla
        contadorProductos.innerText = contador;//Muestra el contador de productos en resultado
        totalEnProductos += parseFloat(txtNumber.value);//Suma la cantidad de los productos
        productosTotal.innerText = totalEnProductos;//Muestra la suma de la cantidad de productos
        costoTotal += precio * parseFloat(txtNumber.value);
        precioTotal.innerText = "$ " + costoTotal.toFixed(2);
        let resumen = `{"contadorProductos" : ${contador},
        "totalEnProductos" : ${totalEnProductos},
        "costoTotal" : ${costoTotal.toFixed(2)}}`;//Sintaxis JSON
        localStorage.setItem("resumen", resumen);//Se guardan los elementos en el navegador de forma local
        //++++++++++++++++++Se comentan para implementar JSON+++++++++++++++//
        // localStorage.setItem("contadorProductos", contador);
        // localStorage.setItem("totalEnProductos", totalEnProductos);
        // localStorage.setItem("costoTotal", costoTotal.toFixed(2));//guardar info en el navegador
        txtNombre.value = "";
        txtNumber.value = "";
        txtNombre.focus();//Coloca el foco en ese punto
    }//if de validación para agregar o no a la tabla
});// btnAgregar click

txtNumber.addEventListener("blur", function (event) {
    event.preventDefault();
    txtNumber.value = txtNumber.value.trim();
});// txtNumber .blur

txtNombre.addEventListener("blur", function (event) {
    event.preventDefault();
    txtNombre.value = txtNombre.value.trim();//.trim borra los espacios 
});// txtNombre .blur //Al salir del campo se activa

window.addEventListener("load", function (event) {//Mantiene los valores en el resumen aunque se actualice el navegador
    if (localStorage.getItem("resumen") == null) {
        let resumen = `{"contadorProductos" : ${contador},
        "totalEnProductos" : ${totalEnProductos},
        "costoTotal" : ${costoTotal.toFixed(2)}}`;
        localStorage.setItem("resumen", resumen);
    }//if
    let res = JSON.parse(localStorage.getItem("resumen"));//Se convierte el valor producido y sus propiedades, y devuelve el valor
    if (localStorage.getItem("datos") != null){
        datos = JSON.parse(localStorage.getItem("datos"));
        
        datos.forEach(r => {
            let row = `<tr>
                  <th>${r.id}</th>
                  <td>${r.nombre}</td>
                  <td>${r.cantidad}</td>
                  <td>$ ${r.precio}</td>
              </tr>`;
              cuerpoTabla[0].insertAdjacentHTML("beforeend", row);//Llama a la tabla y agrega elementos
        });
    }//if !null diferente de null
    
    
    
    
    // if (localStorage.getItem("contadorProductos")==null){
    //     localStorage.setItem("contadorProductos", "0");
    // }//if
    // if (localStorage.getItem("totalEnProductos")==null){
    //     localStorage.setItem("totalEnProductos", "0");
    // }//if
    // if (localStorage.getItem("costoTotal")==null){
    //     localStorage.setItem("costoTotal", "0.0");
    // }//if
    contador = res.contadorProductos; //parseInt(localStorage.getItem("contadorProductos"));
    totalEnProductos = res.totalEnProductos;//parseInt(localStorage.getItem("totalEnProductos"));
    costoTotal = res.costoTotal;//parseFloat(localStorage.getItem("costoTotal"));

    contadorProductos.innerTex = contador;
    productosTotal.innerText = totalEnProductos;
    precioTotal.innerText = "$ " + costoTotal;
});