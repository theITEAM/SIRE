/* Functions for when the mouse is clicked */

function mouseclick(x,y)                                                      // Fires when the mouse is clicked 
{
	var flag;

	if(gdropsel >= 0 && buttype[over] != GDROPSELBUT) gdropsel = -1;

	mx = x; my = y;

	if(helptype >= 0 && !(over >= 0 && buttype[over] == HELPBACKBUT)) helptype = -1;

	if(over >= 0){ finalaction(over); over = -1;}

	buttoninit(); 
}

function mousedblclick()                                                       // Fires for a double click
{
	var dtx, dy, ttmid, ymid, xx, yy;

	if(buttype[over] == CANVASBUT){
		if(canover == -1){
			if(arrow == 2){
				if((page == DATAPAGE && pagesub[page] == 1) || (page == RUNPAGE && pagesub[page] == 4)){
					indzoom(mx-menux-tlinexmin-40,0.5);
				}
			}
		}
	}
}

function finalaction(i)                                                             // What happens when a button is clicked
{
	var x, y, dx, dy, text, val, val2, ac, linkratest, tcvtemp, namest, subnamest;

	makesure = -2;

	x = butx[i]; y = buty[i]; dx = butdx[i]; dy = butdy[i], text = buttext[i]; val = butval[i]; val2 = butval2[i]; ac = butac[i];

	switch(ac){
	case TABBUT:
		if(modelstart == 1){
			loading = 0;
			changepage(val,-1); 
		}
		break;
    
	case PAGESUBBUT:
		loading = 0;
		changepage(-1,val,-1);
		break;
	
	case EXPORTAC:
		exporton = 1;
		break;
		
	case UPLOADBUT:
		fitype = val;
		ById("fileToLoad").accept=".txt,.csv"; 
		loadsta();
		break;
	
	case CANVASBUT:
		if(canover != -1 && canbutac[canover] != -1) canfinalaction(canover);
		break;
		
    case RELOADAC:
		stopinference();
	    location.reload(true);
		break;

	case ERRORBACKAC:
		warning=[]; infres.result = -1;
		break;
	
	case LOADBUT:
	 	fitype = SIREFILE;
		ById("fileToLoad").accept=".sire";
		loadsta();
		break;
	
	case SAVEAC:
		if(modelstart == 1) saveon = 1;
		break;
	
	case CHECKBUT:
		popshow[val][val2] = 1-popshow[val][val2];
		popplotinitfl = 0;
		break;
		
	case RADIOBUT:
		switch(val2){
		case RADIOVAR: if(!ctrlkey) varsel=[]; varsel.push(val); xaxisauto = 1; yaxisauto = 1; break;
		case RADIOCHOOSE: if(chooseaxis == 0) varselx = val; else varsely = val; chooseaxis = -1; break;
		case RADIONAMLAB: radnamlab = val; break;
		case RADIOMOD: modtype = val; break;
		case RADIOENV: envon = val; break;
		case RADIOGE: geon = val; collectvariables(); break;
		case RADIODOM: domon = val; collectvariables(); break;
		case RADIOORDER: order = val; indplotst=[]; orderind(); break;
		case RADIOENABLE: if(text == "Yes") data[val].enable = 1; else data[val].enable = 0; collectvariables(); break;
		}
		break;
		
	case STARTAC:
		switch(page){	
		case RUNPAGE:
			switch(text){
			case "Start": case "Restart":
				if(data.length == 0){ alertp("Data must first be loaded!"); changepage(RUNPAGE,0); return;}
			
				if(runtype == "inf"){
					if(!confirm("Do you want to stop the current inference?")) return;
					stopinference(); infres.result = 2;
					setTimeout(function(){ startinference(nchain); }, 1000);
					return;
				}
				startinference(nchain);
				break;
			
			case "Stop!": stopinference(); infres.result = 2;  break;
			case "Exit!": case "Cancel": stopinference(); infres.result = -1; loading = 0; changepage(-1,0); break;
			}
			break;
		}
		break;

	case BAYESBUT:
		var val = prompt("Please select a value for "+varname[varsel[0]]);
		if(val){
			if(isNaN(val)) alertp("This is not a number!");
			else calcbayesfac(val);
		}
		break;
		
	case EXPORTMINIBUT:
		switch(val){
		case 0: exporttype = 4; ById("fileToSave").accept=".png"; savesta(); exporton = 0; break;
		case 1: exporttype = 5; ById("fileToSave").accept=".txt"; savesta(); exporton = 0; break;
		case 2: exporttype = 10; ById("fileToSave").accept=".sire"; savesta(); break;
		case 3: exporttype = 0; ById("fileToSave").accept=".sire"; savesta(); break;
		}
		break;
		
	case EXPORTPARAMAC:
		exportparam();
		exporton = 0;
		break;
		
	case EXPORTSTATEAC:
		exportstate();
		exporton = 0;
		break;
		
	case EXPORTDIAGNOSTICAC:
		exporttype = 3;
		ById("fileToSave").accept=".txt";
		savesta();
		exporton = 0;
		break;
	
	case DONEAC:
		if(addingdata == 2){ addingdata = 3; return;}
		if(newfile == 1){ fileToLoadlist.push({IDcol:IDcol, name:fileToLoad.name, text:textFromFile});}
		adddata();
		break;
	
	case BACKEVDATAAC2: datashow = "table"; break;
	
	case BACKEVDATAAC: addingdata--; break;
	
	case BACKAC:
		obsloaded = 1;
		setcolumns();
		break;
		
	case BACKAC2:
		obsloaded = 2;
		changepage(DATAPAGE,0); 
		break;
	
	case CANCELBUT2:
		addingdata = 0;
		break;
	
	case NEXTBUT:
		tableyfr = 0;
		switch(page){
		case DESCPAGE: changepage(DATAPAGE,0); break;
		case DATAPAGE: if(pagesub[page] == 0) changepage(DATAPAGE,1); else changepage(MODELPAGE,0); break;
		case MODELPAGE: changepage(PRIORPAGE,0); break;
		case PRIORPAGE: changepage(RUNPAGE,0); break;
		}
		break;
	
	case BACKAC3:
		datashow = "table";
		break;
		
	case BACKBUT:
		if(addingdata == 1){
			if(datatemp.cl != -1) datatemp.cl = -1;
			else datashow = "table";
		}
		else{
			addingdata = 0;
		}
		tableyfr = 0;
		break;

	case TABBACKAC:
		ncoldef--;
		n = tablehist.length-1;
		if(n >= 0){
			colname[tablehist[n].ncoldef] = tablehist[n].name;
			movecol(tablehist[n].ncoldef,tablehist[n].val); 
			tablehist.pop();
		}
		break;
		
	case ADDDATAAC:
		fitype = val; datatype = val2;
		ById("fileToLoad").accept=".txt,.csv";
		switch(datatype){
		case "trial": case "snp": case "infection": case "recovery":
			for(d = 0; d < data.length; d++){ if(data[d].variety == datatype) break;}
			if(d < data.length){ dsel = d; helptype = 99;}
			else helptype = 0;
			break;
	
		default: helptype = 0; break;
		}
		break;
	
	case HELPCLOSEBUT:
		helptype = -1;
		break;
		
	case IMPBUT:
		if(val == 1){
			data.splice(dsel,1);
			converttoobs("data");
			helptype = 0;
		}
		else{
			helptype = -1;
			if(val == 0) loadsta();
		}
		break;
		
	case GDROPBUT:
		gdropfrac = 0;
		gdropsel = val;
		break;
	
	case EDITDESCAC:
		selbuttype(SPEECHBUT2); 
		break;
		
	case GDROPSELBUT:
		if(gdropnum < val.length){
			if(mx > x+dx-17){
				dddy = gdropnum*gdropdy;
				ymin = y+Math.floor(1.15*gdropdy)+gdropfrac*dddy;
				ddx = 14; ddy = Math.floor(dddy*gdropnum/val.length);
				if(my >= ymin+ddy) gdropfrac += gdropnum/val.length;
				else{
					if(my <= ymin) gdropfrac -= gdropnum/val.length;
				}
				
				if(gdropfrac < 0) gdropfrac = 0; if(gdropfrac > 1-gdropnum/val.length) gdropfrac = 1-gdropnum/val.length;
				return;
			}				
		}
		
		if(gdropselop != "&*&"){
			var gd = gdropinfo[gdropsel];
			switch(gd.click){
			case "refcat":
				data[gd.d].ref = gdropselop; collectvariables();
				break;
				
			case "dataname":
				var ev;
				ev = inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
				data[ev.obsdata[gd.j]].val[ev.obsdatai[gd.j]] = gdropselop
				converttoobs("data");
				break;
				
			case "dataname2":
				var ev;
				ev = inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
				data[ev.obsdata].val[ev.obsdatai] = gdropselop;
				converttoobs("data");
				break;		
	
			case "clasel":
				clasel = gdropselj; popplotinitfl = 0;
				break;
			
			case "prior":
				param[gd.j].prior = gdropselop;
				switch(gdropselop){
				case "Flat": param[gd.j].val = ["",""]; break;
				case "Gamma": param[gd.j].val = ["",""]; break;
				case "Normal": param[gd.j].val = ["",""]; break;
				case "Log-Normal": param[gd.j].val = ["",""]; break;
				case "Exponential": param[gd.j].val = [""]; break;
				case "Beta": param[gd.j].val = ["",""]; break;
				case "Weibull": param[gd.j].val = ["",""]; break;
				case "Fix": param[gd.j].val = [""]; break;
				case "Default": param[gd.j].prior = "Flat"; param[gd.j].val =  param[gd.j].defval; break;
				}
				break;
			
			case "sens":
				data[gd.j].sens = gdropselop;
				break;
			
			case "other":
				gd.tr.rateother[gd.cl2] = gdropselop;
				break;
				
			case "sampfilt":
				sampfilt = gdropselop;
				popplotinitfl = 0;
				indplotst=[];
				break;
		
			case "tabledrop":
				row[gd.j][gd.i] = gdropselop;
				break;
				
			case "nchain":
				nchain = parseInt(gdropselop);
				break;
			
			case "indfilt":
				indfilt = gdropselj; 
				break;
			
			case "filter":
				filt = gdropselj; 
				switch(infpagename[pagesub[RUNPAGE]]){
				case "Statistics": startcalc(); break;
				case "Traces": case "Prob. Dist.":  varsel=[]; if(filtervar[filt].length > 0) varsel.push(filtervar[filt][0]); break;
				}
				break;
				
			case "runlab":
				runsel = gdropselj;
				if(page == RUNPAGE && infpagename[pagesub[page]] == "Statistics") startcalc();
				indplotst=[];
				break;
				
			case "runpoplab":
				runpopsel = gdropselj; popplotinitfl = 0; indplotst=[];
				break;
				
			case "groupsel":
				groupsel = gdropselop; popplotinitfl = 0; indplotst=[];
				break;
			}
			xaxisauto = 1; yaxisauto = 1; 
			gdropsel = -1;
			if(gd.click != "prior") tableyfr = 0;
		}
		break;
		
	case CHOOSETIMEBUT:
		var val = prompt("Please enter the observation time");
		if(isNaN(val)) alertp("This is not a number!");
		else{
			colname.splice(1,0,"Time");
			for(r = 0; r < nrow; r++){
				row[r].splice(1,0,val);
				rowwidth[r].splice(1,0,100);
			}
			ncoldef++; tablexfr = 0;
			setcolumns();
		}
		break;
	
	case CHOOSEEXISTAC: existflag = 1; break;
	
	case NEWMODBUT: startnewmodel(); break;
		
	case PDFBUT: new_win = nw.Window.open('SIRE_Manual_v1.0.pdf'); break;
	
	case PDFBUT2: new_win = nw.Window.open('paper_bioRxiv.pdf'); break;
		
	case RELOADSTATBUT: if(vcalc >= filtervar[filt].length) startcalc(); break;	
	
	case MODBUT: modtype = val; break;
	
	case SLIDEAC: break;
	
	case LOADFILEBUT:
		newfile = 0;
		textFromFile = fileToLoadlist[val].text;
		loadedfile();
		selecttablecol(fileToLoadlist[val].IDcol);
		helptype = -1;
		break;
		
	case HELPBACKBUT: break;
	
	case HELPICONBUT: helptype = val; break;
	
	case HELPBACKBUT: break;
	
	default: alertp("Problem EC17."); break;
	}
}
