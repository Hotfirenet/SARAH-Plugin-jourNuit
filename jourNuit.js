var jn_debug = false;

var jn_heureDuJour = '';
var jn_heureDeLaNuit = '';
var jn_flag = false;

exports.init = function (SARAH)
{	
	SARAH.context.jourNuit = {};
		
	var config = SARAH.ConfigManager.getConfig();
	config = config.modules.jourNuit;  
	
	jourOuNuit(config.heureDuJour, config.heureDeLaNuit, function(status){
		SARAH.context.jourNuit.status = status;
	});
	
	jn_heureDuJour = config.heureDuJour;
	jn_heureDeLaNuit = config.heureDeLaNuit;
	
}

exports.action = function(data, callback, config, SARAH)
{
	
	if(jn_debug)
		console.log('01 - action - value context: ' + SARAH.context.jourNuit.status);
	
	if(SARAH.context.jourNuit.status == 'jour')
		strJourNuit = 'le jour.';
	else
		strJourNuit = 'la nuit.';
	
	if(jn_debug)
		console.log('02 - ' + strJourNuit);
	
	var text = 'nous sommes ' + strJourNuit;
	
	if(jn_debug)
		console.log('03 - ' + text);	
		
	switch(data.jourNuitAction)
	{
		case 'setJourNuit':
			setJourOuNuit(data.status, function(cb){
				callback({'tts' : cb});
			});
			break;
			
		default:
			callback({'tts' : 'Action inconnu'});
			break;
	}
}

exports.cron = function(callback, task, SARAH)
{
	jourOuNuit(jn_heureDuJour, jn_heureDeLaNuit, function(status){
		SARAH.context.jourNuit.status = status;
	});
}

exports.getJourNuit = function(SARAH){ 
	var data = SARAH.context.jourNuit.status;
	
	if(jn_debug)
		console.log('getJourNuit: ' + data);
		
	return data; 
}

var jourOuNuit = function(jn_config_heureDuJour, jn_config_heureDeLaNuit, cb)
{
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
	
	var monHeureDuJour= new Date(today +' '+ jn_config_heureDuJour);
	var monHeureDeLaNuit = new Date(today +' '+ jn_config_heureDeLaNuit);

	if(jn_debug)
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
		
	if(jn_debug)	
		console.log('cron: ' + jourNuit);
	
	cb(jourNuit);
	return;
}

var setJourOuNuit = function(level, cb)
{
	if(level)
	{	
		var msg = '';
		switch(level)
		{
			case 'jour':
				msg = 'jour';
				break;		
				
			case 'nuit':
				msg = 'nuit';
				break;
				
			default:
				msg = 'Erreur le level doit etre jour ou nuit !';
				break;				
		}
		
		cb(msg);
		return;				
	} 
	else
	{
		
	}
}
