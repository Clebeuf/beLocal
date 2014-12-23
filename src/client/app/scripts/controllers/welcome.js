'use strict';

angular.module('clientApp')
  .controller('WelcomeCtrl', function ($scope, AuthService, StateService, $location, ipCookie, $timeout, $http, $filter) {
    $scope.AuthService = AuthService;

    // Scroll to a DOM element with a specific id
    // 1250 represents the duration of the animation
    $scope.scrollTo = function(id) {
        angular.element('html, body').animate({
            scrollTop: angular.element(id).offset().top
        }, 1250);
    }

    // Check to see if there is a hashtag in the url when coming to this page. If so, it means we have to extract it and scroll
    // to a certain part of the page. (This is how the register dropdown works when you're not signed in)
    var url = document.location.toString();
    if (url.split('#')[2]) {
        $timeout(function(){
          $scope.scrollTo('#' + url.split('#')[2]);
          $location.hash('');
        }, 250);
    }

    $scope.sendTemplateEmail = function (params){

        // create a new instance of the Mandrill class with your API key
        // This API key can only send template emails so there is no security risk for having it straight in the code
        var m = new mandrill.Mandrill('CaG6Ld7MlGVaM8_KFM1u6w');

        // send the email to belocal
        m.messages.sendTemplate(
            params, 
            function a(res) {
                console.log("sent email");
                console.log(res[0]);

            }, 
            function b(err) {
                console.log("error sending");
                console.log(err[0]);
            }
        );

    };


    // The function calls our Mandrill Api and sends the vendor email template to the new vendor
    $scope.vendorSendEmail = function (){

        // create a variable for the API call parameters
        var params = {
            "template_name": "vendor-welcome",
            "template_content": [
                {
                    "name": "Welcome to beLocal Victoria!",
                    "content": "Thank you for registering as a Farmer or Foodmaker with beLocal Victoria."
                }
            ],
            "message": {
                "from_email":"belocalvictoria@gmail.com",
                "template_name" : "vendor-welcome",
                "to":[{"email": StateService.getCurrentUser().email }],
                "subject": "Welcome to beLocal Victoria!"
                
            }
        };

        //send the welcome email to the vendor
        $scope.sendTemplateEmail(params);

    };

    // The function calls our Mandrill Api and sends the foodie email template to newly registered foodies
    $scope.foodieSendEmail = function (){

        // create a variable for the API call parameters
        var params = {
            "template_name": "foodie-welcome",
            "template_content": [
                {
                    "name": "Welcome to beLocal Victoria!",
                    "content": "Thank you for registering as a foodie with beLocal Victoria."
                }
            ],
            "message": {
                "from_email":"belocalvictoria@gmail.com",
                "template_name" : "foodie-welcome",
                "to":[{"email": StateService.getCurrentUser().email }],
                "subject": "Welcome to beLocal Victoria!"
                
            }
        };

        //send the welcome email to the foodie
        $scope.sendTemplateEmail(params);

    };

    // The function calls our Mandrill Api and sends the foodie email template to newly registered foodies
    $scope.sendNewVendorEmail = function (){

        // create a variable for the API call parameters
        var params = {
            "template_name": "new-vendor",
            "template_content": [
                {
                    "name": "Welcome to beLocal Victoria!",
                    "content": "Thank you for registering as a foodie with beLocal Victoria."
                }
            ],
            "message": {
                "from_email":"belocalvictoria@gmail.com",
                "template_name" : "new-vendor",
                "to":[{"email": "belocalvictoria@gmail.com" }],
                "subject": "New Vendor on beLocal",
                "global_merge_vars": [
                    {
                        "name": "var1",
                        "content": "Global Value 1"
                    }
                ],
                "merge_vars": [
                  {
                      "rcpt": "belocalvictoria@gmail.com",
                      "vars": [
                          {
                              "name": "FNAME",
                              "content": $scope.newVendorFirstName
                          },
                          {
                              "name": "LNAME",
                              "content": $scope.newVendorLastName
                          },
                          {
                              "name": "UNAME",
                              "content": $scope.newVendorUserName
                          },
                          {
                              "name": "UEMAIL",
                              "content": $scope.newVendorEmail
                          },
                          {
                              "name": "SMETHOD",
                              "content": "Non-Facebook (Email)"
                          },
                          {
                              "name": "RTIME",
                              "content": $filter('date')(new Date(), 'medium')
                          }
                      ]
                  }
            ]
                
            }
        };

        //send us an email to belocal account to let us know about the new vendor
        $scope.sendTemplateEmail(params);

    };


    // Try signing up as a customer with Facebook. If there is already an account associated with the currently authenticated Facebook
    // account, a 304 will be returned from the server, prompting an error message to be displayed.
    $scope.signUpAsCustomer = function() {
      AuthService.createCustomer().then(function(status) {
        if(status === 304) {
          $scope.accountAlreadyCreated = true;
        } else {
          angular.element('#createUserModal').modal('hide');         
        }
      });
    }

    // Try signing up as a vendor with Facebook. If there is already an account associated with the currently authenticated Facebook
    // account, a 304 will be returned from the server, prompting an error message to be displayed.
    $scope.signUpAsVendor = function() {
      AuthService.createVendor().then(function(status) {
        if(status === 304) {
          $scope.accountAlreadyCreated = true;          
        } else {
          console.log(StateService.getCurrentUser());
          angular.element('#createUserModal').modal('hide');        
        }
      });
    }

    // Set a flag to sign up as a vendor (this changes the appearance of some modals in the HTML)
    $scope.signUpAsVendorNoFB = function() {
      $scope.accountAlreadyCreated = false;
      $scope.registerAsVendor = true;
    }

    // Set a flag to sign up as a customer (this changes the appearance of some modals in the HTML)
    $scope.signUpAsCustomerNoFB = function() {
      $scope.accountAlreadyCreated = false;
      $scope.registerAsVendor = false;
    }

    // If a user presses the "Start Browsing Now" button, we set a cookie to hide the splash page next time they visit beLocal
    $scope.getStarted = function() {
      ipCookie('beLocalBypass', true, {expires: 14});     
      $location.path('/');
    }  

    // Create a new vendor without Facebook
    $scope.newVendorSubmit = function() {
      $scope.newUserSubmitted = true;
      $scope.usernameErrorMessage = null;
      $scope.emailErrorMessage = null;      
      if($scope.newUserForm.$valid) {
        var data = {
          username: $scope.newVendorUserName,
          password: $scope.newVendorPassword,
          first_name: $scope.newVendorFirstName,
          last_name: $scope.newVendorLastName,
          email: $scope.newVendorEmail,
        }
      }
      AuthService.createNonFacebookVendor(data)
      .success(function() {
        angular.element('#createUserModal').modal('hide');  
        $scope.vendorSendEmail();
        $scope.sendNewVendorEmail();
      })
      .error(function(response) {
        // Catch any serverside errors and display them on the client (duplicate email/username are the only things we check for currently)
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }                  
      });
    } 

    // Create a new customer without Facebook
    $scope.newCustomerSubmit = function() {
      $scope.newUserSubmitted = true;
      $scope.usernameErrorMessage = null;
      $scope.emailErrorMessage = null;
      if($scope.newUserForm.$valid) {
        var data = {
          username: $scope.newVendorUserName,
          password: $scope.newVendorPassword,
          first_name: $scope.newVendorFirstName,
          last_name: $scope.newVendorLastName,
          email: $scope.newVendorEmail,
        }
      }
      AuthService.createNonFacebookCustomer(data)
      .success(function() {
        angular.element('#createUserModal').modal('hide');
        $scope.foodieSendEmail();  
      })
      .error(function(response) {
        // Set a flag to sign up as a vendor (this changes the appearance of some modals in the HTML)
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }          
      });   
    } 

    // When the create user modal is hidden, check to see what kind of user we have just created, and redirect to the appropriate page in beLocal.
    angular.element('#createUserModal').on('hidden.bs.modal', function(e) {
      $timeout(function() {
        if(StateService.getCurrentUser()){        
          if(StateService.getUserType() === 'CUS') {
              $timeout(function() {
                $location.path('/');                    
              });
          } else if(StateService.getUserType() === 'VEN') {
              console.log(StateService.getCurrentUser());
              console.log("hit");
              $timeout(function() {
                console.log('please work!!!!!!');
                $location.path('/vendor');
              });
          }
          else if(StateService.getUserType() === 'SUP') {
              $timeout(function() {
                $location.path('/manage');
              });
          }
        }
      });
    });
  });
