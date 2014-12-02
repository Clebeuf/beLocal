//Vendor Specs


describe('The beLocal Start Page', function() {
    console.log("Testing Start Page");        

    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('beLocal');
    });

    it('should redirect to homepage through Get Started button', function() { 
        element(by.css('[ng-click="getStarted()"]')).click(); 
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('should not allow login without first creating an account', function(){
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.css('[ng-click="signIn()"]')).click();

        //Wait for Facebook pop-up to load
        //We cannot use waitForAngular() here since Facebook popup is not angular
        browser.sleep(4000); //4 seconds should be enough, depending on your connection speed

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

        browser.waitForAngular(); 
        var no_fb_account_error = element(by.css('[ng-show="noFacebookAccountError"]')).click();
        expect(no_fb_account_error);
    });

    /*
    Once this is done for the first time, it will show was a failure
    in protractor. This is perfectly fine. */
    it('should allow farmers to create an account', function(){
        element(by.css('[ng-click="signUpAsVendorNoFB()"]')).click();
        element(by.css('[ng-click="signUpAsVendor()"]')).click();

        browser.sleep(4000);
    });
});


describe('The Vendor Page', function(){
    console.log("Testing Vendor Page");        

    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');
    });

/*
    //The Following test does not work due to not being able to click on typeaheads
    it('should allow the creation of locations', function(){
        element(by.css('.welcome-sign-in')).click();
        browser.sleep(1000);
        element(by.buttonText('Create New Location')).click();
        element(by.id('customLocationTab')).click();
        browser.sleep(500)
        element(by.model('locationName')).sendKeys('new item');
        element(by.name('addressText')).sendKeys('1010 McRae Avenue, Victoria, BC V8P 1G4, Canada');
        browser.sleep(1000);
        element(by.css('.dropdown-menu')).click();
        element(by.model('phoneAtLocation')).sendKeys('2501231234');
        element(by.model('locationDescription')).sendKeys('This is a good location.');
        browser.sleep(500)
        element(by.css('[ng-click="newLocationSubmit()"]')).click();
        browser.sleep(10000);
    });
*/

    it('should allow the creation a product', function(){
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.css('[ng-click="signIn()"]')).click();

        browser.sleep(1000);
        var path = require('path');
        var fileToUpload = 'beets.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        //Create a product that will be deleted later
        browser.wait(function() {
            return browser.isElementPresent(element(by.buttonText('Create New Item'))); 
        }, 5000); 

        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('beets to be deleted');
        element(by.model('itemDescription')).sendKeys('this item will be deleted');
        browser.sleep(100); 

        element(by.css('[ng-click="newItemSubmit()"]')).click(); 
        browser.sleep(100); 
    });

    it('should allow the deletion of a product', function(){
        browser.wait(function() {
            return browser.isElementPresent(element(by.css('.facebook-button'))); 
        })
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.css('[ng-click="signIn()"]')).click();

        browser.wait(function() {
            return browser.isElementPresent(element(by.css('[ng-click="deleteProduct(product)"]')));
        }, 5000);
        element(by.css('[ng-click="deleteProduct(product)"]')).click(); 

        element(by.css('[ng-click="reloadMainPage()"]')).click();


        browser.sleep(1500); //allow products to load on home page


        //Check if item was successfully deleted
        expect(element(by.linkText('beets to be deleted')).isPresent()).toBe(false);
    });

    it('should allow the creation of multiple products', function(){
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.css('[ng-click="signIn()"]')).click();

        browser.sleep(500);
        var path = require('path');
        var fileToUpload = 'applePie.jpg'
        var absolutePath = path.resolve(__dirname, fileToUpload);

        browser.wait(function() {
            return browser.isElementPresent(element(by.buttonText('Create New Item'))); 
        }, 5000); 

        //This for-loop creates mulitple products 
        for(i = 0; i < 5; i++){
            element(by.buttonText('Create New Item')).click();

            //Send product information
            element(by.id('item-image')).sendKeys(absolutePath); 
            element(by.model('itemName')).sendKeys('new Item');
            element(by.model('itemDescription')).sendKeys('This is a test item');

            element(by.css('[ng-click="newItemSubmit()"]')).click();
        }

        browser.sleep(5000);
    });
});

ddescribe('Foodies', function(){
    console.log("Testing Foodies");        

    beforeEach(function(){
        browser.manage().deleteAllCookies();
        browser.driver.manage().deleteAllCookies();
        browser.get('http://127.0.0.1:9000');
    });

    it('should be able to Log in', function(){
        element(by.css('[ng-click="signUpAsCustomerNoFB()"]')).click(); 

        //send New customer information
        element(by.model('newVendorFirstName')).sendKeys('John');
        element(by.model('newVendorLastName')).sendKeys('Doe'); 
        element(by.model('newVendorUserName')).sendKeys('johndo');
        element(by.model('newVendorEmail')).sendKeys('jd@email.com');
        element(by.model('newVendorPassword')).sendKeys('pass');

        element(by.css('[ng-click="newCustomerSubmit()"]')).click(); 

        browser.sleep(1500); 
    }); 

    it('should be able to like products', function(){

        element(by.css('[ng-click="clearLoginModal()"]')).click();
        element(by.model('loginUsername')).sendKeys('johndo');
        element(by.model('loginPassword')).sendKeys('pass');
        element(by.css('[ng-click="loginSubmit()"]')).click(); 
        browser.sleep(5000); //Allow products to load on home page
        element(by.css('[ng-click="likeUnlikeItem(item, \'product\')"]')).click(); 
        browser.sleep(10000);
    });

});





