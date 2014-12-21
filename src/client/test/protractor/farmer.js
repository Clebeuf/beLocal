describe('The beLocal Farmer Splash Page', function() {

    browser.manage().deleteAllCookies();
    browser.driver.manage().deleteAllCookies();
    browser.get('http://127.0.0.1:9000');

    var vendorSignInWithFacebook = function() {
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

    var scrollIntoView = function () {
      arguments[0].scrollIntoView();
    }    

    // This will fail if the account doesn't exist. Not sure how to work around this right now.
    it('Should allow Facebook sign in as a vendor', function(){
        vendorSignInWithFacebook(); 
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
    });

    // Can we edit company name?
    it('Should allow editing of company name', function(){
        // Open edit profile modal
        element(by.css('[data-role="end"]')).click();
        browser.sleep(500);
        var editProfileButton = element(by.css('[ng-click="editProfile()"]'));
        editProfileButton.click();
        browser.sleep(1000);

        // Change company name
        element(by.name('companyName')).clear().sendKeys('Protractor Test!');

        // Fill in other information just in case it's blank
        element(by.name('number')).clear().sendKeys('7783459485');  
        element(by.name('website')).clear().sendKeys('http://www.google.ca');  
        element(by.name('city')).clear().sendKeys('Victoria');  
        element(by.name('province')).clear().sendKeys('BC');  
        element(by.name('country')).clear().sendKeys('Canada');      
        element(by.name('descriptionField')).clear().sendKeys('Some description about our company goes here!');        

        // Update profile
        var updateProfileButton = browser.driver.findElement(by.css('[ng-click="vendorProfileUpdate()"]'));
        browser.executeScript(scrollIntoView, updateProfileButton);
        updateProfileButton.click();
        browser.sleep(1000);             

        // Did the company name change?
        expect(element(by.css('.new-vendor-name-style > *')).getText()).toEqual('Protractor Test!');

        // Change company name back to something else so that we don't automatically pass next test case.
        editProfileButton = browser.driver.findElement(by.css('[ng-click="editProfile()"]'));
        browser.executeScript('scrollTo(0,0);');        
        editProfileButton.click();
        browser.sleep(1000);
        element(by.name('companyName')).clear().sendKeys('beLocal User');

        var updateProfileButton = browser.driver.findElement(by.css('[ng-click="vendorProfileUpdate()"]'));
        browser.executeScript(scrollIntoView, updateProfileButton);
        updateProfileButton.click();
        browser.sleep(1000);        
    });

    // Can we edit website
    it('Should allow editing of website', function(){
        // Open edit profile modal
        browser.executeScript('scrollTo(0,0);');
        var editProfileButton = element(by.css('[ng-click="editProfile()"]'));
        editProfileButton.click();
        browser.sleep(1000);

        // Change company name
        element(by.name('website')).clear().sendKeys('sometestwebsite.com');      

        // Update profile
        var updateProfileButton = browser.driver.findElement(by.css('[ng-click="vendorProfileUpdate()"]'));
        browser.executeScript(scrollIntoView, updateProfileButton);
        updateProfileButton.click();
        browser.sleep(1000);             

        // Did the website change? 
        element(by.css('#website-link')).getAttribute('href').then(function(href) {
            expect(href).toEqual('http://sometestwebsite.com/');
        });   

        // Change website back to something else so that we don't automatically pass next test case.
        editProfileButton = browser.driver.findElement(by.css('[ng-click="editProfile()"]'));
        browser.executeScript('scrollTo(0,0);');        
        editProfileButton.click();
        browser.sleep(1000);
        element(by.name('website')).clear().sendKeys('http://www.google.com');

        var updateProfileButton = browser.driver.findElement(by.css('[ng-click="vendorProfileUpdate()"]'));
        browser.executeScript(scrollIntoView, updateProfileButton);
        updateProfileButton.click();
        browser.sleep(1000);      
    });

    // Can we join and leave a market?
    it('Should allow markets to be joined and left', function(){
        // Open Create New Location Modal
        element(by.css('[data-role="end"]')).click();
        browser.sleep(500);
        browser.executeScript('scrollTo(0,0);');
        var createNewLocationButton = element(by.css('[ng-click="resetLocationModal()"]'));
        createNewLocationButton.click();
        browser.sleep(1000);

        // Select a market
        element(by.cssContainingText('option', 'Victoria Public Market')).click();

        // Join Market
        var joinMarketButton = browser.driver.findElement(by.css('[ng-click="newLocationSubmit()"]'));
        joinMarketButton.click();
        browser.sleep(1000);         

        // Did we join the market?
        expect(element.all(by.repeater('location in marketLocations')).count()).toEqual(1);

        // Leave the market
        element(by.css('[ng-click="leaveMarket(location)"]')).click();        
        expect(element.all(by.repeater('location in marketLocations')).count()).toEqual(0);
    });            
});