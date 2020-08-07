/* Functions to export files from SIRE */

function exportimage(filename)                                                              // Exports an image (e.g. a graph)
{
	var x1, y1 = 110, x2 = 70, y2 = 60, wid, hei;
	scale = 2;
	
	graphdx *= scale; graphdy *= scale;
	
	w = 0;
	i = 0; while(i < ncanbut && canbuttype[i] != YTICKTRBUT) i++;
	if(i < ncanbut){
		for(i = 0; i < nticky; i++){
			ww = textwidth(ticky[i],"40px times");
			if(ww > w) w = ww;
		}
		x1 = 90+w;
	}	
	else x1 = 90;
	
	wid = x1+x2+graphdx; hei = y1+y2+graphdy;
	
	outcan = document.createElement('canvas');
    outcan.width = wid;
    outcan.height = hei;
    outcv = outcan.getContext('2d');
	
	graphcan.width = graphdx;
    graphcan.height = graphdy;
	
	cv = graphcv;
	cv.globalAlpha = 1;
	 
	var na = infpagename[pagesub[RUNPAGE]];

	switch(na){
	case "Traces": drawtrace(2); break;
	case "Prob. Dist.": drawdistribution(); break;
	case "Scatter Plots": if(varselx >= 0 && varsely >= 0) drawscatterplot(3); break;
	case "Populations": drawpopplot(); break;
	default: alerton("Problem!"); break;
	}
	
	cv = outcv;
	fillrect(0,0,wid,hei,WHITE);
	 
	cv.drawImage(graphcan,0,0,graphdx,graphdy,x1,y2,graphdx,graphdy);
	
	x = x1; y = y2; dx = graphdx,dy = graphdy;

	drawline(x,y+dy,x,y-20,BLACK,VTHICKLINE);
	drawarrow(x,y-40,x,y+dy,25,BLACK);
	drawline(x,y+dy,x+dx+40,y+dy,BLACK,VTHICKLINE);
	drawarrow(x+dx+60,y+dy,x,y+dy,25,BLACK);		
	
	i = 0; while(i < ncanbut && canbuttype[i] != XLABELBUT) i++;
	if(i < ncanbut) centertext(canbuttext[i],x1+graphdx/2,hei-20,"50px times",BLACK); 

	i = 0; while(i < ncanbut && canbuttype[i] != YLABELBUT) i++;
	if(i < ncanbut) centerplotangletext(canbuttext[i],45,y2+dy/2,Math.PI/2,"50px times",BLACK); 
	
	i = 0; while(i < ncanbut && canbuttype[i] != XTICKBUT) i++;
	if(i < ncanbut){
		for(j = 0; j < ntickx; j++){
			xx = Math.floor(x+dx*(tickx[j]-axxmin)/(axxmax-axxmin));
			centertext(tickx[j],xx,y2+dy+40,"40px times",BLACK); 
			drawline(xx,y2+dy,xx,y2+dy-20,BLACK,THICKLINE); 
		}
	}
	
	i = 0; while(i < ncanbut && canbuttype[i] != YTICKTRBUT) i++;
	if(i < ncanbut){
		for(j = 0; j < nticky; j++){
			yy = Math.floor(y+dy-dy*(ticky[j]-axymin)/(axymax-axymin));
			righttext(ticky[j],x1-5,yy+6,"40px times",BLACK); 
			drawline(x1,yy,x1+20,yy,BLACK,THICKLINE); 
		}
	}
	
	if(lablist.length > 0){
		cy = 10;
		var i = 0, ist;
		do{
			var xli=[];
			ist = i;
			x = 0;
			while(i < lablist.length){
				dx = 170 + textwidth(lablist[i],"40px times");
				if(x + dx > graphdx-20 && xli.length > 0) break;
				xli.push(x);
				x += dx;
				i++;
			}
		
			for(ii = ist; ii < i; ii++){
				cx = x1+x2+graphdx-20-x+xli[ii-ist];
				val2 = ii; if(!(page == RUNPAGE && pagesub[page] == 6)) val2 = 0;
				drawline(cx,cy+12,cx+100,cy+12,labcollist[ii],VTHICKLINE,val2);
				plottext(lablist[ii],cx+100+10,cy+24,"40px times",BLACK); 
			}
			cy += 40;
		}while(i < lablist.length);
	}
	
	graphdx /= scale; graphdy /= scale;
	cv = maincv;
	
	graphcan.width = width;
    graphcan.height = height;
		
	var dataURL = outcan.toDataURL().replace(/^data:image\/\w+;base64,/, "");
		
	var buf = new Buffer(dataURL, 'base64');
	var fs = require('fs');
	fs.writeFile(filename, buf, function (err) {
       if (err) {
           console.info("There was an error attempting to save your data.");
           console.warn(err.message);
           return;
       } else if (callback) {
		callback();}});
		
	loading = 0;
	scale = 1;
}

