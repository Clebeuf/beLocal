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
            browser.driver.findElement(by.id('email')).sendKeys('protractor_tandkpu_farmer@tfbnw.net');
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

    // MAKE SURE AN ACCOUNT FOR THE CREDENTIALS ABOVE EXISTS IN YOUR APPLICATION
    // This will fail if the account doesn't exist. Not sure how to work around this right now.
    it('Should allow Facebook sign in as a vendor', function(){
        vendorSignInWithFacebook(); 
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
    });

    // Can we change profile pictures?
    it('Should allow editing of profile photo', function() {
        element(by.css('[data-role="end"]')).click();
        browser.sleep(500);

        var oldProfilePictureSrc = undefined;
        var newProfilePictureSrc = undefined;

        // Grab the old profile picture src
        var oldProfilePictureSrc = element(by.id('vendorProfileImage')).getAttribute('src').then(function(src) {
            return src;
        });

        element(by.css('[ng-click="launchProfileImageModal()"]')).click();

        // Upload new profile picture
        var path = require('path');
        var fileToUpload = 'pears.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        element(by.id('profile-image')).sendKeys(absolutePath);

        browser.sleep(500);

        element(by.css('[ng-click="uploadProfileImage()"]')).click();
        browser.waitForAngular();
        browser.sleep(1000);        

        // Grab the new profile picture src
        newProfilePictureSrc = element(by.id('vendorProfileImage')).getAttribute('src').then(function(src) {
            return src;
        });

        // The srcs shouldn't be the same!
        expect(oldProfilePictureSrc).toNotEqual(newProfilePictureSrc);
    });

    // Can we edit user profile?
    it('Should allow editing of user profile', function(){
        // Open edit profile modal
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
        element(by.buttonText('Create New Location')).click();
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

    it('Should allow the creation of a one-time custom location', function(){

        // Create a new custom location
        element(by.buttonText('Create New Location')).click();
        browser.sleep(1000);
        element(by.css('[ng-click="doCustomLocation()"]')).click();
        element(by.model('locationName')).clear().sendKeys('Farm Stand');

        // This is a pretty nasty hack to get the typeahead to appear cross-OS since sendKeys() for OS X fakes key presses rather than
        // sending them natively. Essentially, we're setting the value of the input normally, then triggering Angular's $setViewValue
        // to fire the $parsers pipeline (which typeahead uses to know when to trigger itself).
        var updateInput = "var input = document.getElementById('address-typeahead');" +
            "input.value = 'University of Victoria, 3800 Finnerty Road, Victoria, BC V8P 5C2, Canada';" + 
            "angular.element(input).scope().$apply(function(s) { s.locationForm[input.name].$setViewValue(input.value); });";
        browser.executeScript(updateInput);

        // We don't need to click the typeahead! Just press enter!
        element(by.name('addressText')).click();
        element(by.name('addressText')).sendKeys(protractor.Key.ENTER);        

        // Did we actually create the location?
        element(by.css('[ng-click="newLocationSubmit()"]')).click();
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(1);

        // Is the map showing?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeTruthy();
    });

    it('Should allow the editing of a one-time custom location', function(){
        // Create a new custom location
        element(by.css('[ng-click="editLocation(location)"]')).click();
        browser.sleep(1000);
        element(by.model('locationDescription')).clear().sendKeys('Farm Stand description!');      

        // Did we actually edit the location?
        element(by.css('[ng-click="newLocationSubmit()"]')).click();
        expect(element(by.id('pro-cust-description')).getText()).toEqual('Farm Stand description!');
    });

    it('Should allow the deletion of a one-time custom location', function(){
        // Delete the location
        element(by.css('[ng-click="deleteLocation(location)"]')).click();    

        // Is the locaton gone?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(0);

        // Is the map hidden?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeFalsy();
    }); 

    it('Should allow undoing the deletion of a one-time custom location', function(){
        // Delete the location
        element(by.css('[ng-click="restoreLocation(deletedLocation)"]')).click();    

        // Is the locaton back?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(1);

        // Is the map back?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeTruthy();

        // Delete the location again
        element(by.css('[ng-click="deleteLocation(location)"]')).click();    

        // Is the locaton gone?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(0);        
    });

    it('Should allow the creation of a recurring custom location', function(){

        // Create a new recurring custom location
        element(by.buttonText('Create New Location')).click();
        browser.sleep(1000);
        element(by.css('[ng-click="doCustomLocation()"]')).click();
        element(by.css('[value="false"]')).click();
        element(by.model('locationName')).clear().sendKeys('Recurring Farm Stand');

        // Check/uncheck some days
        element(by.name('day1Check')).click();
        element(by.name('day3Check')).click();        
        element(by.name('day5Check')).click();
        element(by.name('day6Check')).click();

        // This is a pretty nasty hack to get the typeahead to appear cross-OS since sendKeys() for OS X fakes key presses rather than
        // sending them natively. Essentially, we're setting the value of the input normally, then triggering Angular's $setViewValue
        // to fire the $parsers pipeline (which typeahead uses to know when to trigger itself).
        var updateInput = "var input = document.getElementById('address-typeahead');" +
            "input.value = 'University of Victoria, 3800 Finnerty Road, Victoria, BC V8P 5C2, Canada';" + 
            "angular.element(input).scope().$apply(function(s) { s.locationForm[input.name].$setViewValue(input.value); });";
        browser.executeScript(updateInput);

        // We don't need to click the typeahead! Just press enter!
        element(by.name('addressText')).click();
        element(by.name('addressText')).sendKeys(protractor.Key.ENTER);        

        // Did we actually create the location?
        element(by.css('[ng-click="newLocationSubmit()"]')).click();
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(1);

        // Are the hours right?
        expect(element.all(by.repeater('day in location.address.hours')).count()).toEqual(5);        

        // Is the map showing?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeTruthy();
    });

    it('Should allow the editing of a recurring custom location', function(){

        element(by.css('[ng-click="editLocation(location)"]')).click();
        browser.sleep(1000);

        // Check/uncheck some days
        element(by.name('day1Check')).click();
        element(by.name('day3Check')).click();  

        element(by.css('[ng-click="newLocationSubmit()"]')).click();

        // Did the hours update?
        expect(element.all(by.repeater('day in location.address.hours')).count()).toEqual(7);
    }); 

    it('Should allow the deletion of a recurring custom location', function(){
        // Delete the location
        element(by.css('[ng-click="deleteLocation(location)"]')).click();    

        // Is the locaton gone?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(0);

        // Is the map hidden?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeFalsy();
    }); 

    it('Should allow undoing the deletion of a recurring location', function(){
        // Delete the location
        element(by.css('[ng-click="restoreLocation(deletedLocation)"]')).click();    

        // Is the locaton back?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(1);

        // Is the map back?
        expect(element(by.css('[ng-hide="marketLocations.length == 0 && sellerLocations.length == 0"]')).isDisplayed()).toBeTruthy();

        // Delete the location again
        element(by.css('[ng-click="deleteLocation(location)"]')).click();    

        // Is the locaton gone?    
        expect(element.all(by.repeater('location in sellerLocations')).count()).toEqual(0);        
    });                                        

    it('Should allow the creation of a product', function(){
        // Load the picture of pears
        var path = require('path');
        var fileToUpload = 'pears.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Pears');
        element(by.model('itemDescription')).sendKeys('Yummy pears!');

        // Did we create a new item?
        element(by.css('[ng-click="newItemSubmit()"]')).click(); 
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(1);

        // Does it have a picture?
        var productImage = element(by.css('.vendor-product-image > img')); 
        productImage.getAttribute('src').then(function(src) {
            expect(src).toContain('http://127.0.0.1:8000/static/media/products/pears');
        });
    });

    it('Should allow the editing of a product', function(){
        // Load the picture of pears
        var path = require('path');
        var fileToUpload = 'pears.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.css('[ng-click="editItem(product)"]')).click();
        browser.sleep(1000);
        element(by.model('itemDescription')).clear().sendKeys('Edited yummy pears!');

        // Did we edit the item?
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(1000);
        expect(element(by.id('pro-product-details')).getText()).toEqual('Edited yummy pears!');
    });

    it('Should allow the deletion of a product', function(){
        // Delete the item
        element(by.css('[ng-click="deleteProduct(product)"]')).click();        
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(0);
    });

    it('Should allow undoing the deletion of a product', function(){
        // Undo the deletion of the item
        element(by.css('[ng-click="restoreProduct(deletedProduct)"]')).click();        
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(1);

        // Delete the item again
        element(by.css('[ng-click="deleteProduct(product)"]')).click();        
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(0);        
    });

    it('The My Profile button should take you back to your account', function(){
        browser.get('http://127.0.0.1:9000');
        // Go to vendor page
        element(by.id('vendor-dropdown-toggle')).click();        
        element(by.id('vendor-display-account')).click(); 
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');      
    }); 

    it('The vendor tour button should show the tour', function(){
        // Show tour
        element(by.id('xs-dropdown-toggle')).click();        
        element(by.id('vendorTour')).click(); 
        browser.waitForAngular();
        expect(element(by.css('[data-role="end"]')).isDisplayed()).toBeTruthy();
        browser.waitForAngular();        
        element(by.css('[data-role="end"]')).click();
        browser.sleep(500);                     
    });

    it('Should allow vendors to log out', function(){
        // Logout
        element(by.id('xs-dropdown-toggle')).click();        
        element(by.id('xs-logout')).click(); 
        browser.waitForAngular();
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/welcome');                     
    });          

});