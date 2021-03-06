import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockDotMessageService } from 'src/app/test/dot-message-service.mock';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotMyAccountComponent } from './dot-my-account.component';
import {
    CoreWebService,
    DotcmsConfigService,
    LoggerService,
    LoginService,
    StringUtils,
    UserModel
} from 'dotcms-js';
import { LoginServiceMock, mockUser } from '@tests/login-service.mock';
import { AccountService } from '@services/account-service';
import { StringFormat } from 'src/app/api/util/stringFormat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';

describe('DotMyAccountComponent', () => {
    let fixture: ComponentFixture<DotMyAccountComponent>;
    let comp: DotMyAccountComponent;
    let de: DebugElement;
    let accountService: AccountService;
    let loginService: LoginService;
    let dotRouterService: DotRouterService;

    const messageServiceMock = new MockDotMessageService({
        'my-account': 'My Account',
        'modes.Close': 'Close',
        save: 'Save',
        'error.form.mandatory': 'This is mandatory',
        'errors.email': 'Wrong email',
        'First-Name': 'First Name',
        'Last-Name': 'Last Name',
        'email-address': 'Email',
        'new-password': 'New password',
        're-enter-new-password': 'Confirm password',
        'error.forgot.password.passwords.dont.match': 'Passwords do no match',
        'message.createaccount.success': 'Success',
        'Error-communicating-with-server-Please-try-again': 'Server error, try again!',
        'change-password': 'Change Password',
        'current-password': 'Current Password'
    });

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [DotMyAccountComponent],
                imports: [
                    PasswordModule,
                    InputTextModule,
                    FormsModule,
                    DotDialogModule,
                    CommonModule,
                    CheckboxModule,
                    DotPipesModule,
                    HttpClientTestingModule
                ],
                providers: [
                    {
                        provide: LoginService,
                        useClass: LoginServiceMock
                    },
                    { provide: DotMessageService, useValue: messageServiceMock },
                    AccountService,
                    StringFormat,
                    { provide: DotRouterService, useClass: MockDotRouterService },
                    { provide: CoreWebService, useClass: CoreWebServiceMock },
                    DotcmsConfigService,
                    LoggerService,
                    StringUtils,
                    UserModel
                ]
            });

            fixture = TestBed.createComponent(DotMyAccountComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            accountService = TestBed.get(AccountService);
            loginService = TestBed.get(LoginService);
            dotRouterService = TestBed.get(DotRouterService);

            comp.visible = true;
            fixture.detectChanges();
        })
    );

    afterEach(() => {
        comp.visible = false;
        fixture.detectChanges();
    });

    it(`should have right labels`, async () => {
        await fixture.whenStable();
        comp.form.setValue({
            givenName: 'Admin',
            surname: 'Admin',
            email: 'admin@dotcms.com',
            password: 'test',
            newPassword: null,
            confirmPassword: null
        });

        fixture.detectChanges();
        const firstName = de.nativeElement.querySelector('#dot-my-account-first-name-input')
            .parentNode;
        const lasttName = de.nativeElement.querySelector('#dot-my-account-last-name-input')
            .parentNode;
        const email = de.nativeElement.querySelector('#dot-my-account-email-input').parentNode;
        const currentPassword = de.nativeElement.querySelector(
            '#dot-my-account-current-password-input'
        ).parentNode;
        const changePassword = de.nativeElement.querySelector(
            '#dot-my-account-change-password-option'
        );
        const newPassword = de.nativeElement.querySelector('#dot-my-account-new-password-input')
            .parentNode;
        const confirmPassword = de.nativeElement.querySelector(
            '#dot-my-account-confirm-new-password-input'
        ).parentNode;
        const cancel = de.nativeElement.querySelector('.dialog__button-cancel');
        const save = de.nativeElement.querySelector('.dialog__button-accept');

        expect(firstName.innerText).toEqual(messageServiceMock.get('First-Name'));
        expect(lasttName.innerText).toEqual(messageServiceMock.get('Last-Name'));
        expect(email.innerText).toEqual(messageServiceMock.get('email-address'));
        expect(currentPassword.innerText).toEqual(messageServiceMock.get('current-password'));
        expect(changePassword.innerText).toEqual(messageServiceMock.get('change-password'));
        expect(newPassword.innerText).toEqual(messageServiceMock.get('new-password'));
        expect(confirmPassword.innerText).toEqual(messageServiceMock.get('re-enter-new-password'));
        expect(cancel.innerText).toEqual(messageServiceMock.get('modes.Close').toUpperCase());
        expect(save.innerText).toEqual(messageServiceMock.get('save').toUpperCase());
    });

    it(`should form be valid`, async () => {
        await fixture.whenStable();

        comp.form.setValue({
            givenName: 'Admin',
            surname: 'Admin',
            email: 'admin@dotcms.com',
            password: 'test',
            newPassword: null,
            confirmPassword: null
        });
        fixture.detectChanges();
        const save = de.nativeElement.querySelector('.dialog__button-accept');

        expect(comp.form.valid).toBe(true);
        expect(save.disabled).toBe(false);
    });

    it(`should enable new passwords inputs when checked change password option`, async () => {
        comp.form.setValue({
            givenName: 'Admin',
            surname: 'Admin',
            email: 'admin@dotcms.com',
            password: 'test',
            newPassword: '',
            confirmPassword: ''
        });
        fixture.detectChanges();
        const changePassword = de.query(By.css('#dot-my-account-change-password-option'));
        changePassword.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        await fixture.whenStable();

        fixture.detectChanges();
        const newPassword = de.nativeElement.querySelector('#dot-my-account-new-password-input');
        const confirmPassword = de.nativeElement.querySelector(
            '#dot-my-account-confirm-new-password-input'
        );
        expect(newPassword.disabled).toBe(false);
        expect(confirmPassword.disabled).toBe(false);
    });

    it(`should disabled SAVE when new passwords don't match`, async () => {
        comp.form.setValue({
            givenName: 'Admin2',
            surname: 'Admi2',
            email: 'admin@dotcms.com',
            password: 'test',
            newPassword: 'newPassword',
            confirmPassword: 'newPasswrd'
        });
        fixture.detectChanges();
        const changePassword = de.query(By.css('#dot-my-account-change-password-option'));
        changePassword.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        await fixture.whenStable();

        fixture.detectChanges();
        expect(comp.dialogActions.accept.disabled).toBe(true);
    });

    it(`should SAVE form and sethAuth when no reauthentication`, async () => {
        spyOn<any>(accountService, 'updateUser').and.returnValue(
            of({ entity: { user: mockUser() } })
        );
        spyOn(loginService, 'setAuth');
        spyOn(comp.close, 'emit');

        const user = {
            givenName: 'Admin',
            surname: 'Admin',
            email: 'admin@dotcms.com',
            password: 'admin',
            newPassword: 'newPassword',
            confirmPassword: 'newPassword'
        };
        comp.form.setValue(user);
        fixture.detectChanges();
        const changePassword = de.query(By.css('#dot-my-account-change-password-option'));
        changePassword.triggerEventHandler('click', {});
        fixture.detectChanges();

        await fixture.whenStable();

        fixture.detectChanges();
        const save = de.query(By.css('.dialog__button-accept'));
        save.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(comp.close.emit).toHaveBeenCalledTimes(1);
        expect(accountService.updateUser).toHaveBeenCalledWith(comp.accountUser);
        expect(loginService.setAuth).toHaveBeenCalledWith({
            loginAsUser: null,
            user: mockUser()
        });
    });

    it(`should SAVE form and reauthenticate`, async () => {
        spyOn<any>(accountService, 'updateUser').and.returnValue(
            of({ entity: { reauthenticate: true } })
        );
        spyOn(loginService, 'logOutUser').and.returnValue(of({}));
        spyOn(comp.close, 'emit');

        const user = {
            givenName: 'Admin',
            surname: 'Admin',
            email: 'admin@dotcms.com',
            password: 'admin',
            newPassword: 'newPassword',
            confirmPassword: 'newPassword'
        };
        comp.form.setValue(user);
        fixture.detectChanges();
        const changePassword = de.query(By.css('#dot-my-account-change-password-option'));
        changePassword.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();

        fixture.detectChanges();
        const save = de.query(By.css('.dialog__button-accept'));
        save.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(comp.close.emit).toHaveBeenCalledTimes(1);
        expect(accountService.updateUser).toHaveBeenCalledWith(comp.accountUser);
        expect(dotRouterService.doLogOut).toHaveBeenCalledTimes(1);
    });
});
