import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly botonAgregarCuenta: Locator;
  readonly botonEnviarDinero: Locator;
  readonly saldoTotalDashboard: Locator;
  readonly elementosListaTransferencias: Locator;
  readonly elementosListaMontoTransferencia: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('titulo-dashboard');
    this.botonAgregarCuenta = page.getByTestId('tarjeta-agregar-cuenta');
    this.botonEnviarDinero = page.getByTestId('boton-enviar');
    this.saldoTotalDashboard = page.getByTestId('tarjeta-saldo-total');
    this.elementosListaTransferencias = page.locator('[data-testid="descripcion-transaccion"]');
    this.elementosListaMontoTransferencia = page.locator('[data-testid="monto-transaccion"]');
  }

  async visitarPaginaLogin() {
    await this.page.goto('http://localhost:3000/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async visitarPaginaDashboard() {
    await this.page.goto('http://localhost:3000/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  

    
};