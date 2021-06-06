/**
 * This geocoder is used to update geocoding of zip codes
 */

var app = angular.module("geocoderApp", []);
var maxRequest = 0;
var minRequest = 0;
var googleAPIKey = ""; /* Insert Google API Key */

app.controller( "geocoderCtrl", function( $scope, $http ) {
	

	$scope.zips = [];
	$scope.submit = function() {
		
		maxRequest = parseInt( $scope.maxRequest );
		minRequest = parseInt( $scope.minRequest );
		
		for( i = minRequest; i < ( minRequest + maxRequest ); i++ ) {
			
			var s = "00000" + i;
			s = s.substr(s.length-5);
	
			var httpRequest = "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + s + "&key=" + googleAPIKey;
	
			$http.get( httpRequest )
			.then( function( response ) {
	
				if( response.data.results.length !== 0 ){
	
					var zip = {};
					zip.zip = response.data.results[0].address_components[0].short_name;
					zip.lat = response.data.results[0].geometry.location.lat;
					zip.lng = response.data.results[0].geometry.location.lng;
					$scope.zips.push( zip ); 
				}
			});
		}
	}
});