function saveFileAsText()                                                                   // Saves an exported file
{
	var st, filename, nsam, n, c, nev, s, ss;
			
	filename = ById("fileToSave").value;

	switch(exporttype){
	case 0:   // save SIRE file (without results)
		st = save(0);
		break;

	case 10:   // save SIRE file (with results)
		st = save(1);
		break;
		
	case 1:   // export trace
		st = "State\t";
		for(v = 0; v < nvar; v++){ st += varname[v].replace("→","->"); if(v < nvar-1) st += "\t"; else st += "\r\n";}
		
		numsampmax = 0; for(ch = 0; ch < infres.nch; ch++) numsampmax += nsamp[ch]-burnin;	
		for(s = 0; s < samplenum; s++){
			ss = Math.floor(s*numsampmax/samplenum);
			ch = 0; while(ss >= (nsamp[ch]-burnin)){ ss -= (nsamp[ch]-burnin); ch++;}
			st += s+"\t"; for(v = 0; v < nvar; v++){ st += varval[ch][v][burnin+ss]; if(v < nvar-1) st += "\t"; else st += "\r\n";}
		}
		break;
		
	case 2:  // export states
		st = "State\tIndividual\tTransitions\r\n";
		numsampmax = 0; for(ch = 0; ch < infres.nch; ch++) numsampmax += infres.ch[ch].nsampev-infres.burninev;
		for(s = 0; s < samplenum; s++){
			ss = Math.floor(s*numsampmax/samplenum);
			ch = 0; while(ss >= (infres.ch[ch].nsampev-infres.burninev)){ ss -= (infres.ch[ch].nsampev-infres.burninev); ch++;}
		
			for(i = 0; i < infres.ch[ch].sampev[ss].nind; i++){
				st += s+"\t"+infres.inddata.ind[i].id+"\t";

				iw = infres.ch[ch].sampev[ss].ind[i];
				st += "S";
				for(k = 1; k < iw.nev-1; k++){
					st += " -> ";
					switch(iw.evc[k]){
						case 0: st += "S"; break;
						case 1: st += "I"; break;
						case 2: st += "R"; break;
					}
					
					st += ",";
					st += iw.evt[k];
					
				}
				st += "\r\n";
			}
		}
		break;
		
	case 3: // diagnostics
		st = "";
		for(c = 0; c < infres.nch; c++){
			st += "***************************************************************** RUN "+(c+1)+" ****************************************************************\r\n\r\n";
			tabs = infres.diagnostics[c].split("|");
			for(j = 1; j < tabs.length; j++) st += tabs[j]+"\r\n";	
			st += "\r\n";
		}
		break;
		
	case 4:
		exportimage(filename);
		return;
		
	case 5:
		var na = infpagename[pagesub[RUNPAGE]];

		switch(na){
		case "Traces":
			st = "State\t";
			for(cu = 0; cu < curvevar.length; cu++){
				st += lablist[cu];
				if(cu < curvevar.length - 1) st += "\t"; else st += "\r\n";
			}
			
			for(i = 0; i < nsamp[ch]; i++){
				st += i + "\t";
				for(cu = 0; cu < curvevar.length; cu++){
					v = curvevar[cu]; ch = curvech[cu];
					st += varval[ch][v][i];
					if(cu < curvevar.length - 1) st += "\t"; else st += "\r\n";
				}
			}
			break;
		
		case "Prob. Dist.":
			max = 0; for(cu = 0; cu < curvevar.length; cu++){ for(j = 0; j < JX; j++){ val = Jbin[cu][j]; if(val > max) max = val;}}
			max *= 1.05;
	
			st = "";
			if(curvevar.length == 1) st += lablist[0]+"\tProbability\r\n";
			else{
				st += "Parameter Value\t";
				for(cu = 0; cu < curvevar.length; cu++){
					st += "Prob. "+lablist[cu];
					if(cu < curvevar.length - 1) st += "\t"; else st += "\r\n";
				}
			}
				
			for(i = 0; i < JX; i++){
				st += (axxmin + (axxmax-axxmin)*i/(JX-1)) + "\t";
				
				for(cu = 0; cu < curvevar.length; cu++){
					v = curvevar[cu]; ch = curvech[cu];			
					st += Jbin[cu][i]/max;
					if(cu < curvevar.length - 1) st += "\t"; else st += "\r\n";
				}
			}
			break;
			
		case "Scatter Plots":		
			if(runsel < infres.nch){ chmin = runsel; chmax = runsel+1;}
			else{ chmin = 0; chmax = infres.nch;}

			st = varname[varselx]+"\t"+varname[varsely]+"\r\n";	
			for(ch = 0; ch < infres.nch; ch++){
				for(i = burnin; i < nsamp[ch]; i++){			
					st += varval[ch][varselx][i] + "\t" +  varval[ch][varsely][i] + "\r\n";
				}
				if(ch < infres.nch-1 && runsel == infres.nch) st += "\r\n\r\n";
			}
			break;
		
		case "Populations":
			st = "Time\t";
			for(k = 0; k < nquant; k++){
				st += quantname[k] + ":mean\t" + quantname[k]  + ":CImin\t"  + quantname[k]  + ":CImax";
				if(k < nquant-1) st += "\t"; else st += "\r\n";
			}
			
			for(ti = 0; ti < POPX; ti++){
				st += (poptmin + (poptmax-poptmin)*ti/(POPX-1)) +"\t";
				for(k = 0; k < nquant; k++){
					st += quantmean[ti][k]+"\t"+quantCImin[ti][k]+"\t"+quantCImax[ti][k];
					if(k < nquant-1) st += "\t"; else st += "\r\n";
				}
			}
			break;
	
		case "Statistics":
			st = "Variable\tMean\t95% Credible Interval\tESS\tR\r\n";
			for(vv = vmin; vv < filtervar[filt].length; vv++){
				v = filtervar[filt][vv];
				st += varname[v]+"\t";
				if(vcalced[vv] == 0) st += "---\t---\t---\t---\r\n";
				else{
					st += varmean[v].toPrecision(5)+"\t"+varCImin[v].toPrecision(5)+"  \u2014  "+varCImax[v].toPrecision(5)+"\t";
					if(varESS[v] == 0) st += "---\r\n";
					else st += Math.floor(varESS[v])+"\t" + varGR[v] + "\r\n";
				}
			}
			break;	
		}
		break;
		
	case 6:          // save table
		st = ""; for(i = 0; i < ncol; i++){ st += colname[i]; if(i < ncol-1) st += "\t"; else st +="\r\n";}
		for(j = 0; j < nrow; j++){
			for(i = 0; i < ncol; i++){ st += row[j][i]; if(i < ncol-1) st += "\t"; else st +="\r\n";}
		}
		break;
	}
	
	var fs = require('fs');
	fs.writeFile(filename, "\ufeff"+st, function (err) {
        if (err) {
            console.info("There was an error attempting to save your data.");
            console.warn(err.message);
            return;
        } else if (callback) {
            callback();
        }
    });
	
	ById("fileToSave").value = "";
	loading = 0;
}

