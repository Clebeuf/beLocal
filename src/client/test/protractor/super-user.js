describe('The beLocal Farmer Splash Page', function() {

    browser.manage().deleteAllCookies();
    browser.driver.manage().deleteAllCookies();
    browser.get('http://127.0.0.1:9000');

    it('Should allow superuser sign in without Facebook', function() {

        // Let's test the login button in the nav-bar!
        element(by.css('[ng-click="getStarted()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.model('loginUsername')).clear().sendKeys('superuser');
        element(by.model('loginPassword')).clear().sendKeys('belocal');
        element(by.css('[ng-click="loginSubmit()"]')).click();

        browser.sleep(1000);

        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/manage');
    });
});