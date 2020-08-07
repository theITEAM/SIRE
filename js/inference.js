/* The inference page */

function inferencebuts()                                                            // Intialises the buttons on the inference page
{
	var x, y, dx = width-menux, ddx = 140, xx, yy;

	res = infres;
	
	cv = resultcv;
	
	x = menux+tab; y = 30;
 
	if(warning.length > 0){ addwarning(); return;}
	
	na = infpagename[pagesub[RUNPAGE]];
	if(na != "Start") rightmenu(width-rwid,75,na);

	switch(na){
	case "Start": case "Restart":
		if(infres.result != 0){
			addbutton("Setup",x,y,0,0,-1,TITLEBUT,13,-1); y += 50;
	
			x += 25;
			if(isdata("infection") == 0 && isdata("recovery") == 0 && isdata("state") == 0 && isdata("diagtest") == 0){
				addbutton("Data must be added before inference can start!",x,y,150,0,-1,PRHEADBUT,-1,-1); y += 30;	
				return;
			}
	
			cornx = menux+tab+20; corny = y;
			addbutton("",cornx,corny,setupwidth,setupheight,CANVASBUT,CANVASBUT,-1,-1);
		
			drawsetup();
			
			tableyfrac = setupheight/ytot;
			if(tableyfrac < 1) addbutton("",menux+tab+20+setupwidth+10,corny,13,setupheight,SLIDEAC,YSLIDEBUT,-1,-1);
		
			if(runtype == "") addbutton("Start",width-115,height-45,100,30,STARTAC,GREENBUT,0,-1);
			else addbutton("Restart",width-115,height-45,100,30,STARTAC,GREENBUT,0,-1);
		}
		else{
			if(loading == 0) startloading();
			addbutton("",menux+(width-menux)/2,height/2+60,0,0,-1,PROGRESSBUT,0,-1);
		}
		return;
		
	case "Traces":
	case "Prob. Dist.":
		curvevar=[];
		curvech=[];
		curvelab=[];
		for(vs = 0; vs < varsel.length; vs++){
			v = varsel[vs];
			if(runsel == infres.nch || (runsel == infres.nch+1 && na == "Traces")){
				for(ch = 0; ch < infres.nch; ch++){ curvevar.push(v); curvech.push(ch);}
			}
			else{
				curvevar.push(v); curvech.push(runsel); 
			}
		}
	
		psel = -1; if(varsel.length == 1){ psel = findparam(varname[varsel[0]]); if(psel == infres.param.length) psel = -1;}   

		de = "";//filter[filt]+" - "; 
		if(varsel.length < 2){
			for(vs = 0; vs < varsel.length; vs++){ de += vardesc[varsel[vs]]; if(vs < varsel.length-1) de += " / ";}
		}
		else{
			for(vs = 0; vs < varsel.length; vs++){ de += varname[varsel[vs]]; if(vs < varsel.length-1) de += " / ";}
		}
		
		switch(na){
		case "Traces": addbutton(de,x,30,0,0,-1,TITLEBUT,14,-1); showtraces(); break;
		case "Prob. Dist.": addbutton(de,x,30,0,0,-1,TITLEBUT,15,-1); showdistribution(); break;
		}
		
		if(na == "Scatter Plots") varsel = varselst;
		break;

	case "Scatter Plots":
		addbutton("Scatter Plot",x,30,0,0,-1,TITLEBUT,16,-1);
	
		showscatter();
		break;
		
	case "Individuals":
		indplot();
		break;
		
	case "Statistics":
		addbutton("Statistics",x,30,0,0,-1,TITLEBUT,17,-1);
	
		showstatistics();
		break;
		
	case "Populations":
		showpopulations();
		break;
	}

	if(infres.result == 1) addbutton("Stop!",width-115,height-45,100,30,STARTAC,UPLOADBUT,0,-1);
}

function addwarning()                                                                        // Warning page
{
	x = menux+tab; y = 30;
	addbutton("There was a problem...",x,y,0,0,-1,TITLEBUT,-1,-1); y += 50;
		
	addbutton("",x+20,y,0,0,-1,WARNBUT,-1,-1);
	
	wmax = warning.length; if(wmax > 10) wmax = 10;
	for(w = 0; w < wmax; w++){
		addbutton("",x+75,y,0,0,-1,BULLETBUT,1,-1); addbutton(warning[w],x+87,y,800,0,-1,PARAGRAPHBUT,1,-1); y += 50;
		if(w > 10) break;
	}
	addbutton("Back",width-115,height-45,100,30,ERRORBACKAC,BACKBUT,0,-1);
}

function drawsetup()                                                                        // Start page
{	
	var x = 0, y = 4; 
	
	nob = 0;
	addob(x,y,OBSETUP); y += 235;
	 		
	if(trialtime == 0){ addob(x,y,OBSETUP2); y += 200;}
	else{
		addob(x,y,OBSETUP3); y += 90;
		for(p = 0; p < triallist.length; p++){ addob(x,y,OBTRIALTIME,p); y += trialtimedy;}
	}
	y += 5;
	ytot = y;
	
	placeob();		
}

