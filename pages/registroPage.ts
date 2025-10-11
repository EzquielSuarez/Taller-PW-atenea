import { Page, Locator } from '@playwright/test';

export class RegistroPage {
  readonly page: Page;
  readonly firnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registrarBoton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firnameInput = page.locator('input[name="firstName"]');
    this.lastnameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registrarBoton = page.getByTestId('boton-registrarse');
  }

  async visitarPaginaRistro() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }


  
  async completarFormulario(usuario: { nombre: string; apellido: string; email: string; password: string; }) {
    await this.firnameInput.fill(usuario.nombre);
    await this.lastnameInput.fill(usuario.apellido);
    await this.emailInput.fill(usuario.email);
    await this.passwordInput.fill(usuario.password);
  }

  
  async hacerClickRegistrar() {
    await this.registrarBoton.click();
  }

  async completarHacerClickRegistrar(usuario: { nombre: string; apellido: string; email: string; password: string; }) {
    await this.completarFormulario(usuario);
    await this.hacerClickRegistrar();
  }

};