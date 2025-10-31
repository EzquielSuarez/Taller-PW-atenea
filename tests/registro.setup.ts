import { test as setup, expect, Request } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalCrearCuenta } from '../pages/modalCrearCuenta';
import fs from 'fs/promises'; //fs/promises es una API de Node.js que proporciona métodos para interactuar con el sistema de archivos de forma asíncrona.
import path from 'path'; //El path nos ayuda a encontrar o trabajar archivos dentro de un directorio


let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuentaPage: ModalCrearCuenta;

const usuarioEnviaAuthfile =  './playwright/.auth/usuarioEnvia.json';
const usuarioRecibeAuthfile = './playwright/.auth/usuarioRecibe.json';
const usuarioEnviaDataFile = './playwright/.auth/usuarioEnvia.data.json';


//Con el beforeEach se instancia la clase RegistroPage y se navega a la página de registro antes de cada prueba
setup.beforeEach(async ({ page }) => {
   loginPage = new LoginPage(page);
   dashboardPage = new DashboardPage(page);
   modalCrearCuentaPage = new ModalCrearCuenta(page);
   await loginPage.visitarPaginaLogin();
   
});
 


setup('Generar usuario que envía dinero', async ({ page, request }) => {
    // Crear un nuevo usuario a través de la API utilizando BackendUtils
    const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

    //Guardamos los datos del nuevo usuario para poder usarlo en los test de transacciones
    //fs -> file system (sistema de archivos)
    //writeFile -> escribe en un archivo, si el archivo no existe, lo crea. Si existe, lo sobreescribe
    //path.resolve(__dirname,'..', usuarioEnviaDataFile) -> Se encarga de construir la ruta absoluta y segura del archivo que se va a crear
    //JSON.stringify(nuevoUsuario, null, 2) -> Convierte el objeto nuevoUsuario a una cadena JSON con indentación de 2 espacios
    //El objetivo de esta linea de codigo es persister los datos del nuevo usuario para poder usarlos en los test de transacciones
    await fs.writeFile(path.resolve(__dirname,'..', usuarioEnviaDataFile), JSON.stringify(nuevoUsuario, null, 2));


    await loginPage.completarHacerClickLogin({ email: nuevoUsuario.email, password: TestData.usuarioValido.password });
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();

    await dashboardPage.botonAgregarCuenta.click();
    await modalCrearCuentaPage.seleccionarTipoDeCuenta('Débito');
    await modalCrearCuentaPage.ingresarMonto('1000');
    await modalCrearCuentaPage.crearCuentaButton.click();
    await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();
    await page.context().storageState({ path: usuarioEnviaAuthfile });

})


setup('Loguearse con usuario que recibe dinero', async ({ page }) => {
    await loginPage.completarHacerClickLogin(TestData.usuarioValido);
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await page.context().storageState({ path: usuarioRecibeAuthfile });

})