function startinference(numch)                                                             // Starts inference
{
	var index=[], indinfo, sta=[], cl, cl2, tr, ch, st;

	stopinference();

	collectvariables();
	if(checkprior() == 1) return;
	if(checkbeforeinference() == 1) return;
	
	nchrun = numch;
	
	st = '<?xml version="1.0" encoding="UTF-8" ?>\n';
	st += '<SIRE version="1.0">\n';
	st += '<mcmc nsample="10000000" burnin="5000"/>\n';

	st += '<model type="';
	if(modtype == SIR) st += "SIR"; else st += "SI";
	st += '" residual="';
	if(envon == 1) st += "on"; else st += "off";
	st += '" groupeff="';
	if(geon == 1) st += "on"; else st += "off";
	st += '" dominance="';
	if(domon == 1) st += "on"; else st += "off";
	st += '"/>\n';
	
	N = inddata.nindtotal;
	st += '<data N="'+N+'"/>\n';
	
	st += '<data Z="'+triallist.length+'"/>\n'
	
	if(trialtime == 0){
		st += '<inference tmin="'+tpostmin+'" tmax="'+tpostmax+'"/>\n'; 
	}
	else{
		for(j = 0; j < triallist.length; j++){
			st += '<inference tmin="'+tposttrialmin[j]+'" tmax="'+tposttrialmax[j]+'" group="'+(j+1)+'"/>\n'; 
		}
	}
	
	if(infrecfl == 1){
		if(trialtime == 0){
			st += '<observation tmin="'+tobsmin+'" tmax="'+tobsmax+'"/>\n'; 
		}
		else{
			for(j = 0; j < triallist.length; j++){
				st += '<observation tmin="'+tobstrialmin[j]+'" tmax="'+tobstrialmax[j]+'" group="'+(j+1)+'"/>\n'; 
			}
		}
	}

	for(p = 0; p < param.length; p++){
		name = param[p].name; type = param[p].prior;
		if(type == "Unspecified"){ changepage(PRIORPAGE,0); alertp("Please specify the prior for "+name+"."); return;}

		if(name.substr(0,2) == "b_") st += '<prior parameter="'+name.substr(0,3)+'" name="'+name+'" number="'+(param[p].col+1)+'"';
		else st += '<prior parameter="'+name+'"'; 
		
		st += ' type="'+type+'" val1="';
		st += param[p].val[0]+'" ';
		if(param[p].val[1]) st += 'val2="'+param[p].val[1]+'"';
		st += '/>\n';
	}

	st += '\n';
	
	ncol = 0;
	
	for(d = 0; d < data.length; d++){
		if(data[d].variety == "diagtest"){
			st += '<diagtest Se="'+data[d].Se+'" Sp="'+data[d].Sp+'" sens="'+data[d].sens+'"/>\n'; 
		}
	}
	
	st += '<datatable ';
	
	var mat=[];
	for(i = 0; i < N; i++) mat[i] = [];
	
	st += 'id="1" '; 
	for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].id);
	ncol++;
	
	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "trial":
			st += 'trial="'+(ncol+1)+'" ';
			for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].trialnum);
			ncol++;
			break;
		}
	}
	
	for(d = 0; d < data.length; d++){
		if(data[d].enable == 1){
			switch(data[d].variety){
			case "snp":
				st += 'SNP="'+(ncol+1)+'" ';
				for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].snp);
				ncol++;
				break;
			}
		}
	}

	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "infection":
			st += 'It="'+(ncol+1)+'" ';
			for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].It);
			ncol++;
			break;
		}
	}
	
	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "recovery":
			st += 'Rt="'+(ncol+1)+'" ';
			for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].Rt);
			ncol++;
			break;
		}
	}

	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "state":
			st += 'state="'+(ncol+1)+'" ';
			for(i = 0; i < N; i++){
				stt = "";
				for(j = 0; j < inddata.ind[i].state.length; j++){
					if(stt != "") stt += ",";
					stt += "["+inddata.ind[i].state[j].val+","+inddata.ind[i].state[j].t+"]";
				}
				mat[i].push(stt);
			}
			ncol++;
			break;
		}
	}
	
	
	flag = 0;
	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "diagtest":
			if(flag == 0) st += 'diagtest="'+(ncol+1); else st += ','+(ncol+1);
			for(i = 0; i < N; i++){
				stt = "";
				for(j = 0; j < inddata.ind[i].diagtest[flag].length; j++){
					if(stt != "") stt += ",";
					stt += "["+inddata.ind[i].diagtest[flag][j].val+","+inddata.ind[i].diagtest[flag][j].t+"]";
				}
				mat[i].push(stt);
			}
			flag++;
			ncol++;
			break;
		}
	}
	if(flag > 0) st += '" ';
	
	flag = 0;
	for(f = 0; f < fixeddata.length; f++){
		d = fixeddata[f];
		if(data[d].enable == 1){
			switch(data[d].variety){
			case "fixed":
				if(flag == 0) st += 'X="'+(ncol+1); else st += ','+(ncol+1);
				
				for(i = 0; i < N; i++) mat[i].push(inddata.ind[i].fixed[f]);
				flag++;
				ncol++;
				break;
				
			case "fixedcat":
				for(j = 0; j < data[d].posval.length; j++){
					if(data[d].posval[j] != data[d].ref){
						if(flag == 0) st += 'X="'+(ncol+1); else st += ','+(ncol+1);
						for(i = 0; i < N; i++){
							if(inddata.ind[i].fixed[f] == data[d].posval[j]) mat[i].push(1); else mat[i].push(0);
						} 
						flag++;
						ncol++;
					}
				}
				break;
			}
		}
	}
	if(flag > 0) st += '" ';
	st += '>\n';
	
	for(i = 0; i < N; i++){
		for(j = 0; j < ncol; j++){ st += mat[i][j]; if(j < ncol-1) st += "\t"; else st += "\n";}
	}
	st += '</datatable>\n';
	
	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "rel": case "invrel":
			ids = data[d].id; 
			mats = data[d].mat;
			NN = ids.length;
			if(NN != N){ alertp("The matrix is the wrong size."); return;}
			var map=[];
			for(i = 0; i < N; i++) map[i] = -1;
			for(i = 0; i < N; i++){
				indname = inddata.ind[i].id;
				ii = 0; while(ii < NN && ids[ii] != indname) ii++; if(ii == NN){ alertp("Cannot find name!"); return;}
				map[i] = ii;  
			}
			for(i = 0; i < N; i++){ if(map[i] == -1){ alertp("Matrix map not set."); return;}}
		
			if(data[d].variety == "invrel") st += "<AINV>\n"; else st += "<A>\n";
			
			for(i = 0; i < N; i++){
				for(ii = 0; ii < N; ii++){
					st += mats[map[i]][map[ii]]; if(ii < N-1) st += "\t"; else st += "\n";
				}
			}
			
			if(data[d].variety == "invrel") st += "</AINV>\n"; else st += "</A>\n";
			break;
		}
	}
	
	for(d = 0; d < data.length; d++){
		switch(data[d].variety){
		case "invrellist":
			ids = data[d].id; 
			NN = ids.length;
			if(NN != N){ alertp("Matrix wrong size."); return;}
			var map=[];
			for(i = 0; i < N; i++) map[i] = -1;
			for(i = 0; i < N; i++){
				indname = ids[i];
				ii = 0; while(ii < NN && inddata.ind[ii].id != indname) ii++;
				if(ii == NN){ alertp("Cannot find individual name "+indname+"."); return;}
				map[i] = ii;  
			}
			for(i = 0; i < N; i++){ if(map[i] == -1){ alertp("Matrix map not set."); return;}}
			
			st += "<AINVLIST>\n"; 
			for(j = 0; j < data[d].x.length; j++){
				st +=  map[data[d].x[j]] + "\t" + map[data[d].y[j]] + "\t" + data[d].val[j] + "\n";
			}
			st += "</AINVLIST>\n"; 
			break;
		}
	}
	
	st += '</SIRE>\n';

	vcalc = 0;
	if(nchrun == 1){ runsel = 0; runpopsel = 0;} else{ runsel = nchrun+1; runpopsel = nchrun;}
	
	varsel=[]; varsel.push(0);
	groupop=[]; groupop.push("All"); for(j = 0; j < triallist.length; j++) groupop.push(triallist[j]); 
	groupsel = groupop[0]; 

	chooseaxis = -1;
	varselx=-1; varsely=-1;
	
	sampfilt = "All";
	
	filt = 0; clasel = 0;
	tableyfr = 0;
	
	for(cl = 0; cl < ncla; cl++){ 
		popshow[cl]=[]; for(c = 0; c < cla[cl].ncomp; c++) popshow[cl][c] = 1;
	}
	
	nrunlab = nchrun+2; 
	for(c = 0; c < nchrun; c++) runlab[c] = "Run "+(c+1); runlab[nchrun] = "All Runs"; runlab[nchrun+1] = "Combine"; 
	nrunpoplab = nchrun+1; for(c = 0; c < nchrun; c++) runpoplab[c] = "Run "+(c+1); runpoplab[nchrun] = "Combine"; 

	startloading();
	
	varset = 0;
	
	for(i = 0; i < N; i++) inddata.ind[i].ref = i; // this is done so the order can be changed
	
	var trialtmin=[], trialtmax=[];
	if(trialtime == 0){ 
		tmi = tpostmin; tma = tpostmax;
		for(j = 0; j < triallist.length; j++){ trialtmin[j] = tpostmin; trialtmax[j] = tpostmax;}
		
	}
	else{
		tmi = large; tma = -large;
		for(j = 0; j < triallist.length; j++){ 
			trialtmin[j] = tposttrialmin[j]; if(trialtmin[j] < tmi) tmi = trialtmin[j];
			trialtmax[j] = tposttrialmax[j]; if(trialtmax[j] > tma) tma = trialtmax[j];
		}
	}
	
	infres={ result:0, inddata:copy(inddata), data:copy(data), globaldiagnostics:[], diagnostics:[], burninev:0, tmin:tmi, tmax:tma, nch:nchrun, ch:[], evthin:1, nindmax:0, triallist:copy(triallist), trialtmin:trialtmin, trialtmax:trialtmax, param:copy(param)};
	
	for(ch = 0; ch < nchrun; ch++) infres.ch[ch] = {nsampev:0, sampev:[], nsampevread:0};
	
	burnin = 0; nsamppl = 100; varval=[]; for(ch = 0; ch < nchrun; ch++){ varval[ch]=[]; nsamp[ch] = 0; nsampread[ch] = 0;}
	sampthin = 1;

	for(ch = 0; ch < nchrun; ch++){ exe[ch] = 0; leftover[ch] = "";}	
	percentrun = 0; percentload = 0;
	buttoninit();

	var fs = require('fs');
	
	switch(ver){
	case "windows": fi = "init.xml"; break;
	case "linux": fi = "init.xml"; break;
	case "mac": fi = "/tmp/init.xml"; break;
	}
	
	runtype = "inf";

	fs.writeFile(fi,st, function(err) {
		if(err) { alertp("There was a problem wrIting input file: "+err); return;}
		setTimeout(function(){ startspawn(0);}, 500);
	}); 
}

