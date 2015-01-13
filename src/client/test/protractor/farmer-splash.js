describe('The beLocal Farmer Splash Page', function() {
    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');
    });

    it('Should have a title', function() {
        expect(browser.getTitle()).toEqual('beLocal');
    });

    it('Should redirect to homepage through Get Started button', function() { 
        element(by.css('[ng-click="getStarted()"]')).click(); 
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('Farmer button should redirect back to splash page through Register dropdown', function() {
        element(by.css('[ng-click="getStarted()"]')).click();         
        element(by.id('register-dropdown')).click();
        element(by.css('[ng-click="showFarmerSignUp()"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');        
    });    
});