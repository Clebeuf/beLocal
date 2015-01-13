describe('Create a superuser account without Facebook', function() {
    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');        
    });

    it('Should allow sign up as a superuser without Facebook', function() {
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Super');
        element(by.model('newVendorLastName')).clear().sendKeys('User');
        element(by.model('newVendorUserName')).clear().sendKeys('superuser');
        element(by.model('newVendorEmail')).clear().sendKeys('superuser@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newVendorSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
    });
});
