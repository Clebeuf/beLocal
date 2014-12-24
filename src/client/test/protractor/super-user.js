describe('Testing superuser tasks', function() {

    browser.manage().deleteAllCookies();
    browser.driver.manage().deleteAllCookies();
    browser.get('http://127.0.0.1:9000');

    it('Should not allow superuser sign in with wrong credentials', function() {

        // Let's test the login button in the nav-bar!
        element(by.css('[ng-click="getStarted()"]')).click();       
        browser.sleep(1000);

        element(by.css('[ng-click="clearLoginModal()"]')).click();
        browser.sleep(1000);

        element(by.model('loginUsername')).clear().sendKeys('superuser');
        element(by.model('loginPassword')).clear().sendKeys('belocal1');
        element(by.css('[ng-click="loginSubmit()"]')).click();

        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
        expect(element(by.css('[ng-show="loginErrorMessage != null"]')).isDisplayed()).toBeTruthy();;
    });

    it('Should allow superuser sign in without Facebook', function() {
        browser.sleep(1000);        
        element(by.model('loginPassword')).clear().sendKeys('belocal');
        element(by.css('[ng-click="loginSubmit()"]')).click();

        browser.sleep(1000);

        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/manage');
        expect(element.all(by.repeater('vendor in inactiveVendors')).count()).toEqual(2);        
        expect(element.all(by.repeater('user in users')).count()).toEqual(6);
    });

    it('Should allow superusers to activate vendors', function() {
        element(by.className('sm-activate-button')).click();
        element(by.className('sm-deactivate-button')).getInnerHtml().then(function(html){
            expect(html).toEqual('Deactivate');
        });

        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/manage');
    }); 

    it('Should allow superusers to delete users', function() {
        element(by.css('[ng-click="deleteUser(user)"]')).click();
        var prompt = browser.driver.switchTo().alert();
        prompt.sendKeys('$gituvicsoup');
        prompt.accept();
        browser.waitForAngular();
        expect(element.all(by.repeater('user in users')).count()).toEqual(5);
    });         
});