function saveoptions(x)
{
	if(saveon == 0){ addbutton("Save",x,0,75,22,SAVEAC,LOADBUT,31,1);}
	else{
		x -= 65; 	
		xx = x+8; yy = 24;
		addbutton("Save",x,0,75+65,25+22*2,-1,LOADBUT,31,1); 
		addbutton("With results (.sire)",xx,yy,95+30,18,EXPORTMINIBUT,EXPORTMINIBUT,2,0); yy += 22;
		addbutton("W/o results (.sire)",xx,yy,95+30,18,EXPORTMINIBUT,EXPORTMINIBUT,3,0);
	}
	return x-90;
}    

function exportoptions(x)                                                                    // Plots options for export
{
	var na, pngfl=0, txtfl = 0, parfl = 0, evefl = 0, diafl = 0, pt;
	
	if(page == RUNPAGE && pagesub[page] != 0){ 
		na = infpagename[pagesub[page]];
		
		evefl = 1; parfl = 1; //diafl = 1;
		
		if(na != "Start" && na != "Export" &&  na != "Individuals" && !(na == "Scatter Plots" && (varselx < 0 || varsely < 0))){
			if(na != "Statistics") pngfl = 1;
			txtfl = 1;
		}
	}
	
	num = pngfl+txtfl+parfl+evefl+diafl;
	if(num == 0) return;

	if(exporton == 0) addbutton("Export",x,0,75,22,EXPORTAC,LOADBUT,32,3); 
	else{
		x -= 35;
		xx = x;
		addbutton("Export",xx,0,75+35,25+22*num,-1,LOADBUT,32,3);
		yy = 24; xx += 8;
		
		pt = "Graph";
		switch(na){
		case "Statistics": pt = "Table"; break;
		case "Traces": pt = "Plot"; break;
		}
				
		if(pngfl == 1){
			addbutton(pt+" (png)",xx,yy,95,18,EXPORTMINIBUT,EXPORTMINIBUT,0,-1);
			yy += 22;
		}
		
		if(txtfl == 1){
			addbutton(pt+" (txt)",xx,yy,95,18,EXPORTMINIBUT,EXPORTMINIBUT,1,-1);
			yy += 22;
		}
		
		if(evefl == 1){
			addbutton("Events",xx,yy,95,18,EXPORTSTATEAC,EXPORTMINIBUT,1,-1);
			yy += 22;
		}
		
		if(parfl == 1){
			addbutton("Parameters",xx,yy,95,18,EXPORTPARAMAC,EXPORTMINIBUT,1,-1);
			yy += 22;
		}
		
		if(diafl == 1){
			addbutton("Diagnostics",xx,yy,95,18,EXPORTDIAGNOSTICAC,EXPORTMINIBUT,1,-1);
			yy += 22;
		}
	}
	return x;
}