function startspawn(ch)                                                                          // Starts execution of C++ code
{		 
	if(runtype != "inf") return;

	switch(ver){
	case "windows": child[ch] = spawn('Execute/a.exe',["init.xml",ch]); break;
	case "linux": child[ch] = spawn('Execute/a.out',["init.xml",ch]); break;
	case "mac": child[ch] = spawn('Execute/a.out',["/tmp/init.xml",ch]); break;
	}

	exe[ch] = 1;

	percentload = Math.floor((100*(ch+1))/nchrun);
	percent = Math.floor(0.5*percentload+0.5*percentrun);
	loadingfunc(0);

	funct(child[ch],ch);

	cv.clearRect (menux+(width-menux)/2-100,height/2+60-20,200,40);
	if(ch < nchrun-1){
		setTimeout(function(){ startspawn(ch+1);}, 500);
	}
}
	
function stopinference()                                                                      // Used to stop inference
{
	var ch;
	runtype = "";
	clearInterval(intervalid);
	for(ch = 0; ch < nchrun; ch++){ if(exe[ch] == 1){ exe[ch] = 0; child[ch].kill();}}
	//loading = 0;
	//buttoninit();
}

function funct(chi,ch)                                                                      // Gathers output of c++ file
{
	chi.stdout.on('data', function (data) {
		var s, st, li, v, n, j, off, ch2, bu, min, Lmin, val, av, ans, dT, fi;
		
		if(runtype == "") return;
		
		st = leftover[ch]+data;
		var lines = st.split('\n');
		leftover[ch] = lines[lines.length-1];

		for(li = 0; li < lines.length-1; li++){
			st = lines[li]; //pr(st);
			tabs = st.split("|");

			switch(tabs[0]){
			case '1':                 // Variable names
				if(varset == 0){
					filter=[];
					
					nvar = Math.floor((tabs.length-1)/3);
					for(v = 0; v < nvar; v++){
						vartype[v] = tabs[3*v+1]; varname[v] = tabs[3*v+2]; vardesc[v] = tabs[3*v+3];
					
						fi = 0; while(fi < filter.length && filter[fi] != vartype[v]) fi++;
						if(fi == filter.length){
							filter.push(vartype[v]);
							filtervar[fi]=[];
						}
						filtervar[fi].push(v);
					}
					varset = 1;		
				}
				for(v = 0; v < nvar; v++) varval[ch][v]=[];
				break;
			
			case '0':                 // Variable values
				if(nsampread[ch]%sampthin == 0){
					var stot = 0; for(ch2 = 0; ch2 < infres.nch; ch2++) stot += nsamp[ch2];  
					if(stot >= nsampmax){
						for(ch2 = 0; ch2 < infres.nch; ch2++){
							nsa = Math.floor(nsamp[ch2]/2);
							for(s = 0; s < nsa; s++){
								for(v = 0; v < nvar; v++) varval[ch2][v][s] = varval[ch2][v][2*s];	
							}
							for(v = 0; v < nvar; v++) varval[ch2][v].length = nsa;
							nsamp[ch2] = nsa;
						}	
						burnin = Math.floor(burnin/2);				
						sampthin *= 2;
					}
					
					s = nsamp[ch];
					for(v = 0; v < nvar; v++) varval[ch][v][s] = Number(tabs[v+1]);	
			
					nsamp[ch]++;
					bu = large; for(ch2 = 0; ch2 < infres.nch; ch2++) if(nsamp[ch2] < bu) bu = nsamp[ch2];
					bu = Math.floor(bu/5);
					if(bu > burnin) burnin = bu;
				}
				nsampread[ch]++;
				break;
			
			case '3':                 // Loading percentage
				if(ch == nchrun-1){
					per = Number(tabs[1]); if(per > percentrun) percentrun = per; percent = Math.floor(0.5*percentload+0.5*percentrun);
				}
				break;
				
			case '4':                 // List of individual ids
				if(ch == 0){
					nid = tabs.length-1;
					for(i = 0; i < nid; i++) id[i] = tabs[i+1];
				}
				break;
			
			case '5':  // Event data
				if(infres.ch[ch].nsampevread%infres.evthin == 0){
					if(process.memoryUsage().rss/(1024*1024) > 1400 && runtype != ""){
						infres.result = 2;
						stopinference(); 
						changepage(RUNPAGE,0);
					
						alertp("Unfortunately SIRE has run out of available memory. Consider reducing the maximum number of samples and starting again."+runtype);
					}
					else{		
						if(infres.ch[ch].nsampevread%infres.evthin == 0){
							var stot = 0; for(ch2 = 0; ch2 < infres.nch; ch2++) stot += infres.ch[ch2].nsampev;  
							
							if(stot >= nsampevmax){  // Thins samples
								for(ch2 = 0; ch2 < infres.nch; ch2++){
									var nsa = Math.floor(infres.ch[ch2].nsampev/2);
									for(s = 0; s < nsa; s++) infres.ch[ch2].sampev[s] = infres.ch[ch2].sampev[2*s];
									infres.ch[ch2].sampev.length = nsa;
									infres.ch[ch2].nsampev = nsa;
								}
								infres.burninev = Math.floor(infres.burninev/2);	
								s = infres.ch[ch].nsampev; 
								infres.evthin *= 2;
							}
							
							z = 1;
							s = infres.ch[ch].nsampev;
						
							nindto = parseInt(tabs[z]); z++;

							if(nindto > infres.nindmax) infres.nindmax = nindto;

							infres.ch[ch].sampev[s] = {nind:nindto, ind:[]}; 
							
							var ressa = infres.ch[ch].sampev[s];
							for(i = 0; i < nindto; i++){
								var nev = parseInt(tabs[z]); z++;
								ressa.ind[i]={nev:nev, evc:[], evt:[]};
								var ressai = ressa.ind[i];
								for(k = 0; k < nev; k++){
									ressai.evc[k] = (parseInt(tabs[z])); z++;
									ressai.evt[k] = Number(tabs[z]); z++;
								}
							}
							infres.ch[ch].nsampev++;
							bu = large; 
							for(ch2 = 0; ch2 < infres.nch; ch2++) if(infres.ch[ch2].nsampev < bu) bu = infres.ch[ch2].nsampev;
							bu = Math.floor(bu/5);
							if(bu > infres.burninev) infres.burninev = bu;
						}
					}
				}	
				infres.ch[ch].nsampevread++;
				break;
				
			case '6':            // Chain diagnostics
				infres.diagnostics[ch] = st;
				break;
				
			case '7':            // Global diagnostics
				infres.globaldiagnostics[ch] = st;
				break;
			
			case 'e':            // Warning
				warning = st.substr(2,st.length-3).split("*");
				infres.result = -1; changepage(RUNPAGE,0);
				stopinference();
				loading = 0;				
				break;
			
			case 'f':            // Major warning
				alertp("WARNING: "+st);
				break;
				
 			case 'z':            // Comment
				pr(st);
				break;
				
			default:              // Unknown output
				if(runtype != ""){
					infres.result = -1; changepage(RUNPAGE,0);
					stopinference();
					loading = 0;	
					alertp(tabs[0]);
					return;
				}
				break;
			}
		}

		if(infres.result == 0 && burnin > 0){
			for(ch2 = 0; ch2 < infres.nch; ch2++) if(infres.ch[ch2].nsampev == 0) break;
			if(ch2 == infres.nch){			
				var d = new Date(); starttime = d.getTime();
		
				loading = 0; infres.result = 1;
				buttoninit(); buttoninit();
				changepage(RUNPAGE,1);
				intervalid = setInterval(function(){ if(page == RUNPAGE && (pagesub[page] == 1 || pagesub[page] == 2 || pagesub[page] == 3)) buttoninit();}, 4000);  // ensures that plots are updated
			}
		}
	});

	chi.stderr.on('data', function (data) {
		alertp('There was an error: ' + data);
	});

	chi.on('close', function (code) {
		exe[ch] = 0;
		for(ch2 = 0; ch2 < nchrun; ch2++) if(exe[ch2] == 1) return;
		if(ch2 == nchrun){
			if(infres.result == 1) infres.result = 2;
			stopinference();
			buttoninit();
		}
		loading = 0; 
	});
}

