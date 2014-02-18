var debug = false;

exports.action = function(data, callback, config, SARAH){
	var strJourNuit = '';
	var jourOuNuit = SARAH.ConfigManager.getModule('jourNuit');
		
	if(jourOuNuit.jourNuit == 'jour')
		strJourNuit = 'le jour.';
	else
		strJourNuit = 'la nuit.';
	
	var text = 'nous sommes ' + strJourNuit;
	
	callback({'tts': text});
}

exports.cron = function(callback, task, SARAH){
	var config = SARAH.ConfigManager.getConfig().modules.jourNuit;
	var jourNuit = '';
	
	var month=new Array();
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";		

	var date = new Date();
	var today = date.getFullYear() +'-'+ month[date.getMonth()] +'-'+ date.getDate();	
	
	var monHeureDuJour= new Date(today +' '+ config.heureDuJour);
	var monHeureDeLaNuit = new Date(today +' '+config.heureDeLaNuit);

	if(debug)
	{
		console.log(date);
		console.log(today);
		console.log(monHeureDuJour);
		console.log(monHeureDeLaNuit);		
	}

	if(date > monHeureDuJour  && date < monHeureDeLaNuit)
		jourNuit = 'jour';
	else
		jourNuit = 'nuit';		
		
	if(debug)	
		console.log('cron: ' + jourNuit);
	
	exports.jourNuit = jourNuit;
	
	callback({});
}

exports.getJourNuit = function(SARAH){ 
	var getJourNuitPortlet = SARAH.ConfigManager.getModule('jourNuit');
	var data = getJourNuitPortlet.jourNuit;
	
	if(debug)
		console.log('getJourNuit: ' + data);
		
	return data; 
}