function exportstate()                                                                     // Exports state samples
{
	res = infres;
	numsampmax = 0; for(ch = 0; ch < infres.nch; ch++) numsampmax += infres.ch[ch].nsampev-infres.burninev;
	
	if(numsampmax > 1000) numsug = 1000; else numsug = numsampmax;
	var ans = prompt("Please enter the number of samples to be exported (1-"+numsampmax+").\nNote, samples are taken at uniform intervals from burnin\n(which is taken to be 20% of the total sample number).",numsug);

	if(ans){
		samplenum = Number(ans);
		if(isNaN(samplenum)){ alertp("Not a number!");}
		else{
			if(samplenum < 1 || samplenum > numsampmax) alertp("Not a valid number!");
			else{
				exporttype = 2;
				ById("fileToSave").accept=".txt";
				savesta();
			}
		}
	} 
}

function exportparam()                                                                       // Exports parameter samples
{
	res = infres;
	numsampmax = 0; for(ch = 0; ch < infres.nch; ch++) numsampmax += nsamp[ch]-burnin;
	
	if(numsampmax > 1000) numsug = 1000; else numsug = numsampmax;
	var ans = prompt("Please enter the number of samples to be exported (1-"+numsampmax+").\nNote, samples are taken at uniform intervals from burnin\n(which is taken to be 20% of the total sample number).",numsug);
	
	if(ans){
		samplenum = Number(ans);
		if(isNaN(samplenum)){ alertp("Not a number!");}
		else{
			if(samplenum < 1 || samplenum > numsampmax) alertp("Not a valid number!");
			else{
				exporttype = 1;
				ById("fileToSave").accept=".txt";
				savesta();
			}
		}
	} 
}
