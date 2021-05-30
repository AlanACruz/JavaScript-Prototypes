//Adding String.trim() support for IE8
if( typeof String.prototype.trim !== 'function' ) {

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	};
}

// Define the FreeEnterpriseJS Class
var FreeEnterpriseJS = {};

// Define Nonspecific Utilities
FreeEnterpriseJS.utils = {

	formatNumbersWithCommas: function( num ){

		num = parseFloat( num ).toFixed( 2 );
		return num.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
	},
	compoundInterest: function( p /*principal*/, r /*interest rate*/, t /*number of times*/, n /*compounds per time*/ ){

		var a = p * Math.pow( ( 1 + r/n ), n * t );
		return parseFloat( a.toFixed( 2 ) );
	},
	printObject: function( o ){
    		
		var str='';

		for( var p in o ){
			if( typeof o[ p ] === 'string' ){
				str+= p + ': ' + o[p]+'; \n';
			} else {
				str+= p + ': { \n' + print( o[ p ] ) + '}'
			}
    		}
		
		return str;
	}
}

//Define Cookie Manager
FreeEnterpriseJS.cookie = {

	set: function(){

		// Set money cookie
		document.cookie = "cdpsMoney=" + FreeEnterpriseJS.status.money.toFixed(2);
		
		// Set resourceGenerators cookies
		for ( var i = 0; i < FreeEnterpriseJS.status.resourceGenerators.length; i += 1 ) {
			document.cookie = "cdps" + FreeEnterpriseJS.status.resourceGenerators[ i ].name + "Count=" + FreeEnterpriseJS.status.resourceGenerators[ i ].count.toString();
			document.cookie = "cdps" + FreeEnterpriseJS.status.resourceGenerators[ i ].name + "Level=" + FreeEnterpriseJS.status.resourceGenerators[ i ].level.toString();
		}

		// Set item storage cookie
		document.cookie = "cdpsStorage=" + JSON.stringify( FreeEnterpriseJS.status.storage );
	},
	del: function(){

		document.cookie = "expires=" + FreeEnterpriseJS.status.before.toUTCString();
	},
	get: function( cName ){

		var name = cName + "=";
		var cArray = document.cookie.split( ';' );
		for( var i = 0; i < cArray.length; i += 1 ) {
			var cString = cArray[i].trim();
			if ( cString.indexOf( name ) === 0 ) {
				return cString.substring( name.length, cString.length );
			}
		}
		return "";
	},
	check: function(){

		// Check for Money
		var cMoney = FreeEnterpriseJS.cookie.get( "cdpsMoney" );
		if ( cMoney !== "" && cMoney !== "NaN" ){
			FreeEnterpriseJS.status.money = parseFloat( cMoney );
		}

		// Check for Resource Generators
		for ( var i = 0; i < FreeEnterpriseJS.status.resourceGenerators.length; i += 1 ) {
			var cCount = FreeEnterpriseJS.cookie.get( "cdps" + FreeEnterpriseJS.status.resourceGenerators[ i ].name + "Count" );
			var cLevel = FreeEnterpriseJS.cookie.get( "cdps" + FreeEnterpriseJS.status.resourceGenerators[ i ].name + "Level" );

			if ( cCount !== "" && cCount !== "NaN" &&
			     cLevel !== "" && cLevel !== "NaN" ){
				FreeEnterpriseJS.status.resourceGenerators[ i ].count = parseInt( cCount, 10 );
				FreeEnterpriseJS.status.resourceGenerators[ i ].level = parseInt( cLevel, 10 );
			}
		}

		// Chekc for item storage cookie
		var cStorage = FreeEnterpriseJS.cookie.get( "cdpsStorage" );
		if ( cStorage !== "" ){
			cStorageArray = JSON.parse( cStorage );
			for ( var j = 0; j < cStorageArray.length; j += 1 ) {
				FreeEnterpriseJS.status.storage.push( new FreeEnterpriseJS.Loot( cStorageArray[ j ].name, cStorageArray[ j ].text, cStorageArray[ j ].level, cStorageArray[ j ].priority ) );
			}
		}
	}
};

