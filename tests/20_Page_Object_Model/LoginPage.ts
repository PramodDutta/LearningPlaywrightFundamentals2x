import { Page, Locator, expect} from '@playwright/test';

export class LoginPage {

        // Page Locator

        readonly page:Page;
        readonly emailInput : Locator;
        readonly passwordInput: Locator;
        readonly loginButton: Locator;

        constructor(page:Page){
            this.page = page;
            this.emailInput = page.getByRole("textbox", { name: "Username" });
            this.passwordInput = page.getByRole("textbox", { name: "Password" })
            this.loginButton = page.getByTestId("login-button").or(page.getByText("Login")).or(page.locator("#login-button"));
        }



        // Page Actions
        async goto(){
                    await this.page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
        }

        async login(username:string,password:string){
            await this.emailInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
        }




}