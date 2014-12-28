describe('Testing population of database for farmer', function() {
    beforeEach(function(){
        browser.sleep(1000);        
    });

    browser.manage().deleteAllCookies();
    browser.driver.manage().deleteAllCookies();
    browser.get('http://127.0.0.1:9000');

    it('Should allow Facebook sign in as a vendor', function(){
        element(by.css('[ng-click="clearLoginModal()"]')).click();
        browser.sleep(1000);
        element(by.css('[ng-click="signIn()"]')).click();
        browser.waitForAngular();
        browser.sleep(1000);        
        expect(browser.getCurrentUrl()).toEqual('http://127.0.0.1:9000/#/vendor');
    });

    // POPULATE PRODUCTS FOR TEST DATABASE

    it('Should allow the creation of Apple Pie', function(){
        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/apple-pie.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Applie Pie');
        element(by.model('itemDescription')).sendKeys('Yummy Apple Pie!');

        element(by.cssContainingText('option', 'Baked Goods')).click();
        element.all(by.repeater('tag in tagList')).get(1).click();
        element.all(by.repeater('tag in tagList')).get(2).click();
        element.all(by.repeater('tag in tagList')).get(5).click();
        element.all(by.repeater('tag in tagList')).get(7).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500);
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(2);        
    });

    it('Should allow the creation of Apples', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/apples.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Apples');
        element(by.model('itemDescription')).sendKeys('Yummy Apples!');

        element(by.cssContainingText('option', 'Fruits')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click(); 
        browser.sleep(500);
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(3);
    });

    it('Should allow the creation of Carrots', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/carrots.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Carrots');
        element(by.model('itemDescription')).sendKeys('Yummy Carrots!');

        element(by.cssContainingText('option', 'Vegetables')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500);  
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(4);               
    });            

    it('Should allow the creation of Kale', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/kale.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Kale');
        element(by.model('itemDescription')).sendKeys('Yummy Kale!');

        element(by.cssContainingText('option', 'Vegetables')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500); 
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(5);
    });

    it('Should allow the creation of Potatoes', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/potatoes.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Potatoes');
        element(by.model('itemDescription')).sendKeys('Yummy Potatoes!');

        element(by.cssContainingText('option', 'Vegetables')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500);
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(6);
    });

    it('Should allow the creation of Radishes', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/radish.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Radish');
        element(by.model('itemDescription')).sendKeys('Yummy Radishes!');

        element(by.cssContainingText('option', 'Vegetables')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500);
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(7);         
    });

    it('Should allow the creation of Squash', function(){

        // Load the picture
        var path = require('path');
        var fileToUpload = 'images/squash.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        // Create a new item
        element(by.buttonText('Create New Item')).click();
        element(by.id('item-image')).sendKeys(absolutePath);
        element(by.model('itemName')).sendKeys('Squash');
        element(by.model('itemDescription')).sendKeys('Yummy Squash!');

        element(by.cssContainingText('option', 'Vegetables')).click();
        element.all(by.repeater('tag in tagList')).get(0).click();
        element.all(by.repeater('tag in tagList')).get(4).click();        
        element(by.css('[ng-click="newItemSubmit()"]')).click();
        browser.sleep(500);
        expect(element.all(by.repeater('product in sellerItems')).count()).toEqual(8);         
    });


});