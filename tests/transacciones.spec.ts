import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalEnviarTransferencia } from '../pages/modalEnviarTransferencia';
import TestData from '../data/testData.json';
import fs from 'fs/promises';
import path from 'path';
import { request } from 'http';

let dashboardPage: DashboardPage;
let modalEnviarTransferencia: ModalEnviarTransferencia;

const testUsuarioEnvia = test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioEnvia.json')
});

const testUsuarioRecibe = test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioRecibe.json')
});

test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    modalEnviarTransferencia = new ModalEnviarTransferencia(page);
    await dashboardPage.visitarPaginaDashboard();
})

testUsuarioEnvia('TC-12 Verificar que el usuario envia una transacción', async ({ page }) => {
    await expect( dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.botonEnviarDinero.click();
    await modalEnviarTransferencia.completarHacerClickEnviar(TestData.usuarioValido.email, '100');
    await expect(page.getByText('Transferencia enviada a '+TestData.usuarioValido.email)).toBeVisible();
    
});


testUsuarioRecibe('TC-13 Verificar que el usuario recibe una transacción', async ({ page }) => {
    await expect( dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByTestId('monto-transaccion').first()).toBeVisible();
    
});

//Test unificado que envia dinero por API y recibe por UI
testUsuarioRecibe('TC-14 Verificar transferencia recibida (Enviada por API)', async ({ page, request }) => {
    //#1 Prepareción para lecturas de de datos y token jwt del remitente.
    //Leemos el archivo JSON que contiene los datos del usuario que envia dinero para obtener el email y el password
    const usuarioEnviaData = require.resolve('../playwright/.auth/usuarioEnvia.data.json'); //Ubicamos el archivo JSON que contiene los datos del usuario que envia dinero
    const usuarioEnviaContenidoData = await fs.readFile(usuarioEnviaData, 'utf-8'); //Leemos el contenido del archivo JSON
    const datosDeUsuarioEnvia = JSON.parse(usuarioEnviaContenidoData); //Convertimos el objeto de Js a un JSON
    const emailDeUsuarioEnvia = datosDeUsuarioEnvia.email; //Obtenemos el email del usuario que envia dinero
    expect (emailDeUsuarioEnvia, 'El email del usuario que envia dinero no es valido').toBeDefined();

    //Leemos el archivo autentificación del usuario que envia dinero para obtener el token jwt
    const usuarioEnviaAuth = require.resolve('../playwright/.auth/usuarioEnvia.json'); //Ubicamos el archivo JSON que contiene los datos del usuario que envia dinero
    const usuarioEnviaContenidoAuth = await fs.readFile(usuarioEnviaAuth, 'utf-8'); //Leemos el contenido del archivo JSON
    const datosDeUsuarioEnviaAuth = JSON.parse(usuarioEnviaContenidoAuth); //Convertimos el objeto de Js a un JSON

    //Obtenemos el token jwt del usuario que envia dinero
    //find() Encontrar, es un método que busca un elemento en un array que cumpla con una condición
    //item.name === 'jwt' es la condición que busca el elemento jwt
    //? es un operador llamado encadenamiento opcional (optional chaining) que indica que el elemento puede ser undefined
    const jwtDeUsuarioEnvia = datosDeUsuarioEnviaAuth.origins[0]?.localStorage.find((item: { name: string; }) => item.name === 'jwt');
    expect (jwtDeUsuarioEnvia, 'El token jwt del usuario que envia dinero no es valido').toBeDefined();

    const jwt = jwtDeUsuarioEnvia.value;

    //#2 Acción: Obeter Cuenta y Enviar transferencias via API

    //Payload -> Es el cuerpo de la solicitud HTTP

    //Primero, obtenemos la cuenta del remitente para conover el ID del origen. 
    const respuestaDeCuentas = await request.get('http://localhost:6007/api/accounts', {    
        headers: {
            'Authorization': `Bearer ${jwt}`  //Bearer es un tipo de autenticación que se utiliza en la web para identificar a un usuario
        }
    })

    expect(respuestaDeCuentas.ok(), `La API para obetner cuenta falló: status ${respuestaDeCuentas.status()}`).toBeTruthy(); //toBeTruthy es un matcher (compara valores)que verifica que la respuesta sea exitosa 
    const cuentas = await respuestaDeCuentas.json();
    expect(cuentas.length, 'No se encontraron cuentas').toBeGreaterThan(0); //toBeGreaterThan es un matcher (compara valores)que verifica que el valor sea mayor a 0
    const idDeCuentaOrigen = cuentas[0]._id; //Obtenemos el ID de la cuenta origen

    
    const montoAleatorio = Math.floor(Math.random() * 100) + 1; //Generamos un monto aleatorio entre 1 y 100

    //Imprimimos en consola el monto aleatorio, el ID de la cuenta origen y el email del destinatario
    console.log(`Enviando transferendia de ${montoAleatorio} desde la cuenta ${idDeCuentaOrigen} a ${TestData.usuarioValido.email}`);

    // //Ahora con todos los datos, podemos enviar la transferencia de dinero de una cuenta a otra.
    const respuestaDeTransferencia = await request.post('http://localhost:6007/api/transactions/transfer', {
        headers: {
            'Authorization': `Bearer ${jwt}` 
        },
        data: { //Info del Payload
            fromAccountId: idDeCuentaOrigen, //fromAccount -> es el ID de la cuenta origen
            toEmail: TestData.usuarioValido.email, //toAccount -> es el email del destinatario fijo
            amount: montoAleatorio //amount -> es el monto de la transferencia
        }
    })

    expect(respuestaDeTransferencia.ok(), `La API para transferir el dinero fallo ${respuestaDeTransferencia.status()}`).toBeTruthy();


    //#3 Verificación: Comprobar que el monto llego a destinatario por UI

    await page.reload(); //Recargamos la página para que se actualicen los datos
    await page.waitForLoadState('networkidle'); //Esperamos a que la página se cargue completamente
    await expect(dashboardPage.dashboardTitle).toBeVisible();

    //Verificamos que se visualice el email del remitente en la lista de la ultima transferencia
    await expect(dashboardPage.elementosListaTransferencias.first()).toContainText(emailDeUsuarioEnvia);

    //Verificamos que se visualice el monto en la lista de la ultima transferencia
    //Usamos una expresión regular para buscar el numero (ej. 5.00
    //montoRegex -> es una expresión regular que busca el numero (ej. 5.00)
    //Expresión regular -> es una secuencia de caracteres que define un patrón de búsqueda, patron de busqueda de texto
    //RegExp -> es una clase que permite crear una expresión regular
    const montoRegex = new RegExp(String(montoAleatorio.toFixed(2))); //toFixed(2) es un método que convierte un número a una cadena de texto con 2 decimales
    
    await expect(dashboardPage.elementosListaMontoTransferencia.first()).toContainText(montoRegex);
    

});
