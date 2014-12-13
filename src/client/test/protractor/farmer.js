describe('The beLocal Start Page', function() {
    console.log("Testing Start Page");

    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };  

    var signInWithFacebook = function() {
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
            browser.driver.findElement(by.id('email')).sendKeys('bgyznnn_mcdonaldstein_1415845994@tfbnw.net');
            browser.driver.findElement(by.id('pass')).sendKeys('belocal');
            browser.driver.findElement(by.id('loginbutton')).click();

            browser.sleep(1000);

            //Switch back to main window (is this even necessary?)
            browser.driver.switchTo().window(handles[0]);
        });
    }       

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

    it('Should allow Facebook sign in as a vendor', function(){
        signInWithFacebook(); 
        browser.waitForAngular();
        var noFacebookAccount = $('[ng-show=noFacebookAccountError]').isDisplayed();
        var noFacebookElement = element(by.css('[ng-show=noFacebookAccountError]'));

        if(hasClass(noFacebookElement), 'ng-show') {
            browser.sleep(1000);

            element(by.id('login-modal-close')).click();

            browser.sleep(1000);

            element(by.css('[ng-click="signUpAsVendorNoFB()"')).click();

            browser.sleep(1000);

            element(by.css('[ng-click="signUpAsVendor()"]')).click();
            expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
        } else {
            expect(noFacebookAccount).toBeFalsy();
            expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');            
        }
    }); 

    it('Should allow editing of user profiles', function(){
        signInWithFacebook(); 
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor'); 
        element(by.css('[data-role="end"]')).click();
        browser.sleep(500);
        element(by.css('[ng-click="editProfile()"]')).click();
        browser.sleep(1000);
        element(by.name('companyName')).clear().sendKeys('Protractor Test!');

        // WE NEED TO SCROLL THIS INTO VIEW FOR THIS TO WORK
        $('[ng-click="vendorProfileUpdate()"]').click();
        browser.sleep(1000);

        expect(element(by.css('.new-vendor-name-style > *')).getText()).toEqual('Protractor Test!');

        // // Change company name to something else for next test case
        // element(by.css('[ng-click="editProfile()"]')).click();
        // browser.sleep(1000);
        // element(by.name('companyName')).clear().sendKeys('beLocal User');

        // // // Then, fill out other fields.
        // element(by.name('number')).clear().sendKeys('7783459485');  
        // element(by.name('website')).clear().sendKeys('http://www.google.ca');  
        // element(by.name('city')).clear().sendKeys('Victoria');  
        // element(by.name('province')).clear().sendKeys('BC');  
        // element(by.name('country')).clear().sendKeys('Canada');      
        // element(by.name('descriptionField')).clear().sendKeys('Some description about our company goes here!');
        // browser.executeScript(scrollIntoView, element(by.css('[ng-click="vendorProfileUpdate()"]')));        
        // element(by.css('[ng-click="vendorProfileUpdate()"]')).click();
    });     
});