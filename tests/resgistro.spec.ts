import { test, expect } from '@playwright/test';
import { RegistroPage } from '../pages/registroPage';
import TestData from '../data/testData.json';

let registroPage: RegistroPage;

//Con el beforeEach se instancia la clase RegistroPage y se navega a la página de registro antes de cada prueba
test.beforeEach(async ({ page }) => {
  registroPage = new RegistroPage(page);
  await registroPage.visitarPaginaRistro();
});


test('TC-1: Verificación de elementos visuales en la pagina de registro', async ({ page }) => {

  // //Localizar los campos del formulario de registro con POM 
  await expect(registroPage.firnameInput).toBeVisible(); // Verifica que el campo de nombre esté visible
  await expect(registroPage.lastnameInput).toBeVisible(); // Verifica que el campo de apellido esté visible
  await expect(registroPage.emailInput).toBeVisible(); // Verifica que el campo de correo electrónico esté visible
  await expect(registroPage.passwordInput).toBeVisible(); // Verifica que el campo de contraseña esté visible
  await expect(registroPage.registrarBoton).toBeVisible(); // Verifica que el botón de registro esté visible

    //Localizar los campos del formulario de registro sin POM
//   await expect(page.locator('input[name="firstName"]')).toBeVisible();
//   await expect(page.locator('input[name="lastName"]')).toBeVisible(); 
//   await expect(page.locator('input[name="email"]')).toBeVisible(); 
//   await expect(page.locator('input[name="password"]')).toBeVisible(); 
 
  //Localizar boton Resgistrarse con DATA TEST ID
  await expect(page.getByTestId('boton-registrarse')).toBeVisible(); // Verifica que el botón de registro esté visible
  
 //Localzar boton Registrarse SIN DATA TEST ID
  //await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible()

  await expect(page.getByTestId('boton-login-header-signup')).toBeVisible(); // Verifica que el botón de Iniciar Sesión esté visible

});

test('TC-2: Verificar boton de registro esta inhabilitado por defecto', async ({ page }) => {

    await expect((registroPage.registrarBoton)).toBeDisabled(); // Verifica que el botón de registro esté deshabilitado por defecto
  
})

test('TC-3: Verificar que el boton de registro se habilita al llenar el formulario', async ({ page }) => {


    // Rellenar los campos del formulario
    await registroPage.completarFormulario(TestData.usuarioValido);

    // Verificar que el botón de registro esté habilitado
    await expect((registroPage.registrarBoton)).toBeEnabled();
  
})    

test('TC-4: Verificar redireccionamiento a página de inicio de sesión al hacer clic', async ({ page }) => {

    
    // Hacer clic en el botón de Iniciar Sesión
    await page.getByTestId('boton-login-header-signup').click();
    await expect(page).toHaveURL('http://localhost:3000/login'); //Esperar que la URL sea la de la página de inicio de sesión

    // Verificar que la URL sea la de la página de inicio de sesión
    await expect(page).toHaveURL('http://localhost:3000/login');

    // await page.waitForTimeout(5000); // Esperar 5 segundos para observar el resultado (opcional)

})  

test('TC-5: Verificar registro exitoso y redireccionamiento a la página de inicio', async ({ page }) => {

    const email =  (TestData.usuarioValido.email).split('@')[0]+Date.now().toString()+'@gmail.com'
    TestData.usuarioValido.email=email;
    

    // Rellenar los campos del formulario
    await registroPage.completarHacerClickRegistrar(TestData.usuarioValido); 

    // Verificar que aparezca el mensaje de registro exitoso
    await expect(page.getByText('Registro exitoso!')).toBeVisible(); 
})  


test('TC-6: Verificar que un usuario no pueda registrarse con un correo electrónico ya existente', async ({ page }) => {
    
    const email =  'juan'+Date.now().toString()+'@gmail.com'
    TestData.usuarioValido.email=email;

    // Rellenar los campos del formulario y hacer clic en el botón de registro
    await registroPage.completarHacerClickRegistrar(TestData.usuarioValido);

    // Verificar que aparezca el mensaje de registro exitoso
    await expect(page.getByText('Registro exitoso!')).toBeVisible(); 

    // Volver a la página de registro
    await registroPage.visitarPaginaRistro();    

    // Rellenar los campos del formulario con el mismo correo electrónico y hacer clic en el botón de registro
     await registroPage.completarHacerClickRegistrar(TestData.usuarioValido);


    await expect(page.getByText('Email already in use')).toBeVisible(); // Verificar que aparezca el mensaje de error
    await expect(page.getByText('Registro exitoso!')).not.toBeVisible(); // Verificar NO que aparezca el mensaje de registro exitoso

})  