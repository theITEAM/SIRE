/* Plots graphs showing variation in populations */

function showpopulations()                                                      // Plots graphs showing variation in population number 
{
	var i, j, tx, val, bin=[], wei=[], range = 10, novari, cc = 5, c, stat=[];

	res = infres; 
	
	x = menux+tab; y = 30;
	
	st = "Populations"; if(groupsel != "All") st += " in group "+groupsel;

	addbutton(st,x,y,0,0,-1,TITLEBUT,18,-1);	
	
	rightmenu(width-rwid,75,"pop");
	
	
	if(groupsel == "All"){
		poptmin = infres.tmin; poptmax = infres.tmax; 
	}
	else{
		z = 0; while(z < infres.triallist.length && infres.triallist[z] != groupsel) z++;
		if(z == infres.triallist.length) alertp("Problem EC15.");
		poptmin = infres.trialtmin[z]; poptmax = infres.trialtmax[z];
	}

	if(xaxisauto == 1){
		axxmin = poptmin; axxmax = poptmax;
		if(axxmax > 0 && axxmin > 0){ if(axxmin < 0.3*axxmax) axxmin = 0;}
		axxmax += 0.001*(axxmax-axxmin);
	}
	else{ axxmin = xaxisfixmin; axxmax = xaxisfixmax;}

	setxtics();
	
	if(popplotinitfl == 0){ popplotinit(); return;}
	if(popplotinitfl != 2) return; 	

	if(yaxisauto == 1){ axymin = plotmi; axymax = plotma;}
	else{ axymin = yaxisfixmin; axymax = yaxisfixmax;}	
	w = setytics();

	graphframe(menux+10,80,40+w,60,20,40,w,"Time","Population","pop");
	
	addcanbutton("Reload",26,30+graphdy+34,20,20,RELOADBUT,RELOADBUT,-1,-1); 
	
	drawpopplot();
}

function popplotinit()                                                                         // Initialises population plot
{
	var k, pop=[];
	
	startloading();
	
	poppage = page; poppagesub = pagesub[page];
	
	cl = 0;
	
	// works out which individuals
	N = infres.inddata.nindtotal;
	indcalc=[];
	for(i = 0; i < N; i++){
		if(groupsel == "All" || infres.inddata.ind[i].trial == groupsel) indcalc.push(i);
	}
	
	npop = 0;
	for(k = 0; k < cla[cl].ncomp; k++){
		if(popshow[cl][k] == 1){
			popfilter[npop]=[];
			for(cl2 = 0; cl2 < ncla; cl2++){
				if(cl2 == cl) popfilter[npop][cl2] = k; 
				else popfilter[npop][cl2] = -1;
			}
			pop.push(k);
			npop++;
		}
	}

	nquant = npop;
	quantname=[];
	for(q = 0; q < nquant; q++){
		k = pop[q];
		quanteqn[q] = k;
		quantname[q] = cla[cl].comp[k].name;
		quantcol[q] = cla[cl].comp[k].col;
	}

	POPX = 400;//Math.floor(100*(poptmax-poptmin)/(axxmax-axxmin)); if(POPX < 100) POPX = 100;

	for(ti = 0; ti < POPX; ti++){
		popch[ti]=[];
		quant[ti]=[]; for(k = 0; k < nquant; k++) quant[ti][k]=[];
	}	

	for(c = 0; c < ncomp; c++){
		cpop[c]=[];
		for(k = 0; k < npop; k++){
			cpop[c][k] = 0;
			for(cl = 0; cl < ncla; cl++){
				if(popfilter[k][cl] != -1 && compval[c][cl] != popfilter[k][cl]) break;
			}
			if(cl == ncla) cpop[c][k] = 1;
		}
	}

	getminmax();
	
	sstart = smin;
	popplotinitfl = 1;
	popplotcalc();
}

function initcompmult()                                                                   // Initialises compval and compmult
{
	var c, cl;
	ncomp = 1; for(cl = 0; cl < ncla; cl++){ compmult[cl] = ncomp; ncomp *= cla[cl].ncomp;}
	for(c = 0; c < ncomp; c++){
		compval[c]=[]; for(cl = 0; cl < ncla; cl++) compval[c][cl] = Math.floor(c/compmult[cl])%(cla[cl].ncomp);
	}	
}

function getminmax()                                                                      // Gets the minimum and maximum sample number
{
	var ch;
	if(runpopsel < infres.nch){ chmin = runpopsel; chmax = runpopsel+1;}
	else{ chmin = 0; chmax = infres.nch;}

	if(sampfilt == "All"){
		smin = infres.burninev; 
		smax = -large;
		for(ch = chmin; ch < chmax; ch++){
			num = infres.ch[ch].nsampev;
			if(num > smax) smax = num;
		}
	}
	else{
		for(ch = chmin; ch < chmax; ch++){
			num = infres.ch[ch].nsampev;
			if(sampfilt-1 >= num) sampfilt = num;
		}
		smin = sampfilt-1; smax = smin+1;
	}	
}

