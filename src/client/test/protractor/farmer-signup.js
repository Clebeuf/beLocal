describe('Sign Up as a Farmer With and Without Facebook', function() {
    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');        
    });

    it('Should allow sign up as a farmer with Facebook', function() {       
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signUpAsVendor()"]')).click();

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
            browser.driver.findElement(by.id('email')).sendKeys('protractor_tandkpu_farmer@tfbnw.net');
            browser.driver.findElement(by.id('pass')).sendKeys('belocal');
            browser.driver.findElement(by.id('loginbutton')).click();

            //Switch back to main window (is this even necessary?)
            browser.driver.switchTo().window(handles[0]);
            browser.sleep(1000);

        	expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
            browser.sleep(1000);
            element(by.css('[data-role="end"]')).click();
            browser.sleep(500);
            element(by.id('xs-dropdown-toggle')).click();        
            element(by.id('xs-logout')).click(); 
            browser.waitForAngular();
            expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');            
        });        
    });

    it('Should prevent sign up as a farmer with an already used Facebook account', function() {
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.css('[ng-click="signUpAsVendor()"]')).click();
        browser.sleep(1000);        
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="accountAlreadyCreated"]')).isDisplayed()).toBeTruthy();
    });

    it('Should allow sign up as a farmer without Facebook', function() {
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Farmer');
        element(by.model('newVendorUserName')).clear().sendKeys('testfarmer');
        element(by.model('newVendorEmail')).clear().sendKeys('testfarmer@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newVendorSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
    });

    it('Should prevent sign up as a farmer without Facebook when an username that already exists is entered', function() {
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Farmer');
        element(by.model('newVendorUserName')).clear().sendKeys('testfarmer');
        element(by.model('newVendorEmail')).clear().sendKeys('testfarmer1@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newVendorSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="usernameErrorMessage != null"]')).isDisplayed()).toBeTruthy();
    });

    it('Should prevent sign up as a farmer without Facebook when an email that already exists is entered', function() {
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        browser.sleep(1000);

        element(by.model('newVendorFirstName')).clear().sendKeys('Test');
        element(by.model('newVendorLastName')).clear().sendKeys('Farmer');
        element(by.model('newVendorUserName')).clear().sendKeys('testfarmer1');
        element(by.model('newVendorEmail')).clear().sendKeys('testfarmer@belocalvictoria.me');
        element(by.model('newVendorPassword')).clear().sendKeys('belocal');

        element(by.css('[ng-click="newVendorSubmit()"]')).click();

        browser.sleep(1000);
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');
        expect(element(by.css('[ng-show="emailErrorMessage != null"]')).isDisplayed()).toBeTruthy();
    });    
});
