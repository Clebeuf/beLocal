describe('Sign Up as a Foodie and Farmer With Facebook', function() {
    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
    });

    it('Should allow sign up as a foodie with Facebook', function() {
        browser.get('http://127.0.0.1:9000'); 
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signUpAsCustomer()"]')).click();

        //Wait for Facebook pop-up to load
        //We cannot use waitForAngular() here since Facebook popup is not angular
        browser.sleep(2000); //2 seconds should be enough, depending on your connection speed

        //Get handle for Facebook popup window
        browser.driver.getAllWindowHandles().then(function(handles) {
            //We now have entered a non-angular website (Facebook pop-up)
            //For this we have to use browser.driver
            browser.driver.switchTo().window(handles[1]);

            //Assert that we're on a Facebook page
            expect(browser.driver.getCurrentUrl()).toContain('facebook');

            //Send login information for a facebook test user
            browser.driver.findElement(by.id('email')).sendKeys('protractor_zvakuzk_foodie@tfbnw.net');
            browser.driver.findElement(by.id('pass')).sendKeys('belocal');
            browser.driver.findElement(by.id('loginbutton')).click();

            browser.sleep(1000);

            //Switch back to main window (is this even necessary?)
            browser.driver.switchTo().window(handles[0]);
       		browser.waitForAngular();
        	expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
        });        
    });
});
