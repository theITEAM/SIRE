/* Loads and saves SIRE files */

function save(withres)                                                                                 // Saves a SIRE file
{
	collectvariables();           
	 
	st = "";
	st += "param:"+JSON.stringify(param)+"\n";	
	st += "tpostmin:"+JSON.stringify(tpostmin)+"\n";
	st += "tpostmax:"+JSON.stringify(tpostmax)+"\n";

	st += "tdatamin:"+JSON.stringify(tdatamin)+"\n";
	st += "tdatamax:"+JSON.stringify(tdatamax)+"\n";

	st += "data:"+JSON.stringify(data)+"\n";
	
	st += "nchain:"+JSON.stringify(nchain)+"\n";

	st += "popshow:"+JSON.stringify(popshow)+"\n";
	
	st += "filt:"+JSON.stringify(filt)+"\n";
	st += "indfilt:"+JSON.stringify(indfilt)+"\n";
	st += "sampfilt:"+JSON.stringify(sampfilt)+"\n";
	st += "runsel:"+JSON.stringify(runsel)+"\n";
	
	st += "inddata:"+JSON.stringify(inddata)+"\n";

	if(withres == 1) st += "infres:"+JSON.stringify(infres)+"\n";

	st += "data:"+JSON.stringify(data)+"\n";

	st += "nvar:"+JSON.stringify(nvar)+"\n";  // used for parameter inference
	st += "vartype:"+JSON.stringify(vartype)+"\n";
	st += "varname:"+JSON.stringify(varname)+"\n";
	st += "vardesc:"+JSON.stringify(vardesc)+"\n";
	if(withres == 1) st += "varval:"+JSON.stringify(varval)+"\n";
	st += "varsel:"+JSON.stringify(varsel)+"\n";
	st += "filter:"+JSON.stringify(filter)+"\n";
	st += "filtervar:"+JSON.stringify(filtervar)+"\n";
	st += "burnin:"+JSON.stringify(burnin)+"\n";
	st += "nsamp:"+JSON.stringify(nsamp)+"\n";
	st += "sampthin:"+JSON.stringify(sampthin)+"\n";
	st += "nsampread:"+JSON.stringify(nsampread)+"\n";
	st += "nsamppl:"+JSON.stringify(nsamppl)+"\n";
	st += "nid:"+JSON.stringify(nid)+"\n";
	st += "id:"+JSON.stringify(id)+"\n";
	st += "varselx:"+JSON.stringify(varselx)+"\n";
	st += "varsely:"+JSON.stringify(varsely)+"\n";
	st += "runpopsel:"+JSON.stringify(runpopsel)+"\n";
	st += "widthst:"+JSON.stringify(width)+"\n";
	st += "heightst:"+JSON.stringify(height)+"\n";
	st += "datanote:"+JSON.stringify(datanote)+"\n";
	st += "modtype:"+JSON.stringify(modtype)+"\n";
 	st += "envon:"+JSON.stringify(envon)+"\n";
	st += "geon:"+JSON.stringify(geon)+"\n";
	st += "domon:"+JSON.stringify(domon)+"\n";
	st += "order:"+JSON.stringify(order)+"\n";
 	st += "fixeddata:"+JSON.stringify(fixeddata)+"\n";
	st += "trialtime:"+JSON.stringify(trialtime)+"\n";
	st += "tposttrialmin:"+JSON.stringify(tposttrialmin)+"\n";
	st += "tposttrialmax:"+JSON.stringify(tposttrialmax)+"\n";
	st += "triallist:"+JSON.stringify(triallist)+"\n";
	st += "groupsel:"+JSON.stringify(groupsel)+"\n";
	st += "groupop:"+JSON.stringify(groupop)+"\n";
	st += "tobsmin:"+JSON.stringify(tobsmin)+"\n";
	st += "tobsmax:"+JSON.stringify(tobsmax)+"\n";
	st += "tobstrialmin:"+JSON.stringify(tobstrialmin)+"\n";
	st += "tobstrialmax:"+JSON.stringify(tobstrialmax)+"\n";
	st += "dataerror:"+JSON.stringify(dataerror)+"\n";
	st += "nsampmax:"+JSON.stringify(nsampmax)+"\n";
	st += "nsampevmax:"+JSON.stringify(nsampevmax)+"\n";
	st += "fileToLoadlist:"+JSON.stringify(fileToLoadlist)+"\n";
	return st;
}

