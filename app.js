var contactsApp = angular.module('contactsApp', []);

contactsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'list_contacts.html',
        controller: 'mainController'
      }) 

      .when('/contact', {
				templateUrl : 'contact.html',
				controller  : 'contactController'
			})

      .when('/editContact/:contactId', {
                templateUrl : 'contact.html',
                controller  : 'contactController'
      })
      
    .otherwise({
        redirectTo: '/'
      });
  }
]);

contactsApp.controller('mainController', function($scope, $rootScope, $route, $routeParams, $location) {

        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

        $scope.loadContacts = function(){
            $.getJSON('http://blog.armandomusto.com/code_samples/coldfusion_angular_contact_manager/contacts.cfc?method=getContacts',{},function(data){
                $scope.$apply(function(){
                    $rootScope.contacts = data;
                });
            });
        };

        if(angular.isDefined($rootScope.contacts)){
            }
        else{
            $scope.loadContacts();
            console.log('reloading contacts from Coldfusion CFC now!');
        }

        $scope.getContact = function(contactId){
            $scope.contactId = contactId;
            $rootScope.contact = $scope.contacts[$scope.contactId];
            $rootScope.contact.id = $scope.contactId;
            $rootScope.contact.exists = 1;
        };

        //show contactDetails
        $scope.showContactDetails = {};
        $scope.showContactDetails = function(index){
            $scope.showContactDetails[index] = !$scope.showContactDetails[index];
        };


        $scope.deleteContact = function(index){
            console.log(index);
            var thisContact = {};
            thisContact = $rootScope.contacts[index];
            thisContact.id = index;
            $rootScope.contacts.splice(index, 1);
        };

  
});

	contactsApp.controller('contactController', function($scope, $rootScope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.createContact = false;        

        console.log($scope.createContact);

        if(typeof $scope.$routeParams.contactId=="undefined"){
          $scope.createContact = true;        
          $rootScope.contact = {
              "fullname": '',
              "phone": '',
              "email": '',
              "exists": 0
          };
        }else{
          $scope.createContact = false;                  
          contactId = $scope.$routeParams.contactId;
          $scope.getContact(contactId);
        }

        $scope.updateContact = function(){
            thisContact = $rootScope.contact;

            if(thisContact.exists===0){
                $rootScope.contacts.push({ id:thisContact.id, fullname:thisContact.fullname, email:thisContact.email, phone:thisContact.phone });
                $location.path("/");
            } else {
                $rootScope.contacts[thisContact.id] = thisContact;
                $location.path("/");
            }
        }
		
		$scope.cancelContact = function(){
                    $location.path("/");
			}

    });
