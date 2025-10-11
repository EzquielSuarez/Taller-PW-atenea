import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';


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
        await loginPage.completarHacerClickLogin(testData.usuarioValido);
        await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible(); // Verificar que aparezca el mensaje de inicio de sesión exitoso
       
        await expect(dashboardPage.dashboardTitle).toBeVisible(); // Verifica que el título del dashboard esté visible
        
    })         
    


})