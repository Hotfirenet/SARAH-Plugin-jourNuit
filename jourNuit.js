var JNDebug = true;

var JNHeureDuJour = '';
var JNHeureDeLaNuit = '';
var JNSetFlag = false;

exports.init = function (SARAH)
{	
	SARAH.context.jourNuit = {};
		
	var config = SARAH.ConfigManager.getConfig();
	config = config.modules.jourNuit;  
	
	jourOuNuit(config.heureDuJour, config.heureDeLaNuit, '', function(status){
		SARAH.context.jourNuit.status = status;
	});
	
	JNHeureDuJour = config.heureDuJour;
	JNHeureDeLaNuit = config.heureDeLaNuit;	
}

exports.action = function(data, callback, config, SARAH)
{	
	if(JNDebug)
		console.log('01 - action - value context: ' + SARAH.context.jourNuit.status);
	
	var text = 'nous sommes en mode ' + SARAH.context.jourNuit.status;
	
	if(JNDebug)
	{
		console.log('03 - ' + text);	
		console.log('04 - ' + data.jourNuitAction);
		console.log('05 - ' + data.status);
		console.log('06 - ' + JNSetFlag);		
	}
		
	switch(data.jourNuitAction)
	{
		case 'setJourNuit':
			setJourOuNuit(data.status, function(cb){
				SARAH.context.jourNuit.status = cb;
				callback({'tts' : cb});
			});
			break;
			
		case 'getJourNuit':
			callback({'tts' : SARAH.context.jourNuit.status});
			break;
			
		default:
			callback({'tts' : 'Action inconnu'});
			break;
	}
}

exports.cron = function(callback, task, SARAH)
{
	jourOuNuit(JNHeureDuJour, JNHeureDeLaNuit, SARAH.context.jourNuit.status, function(status){
		SARAH.context.jourNuit.status = status;
	});
}

exports.getJourNuit = function(SARAH){ 
	var data = SARAH.context.jourNuit.status;
	
	if(JNDebug)
		console.log('getJourNuit: ' + data);
		
	return data; 
}

var jourOuNuit = function(JNHeureDuJour, JNHeureDeLaNuit, status, cb)
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
	
	var monHeureDuJour= new Date(today +' '+ JNHeureDuJour);
	var monHeureDeLaNuit = new Date(today +' '+ JNHeureDeLaNuit);

	if(JNDebug)
	{
		console.log(date);
		console.log(today);
		console.log(monHeureDuJour);
		console.log(monHeureDeLaNuit);		
	}

	if(date > monHeureDuJour  && date < monHeureDeLaNuit)
	{
		if(!JNSetFlag)
			jourNuit = 'jour';
		else
			jourNuit = status;		
	}
	else
	{
		if(!JNSetFlag)
			jourNuit = 'nuit';
		else
			jourNuit = status;		
	}
		
	if(JNDebug)	
		console.log('cron: ' + jourNuit);
	
	cb(jourNuit);
	return;
}

var setJourOuNuit = function(level, cb)
{
	if(JNDebug)	
		console.log('05 - ' + level);		
		
	if(level)
	{	
		var JNReturn = '';
		switch(level)
		{
			case 'jour':
				JNReturn = 'jour';
				JNSetFlag = true;
				break;		
				
			case 'nuit':
				JNReturn = 'nuit';
				JNSetFlag = true;
				break;
				
			case 'normal':
				if(JNSetFlag)
				{
					JNSetFlag = false;
					jourOuNuit(JNHeureDuJour, JNHeureDeLaNuit, '', function(status){
						JNReturn = status;
					});				
				}
				else
					JNReturn = 'Le système est déjà en mode normal !';
					
				break;
				
			default:
				JNReturn = 'Erreur le level doit etre jour, nuit ou normal !';
				break;				
		}
		
		cb(JNReturn);
		return;				
	} 
}