function showtraces()                                                              // Sets up trace plot
{
	var i, w, ww, x, y, yy, c, cc = 5, tx, ty, mm, val, vv;
 
	if(xaxisauto == 1){
		axxmin = 0; 
		for(cu = 0; cu < curvevar.length; cu++){
			ch = curvech[cu];
			while(nsamp[ch] > nsamppl) nsamppl *= 2;
		}
	
		axxmax = nsamppl;
		axxmax *= 1.001;
	}
	else{ axxmin  = xaxisfixmin; axxmax = xaxisfixmax;}
	
	if(yaxisauto == 1){
		axymin = 10000000; axymax = -10000000;
		for(cu = 0; cu < curvevar.length; cu++){
			v = curvevar[cu]; ch = curvech[cu];
		
			if(ch == infres.nch+1){
				for(ch = 0; ch < infres.nch; ch++){
					for(i = burnin; i < nsamp[ch]; i++){
						val = varval[ch][v][i];
						if(val < axymin) axymin = val; 
						if(val > axymax) axymax = val; 
					}
				}
			}
			else{
				for(i = burnin; i < nsamp[ch]; i++){
					val = varval[ch][v][i];
					if(val < axymin) axymin = val; 
					if(val > axymax) axymax = val; 
				}
			}
		}

		if(axymin >= axymax-0.00001){ axymin--; axymax++;} 
		if(axymax > 0 && axymin > 0){ if(axymin < 0.3*axymax) axymin = 0;}
		axymax += 0.001*(axymax-axymin);
	}
	else{ axymin = yaxisfixmin; axymax = yaxisfixmax;}
	
	setxtics();
	w = setytics();   
	
	if(varsel.length == 1) laby = varname[varsel[0]]; else laby = "Parameter Value";
		
	graphframe(menux+10,80,40+w,60,20,40,w,"Samples",laby,"tr");
	xx = Math.floor(graphdx*(burnin-axxmin)/(axxmax-axxmin));
	if(xx >= 0 && xx < graphdx) addcanbutton("",40+w+xx-cc,40,2*cc,graphdy,BURNINBUT,BURNINBUT,-1,-1); 
	
	drawtrace();
}

function graphframe(x,y,x1,y1,x2,y2,w,labx,laby,arg)                                  // Draws the frame for graphs
{	
	graphdx = (width-360)-w; graphdy = height-185+40-y2;
	if(arg == "genpop"){ graphdx = (width-270)-w; graphdy = height-185-y2;}

	addbutton("",x,y,x1+x2+graphdx,y1+y2+graphdy,CANVASBUT,CANVASBUT,-1,-1);
	addcanbutton("",x1,y2,graphdx,graphdy,-1,RESULTBUT,-1,-1);		
	if(arg == "scat"){
		addcanbutton(labx,x1,y2+graphdy+30,graphdx,30,XLABELBUT,XLABELBUT,-1,-1);
		addcanbutton(laby,0,y2,30,graphdy,YLABELBUT,YLABELBUT,-1,-1);
	}
	else{
		addcanbutton(labx,x1,y2+graphdy+30,graphdx,30,-1,XLABELBUT,-1,-1);
		addcanbutton(laby,0,y2,30,graphdy,-1,YLABELBUT,-1,-1);
	}
	
	if(ntickx > 0) addcanbutton("X ticks",x1,y2+graphdy,graphdx,30,XTICKBUT,XTICKBUT,-1,-1);
	if(nticky > 0) addcanbutton("Y ticks",x1-w,y2,w,graphdy,YTICKTRBUT,YTICKTRBUT,-1,-1);

	lablist=[]; labcollist=[];
	if(arg == "tr"){
		for(cu = 0; cu < curvevar.length; cu++){
			v = curvevar[cu]; ch = curvech[cu];
			if(ch < infres.nch){ 
				if(varsel.length > 1){ de = varname[v]; if(infres.nch > 1) de += " run "+(ch+1);}
				else{ de = ""; if(infres.nch > 1) de += "Run "+(ch+1);}
			}
			else de = varname[v];
			
			lablist[cu] = de;
		}
		labcollist = chcol;
	}

	if(arg == "pop"){
		lablist=[]; labcollist=[]; for(cu = 0; cu < nquant; cu++){ lablist.push(quantname[cu]); labcollist.push(quantcol[cu]);}	
	}
	
	if(arg == "scat"){
		if(runsel == infres.nch && varselx >= 0 && varsely >= 0){
			for(ch = 0; ch < infres.nch; ch++) lablist[ch] = "Run "+(ch+1);
			labcollist = chcol;
		}
	}
	
	if(lablist.length > 1){
		cy = 10;
		var i = 0, ist;
		do{
			var xli=[];
			ist = i;
			x = 0;
			while(i < lablist.length){
				dx = 70 + textwidth(lablist[i],KEYFONT);
				if(x + dx > graphdx-20 && xli.length > 0) break;
				xli.push(x);
				x += dx;
				i++;
			}
		
			for(ii = ist; ii < i; ii++) addcanbutton(lablist[ii],x1+x2+graphdx-20-x+xli[ii-ist],cy,40,13,-1,LABBUT,labcollist[ii],ii);	
			cy += 20;
		}while(i < lablist.length);
	}
}

function drawtrace(wid)                                                             // Draws trace plot
{
	var step, i, burn;
	step = Math.floor(axxmax/1000); if(step < 1) step = 1;

	cv.clearRect(0,0,graphdx,graphdy);

	if(wid) cv.lineWidth = wid;
	else cv.lineWidth = 1;
	
	for(cu = 0; cu < curvevar.length; cu++){
		v = curvevar[cu]; ch = curvech[cu];
		//setdash(cu);
	
		cv.beginPath();
		burn = 1;
		cv.strokeStyle = chcol[cu]; 
		for(i = 0; i < nsamp[ch]; i+=step){
			if(burn == 1 && i >= burnin){ cv.globalAlpha = 0.2; cv.stroke(); cv.globalAlpha = 1; cv.beginPath(); burn = 0;}
			x = graphdx*(i-axxmin)/(axxmax-axxmin);
			y = graphdy*(1-(varval[ch][v][i]-axymin)/(axymax-axymin));
			if(i == 0) cv.moveTo(x,y); else cv.lineTo(x,y);
		}
		cv.stroke();
	}
	//setdash(0);
}

function rn(n)                                                                          // Rounds a number when put in interface
{
	var x;
	n = parseFloat(n);

	x = 0;
	do{
		num = n.toFixed(x);
		if((num-n)*(num-n) < 0.000000000000001) break;
		x++;
	}while(1 == 1);
	return num;
}

function showscatter()                                                                   // Sets up a scatter plot
{ 
	var x, y, dx, dx2, w, cc = 6, xst, yst;

	if(varselx == -1 || varsely == -1){ ntickx = 0; nticky = 0; w = 20; }
	else{
		setscatteraxis();

		setxtics();
		w = setytics();
	}
	
	if(varselx != -1) labx = varname[varselx];
	else{
		if(chooseaxis == 0)	labx = "Select a parameter (on the right)";
		else labx = "Click to select";
	}
	
	if(varsely != -1) laby = varname[varsely];
	else{
		if(chooseaxis == 1)	laby = "Select a parameter (on the right)";
		else laby = "Click to select";
	}
	
	graphframe(menux+10,80,40+w,60,20,40,w,labx,laby,"scat");
	
	cv.clearRect(0,0,graphdx,graphdy);
	if(varselx >= 0 && varsely >= 0) drawscatterplot();
}

function setscatteraxis()                                                      // Sets axes for scatter plot
{
	var v, i;
	
	if(runsel < infres.nch){ chmin = runsel; chmax = runsel+1;}
	else{ chmin = 0; chmax = infres.nch;}

	if(xaxisauto == 1){
		axxmin = 100000; axxmax = -100000;
		for(ch = chmin; ch < chmax; ch++){
			for(i = burnin; i < nsamp[ch]; i++){
				val = varval[ch][varselx][i];
				if(val < axxmin) axxmin = val; 
				if(val > axxmax) axxmax = val; 
			}
		}
		if(Math.sqrt(axxmin*axxmin) < 0.2*Math.sqrt(axxmax*axxmax)) axxmin = 0;
	}
	else{ axxmin = xaxisfixmin; axxmax = xaxisfixmax;}

	if(yaxisauto == 1){
		axymin = 100000; axymax = -100000;
		for(ch = chmin; ch < chmax; ch++){
			for(i = burnin; i < nsamp[ch]; i++){
				val = varval[ch][varsely][i];
				if(val < axymin) axymin = val; 
				if(val > axymax) axymax = val; 
			}
		}
		if(Math.sqrt(axymin*axymin) < 0.2*Math.sqrt(axymax*axymax)) axymin = 0;
	}
	else{ axymin = yaxisfixmin; axymax = yaxisfixmax;}
}

