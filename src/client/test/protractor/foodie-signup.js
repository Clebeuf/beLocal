describe('Sign Up as a Foodie With and Without Facebook', function() {
    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();       
        browser.get('http://127.0.0.1:9000'); 
    });  
    
    it('Should allow sign up as a foodie without Facebook', function() {
        // This account will be deleted after superuser tests
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('To Be');
        element(by.model('newVendorLastName')).clear().sendKeys('Deleted');
        element(by.model('newVendorUserName')).clear().sendKeys('tobedeleted');
        element(by.model('newVendorEmail')).clear().sendKeys('tobedeleted@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newCustomerSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('Should prevent login with a Facebook account that does not have a beLocal account associated with it', function() {
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signIn()"]')).click();

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
            expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
            expect(element(by.css('[ng-show="noFacebookAccountError"]')).isDisplayed()).toBeTruthy();
        });        
    });          

    // This works since the Facebook cookie is never cleared despite our call to deleteAllCookies()
    it('Should allow sign up as a foodie with Facebook', function() {
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signUpAsCustomer()"]')).click();
        browser.sleep(2000);        
       	browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('Should prevent sign up as a foodie with an already used Facebook account', function() {
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signUpAsCustomer()"]')).click();
        browser.sleep(1000);        
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="accountAlreadyCreated"]')).isDisplayed()).toBeTruthy();
    });

    it('Should allow sign up as a foodie without Facebook', function() {
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Foodie');
        element(by.model('newVendorUserName')).clear().sendKeys('testfoodie');
        element(by.model('newVendorEmail')).clear().sendKeys('testfoodie@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newCustomerSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('Should prevent sign up as a foodie without Facebook when an username that already exists is entered', function() {
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Foodie');
        element(by.model('newVendorUserName')).clear().sendKeys('testfoodie');
        element(by.model('newVendorEmail')).clear().sendKeys('testfoodie1@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newCustomerSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="usernameErrorMessage != null"]')).isDisplayed()).toBeTruthy();
    });

    it('Should prevent sign up as a foodie without Facebook when an email that already exists is entered', function() {
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Foodie');
        element(by.model('newVendorUserName')).clear().sendKeys('testfoodie1');
        element(by.model('newVendorEmail')).clear().sendKeys('testfoodie@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newCustomerSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="emailErrorMessage != null"]')).isDisplayed()).toBeTruthy();
    });            
});
