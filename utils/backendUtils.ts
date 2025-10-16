// import { Page, Locator, Request } from '@playwright/test';

// export class BanckendUtils {
//   readonly page: Page;
  
//   constructor(page: Page) {
//     this.page = page;
    
//   }

//   async enviarRequestBankend(endopoint: string) {
//     const response = await request.post('http://localhost:6007/api/auth/signup', {

//       headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//       },
//       data: {
//        firstName: TestData.usuarioValido.nombre,
//        lastName: TestData.usuarioValido.apellido,  
//        email: email,
//        password: TestData.usuarioValido.password
//       } 

//     });

//   const responsebody = await response.json(); //Convierte la respuesta (JSON) en un objeto JS que podés leer y validar.

//   }


    

// };