function drawscatterplot(wid)                                                        // Draws a scatter plot
{
	var i, j, max, val, x, y;
	
	if(runsel < infres.nch){ chmin = runsel; chmax = runsel+1;}
	else{ chmin = 0; chmax = infres.nch;}

	for(ch = chmin; ch < chmax; ch++){
		if(runsel == infres.nch) col = chcol[ch]; else col = BLACK;
	
		cv.fillStyle = col; 
		for(i = burnin; i < nsamp[ch]; i++){			
			x = Math.floor(graphdx*(varval[ch][varselx][i]-axxmin)/(axxmax-axxmin));
			y = Math.floor(graphdy - graphdy*(varval[ch][varsely][i]-axymin)/(axymax-axymin));
			if(wid) fillcircle(x,y,wid,col,col,NORMLINE);
			else cv.fillRect(x-1,y-1,3,3);
		}
	}
}

function showdistribution()                                                             // Sets up distribution
{ 
	var x, y, dx, dx2, w, cc = 6, xst, yst;
	
	setdistributionaxis();

	w = 10;
	if(varsel.length == 1) labx = varname[varsel[0]]; else labx = "Parameter Value";
	
	nticky = 0;
	graphframe(menux+10,80,40+w,60,20,40,w,labx,"Probability","tr");
		
	drawdistribution();

	addcanbutton("Smooth:",70,graphdy+75,slidex,slidedy,-1,SLIDERBACKBUT,-1,-1); 
	addcanbutton("",70+Math.floor(slidex*(kde-kdemin)/(kdemax-kdemin) - slidedx/2),graphdy+75,slidedx,slidedy,SLIDERBUT,SLIDERBUT,-1,-1); 
}

function setdistributionaxis()                                                            // Sets up distribution x axis
{
	var i, j, tx, val, bin=[], wei=[], range = 10, novari;

	if(xaxisauto == 1){
		axxmin = 100000; axxmax = -100000;
		
		for(cu = 0; cu < curvevar.length; cu++){
			v = curvevar[cu]; ch = curvech[cu];
			if(ch == infres.nch+1){
				for(ch = 0; ch < infres.nch; ch++){
					for(i = burnin; i < nsamp[ch]; i++){
						val = varval[ch][v][i];
						if(val < axxmin) axxmin = val; 
						if(val > axxmax) axxmax = val; 
					}
				}
			}
			else{
				for(i = burnin; i < nsamp[ch]; i++){
					val = varval[ch][v][i];
					if(val < axxmin) axxmin = val; 
					if(val > axxmax) axxmax = val; 
				}
			}
		}

		novari = 0; if(axxmin >= axxmax-0.00001){ axxmin--; axxmax++; novari = 1;} 
		if(axxmax > 0 && axxmin > 0){ if(axxmin < 0.3*axxmax) axxmin = 0;}

		for(cu = 0; cu < curvevar.length; cu++){  // looks for the boundaries in the prior
			v = curvevar[cu];
			vpri = findparam(varname[v]);
			if(vpri < infres.param.length && infres.param[vpri].prior == "Flat"){
				valmin = parseFloat(infres.param[vpri].val[0]);
				if(valmin < axxmin && axxmin-valmin < 0.2*(axxmax-axxmin)) axxmin = valmin;
				valmax = parseFloat(infres.param[vpri].val[1]);
				if(valmax > axxmax && valmax-axxmax < 0.2*(axxmax-axxmin)) axxmax = valmax;
			}
		}
		axxmax += 0.0001*(axxmax-axxmin);
	}
	else{ axxmin  = xaxisfixmin; axxmax = xaxisfixmax;}

	
	for(cu = 0; cu < curvevar.length; cu++){  // looks for the boundaries in the prior
		v = curvevar[cu];
		vpri = findparam(varname[v]);
		Jbinpriorfac[cu]=[];
		for(j = 0; j < JX; j++) Jbinpriorfac[cu][j] = 1;
			
		if(vpri < infres.param.length && infres.param[vpri].prior == "Flat"){
			valmin = parseFloat(infres.param[vpri].val[0]);
			valmax = parseFloat(infres.param[vpri].val[1]);
		
			valmi = (JX-1)*(valmin-axxmin)/(axxmax-axxmin);
			valma = (JX-1)*(valmax-axxmin)/(axxmax-axxmin);
			for(j = 0; j < JX; j++){
				if(j < valmi || j > valma) Jbinpriorfac[cu][j] = large;
				else{
					d = j-valmi;
					if(d < kde) Jbinpriorfac[cu][j] -= 0.5*(kde-d)*(kde-d)/(kde*kde);
					d = valma-j;
					if(d < kde) Jbinpriorfac[cu][j] -= 0.5*(kde-d)*(kde-d)/(kde*kde);
				}
			}
		}
	}
	
	max = 0;
	for(cu = 0; cu < curvevar.length; cu++){  // KDE
		v = curvevar[cu]; ch = curvech[cu];
		
		Jbin[cu]=[];
		for(j = 0; j < JX; j++) Jbin[cu][j] = 0;
		
		if(ch == infres.nch+1){ // combines all
			for(ch = 0; ch < infres.nch; ch++){
				for(i = burnin; i < nsamp[ch]; i++){
					val = (JX-1)*(varval[ch][v][i]-axxmin)/(axxmax-axxmin);
					for(j = Math.floor(val-kde); j <= Math.floor(val+kde+1); j++){
						if(j >= 0 && j < JX){
							d = val-j;
							if(d > 0){
								if(d < kde) Jbin[cu][j] += 1-d/kde;  // triangular
							}
							else{
								if(d > -kde) Jbin[cu][j] += 1+d/kde;
							}
						}
					}
				}
			}
		}
		else{		
			for(i = burnin; i < nsamp[ch]; i++){
				val = (JX-1)*(varval[ch][v][i]-axxmin)/(axxmax-axxmin);
				for(j = Math.floor(val-kde); j <= Math.floor(val+kde+1); j++){
					if(j >= 0 && j < JX){
						d = val-j;
						if(d > 0){
							if(d < kde) Jbin[cu][j] += 1-d/kde;  // triangular
						}
						else{
							if(d > -kde) Jbin[cu][j] += 1+d/kde;
						}
					}
				}
			}
		}
		for(j = 0; j < JX; j++) Jbin[cu][j] /= Jbinpriorfac[cu][j];
		
		max = 0; for(j = 0; j < JX; j++) if(Jbin[cu][j] > max) max = Jbin[cu][j];
	}
	
	for(cu = 0; cu < curvevar.length; cu++){ 
		for(j = 0; j < JX; j++) Jbin[cu][j] /= max;
	}
	
	setxtics();
}

function setytics()                                                             // Sets up distribution y axis
{
	i = nticksize-1; while(i >= 0 && Math.floor((axymax-axymin)/ticksize[i]) < 3) i--;
    axticky = ticksize[i];

    mm = Math.floor(axymin/axticky + 0.9999);
    nticky = 0;
    while(mm*axticky < axymax){
		ticky[nticky] = rn(mm*axticky); nticky++;
		mm++;
    }

	w = 0;
	for(i = 0; i < nticky; i++){
		ww = textwidth(ticky[i],TICKFONT);
		if(ww > w) w = ww;
	}
	
	return w;
}

function setxtics()                                                             // Sets up ticks on x axis
{
	i = nticksize-1; while(i >= 0 && Math.floor((axxmax-axxmin)/ticksize[i]) < 4) i--;
	axtickx = ticksize[i];

	tx = Math.floor(axxmin/axtickx + 0.999999)*axtickx;
	ntickx = 0;
	while(tx < axxmax){
		tickx[ntickx] = rn(tx); ntickx++;	
		tx += axtickx;
	}
}