function load()                                                                                         // Loads a SIRE file
{		
	var lines = textFromFile.split('\n');
	var n = 0, j, st;
	
	dataerror = "";
	infres={}; varval=[];
	 
	for(n = 0; n < lines.length; n++){
		st = lines[n];
		if(st.length > 0){
			j = 0; while(j < st.length && st.substr(j,1) != ":") j++; if(j == st.length){ alertp("Problem loading file."); return 1;}
			code = st.substr(0,j); st = st.substr(j+1);

			if(st != "undefined"){
				switch(code){
				case "param": param = JSON.parse(st); break;
				case "tpostmin": tpostmin = JSON.parse(st); break;
				case "tpostmax": tpostmax = JSON.parse(st); break;
				case "tdatamin": tdatamin = JSON.parse(st); break;
				case "tdatamax": tdatamax = JSON.parse(st); break;
				case "data": data = JSON.parse(st); break;
				case "nchain": nchain = JSON.parse(st); break;
				case "popshow": popshow = JSON.parse(st); break;
				case "filt": filt = JSON.parse(st); break;
				case "indfilt": indfilt = parseInt(JSON.parse(st)); break;
				case "sampfilt": sampfilt = JSON.parse(st); break;
				case "runsel": runsel = JSON.parse(st); break;
				case "inddata": inddata = JSON.parse(st); break;
				case "infres": infres = JSON.parse(st); break;
				case "data": data = JSON.parse(st); break;
				case "nvar": nvar = JSON.parse(st); break;
				case "vartype": vartype = JSON.parse(st); break;
				case "varname": varname = JSON.parse(st); break;
				case "vardesc": vardesc = JSON.parse(st); break;
				case "varval": varval = JSON.parse(st); break;
				case "varsel": varsel = JSON.parse(st); break;
				case "filter": filter = JSON.parse(st); break;
				case "filtervar": filtervar = JSON.parse(st); break;
				case "burnin": burnin = JSON.parse(st); break;
				case "nsamp": nsamp = JSON.parse(st); break;
				case "nsampread": nsampread = JSON.parse(st); break;
				case "sampthin": sampthin = JSON.parse(st); break;
				case "nsamppl": nsamppl = JSON.parse(st); break;
				case "nid": nid = JSON.parse(st); break;
				case "id": id = JSON.parse(st); break;
				case "varselx": varselx = JSON.parse(st); break;
				case "varsely": varsely = JSON.parse(st); break;
				case "runpopsel": runpopsel = JSON.parse(st); break;
				case "widthst": widthold = JSON.parse(st); break;
				case "heightst": heightold = JSON.parse(st); break;
				case "datanote": datanote = JSON.parse(st); break;
				case "modtype": modtype = JSON.parse(st); break;
				case "envon": envon = JSON.parse(st); break;
				case "geon": geon = JSON.parse(st); break;
				case "domon": domon = JSON.parse(st); break;
				case "order": order = JSON.parse(st); break;
				case "fixeddata": fixeddata = JSON.parse(st); break;
				case "trialtime": trialtime = JSON.parse(st); break;
				case "tposttrialmin": tposttrialmin = JSON.parse(st); break;
				case "tposttrialmax": tposttrialmax = JSON.parse(st); break;
				case "triallist": triallist = JSON.parse(st); break;
				case "groupsel": groupsel = JSON.parse(st); break;
				case "groupop": groupop = JSON.parse(st); break;
				case "tobsmin": tobsmin = JSON.parse(st); break;
				case "tobsmax": tobsmax = JSON.parse(st); break;
				case "tobstrialmin": tobstrialmin = JSON.parse(st); break;
				case "tobstrialmax": tobstrialmax = JSON.parse(st); break;
				case "dataerror": dataerror = JSON.parse(st); break;
				case "nsampmax": nsampmax = JSON.parse(st); break;
				case "nsampevmax": nsampevmax = JSON.parse(st); break;
				case "fileToLoadlist": fileToLoadlist = JSON.parse(st); break;
				
				//case "":  = JSON.parse(st); break;
				}
			}
		}
	}

	//param = []; if(domon == undefined) domon = 1;
	//fileToLoadlist=[];
	
	/*
	for(j= 0; j < triallist.length; j++){
		num =  parseInt(triallist[j].substring(3))-1;
		sh = Math.floor(num/5);
		tposttrialmin[j] = sh*100; tposttrialmax[j] = (sh)*100+40; 
		tobstrialmin[j] = sh*100; tobstrialmax[j] = (sh)*100+40; 
	}
	*/
	
	for(i = 0; i < 8; i++) pagesub[i] = 0;
	
	modelstart = 1;
	setsize();	

	changepage(DATAPAGE,0);
	return 0;
}
