describe('Testing foodie tasks', function() {

    browser.manage().deleteAllCookies();
    browser.driver.manage().deleteAllCookies();
    browser.get('http://127.0.0.1:9000');

    var foodieSignInWithFacebook = function() {
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
        });
    }

    var scrollIntoView = function () {
      arguments[0].scrollIntoView();
    }    

    // MAKE SURE AN ACCOUNT FOR THE CREDENTIALS ABOVE EXISTS IN YOUR APPLICATION
    // This will fail if the account doesn't exist. Not sure how to work around this right now.
    it('Should allow Facebook sign in as a foodie', function() {
        foodieSignInWithFacebook(); 
        browser.waitForAngular();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/');
    });

    it('Should allow showing of all products by clicking the All Products category', function() {
        element.all(by.css('[ng-click="getProductsWithCategory(category)"]')).get(5).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);
    });

    it('Should allow filtering of products by category', function() {
        element(by.css('[ng-click="getAllProducts(\'category\')"]')).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(8);
    }); 
    
    it('Should allow filtering of products by tag', function() {
        element.all(by.className('tag-picker-item')).get(1).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);

        element.all(by.className('tag-picker-item')).get(2).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);

        element.all(by.className('tag-picker-item')).get(2).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1); 

        element.all(by.className('tag-picker-item')).get(1).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(8);                              
    });        
});