function drawdistribution()                                                      // Draws distribution
{
	var i, j, max, val, x, y;
  
 	max = 0; for(cu = 0; cu < curvevar.length; cu++){ for(j = 0; j < JX; j++){ val = Jbin[cu][j]; if(val > max) max = val;}}
	max *= 1.05;

    cv.clearRect(0,0,graphdx,graphdy);
	for(cu = 0; cu < curvevar.length; cu++){
		v = curvevar[cu]; ch = curvech[cu];
		//setdash(cu);
		
		cv.beginPath(); 
		for(i = 0; i < JX; i++){
			val = Jbin[cu][i];
			x = Math.floor(graphdx*(i)/(JX-1));
			y = Math.floor(graphdy-graphdy*val/max);
			if(i == 0) cv.moveTo(x,y);
			else cv.lineTo(x,y);
		}
		
		cv.strokeStyle = chcol[cu];
		cv.lineWidth = 3;
		cv.stroke();

		cv.fillStyle = chcol[cu];
		y = graphdy;
		cv.lineTo(x,y);
		x = 0;
		cv.lineTo(x,y);
		cv.globalAlpha = 0.05;
		cv.fill();
		cv.globalAlpha = 1;
	}
	//setdash(0);
}

function startcalc()                                                                   // Starts calculation of statistics
{
	var vv;
	
	tableyfr = 0;
	startloading();
	vcalc = 0; for(vv = 0; vv < filtervar[filt].length; vv++) vcalced[vv] = 0;
	setTimeout(function(){ calcstatistics();}, 10);
}

function calcstatistics()                                                              // Calculates statistics
{
	var i, j, v, min, max, n, nmin, nmax, nsampst=[], ch;
	var time = (new Date()).getTime(), timenew;

	if(vcalc >= filtervar[filt].length) return;
		
	for(ch = 0; ch < infres.nch; ch++) nsampst[ch] = nsamp[ch]-10;
	
	v = filtervar[filt][vcalc];
	percent = Math.floor((100*vcalc)/filtervar[filt].length);

	varGR[v] = "---";
	
	n = 0;
	if(runsel < infres.nch){
		ch = runsel;
		for(i = burnin; i < nsampst[ch]; i++){ tempCI[n] = varval[ch][v][i]; n++;} 
	}
	else{
		for(ch = 0; ch < infres.nch; ch++){
			for(i = burnin; i < nsampst[ch]; i++){ tempCI[n] = varval[ch][v][i]; n++;} 
		}

		if(infres.nch > 1){	         // calculates the Gelman-Rubin diagnostics
			var ma = large, N, M, W, B;
			for(ch = 0; ch < infres.nch; ch++) if(nsampst[ch] < ma) ma = nsampst[ch];
			
			if(ma > burnin+1){
				N = ma-burnin; M = infres.nch;
				var mu=[], vari=[], muav = 0;
				for(ch = 0; ch < M; ch++){ 
					valav = 0; for(i = burnin; i < ma; i++) valav += varval[ch][v][i]/N;
					varr = 0; for(i = burnin; i < ma; i++) varr += (varval[ch][v][i]-valav)*(varval[ch][v][i]-valav)/(N-1);
					mu[ch] = valav;
					vari[ch] = varr;
					muav += mu[ch]/M;
				}
				W = 0; for(ch = 0; ch < M; ch++) W += vari[ch]/M;
				B = 0; for(ch = 0; ch < M; ch++) B += (mu[ch]-muav)*(mu[ch]-muav)*N/(M-1);
				if(W > 0) varGR[v] = Math.sqrt(((1-1.0/N)*W+B/N)/W).toPrecision(3);
			}
		}
	}
	
	calcCI(n);
	varCImin[v] = CImin; varCImax[v] = CImax;

	varmean[v] = mean;

	if(sd == 0) varESS[v] = 0;
	else{
		for(i = 0; i < n; i++) tempCI[i] = (tempCI[i]-mean)/sd;
		
		sum = 1;
		for(d = 0; d < n/2; d++){             // calculates the effective sample size
			a = 0; for(i = 0; i < n-d; i++) a += tempCI[i]*tempCI[i+d]; 
			cor = a/(n-d);
			if(cor < 0) break;
			sum += 0.5*cor;			
		}
		varESS[v] = n/sum;
	}

	vcalced[vcalc] = 1;
	vcalc++;

	if(vcalc < filtervar[filt].length && page == RUNPAGE && infpagename[pagesub[RUNPAGE]] == "Statistics"){ setTimeout(function(){ calcstatistics();},80);}
	else loading = 0;
	buttoninit();
}

function calcCI(n)                                                                        // Calculates confidence intervals 
{
	var min, max, va, mean2;
	
	if(n == 0){ alertp("No information."); return;}
	
	min = 100000; max = -100000; 
	for(i = 0; i < n; i++){
		val = tempCI[i];
		if(val < min) min = val; if(val > max) max = val; 
	}
  
    if(min == max){ min--; max++;} 
	
	for(j = 0; j < B; j++){ nbin[j] = 0; bin[j]=[];}
  
	for(i = 0; i < n; i++){
		j = Math.floor(0.99999*B*(tempCI[i]-min)/(max-min));
		bin[j][nbin[j]] = tempCI[i];
		nbin[j]++;
	}
	
	nmin = Math.floor(0.025*n);
	j = 0; sum = 0; while(sum+nbin[j] <= nmin){ sum += nbin[j]; j++;}
	sort(j);
	CImin = bin[j][nmin-sum];
		
	j = B-1; sum = 0; while(sum+nbin[j] <= nmin){ sum += nbin[j]; j--;}
	sort(j);
	CImax = bin[j][nbin[j]-1-(nmin-sum)];
	
	mean = 0; mean2 = 0;
	for(i = 0; i < n; i++){
		val = tempCI[i]; mean += val; mean2 += val*val;
	}
	mean /= n;
	va = mean2/n - mean*mean; if(va < 0.000000001) va = 0;
	sd = Math.sqrt(va);
}

function calcCIint(n)                                                          // Calculates confidence intervals for integer values
{
	var min, max, va, mean2, num, x;
	
	if(n == 0) alertp("No information.");
	min = 100000; max = -100000;
	for(i = 0; i < n; i++){
		val = tempCI[i];
		if(val < min) min = val; if(val > max) max = val; 
	}
  
    if(min == max){ CImin = min; CImax = min; mean = min; va = 0; sd = 0; return;} 
	max++;
	num  = max-min;
	if(num > B){ calcCI(n); return;}  

	for(j = 0; j < num; j++) nbin[j] = 0;  
	for(i = 0; i < n; i++) nbin[tempCI[i]-min]++;
	
	area = 0; for(j = 0; j < num-1; j++) area += (nbin[j]+ nbin[j+1])/2;

	ar = 0; j = 0;
	
	do{ dar = (nbin[j]+ nbin[j+1])/2; if(ar+dar > 0.025*area) break; ar += dar; j++;}while(1 == 1);
	if(nbin[j+1] == nbin[j]) x = (0.025*area-ar)/nbin[j];
	else x = (-nbin[j] + Math.sqrt(nbin[j]*nbin[j] + 2*(nbin[j+1]-nbin[j])*(0.025*area-ar)))/(nbin[j+1]-nbin[j]);
	if(x < 0 || x > 1) alertp("Problem with CI.");	
	CImin = min+j+x;

	do{ dar = (nbin[j]+ nbin[j+1])/2; if(ar+dar > 0.975*area) break; ar += dar; j++;}while(1 == 1);
	if(nbin[j+1] == nbin[j]) x = (0.975*area-ar)/nbin[j];
	else x = (-nbin[j] +  Math.sqrt(nbin[j]*nbin[j] + 2*(nbin[j+1]-nbin[j])*(0.975*area-ar)))/(nbin[j+1]-nbin[j]);
	if(x < 0 || x > 1) alertp("Problem with CI.");	
	CImax = min+j+x;

	mean = 0; mean2 = 0; for(i = 0; i < n; i++){ val = tempCI[i]; mean += val; mean2 += val*val;}
	mean /= n;
	va = mean2/n - mean*mean; if(va < 0.000000001) va = 0;
	sd = Math.sqrt(va);
	
	if(isNaN(mean) || isNaN(sd) || isNaN(CImin) || isNaN(CImax)) alertp("Problem calculating CI.");
}

function sort(j)                                                                               // Bubble sorts within a bin
{
	var i, flag;
	do{
		flag = 0;
		for(i = 0; i < nbin[j]-1; i++){ if(bin[j][i] > bin[j][i+1]){ t = bin[j][i]; bin[j][i] = bin[j][i+1]; bin[j][i+1] = t; flag = 1;}}
	}while(flag == 1);
}