// Define the UI Object
FreeEnterpriseJS.ui = {

	FPS: 20,
	refreshRate: function(){

		// 1000 ms = 1 s.  So this retruns the number of ms per frame.
		return 1000 / FreeEnterpriseJS.ui.FPS;
	},
	update: function(){

		$( "#money" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.money ) );
		$( "#totalIncome" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.totalIncome() ) );

		for ( var i = 0; i < FreeEnterpriseJS.status.resourceGenerators.length; i += 1 ) {
			FreeEnterpriseJS.status.resourceGenerators[ i ].updateUI();
		}

		$( "#storage" ).html( "" );

		for ( var j = 0; j < FreeEnterpriseJS.status.storage.length; j += 1 ) {
			FreeEnterpriseJS.status.storage[ j ].addToUI();
		}
    	},
	init: function(){

		$( "#resourceGenerators" ).html( "" );
		for ( var i = 0; i < FreeEnterpriseJS.status.resourceGenerators.length; i += 1 ) {
			FreeEnterpriseJS.status.resourceGenerators[ i ].addToUI();
			FreeEnterpriseJS.status.resourceGenerators[ i ].bindEvents();
		}
		$( "#resetGame" ).click( function() { FreeEnterpriseJS.status.resetGame(); });
	}
};

// Define Nonspecific Utilities
FreeEnterpriseJS.status = {

	money: 0,
	before: 0,
	now: 0,
	tics: 0,
	elapsedTime: 0,
	storage: [],
	addMoney: function( amount ){

		FreeEnterpriseJS.status.money += parseFloat( amount );
	},
	subtractMoney: function( amount ){

		FreeEnterpriseJS.status.money -= parseFloat( amount );
	},
	collect: function() {

		FreeEnterpriseJS.status.now = new Date();
		FreeEnterpriseJS.status.elapsedTime = ( FreeEnterpriseJS.status.now.getTime() - FreeEnterpriseJS.status.before.getTime() );
		FreeEnterpriseJS.status.addMoney( ( FreeEnterpriseJS.status.totalIncome() / FreeEnterpriseJS.ui.FPS ) * ( FreeEnterpriseJS.status.elapsedTime / FreeEnterpriseJS.ui.refreshRate() ) );

		/* Debug Display */
		$( "#FPS" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.ui.FPS ) );
		$( "#refreshRate" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.ui.refreshRate() ) );
		$( "#incomePerRefresh" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.totalIncome() / FreeEnterpriseJS.ui.refreshRate() ) );
		$( "#elaspedTime" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.elapsedTime ) );
		$( "#elaspedTimePerRefresh" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.elapsedTime / FreeEnterpriseJS.ui.refreshRate() ) );
		
	},
	totalIncome: function() {

		var total = 0;
		
		for ( var i = 0; i < FreeEnterpriseJS.status.resourceGenerators.length; i += 1 ) {
			total += FreeEnterpriseJS.status.resourceGenerators[ i ].income();
		}
		return total;
	},
	resetGame: function() {

		FreeEnterpriseJS.status.tics = 101;
		FreeEnterpriseJS.status.init();
		FreeEnterpriseJS.ui.init();
		FreeEnterpriseJS.cookie.del();
		FreeEnterpriseJS.status.tics = 99;
	},
	init: function(){

		FreeEnterpriseJS.status.money = 20;
		FreeEnterpriseJS.status.resourceGenerators = new Array();
		FreeEnterpriseJS.status.resourceGenerators[ 0 ] = new FreeEnterpriseJS.ResourceGenerator( "Farm", 0, 0, 15, 0.05 , 1 );
		FreeEnterpriseJS.status.resourceGenerators[ 1 ] = new FreeEnterpriseJS.ResourceGenerator( "Warehouse", 0, 0, 250, 0.06 , 5 );
		FreeEnterpriseJS.status.resourceGenerators[ 2 ] = new FreeEnterpriseJS.ResourceGenerator( "Factory", 0, 0, 1500, 0.07, 25 );
		FreeEnterpriseJS.status.resourceGenerators[ 3 ] = new FreeEnterpriseJS.ResourceGenerator( "Website", 0, 0, 25000, 0.20 , 100 );
		FreeEnterpriseJS.status.storage = new Array();
	}
};

