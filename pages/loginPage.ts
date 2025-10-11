import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBoton: Locator;
  // readonly dashboardTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginBoton = page.getByTestId('boton-login');
    // this.dashboardTitle = page.getByTestId('titulo-dashboard');
  }

  async visitarPaginaLogin() {
    await this.page.goto('http://localhost:3000/login');
    await this.page.waitForLoadState('networkidle');
  }


    async completarLogin(usuario: { email: string; password: string; }) {
    await this.emailInput.fill(usuario.email);
    await this.passwordInput.fill(usuario.password);
  }


  async hacerClickLogin() {
    await this.loginBoton.click();
  }

  async completarHacerClickLogin(usuario: { email: string; password: string; }) {
    await this.completarLogin(usuario);
    await this.hacerClickLogin();
  }

};