function popplotcalc()                                                                               // Calculates population variation
{
	var ch, s, ti, tim, reschsa, reschsai, c, cf, k;
	
	if(page != poppage || pagesub[page] != poppagesub){ loading = 0; return;}
	
	tim = (new Date()).getTime();
	do{
		s = sstart;
		for(ch = chmin; ch < chmax; ch++){	
			if(s < infres.ch[ch].nsampev){
				reschsa = infres.ch[ch].sampev[s];
				for(k = 0; k < npop; k++) popinit[k] = 0;
				for(ti = 0; ti < POPX; ti++){ for(k = 0; k < npop; k++) popch[ti][k] = 0;}

				for(ii = 0; ii < indcalc.length; ii++){
					i = indcalc[ii];
					reschsai = reschsa.ind[i];
				
					c = -1;
					for(e = 0; e < reschsai.nev; e++){
						cf = reschsai.evc[e];
						for(k = 0; k < npop; k++){
							d = 0;
							if(cf != -1) d += cpop[cf][k];
							if(c != -1) d -= cpop[c][k];
							if(d != 0){
								ti = Math.floor((POPX-1)*(reschsai.evt[e]-poptmin)/(poptmax-poptmin));
								if(ti >= POPX) break;
								if(reschsai.evt[e] <= poptmin) popinit[k] += d;
								else popch[ti][k] += d;
							}
						}
						c = cf;
					}
				}
				
				for(ti = 0; ti < POPX; ti++){
					for(k = 0; k < nquant; k++) quant[ti][k].push(popinit[k]);
					for(k = 0; k < nquant; k++) popinit[k] += popch[ti][k];
				}
			}
		}
		sstart++;
	}while(sstart < smax && (new Date()).getTime() -tim < 100);
	percent = Math.floor(100*((sstart-smin)/(smax-smin)));
	
	if(sstart == smax){
		plotmi = 100000; plotma = -1000000;
		for(ti = 0; ti < POPX; ti++){
			quantmean[ti]=[]; quantCImin[ti]=[]; quantCImax[ti]=[];
			maxi = 0;
			for(k = 0; k < npop; k++){
				tempCI = quant[ti][k];
				calcCIint(quant[ti][k].length);
				quantmean[ti][k] = mean; if(mean > maxi) maxi = mean;
				quantCImin[ti][k] = CImin;
				quantCImax[ti][k] = CImax;
				t = poptmin + (poptmax-poptmin)*ti/(POPX-1)
				if(t > axxmin && t < axxmax){
					if(quantCImin[ti][k] < plotmi) plotmi = quantCImin[ti][k];
					if(quantCImax[ti][k] > plotma) plotma = quantCImax[ti][k];
				}
			}	
			quantmaxi[ti] = maxi;
		}
		plotmi = 0; plotma *= 1.05;

		loading = 0; popplotinitfl = 2; buttoninit();
	}
	else{ setTimeout(function(){ popplotcalc();}, 20);}
}

function drawpopplot()                                                                              // Draws the population plot
{
	cv.clearRect(0,0,graphdx,graphdy);
	for(k = 0; k < nquant; k++){
		cv.beginPath(); 
		for(ti = 0; ti < POPX; ti++){
			t = poptmin + (poptmax-poptmin)*ti/(POPX-1)
			x = Math.floor(graphdx*(t-axxmin)/(axxmax-axxmin));
			y = Math.floor(graphdy-graphdy*(quantmean[ti][k]-axymin)/(axymax-axymin));
			if(ti == 0) cv.moveTo(x,y);
			else cv.lineTo(x,y);
		}
		
		cv.strokeStyle = quantcol[k];
		
		cv.lineWidth = 3;
		setdash(k)
		cv.stroke();

		cv.beginPath(); 
		for(ti = 0; ti < POPX; ti++){
			t = poptmin + (poptmax-poptmin)*ti/(POPX-1);
			x = Math.floor(graphdx*(t-axxmin)/(axxmax-axxmin));
			y = Math.floor(graphdy-graphdy*(quantCImax[ti][k]-axymin)/(axymax-axymin));
					
			if(ti == 0) cv.moveTo(x,y);
			else cv.lineTo(x,y);
		}
		
		for(ti = POPX-1; ti >= 0; ti--){
			t = poptmin + (poptmax-poptmin)*ti/(POPX-1);
			x = Math.floor(graphdx*(t-axxmin)/(axxmax-axxmin));
			y = Math.floor(graphdy-graphdy*(quantCImin[ti][k]-axymin)/(axymax-axymin));
			cv.lineTo(x,y);
		}
		cv.globalAlpha = 0.2;
		cv.fillStyle = quantcol[k];
		cv.fill();
		cv.globalAlpha = 1;
	} 	

	setdash(0);
}

