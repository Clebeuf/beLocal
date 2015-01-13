describe('The beLocal Start Page', function() {
    console.log("Testing Start Page");        

    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');
    });

    it('Foodie button should redirect back to splash page through Register dropdown', function() {
        element(by.css('[ng-click="getStarted()"]')).click();         
        element(by.id('register-dropdown')).click();
        element(by.css('[ng-click="showCustomerSignUp()"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
    }); 
});