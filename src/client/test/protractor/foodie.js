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

    it('Should allow filtering of products by category', function() {
        element.all(by.css('[ng-click="getProductsWithCategory(category)"]')).get(5).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);
    });

    it('Should allow showing of all products by clicking the All Products category', function() {
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

    it('Should allow filtering of products by tag within a category', function() {
        element.all(by.css('[ng-click="getProductsWithCategory(category)"]')).get(0).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);

        element.all(by.className('tag-picker-item')).get(1).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(0); 
        
        element.all(by.className('tag-picker-item')).get(1).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);

        element.all(by.css('[ng-click="getProductsWithCategory(category)"]')).get(5).click();
        expect(element.all(by.repeater('item in trendingProducts')).count()).toEqual(1);
    }); 

    it('Should allow filtering by tag from the product details modal on the trending page', function() {
        element.all(by.repeater('item in trendingProducts')).get(0).click();
        browser.sleep(1000);

        element.all(by.repeater('tag in product.tags')).get(0).click();
        browser.sleep(1000);
        expect(element(by.css('.new-heading-style')).getText()).toEqual('Baked Goods');
        expect(element.all(by.css('[ng-show="tagSelected(tag.name)"]')).get(1).isDisplayed()).toBeTruthy();
    });

    it('Should allow liking and unliking of products', function() {
        element(by.css('[ng-click="likeUnlikeItem(item, \'product\')"]')).click();
        browser.sleep(1000);
        expect(element(by.css('[ng-show="item.is_liked"]')).isDisplayed()).toBeTruthy();

        element(by.css('[ng-click="likeUnlikeItem(item, \'product\')"]')).click();
        browser.sleep(1000);
        expect(element(by.css('[ng-show="item.is_liked"]')).isDisplayed()).toBeFalsy();        
    });

    it('Should take users to the vendor page when they click a vendor\'s name in a product card', function() {
        element(by.css('[ng-click="displayVendor(item.vendor.id)"]')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor/details/2');

        browser.navigate().back();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#trending');        
    }); 

    it('Should take users to the vendor page when they click a vendor\'s name in a product\'s details modal', function() {
        element.all(by.repeater('item in trendingProducts')).get(0).click();
        browser.sleep(1000);
        element(by.className('product-detail-vendor')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor/details/2');

        browser.navigate().back();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#trending');
    }); 

    it('Should allow users to view the vendor tab', function() {
        element(by.className('pro-vendor-tab')).click();
        browser.sleep(500);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#vendors');
    }); 

    it('Should take users to the vendor page when they click a vendor\'s name on a vendor card', function() {
        // Get the vendor name object for small screen sizes
        element.all(by.className('pro-vendor-name')).get(1).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor/details/2');
    });

    it('Should allow liking of vendors from the vendor details page', function() {
        element.all(by.css('[ng-click="likeUnlikeItem(vendorDetails.vendor, \'vendor\')"]')).get(0).click();
        browser.sleep(1000);
        expect(element.all(by.css('[ng-show="vendorDetails.vendor.is_liked"]')).get(0).isDisplayed()).toBeTruthy(); 
        element.all(by.css('[ng-click="likeUnlikeItem(vendorDetails.vendor, \'vendor\')"]')).get(0).click();
        browser.sleep(1000);
        expect(element.all(by.css('[ng-show="vendorDetails.vendor.is_liked"]')).get(0).isDisplayed()).toBeFalsy();  

        // This also inadvertently tests some back button behaviour 
        browser.navigate().back();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#vendors');                
    });     

    it('Should open a product details modal when a product in a vendor card is clicked', function() {
        // Get the second product for small screen sizes
        element.all(by.repeater('product in vendor.products')).get(5).click();
        browser.sleep(1000);
        expect(element(by.className('product-details-model')).isDisplayed()).toBeTruthy();
    });

    it('Should allow filtering by tag from a product details modal on a page other than the trending page', function() {
        element.all(by.repeater('tag in product.tags')).get(0).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#trending');        
        expect(element.all(by.css('[ng-show="tagSelected(tag.name)"]')).get(0).isDisplayed()).toBeTruthy();

        // Check back button behaviour again
        browser.navigate().back();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#vendors');        
        expect(element(by.className('product-details-model')).isDisplayed()).toBeFalsy();        
    });   

    it('Should allow users to view the markets tab', function() {
        element(by.className('pro-market-tab')).click();
        browser.sleep(500);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#markets');
    });

    it('Should take users to the market details page when a market is clicked', function() {
        element.all(by.repeater('market in marketList')).get(0).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://127.0.0.1:9000/#/market/details/');                        
    });

    it('Should allow liking of markets from the market details page', function() {
        element(by.css('[ng-click="likeUnlikeItem(marketDetails, \'market\')"]')).click();
        browser.sleep(1000);
        expect(element(by.css('[ng-show="marketDetails.is_liked"]')).isDisplayed()).toBeTruthy(); 
        element(by.css('[ng-click="likeUnlikeItem(marketDetails, \'market\')"]')).click();
        browser.sleep(1000);
        expect(element(by.css('[ng-show="marketDetails.is_liked"]')).isDisplayed()).toBeFalsy();                

        // Check back button behaviour
        browser.navigate().back();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/#markets');         
    });

    it('Should allow liking of markets from the markets tab', function() {
        browser.executeScript('scrollTo(0,0);'); 
        browser.sleep(500);        
        element.all(by.css('[ng-click="likeUnlikeItem(market, \'market\')"]')).get(0).click();
        browser.sleep(1000);
        expect(element.all(by.css('[ng-show="market.is_liked"]')).get(0).isDisplayed()).toBeTruthy(); 
        element.all(by.css('[ng-click="likeUnlikeItem(market, \'market\')"]')).get(0).click();
        browser.sleep(1000);
        expect(element.all(by.css('[ng-show="market.is_liked"]')).get(0).isDisplayed()).toBeFalsy();          
    });
});