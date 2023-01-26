import { Textfield, Switch, Button, TitleBar } from "../views";
import { Client, ViewController } from "../utils";

export class LoginController extends ViewController {
    public readonly titleBar = new TitleBar();
    public readonly loginButton = new Button('login');

    public readonly usernameTextfield = new Textfield('username');
    public readonly passwordTextfield = new Textfield('password');

    public readonly keepLoginSwitch = new Switch('keepLogin');

    constructor(...classes: string[]) {
        super(...classes, 'login');
    }

    public init() {
        this.view.appendChild(this.titleBar);
        this.view.appendChild(this.usernameTextfield);
        this.view.appendChild(this.passwordTextfield);
        this.view.appendChild(this.keepLoginSwitch);
        this.view.appendChild(this.loginButton);

        this.usernameTextfield.onReturn.on(() => this.login());
        this.passwordTextfield.onReturn.on(() => this.login());
        this.loginButton.onClick.on(() => this.login());

        super.init();
    }

    public focus() {
        this.usernameTextfield.focus();
    }

    public clear() {
        this.usernameTextfield.text = '';
        this.passwordTextfield.text = '';
        this.keepLoginSwitch.enabled = false;
    }

    private async login() {
        const username = this.usernameTextfield.text;

        if (!username) {
            await Client.messageViewController.push({ text: 'username_not_set', title: Client.translator.translate('error') });
            this.usernameTextfield.focus();
            return;
        }

        const password = this.passwordTextfield.text;

        if (!password) {
            await Client.messageViewController.push({ text: 'password_not_set', title: Client.translator.translate('error') });
            this.passwordTextfield.focus();
            return;
        }

        const keepLogin = this.keepLoginSwitch.enabled;
        const label = navigator.userAgent;

        Client.session
            .login(username, password, keepLogin, label)
            .then(() => this.clear())
            .catch(() => this.focus());
    }
}