function showstatistics()                                                                      // Shows statistics
{
	var x1, x2, x3, x4, x5, dd, nummax;
	17
	nummax = Math.floor((height-185)/28);
	
	tableyfrac = nummax/filtervar[filt].length;
	y = 95;
	vmin = Math.floor(1.001*tableyfr*filtervar[filt].length); vmax = vmin+nummax; if(vmax > filtervar[filt].length) vmax = filtervar[filt].length;

	x1 = 40; x2 = 160; x3 = 290; x4 = 520; x5 = 640; dd = 3;
	addbutton("Variable",menux+x1,y,50,15,-1,STATBUT2,-1,-1);            
	addbutton("Mean",menux+x2,y,50,15,-1,STATBUT2,-1,-1);            
	addbutton("95% Credible Interval",menux+x3,y,50,15,-1,STATBUT2,-1,-1);            
	addbutton("ESS",menux+x4,y,50,15,-1,STATBUT2,-1,-1);            
	addbutton("R̂",menux+x5,y,50,15,-1,STATBUT2,-1,-1);            

	y += 40;
	for(vv = vmin; vv < vmax; vv++){
		v = filtervar[filt][vv];

		addbutton(varname[v],menux+x1+dd,y,50,15,-1,STATBUT,0,-1);
		if(vcalced[vv] == 0){
			addbutton("---",menux+x2+dd,y,50,15,-1,STATBUT3,-1,-1);
			addbutton("---",menux+x3+dd,y,50,15,-1,STATBUT3,-1,-1);
			addbutton("---",menux+x4+dd,y,50,15,-1,STATBUT3,-1,-1);
		}
		else{
			addbutton(varmean[v].toPrecision(3),menux+x2+dd,y,50,15,-1,STATBUT3,-1,-1);
			addbutton(varCImin[v].toPrecision(3)+"  \u2014  "+varCImax[v].toPrecision(3),menux+x3+dd,y,50,15,-1,STATBUT3,-1,-1);
			if(varESS[v] == 0) addbutton("---",menux+x4+dd,y,50,15,-1,STATBUT3,-1,-1);
			else{
				var d = new Date(); t = (d.getTime()-starttime)/60000;
				addbutton(Math.floor(varESS[v]),menux+x4+dd,y,50,15,-1,STATBUT3,-1,-1);
			}
			addbutton(varGR[v],menux+x5+dd,y,50,15,-1,STATBUT3,-1,-1);
		}
		y += 28;
	}
	
	if(tableyfrac < 1) addbutton("",menux+700,116,13,nummax*28,SLIDEAC,YSLIDEBUT,-1,-1);		
	
	addbutton("ESS gives the number of independent posterior samples (> 200 for good mixing).",menux+65,height-60,700,0,-1,PARAGRAPHBUT,1,-1); 
	addbutton("R̂ is the Gelman-Rubin diagnostic (0.9 < R̂ < 1.1 for good mixing).",menux+65,height-35,680,0,-1,PARAGRAPHBUT,1,-1); 
	
	addbutton("Reload",menux+27,height-48,20,20,RELOADSTATBUT,RELOADSTATBUT,-1,-1); 
}

function calcbayesfac(va)                                                                 // Calculates the Bayes Factor
{
	var dj=0.1, chh, chmin, chmax;
	
	v = curvevar[0]; chh = curvech[0];
	if(chh == infres.nch+1){ chmin = 0; chmax = infres.nch;}
	else { chmin = chh; chmax = chh+1;}		
				
	vpri = findparam(varname[v]);
	if(vpri == infres.param.length){ alertp("This parameter does not have a prior distribution."); return;}
	
	if(infres.param[vpri].prior == "Flat"){
		valmin = parseFloat(infres.param[vpri].val[0]);
		valmax = parseFloat(infres.param[vpri].val[1]);
	}
	else{
		valmin = -large; valmax = large;
	}
	if(va < valmin || va > valmax){ alertp("The value must be within the range of the prior."); return;}
	
	j = (JX-1)*(va-axxmin)/(axxmax-axxmin);

	num = 0;
	for(ch = chmin; ch < chmax; ch++){
		for(i = burnin; i < nsamp[ch]; i++){
			val = (JX-1)*(varval[ch][v][i]-axxmin)/(axxmax-axxmin);
			d = val-j;
			if(d > 0){ if(d < kde) num += 1-d/kde;}
			else{ if(d > -kde) num += 1+d/kde;}
		}
	}
	
	fac = 1;     
	val = (JX-1)*(valmin-axxmin)/(axxmax-axxmin);
	d = j-val; if(d < kde) fac -= 0.5*(kde-d)*(kde-d)/(kde*kde);
	val = (JX-1)*(valmax-axxmin)/(axxmax-axxmin);
	d = val-j; if(d < kde) fac -= 0.5*(kde-d)*(kde-d)/(kde*kde);		
	num /= fac;
	
	area = 0;
	for(ch = chmin; ch < chmax; ch++){
		for(j = 0; j < JX; j += dj){
			nu = 0;
			
			for(i = burnin; i < nsamp[ch]; i++){
				val = (JX-1)*(varval[ch][v][i]-axxmin)/(axxmax-axxmin);
				d = val-j;
				if(d > 0){ if(d < kde) nu += 1-d/kde;}
				else{ if(d > -kde) nu += 1+d/kde;}
			}
			fac = 1;
			val = (JX-1)*(valmin-axxmin)/(axxmax-axxmin);
			if(j < val) nu = 0;
			d = j-val; if(d < kde) fac -= 0.5*(kde-d)*(kde-d)/(kde*kde);
			val = (JX-1)*(valmax-axxmin)/(axxmax-axxmin);
			if(j > val) nu = 0;
			d = val-j; if(d < kde) fac -= 0.5*(kde-d)*(kde-d)/(kde*kde);		
			nu /= fac;
			
			area += nu*dj;
		}
	}
	BF = num*(JX-1)/area;

	if(BF < 1){
		if(BF == 0){
			BFtext = "A very large Bayes Factor in favour of model with variable "+varname[varsel[0]]+" over a model with "+varname[varsel[0]]+" = "+va;
		}
		else BFtext = "Bayes Factor of "+(1.0/BF).toFixed(2)+" in favour of model with variable "+varname[varsel[0]]+" over a model with "+varname[varsel[0]]+" = "+va;
	}
	else BFtext = "Bayes Factor of "+BF.toFixed(2)+" in favour of model with "+varname[varsel[0]]+" = "+va+" over a model with variable "+varname[varsel[0]];
	helptype = 34;
}