function varlistplot(y,type)                                                                   // Makes a list of variables
{
	var yst, x1, x2;
	
	addbutton("Variable type:",width-rwid,y,0,0,-1,SMALLTEXTBUT,BLACK,22); y += 20;	
	gdropinfo.push({val:filter[filt], x:width-rwid, y:y, dx:selbutdx, dy:20, style:4, options:filter, click:"filter"}); y += 30;
	
	x1 = width-130; x2 = width-25;
	nma = 14;
	tableyfrac = nma/filtervar[filt].length;
	vmin = Math.floor(1.0001*tableyfr*filtervar[filt].length);
	vmax = vmin+nma; if(vmax > filtervar[filt].length) vmax = filtervar[filt].length;

	yst = y;
	for(v = vmin; v < vmax; v++){ addbutton(varname[filtervar[filt][v]],x1,y,90,15,RADIOBUT,RADIOBUT,filtervar[filt][v],type); y += 22;}
	if(tableyfrac < 1) addbutton("",x2,yst,13,22*(vmax-vmin),SLIDEAC,YSLIDEBUT,-1,-1);
	
	return y;
}

function rightmenu(x,y,type)                                                                      // Draws the right menu
{
	var x1, x2, cl, dy1 = 20, dy2 = 40;
	
	switch(type){
	case "Scatter Plots":
		if(chooseaxis >= 0) y = varlistplot(y,RADIOCHOOSE);
		else{
			if(varselx >= 0 && varsely >= 0 && infres.nch > 1){
				y += 10;
				addbutton("Run:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,23); y += dy1;
				gdropinfo.push({val:runlab[runsel], x:x, y:y, dx:selbutdx, dy:20, style:5, options:runlab, click:"runlab"}); y +=dy2;
			}	
		}
		break;
		
	case "Statistics":
		addbutton("Variable type:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,22); y += 20;	
		gdropinfo.push({val:filter[filt], x:x, y:y, dx:selbutdx, dy:20, style:4, options:filter, click:"filter"}); y += 30;
		
		if(infres.nch > 1){
			addbutton("Run:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,23); y += dy1;
			gdropinfo.push({val:runlab[runsel], x:x, y:y, dx:selbutdx, dy:20, style:5, options:runlab, click:"runlab"}); y += dy2;
		}

		break;
		
	case "Traces":
	case "Prob. Dist.":
		y = varlistplot(y,RADIOVAR);

		if(infres.nch > 1){
			y += 10;
			addbutton("Run:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,23); y += dy1;
			gdropinfo.push({val:runlab[runsel], x:x, y:y, dx:selbutdx, dy:20, style:5, options:runlab, click:"runlab"}); y += dy2;
		}	
		
		y += 20;
		if(na ==  "Prob. Dist."){
			if(curvevar.length == 1){
				addbutton("Bayes Fac.",x,y,selbutdx,20,BAYESBUT,BAYESBUT,-1,-1);
				addbutton("[?]",x+101,y+1,15,20,HELPICONBUT,HELPICONBUT,33,-1);
			}
			y += 40;
		}
		break;
		
	case "pop": case "ind":
		if(page == RUNPAGE && infres.nch > 1){
			addbutton("Run:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,23); y += dy1;
			gdropinfo.push({val:runpoplab[runpopsel], x:x, y:y, dx:selbutdx, dy:20, style:5, options:runpoplab, click:"runpoplab"}); y += dy2;
		}	
		
		if(page == RUNPAGE && infres.triallist.length > 1){
			addbutton("Group:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,24); y += dy1;
			gdropinfo.push({val:groupsel, x:x, y:y, dx:selbutdx, dy:20, style:5, options:groupop, click:"groupsel"}); y += dy2;	
		}
	
		if(page == DATAPAGE && triallist.length > 1){
			var ops=[]; ops.push("All"); for(i = 0; i < triallist.length; i++) ops.push(triallist[i]);
			addbutton("Group:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,24); y += dy1;
			gdropinfo.push({val:groupsel, x:x, y:y, dx:selbutdx, dy:20, style:5, options:ops, click:"groupsel"}); y += dy2;	
		}
		
		if(page == RUNPAGE){
			addbutton("Sample:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,25); y += dy1;
			gdropinfo.push({val:sampfilt, x:x, y:y, dx:selbutdx, dy:20, style:4, options:[], click:"sampfilt"}); y += dy2;
		}
		
		if(type == "ind"){
			addbutton("Order by:",x,y,0,0,-1,SMALLTEXTBUT,BLACK,26); y += dy1;
			addbutton("ID",x+10,y,90,15,RADIOBUT,RADIOBUT,IDORD,RADIOORDER); y += 22;
			addbutton("Time",x+10,y,90,15,RADIOBUT,RADIOBUT,TIMEORD,RADIOORDER); y += 22;
		}
		break;
	}
}