// Define the Base Loot Class
FreeEnterpriseJS.Loot = function( name, text, level, priority ){

	this.name = name || "Junk";
	this.text = text || "Nothing of value.";
	this.level = level || 0;
	this.priority = priority || 0;
};

FreeEnterpriseJS.Loot.prototype = {

	init: "", // To be overwriten

	addToUI: function(){
		$( "#storage" ).append( "<div class=\"item\">" + this.name + ": " + this.text + " Item Level: " + this.level + "</div>" );
	}
};

// Define Loot Generator
FreeEnterpriseJS.lootGenerator = {

	selectLoot: function( generatableLootList ){
		
		var totalPriority = 0;		

		// Loop to find the totalPriority of all items in generatableLootList
		for ( var i = 0; i < generatableLootList.length; i += 1 ) {
			if ( generatableLootList[ i ].priority > 0 ){
				totalPriority += generatableLootList[ i ].priority;
			}
		}
		
		// Generate a number between 1 and totalPriority
		var magicNumber = Math.floor( ( Math.random() * totalPriority ) + 1 );
		
		// Loop to find the item that was picked from the generatableLootList
		for ( var j = 0; j < generatableLootList.length; j += 1 ) {
			
			// Subtract items priority from the magicNumber
			magicNumber -= generatableLootList[ j ].priority;
			
			if ( magicNumber <= 0 ){
				return generatableLootList[ j ];
			}
		}

		return new FreeEnterpriseJS.Loot();	
	},
	includeStandardLoot: function( generateableLootList ){
		
		generateableLootList.push( new FreeEnterpriseJS.Loot( "Candy", "Sweet, candy! or Sweet candy!", 1, 100 ) );
		generateableLootList.push( new FreeEnterpriseJS.Loot( "Water", "Always useful.", 2, 100 ) );
		generateableLootList.push( new FreeEnterpriseJS.Loot( "9mm Ammo", "Put 'em down.", 3, 10 ) );
		generateableLootList.push( new FreeEnterpriseJS.Loot( "9mm Handgun", "Finally.", 3, 1 ) );
		return generateableLootList;
	},
	generateLoot: function( generateableLootList, includeStandardLoot ){
		
		var selectedLoot = {};

		// Check to see if generateableLootList is an Array
		if( Object.prototype.toString.call( generateableLootList ) !== '[object Array]' ) {

			//generateable loot was not an array so make it one and add the standard loot
			generateableLootList = new Array();
			includeStandardLoot = true;
		}
		
		var generatedLoot = {};

		// Add standard loot to the list
		if ( includeStandardLoot === true ) {

			generateableLootList = FreeEnterpriseJS.lootGenerator.includeStandardLoot( generateableLootList );
		}

		// Select a loot item from the list
		selectedLoot = FreeEnterpriseJS.lootGenerator.selectLoot( generateableLootList );

		// Initialized the loot if it needs to be 
		if( typeof selectedLoot.init === 'function' ) {

			selectedLoot.init();
		}

		FreeEnterpriseJS.status.storage.push( selectedLoot );
	}
};


// Define the Resource Generator Class
FreeEnterpriseJS.ResourceGenerator = function( name, num, lvl, baseC, baseI, baseR ){

	this.name = name || "default";
	this.count = num || 0;
	this.level = lvl || 0;
	this.baseCost = baseC || 0;
	this.baseInflation = baseI || 0;
	this.baseReturn = baseR || 0;
};