function calcindprob(i,cl,x,y,dx)                                                   // Calculates timelines for individuals 
{	
	var indsto;

	if(indplotst[i] == undefined){
		var tl=[], timax, ti, prob=[], r=[], g=[], b=[], tlast, div, ndiv;
		var ev, evallt=[];
		
		indi = infres.inddata.ind[i];
		axxmax += 0.001;

		ii = indi.ref;  // gives the reference for the event data
		
		var small = 0.00001;
		evallt.push(axxmin);
		if(indi){
			for(cl2 = 0; cl2 < ncla; cl2++){
				ev = indi.cl[cl2].ev;
				for(e = 0; e < ev.length; e++){
					t = ev[e].t;
					if(t > axxmin && t < axxmax){
						evallt.push(t);
					}
				}
			}
		}

		evallt.push(axxmax);
		evallt.sort(function(a, b){return a - b});
		
		tlast = evallt[0]; 
		tl.push(tlast);
		for(e = 0; e < evallt.length; e++){
			tnew = evallt[e];
			if(tnew != tlast){
				ndiv = Math.floor(1+200*(tnew-tlast)/(axxmax-axxmin));
				for(div = 0; div < ndiv; div++) tl.push(tlast + (tnew-tlast)*(div+1)/ndiv);
				tlast = tnew;
			}
		}
		
		timax = tl.length;
		
		kmax = 3;
		for(ti = 0; ti < timax; ti++){
			prob[ti]=[];
			for(k = 0; k <= kmax; k++) prob[ti][k] = 0;
		}
		
		getminmax();
		
		fl = 0;
		for(ch = chmin; ch < chmax; ch++){
			for(s = smin; s < smax; s++){
				if(s < infres.ch[ch].nsampev){
					if(ii < infres.ch[ch].sampev[s].nind){
						ress = infres.ch[ch].sampev[s].ind[ii];
				
						c = -1;
						e = 0;
						for(ti = 0; ti < timax; ti++){
							t = tl[ti];
							while(e < ress.nev && ress.evt[e] < t){ c = ress.evc[e]; e++;}
							if(c >= 0) prob[ti][compval[c][cl]]++;
							fl = 1;
						}
					}
				}
			}
		}	
		if(fl == 0) return;
		
		for(k = 0; k < kmax; k++){
			co = cla[cl].comp[k].col;
			coconv = hexToRgb(co);
			r[k] = coconv.r; g[k] = coconv.g; b[k] = coconv.b;
		}
		r[kmax] = 255; g[kmax] = 255; b[kmax] = 255;

		gr = cv.createLinearGradient(x,0,x+dx,0);
	 
		for(ti = 0; ti < timax; ti++){
			rsum = 0; gsum = 0; bsum = 0; sum = 0;
			for(k = 0; k <= kmax; k++){
				rsum += prob[ti][k]*r[k]; gsum += prob[ti][k]*g[k]; bsum += prob[ti][k]*b[k];
				sum += prob[ti][k];
			}
			if(sum == 0) gr.addColorStop((tl[ti]-axxmin)/(axxmax-axxmin),"#ffffff");
			else{
				gr.addColorStop((tl[ti]-axxmin)/(axxmax-axxmin),"rgb("+Math.floor(rsum/sum)+","+Math.floor(gsum/sum)+","+Math.floor(bsum/sum) +")"); 
			}
		}
		x1 = Math.floor(dx*(tl[0]-axxmin)/(axxmax-axxmin)); x2 = Math.floor(dx*(tl[timax-1]-axxmin)/(axxmax-axxmin));
		indsto={x1:x1, x2:x2, gr:gr, lab:[]};
	
		// works out labels
		for(ti = 0; ti < timax; ti++){
			ma = 0; for(k = 0; k <= kmax; k++) if(prob[ti][k] >= ma){ ma = prob[ti][k]; mak = k;}
			if(ti == 0){ tist = ti; makst = mak;}
			else{
				if(mak != makst || ti == timax-1){
					if(makst < kmax && makst < cla[cl].ncomp){
						st = cla[cl].comp[makst].name;
						w = textwidth(st,"15px Times");
						xx = Math.floor(x+dx*(tl[ti]-axxmin)/(axxmax-axxmin)); drawline(xx,y-10,xx,y+10,"BLACK",NORMLINE);
						if(w < dx*(tl[ti]-tl[tist])/(axxmax-axxmin)){
							indsto.lab.push({text:st, x:dx*((tl[tist]+tl[ti])/2-axxmin)/(axxmax-axxmin)});
						}
					}
					tist = ti; makst = mak;
				}
			}
		}
		indplotst[i] = indsto;
	}
	else indsto = indplotst[i];

	cv.fillStyle = indsto.gr; cv.fillRect(x+indsto.x1,y-10,indsto.x2-indsto.x1,20);
	for(j = 0; j < indsto.lab.length; j++) centertext(indsto.lab[j].text,x+indsto.lab[j].x,y+5,"15px Times",BLACK,0);
}

function checkbeforeinference()                                                         // Makes various checks before inference starts
{
	if(dataerror != ""){
		alertp(dataerror); changepage(DATAPAGE,0); return 1;
	}
	
	if(modtype == SI){
		if(isdata("recovery") > 0){ alertp("Cannot have recovery times for an SI model."); changepage(DATAPAGE,0); return 1;}  
	}
	
	if(isdata("rel")+isdata("invrellist")+ isdata("ped") > 1){ alertp("More than one data source for relationships."); changepage(DATAPAGE,0); return 1;}
			
	N = inddata.nindtotal;;
	if(trialtime == 0){
		if(tpostmin.length == 0){ alertp("Inference 'Begin' time must be set."); return 1;}
		if(tpostmax.length == 0){ alertp("Inference 'End' time must be set."); return 1;}
		
		if(isNaN(tpostmin)){ alertp("Inference 'Begin' time is not valid."); return 1;}
		if(isNaN(tpostmax)){ alertp("Inference 'End' time is not valid."); return 1;}
		
		tpostmin = parseFloat(tpostmin); tpostmax = parseFloat(tpostmax);
		if(tpostmin >= tpostmax){  alertp("'Begin' inference time must be less than 'End' time."); return 1;} 
		
		if(infrecfl == 1){
			if(tobsmin.length == 0){ alertp("Observation 'Begin' time must be set."); return 1;} 
			if(tobsmax.length == 0){ alertp("Observation 'End' time must be set."); return 1;} 

			if(isNaN(tobsmin)){ alertp("Observation 'Begin' time is not valid."); return 1;} 
			if(isNaN(tobsmax)){ alertp("Observation 'End' time is not valid."); return 1;} 

			tobsmin = parseFloat(tobsmin); tobsmax = parseFloat(tobsmax);
			if(tobsmin < tpostmin || tobsmax > tpostmax){ alertp("Observation times must be within the inference time range."); return 1;} 
		}
		
		for(i = 0; i < N; i++){
			a = inddata.ind[i].cl[0].ev;
			for(e = 0; e < a.length; e++){
				if(a[e].t < tpostmin || a[e].t > tpostmax){ alertp("Data not within the observed time range."); return 1;}
				if(infrecfl == 1){
					if(a[e].variety == "infection" && (a[e].t < tobsmin || a[e].t > tobsmax)){
						alertp("Infection events are not all within the observed time range."); return 1;
					}
					if(a[e].variety == "recovery" &&  (a[e].t < tobsmin || a[e].t > tobsmax)){
						alertp("Recovery events are not all within the observed time range."); return 1;
					}
				}
			}
		}	
	}
	else{
		for(j = 0; j < triallist.length; j++){
			if(tposttrialmin[j].length == 0){ alertp("Inference 'Begin' time must be set."); return 1;}
			if(tposttrialmax[j].length == 0){ alertp("Inference 'End' time must be set."); return 1;}
		
			if(isNaN(tposttrialmin[j])){ alertp("Inference 'Begin' time is not valid."); return 1;}
			if(isNaN(tposttrialmax[j])){ alertp("Inference 'End' time is not valid."); return 1;}
	
			tposttrialmin[j] = parseFloat(tposttrialmin[j]); tposttrialmax[j] = parseFloat(tposttrialmax[j]);
			if(tposttrialmin[j] >= tposttrialmax[j]){  alertp("'Begin' inference time must be less than 'End' time."); return 1;} 
			
			if(infrecfl == 1){
				if(tobstrialmin[j].length == 0){ alertp("Inference 'Begin' time must be set."); return 1;}
				if(tobstrialmax[j].length == 0){ alertp("Inference 'End' time must be set."); return 1;}
		
				if(isNaN(tobstrialmin[j])){ alertp("Inference 'Begin' time is not valid."); return 1;}
				if(isNaN(tobstrialmax[j])){ alertp("Inference 'End' time is not valid."); return 1;}
	
				tobstrialmin[j] = parseFloat(tobstrialmin[j]); tobstrialmax[j] = parseFloat(tobstrialmax[j]);
				if(tobstrialmin[j] < tposttrialmin[j] || tobstrialmax[j] > tposttrialmax[j]){ alertp("Observation times must be within the inference time for group "+triallist[j]+"."); return 1;} 
			}		
			
			for(i = 0; i < N; i++){
				if(inddata.ind[i].trialnum == j+1){
					a = inddata.ind[i].cl[0].ev;
					for(e = 0; e < a.length; e++){
						if(a[e].t < tposttrialmin[j] || a[e].t > tposttrialmax[j]){ alertp("Data not within the time range for group '"+triallist[j]+"'."); return 1;}
						
						if(infrecfl == 1){
							if(a[e].variety == "infection" && (a[e].t < tobstrialmin[j] || a[e].t > tobstrialmax[j])){
								alertp("Infection events are not all within the observed time range of group '"+triallist[j]+"'."); return 1;
							}
							if(a[e].variety == "recovery" &&  (a[e].t < tobstrialmin[j] || a[e].t > tobstrialmax[j])){
								alertp("Recovery events are not all within the observed time range of group '"+triallist[j]+"'."); return 1;
							}
						}
					}
				}
			}		
		}
	}
	
	return 0;
}

