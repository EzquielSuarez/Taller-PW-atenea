import { test, expect } from '@playwright/test';

test('TC-1: Verificación de elementos visuales en la pagina de registro', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();// Verifica que el campo de nombre esté visible
  await expect(page.locator('input[name="lastName"]')).toBeVisible(); // Verifica que el campo de apellido esté visible
  await expect(page.locator('input[name="email"]')).toBeVisible(); // Verifica que el campo de correo electrónico esté visible
  await expect(page.locator('input[name="password"]')).toBeVisible(); // Verifica que el campo de contraseña esté visible
 
  //Localizar boton Resgistrarse con DATA TEST ID
  await expect(page.getByTestId('boton-registrarse')).toBeVisible(); // Verifica que el botón de registro esté visible
  
 //Localzar boton Registrarse SIN DATA TEST ID
  await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible()

  await expect(page.getByTestId('boton-login-header-signup')).toBeVisible(); // Verifica que el botón de Iniciar Sesión esté visible

});

test('TC-2: Verificar boton de registro esta inhabilitado por defecto', async ({ page }) => {

    await page.goto('http://localhost:3000');

    await expect(page.getByTestId('boton-registrarse')).toBeDisabled(); // Verifica que el botón de registro esté deshabilitado por defecto
  
})

test('TC-3: Verificar que el boton de registro se habilita al llenar el formulario', async ({ page }) => {

    await page.goto('http://localhost:3000');

    // Rellenar los campos del formulario
    await page.locator('input[name="firstName"]').fill('Juan');
    await page.locator('input[name="lastName"]').fill('Pérez');
    await page.locator('input[name="email"]').fill('juan@gamil.com');
    await page.locator('input[name="password"]').fill('Password123');

    // Verificar que el botón de registro esté habilitado
    await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
  
})    

test('TC-4: Verificar redireccionamiento a página de inicio de sesión al hacer clic', async ({ page }) => {

    await page.goto('http://localhost:3000');
    // Hacer clic en el botón de Iniciar Sesión
    await page.getByTestId('boton-login-header-signup').click();
    await expect(page).toHaveURL('http://localhost:3000/login'); //Esperar que la URL sea la de la página de inicio de sesión

    // Verificar que la URL sea la de la página de inicio de sesión
    await expect(page).toHaveURL('http://localhost:3000/login');

    // await page.waitForTimeout(5000); // Esperar 5 segundos para observar el resultado (opcional)

})  

test('TC-5: Verificar registro exitoso y redireccionamiento a la página de inicio', async ({ page }) => {

    await page.goto('http://localhost:3000');

    // Rellenar los campos del formulario
    await page.locator('input[name="firstName"]').fill('Juan');
    await page.locator('input[name="lastName"]').fill('Pérez');
    await page.locator('input[name="email"]').fill('juan'+Date.now().toString()+'@gmail.com'); //Date.now() para evitar duplicados
    await page.locator('input[name="password"]').fill('Password123123');

    // Hacer clic en el botón de registro
    await page.getByTestId('boton-registrarse').click();
    await expect(page.getByText('Registro exitoso!')).toBeVisible(); // Verificar que aparezca el mensaje de registro exitoso
 
})  


test('TC-6: Verificar que un usuario no pueda registrarse con un correo electrónico ya existente', async ({ page }) => {
    const email =  'juan'+Date.now().toString()+'@gmail.com'

    await page.goto('http://localhost:3000');
    // Rellenar los campos del formulario
    await page.locator('input[name="firstName"]').fill('Juan');
    await page.locator('input[name="lastName"]').fill('Pérez');
    await page.locator('input[name="email"]').fill(email); //Date.now() para evitar duplicados
    await page.locator('input[name="password"]').fill('Password123123');    
    // Hacer clic en el botón de registro
    await page.getByTestId('boton-registrarse').click();
    await expect(page.getByText('Registro exitoso!')).toBeVisible(); // Verificar que aparezca el mensaje de registro exitoso
    
    // Volver a la página de registro
    await page.goto('http://localhost:3000');       
    // Rellenar los campos del formulario con el mismo correo electrónico
    await page.locator('input[name="firstName"]').fill('Juan');
    await page.locator('input[name="lastName"]').fill('Perez');
    await page.locator('input[name="email"]').fill(email); // Usar el mismo correo electrónico
    await page.locator('input[name="password"]').fill('Password123123');    
    // Hacer clic en el botón de registro
    await page.getByTestId('boton-registrarse').click();
    await expect(page.getByText('Email already in use')).toBeVisible(); // Verificar que aparezca el mensaje de error
    await expect(page.getByText('Registro exitoso!')).not.toBeVisible(); // Verificar NO que aparezca el mensaje de registro exitoso

})  