FreeEnterpriseJS.ResourceGenerator.prototype = {

	upgradeCost: function(){

		return FreeEnterpriseJS.utils.compoundInterest( ( this.baseCost * 3 ), ( this.baseInflation * 3 ), this.level, 1 );
	},
	buyCost: function() {

		return FreeEnterpriseJS.utils.compoundInterest( this.baseCost, this.baseInflation , this.count + 1, 1 );
	},
	refund: function() {

		if( this.count > 0 ){

			return FreeEnterpriseJS.utils.compoundInterest( this.baseCost, this.baseInflation, this.count , 1 );
		} else {

			return 0;
		}
	},
	income: function() {

		return this.count * this.incomePer();
	},
	incomePer: function() {

		return FreeEnterpriseJS.utils.compoundInterest( this.baseReturn, this.baseInflation , this.level + 1, this.level + 1 );
	},
	buy: function() {

		if( FreeEnterpriseJS.status.money >= this.buyCost() ){

			FreeEnterpriseJS.status.subtractMoney( this.buyCost() );
			this.count += 1;
		}
	},
	sell: function() {

		if( this.count >= 1 ){

			FreeEnterpriseJS.status.addMoney( this.refund() );
			this.count -= 1;
		}
	},
	upgrade: function() {

		if( FreeEnterpriseJS.status.money >= this.upgradeCost() && this.count > 0 ){

			FreeEnterpriseJS.status.subtractMoney( this.upgradeCost() );
			this.level += 1;
		}
	},
	addToUI: function() {

		$( "#resourceGenerators" ).append( "<div id=\"" + this.name + "Div\">"  +
			this.name + " Count: <span id=\"" + this.name + "Count\"></span><br/>" + 
			"Income Per " + this.name  + ": $<span id=\"" + this.name + "IncomePer\"></span><br/>" +
			"<a href=\"#\" id=\"" + this.name + "Buy\">Buy " + this.name + " for $<span id=\"" + this.name + "Cost\"></span></a><br/>" +
			"<a href=\"#\" id=\"" + this.name + "Sell\">Sell " + this.name + " for $<span id=\"" + this.name + "Refund\"></span></a><br/>" +
			this.name + " Level: <span id=\"" + this.name + "Level\"></span><br/>" +
			"<a href=\"#\" id=\"" + this.name + "Upgrade\">Upgrade " + this.name + " for $<span id=\"" + this.name + "UpgradeCost\"></span></a><br/>" +
			"</div>" );
	},
	bindEvents: function() {

		var that = this;
		$( "#" + this.name + "Buy" ).click( function() { that.buy(); });
		$( "#" + this.name + "Sell" ).click( function() { that.sell(); });
		$( "#" + this.name + "Upgrade" ).click( function() { that.upgrade(); });
	},
	updateUI: function() {

		$( "#" + this.name + "Count" ).html( this.count );
		$( "#" + this.name + "Cost" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( this.buyCost() ) );
		$( "#" + this.name + "Refund" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( this.refund() ) );
		$( "#" + this.name + "Level" ).html( this.level );
		$( "#" + this.name + "IncomePer" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( this.incomePer() ) );
		$( "#" + this.name + "UpgradeCost" ).html( FreeEnterpriseJS.utils.formatNumbersWithCommas( this.upgradeCost() ) );
	}
};

// On document ready start the game.
$( document ).ready( function() {

	// Initialize the game
	FreeEnterpriseJS.status.before = new Date();  //init 'before' for the the first loop
	FreeEnterpriseJS.status.tics = 99;  // make first loop trigger the document.title & cookie update
	FreeEnterpriseJS.status.init();
	FreeEnterpriseJS.ui.init();

	// Check for cookies
	FreeEnterpriseJS.cookie.check();

	// Start the Game Loop
	setInterval( function(){

		FreeEnterpriseJS.status.collect();
		FreeEnterpriseJS.status.before = new Date();
		FreeEnterpriseJS.ui.update();
		FreeEnterpriseJS.status.tics += 1;

		// Update the Document's Cookies and the Document's Title every 100 loops
		if( FreeEnterpriseJS.status.tics === 100 ){
			
			// Drop some sweet loot
			FreeEnterpriseJS.lootGenerator.generateLoot();

			document.title = "$" + FreeEnterpriseJS.utils.formatNumbersWithCommas( FreeEnterpriseJS.status.money );
			FreeEnterpriseJS.cookie.set();
			FreeEnterpriseJS.status.tics = 0;
		}
	}, FreeEnterpriseJS.ui.refreshRate() );
});