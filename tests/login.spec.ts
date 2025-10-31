import { test, expect, Request } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import TestData from '../data/testData.json';
import { BackendUtils } from '../utils/backendUtils';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

//Con el beforeEach se instancia la clase RegistroPage y se navega a la página de registro antes de cada prueba
test.beforeEach(async ({ page }) => {
   loginPage = new LoginPage(page);
   dashboardPage = new DashboardPage(page);
   await loginPage.visitarPaginaLogin();
});

test('TC-7: Verificación de elementos visuales en la pagina de login', async ({ page }) => {

    await test.step('Dado que navego en la pagina de login, valido los campos', async () => {
        await expect(loginPage.emailInput).toBeVisible(); // Verifica que el campo de correo electrónico esté visible
        await expect(loginPage.passwordInput).toBeVisible(); // Verifica que el campo de contraseña esté visible
        await expect(loginPage.loginBoton).toBeVisible(); // Verifica que el botón de login esté visible
    })
    
    await test.step('Valido el boton Registrarse', async () => {
        await expect(page.getByTestId('link-registrarse-login')).toBeVisible(); // Verifica que el botón de registro esté visible
    })

    await test.step('Valido el boton Crear Cuenta', async () => {
        await expect(page.getByTestId('boton-signup-header')).toBeVisible(); // Verifica que el botón de Crear Cuenta esté visible
    })
})

test('TC-8: Verificar inicio de sesión exitoso con credenciales validas', async ({ page }) => {

    await test.step('Cuando completo el formulario de login con credenciales válidas y hago click en el boton login', async () => {
        await loginPage.completarHacerClickLogin(TestData.usuarioValido);
        await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible(); // Verificar que aparezca el mensaje de inicio de sesión exitoso
       
        await expect(dashboardPage.dashboardTitle).toBeVisible(); // Verifica que el título del dashboard esté visible
        
    })         
    


})


test('TC-11 Loguearse con nuevo usuario creado por backend', async ({ page, request }) => {
  // Crear un nuevo usuario a través de la API utilizando BackendUtils
  const backendUtils = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);
  
 // await test.step('Cuando completo el formulario de login con credenciales válidas y hago click en el boton login', async () => {
 const respondePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
 
 await loginPage.completarHacerClickLogin({ email: backendUtils.email, password: TestData.usuarioValido.password });


 const responseLogin = await respondePromiseLogin;//Espera la respuesta de la solicitud de inicio de sesión
 const respondePromiseLoinJson = await responseLogin.json();//Convierte la respuesta (JSON) en un objeto JS que podés leer y validar.

 expect(responseLogin.status()).toBe(200); // Verifica que el estado de la respuesta sea 200 (OK)
 expect(respondePromiseLoinJson).toHaveProperty('token'); // Verifica que la respuesta tenga la propiedad 'token'
 expect (typeof respondePromiseLoinJson.token).toBe('string'); // Verifica que el token sea una cadena de texto
 expect(respondePromiseLoinJson).toHaveProperty('user'); // Verifica que la respuesta tenga la propiedad 'user'
 expect(respondePromiseLoinJson.user).toEqual(expect.objectContaining({  //Verifica que el objeto user contenga las siguientes propiedades
    id: expect.any(String), 
    firstName: TestData.usuarioValido.nombre,
    lastName: TestData.usuarioValido.apellido,
    email: backendUtils.email,//Usa el email generado por la API
   }));
 
 
    // await loginPage.completarHacerClickLogin({email: email, password: TestData.usuarioValido.password});
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible(); // Verificar que aparezca el mensaje de inicio de sesión exitoso
    await expect(dashboardPage.dashboardTitle).toBeVisible(); // Verifica que el título del dashboard esté visible
        
          

})