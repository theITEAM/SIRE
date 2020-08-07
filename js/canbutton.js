/* Initialises, draw and acts on click for canvas buttons */

function canbuttonplot()                                                   // Plots all the canvas buttons on the page
{
	var i, os;

	cv = graphcv;
	cv.clearRect(0,0,width,height);
	for(i = 0; i < ncanbut; i++){
		ov = 0; if(i == canover) ov = 1;
		canbutplot(i,ov);
	}
	cv = maincv;
}

function canfinalaction(i)                                                 // Click on a canvas buttons
{
	val = canbutval[i]; val2 = canbutval2[i]; 
	x = Math.floor(canbutx[i]); y = Math.floor(canbuty[i]); dx = Math.floor(canbutdx[i]); dy = Math.floor(canbutdy[i]);
	text = canbuttext[i]; 

	switch(canbutac[i]){
	case TABLECOLBUT:
		if(val >= ncoldef){
			if(val == 0) IDcol = val;
			selecttablecol(val);
		}
		break;
		
	case SPEECHBUT2:
		selbut(i);
		break;
		
	case TESTNAMEBUT:
		selbut(i);
		break;
	
	case BUBBLEOFFBUT:
		buboff(1);
		break;
	
	case DONEBUT:
		buboff();
		break;
	
	case INDAC:
		indplotst=[];
		tma =  -large; tmi = large;
		switch(page){
		case DATAPAGE:
			indi = inddata.ind[val]; 
			ev = indi.cl[0].ev;
			if(ev.length > 0){
				t = ev[0].t; if(t < tmi) tmi = t;
				t =  ev[ev.length-1].t; if(t > tma) tma = t;
			}
			break;
			
		case RUNPAGE:
			smin = infres.burninev;
			i = infres.inddata.ind[val].ref;
			indzoom(tablewidth/2,1);
			for(ch = 0; ch < infres.nch; ch++){
				w = infres.ch[ch];
				for(s = smin; s < infres.ch[ch].nsampev; s++){
					ws = w.sampev[s].ind[i];
					if(ws.nev > 2){
						t = ws.evt[1]; if(t < tmi) tmi = t;
						t = ws.evt[ws.nev-2]; if(t > tma) tma = t;
					}
				}
			}
			break;
		}
		if(tma != -large){
			tmi -= 0.0001*(tma-tmi); tma += 0.0001*(tma-tmi)
			xaxisfixmin = tmi;
			xaxisfixmax = tma;
		}
		break;
		
	case BUBBLEBUT:
		break;

	case NUMBUT:
		inserttext(numbut[val]);
		break;
		
	case MINMAXBUT: case MINMAXBIGBUT:
		selbut(i);
		break;
		
	case CANCELBUT:
		buboff(1);
		break;
		
	case CONVERTAC:
		convertdates();
		buboff();
		break;
		
	case TABLEBUT:
		selectelement(val2,val,TABLEBUT);
		break;
	
	case TABLEDROPBUT:
		if(addingdata != 2) selectelement(val2,val,TABLEDROPBUT);
		break;
	
	case TABLEBUT3:
		selbut(i);
		break;
		
	case TABLEHEADBUT:
	 	selecthead(val,TABLEHEADBUT);
		break;
		
	case DELROWAC:
		buboff(1);
		row.splice(selectbubval2,1);
		rowwidth.splice(selectbubval2,1);
		nrow--;	
		setcolumns();
		break;
		
	case SEARCHAC:
		inpon = 0;
		selectbub = SEARCHBUB;
		break;
		
	case DOSEARCHAC:
		buboff(0);
		break;
		
	case REPLACEAC:
		inpon = 0;
		selectbub = REPLACEBUB;
		break;
	
	case DOREPLACEAC:
		doreplace();
		break;
		
	case DELROWSAC:
		inpon = 0;
		selectbub = DELROWSBUB;
		break;
		
	case DODELROWSAC:
		dodelrows();
		break;
	
	case SORTAC:
		if(val == 0) dosort(selectbubval,"alp","swap");
		else dosort(selectbubval,"num","swap");
		buboff(1);
		buttoninit();
		break;
		
	case CANRADIOBUT:
		switch(val2){
		case CANRADIOCHECK: if(addingdata == 1 || addingdata == 3) datatemp.type = val; break;
		case CANRADIOTESTRES: if(addingdata == 1 || addingdata == 3) datatemp.postestres[Math.floor(val/1000)] = val%1000; break;
		case CANRADIOXAXIS: 
			xaxisauto = val;
			if(xaxisauto == 0){
				xaxisfixmin = parseFloat(axxmin.toPrecision(4));
				xaxisfixmax = parseFloat(axxmax.toPrecision(4));
			}
			else{ inpon = 0; ById("add").innerHTML = "";}
			if(errmsg == "" && page == RUNPAGE) indplotst=[];
			break;
		case CANRADIOYAXIS:
			yaxisauto = val;
			if(yaxisauto == 0){
				yaxisfixmin = parseFloat(axymin);
				yaxisfixmax = parseFloat(axymax);
			}
			else{ inpon = 0; ById("add").innerHTML = "";}
			break;
		}
		break;
	
	case CROSSBUT:
		break;

	case VIEWBUT:
		reloaddata(val);
		break;
		
	case DELETEBUT:
		if(confirm("Are you sure you want to delete this data source?")){
			data.splice(val,1);
			converttoobs("data");
		}
		break;
	
	case EVBUT: case EVBUT2: case EVBUT3: // case EVBUT5: case EVBUT6: case EVBUT7:
		selbut(i);
		break;
	
	case XLABELBUT: chooseaxis = 0; break;
	case YLABELBUT: chooseaxis = 1; break;
	
	case XTICKBUT:
		selbut(i);
		break;
		
	case YTICKTRBUT:
		selbut(i);
		break;
		
	case SUBBUT:
		param = priorsubbut(param,val,val2);
		break;

	case LINKBUT: val.posrefmore[val2] = 1; break;
	
	case EXAMPBUT: 
		fl = 0;
		if(modelstart == 1){
			if(confirm("Are you sure you want to discard the currently loaded model?")) fl = 1;
		}
		else fl = 1;
		
		if(fl === 1){
			stopinference();
			startloading();
			xmlhttp.open("GET","Examples/"+val+".sire",true); xmlhttp.send();
		}
		break;

	case RELOADBUT:
		if(popplotinitfl == 2) popplotinitfl = 0;
		break;
		
	case RELOADBUT2:
		indplotst=[];
		buttoninit();
		break;
		
	case NEXTSEARCHAC:
		if(searchres.length == 0) searchresnum = 0;
		else{
			searchresnum++; if(searchresnum==searchres.length) searchresnum = 0;
			selectelement(searchres[searchresnum],selectbubval,SEARCHRESBUB);
		}
		break
		
	case BACKSEARCHAC:
		if(searchres.length == 0) searchresnum = 0;
		else{
			searchresnum--; if(searchresnum == -1) searchresnum = searchres.length-1;
			selectelement(searchres[searchresnum],selectbubval,SEARCHRESBUB);
		}
		break;
	
	case UNDOAC: row = rowcopy; buboff(1); break;
	
	case CHOOSETRIALTIMEBUT:
		trialtime = 1-trialtime; 
		if(trialtime == 1){
			for(j = 0; j < triallist.length; j++){
				tposttrialmin[j] = tpostmin; tposttrialmax[j] = tpostmax;
				if(infrecfl == 1){ tobstrialmin[j] = tobsmin; tobstrialmax[j] = tobsmax;}
			}
		}
		break;
	
	case ZOOMINBUT:
	case ZOOMOUTBUT:
		buboff();
		
		fac = 0.5; if(canbutac[i] == ZOOMOUTBUT) fac = 1.0/fac;
		indzoom(tablewidth/2,fac);
		indplotst=[];
		break;
	
	case SLIDERBUT: break;
	
	case HELPICONCANBUT: helptype = val; if(val == 35) psel = val2; break;
	
	default: alertp("Problem EC10:"+canbutac[i]); break;
	}
}

function getsec(){ return new Date().getTime() / 1000;}                                     // Gets the time in seconds

function selbut(i)                                                                          // Selects a button
{
	if(selectbub != -1) buboff(1);
	
	selectbubx = canbutx[i]; selectbuby = canbuty[i]; selectbubdx = canbutdx[i]; selectbubdy = canbutdy[i];
	selectbub = canbuttype[i];
	selectbubval = canbutval[i];
	selectbubval2 = canbutval2[i];
	selectbubtext = canbuttext[i];
}

function selbuttype(ty)                                                                          // Selects a button
{
	i = 0; while(i < ncanbut && canbuttype[i] != ty) i++;
	if(i == ncanbut){ alertp("Problem EC20"); return;}
	
	if(selectbub != -1) buboff(1);
	
	selectbubx = canbutx[i]; selectbuby = canbuty[i]; selectbubdx = canbutdx[i]; selectbubdy = canbutdy[i];
	selectbub = canbuttype[i];
	selectbubval = canbutval[i];
	selectbubval2 = canbutval2[i];
	selectbubtext = canbuttext[i];
}

function canbutplot(i,ov)                                                                    // Plots an individual canvas button
{	
	x = Math.floor(canbutx[i]); y = Math.floor(canbuty[i]); dx = Math.floor(canbutdx[i]); dy = Math.floor(canbutdy[i]);
	text = canbuttext[i]; ty = canbuttype[i];
	val = canbutval[i]; val2 = canbutval2[i];
	if(selectbub == canbuttype[i] && selectbubval == val && selectbubval2 == val2) ov = 0;
	
	switch(ty){ 
	case EXAMPMODBUT:
		cv.drawImage(examppic[val],x,y);
		break;
	
	case EXAMPBUT:
		col = RED; if(ov == 1) col =LRED;
		
		plottext(text,x+11,y+16,examplefont,col);
		if(val2 != -1) plottext(val2,x+11,y+36,examplefont,col);
		ddx = 0; ddx2 = 5; ddy = 5; dy = 20;
		drawline(x+ddx,y+dy/2-ddy,x+ddx+ddx2,y+dy/2,col,THICKLINE);
		drawline(x+ddx,y+dy/2+ddy,x+ddx+ddx2,y+dy/2,col,THICKLINE);
		break;
		
	case TABLEHEADBUT:
		gettabcol(val,dy);
		if(ov == 1 && dy > 0) fillrect(x, y, dx, dy, col2);
		plottext(text,x+4,y+16,tableheadfont,col);
		break;
	
	case PARAMBUT:
		col = BLACK;
		plottext(text,x+4,y+16,tablefont,col);
		break;
		
	case TABLEBUT: case TABLEDROPBUT:
		gettabcol(val,dy);
		
		if(ov == 1 && dy > 0) fillrect(x, y, dx, dy, col2);
		plottext(text,x+4,y+16,tablefont,col);
		break;
	
	case TABLEBUT3:
		col = RED; col2 = LLRED;
		if(ov == 1 && dy > 0) fillrect(x, y, dx, dy, col2);
		plottext(text,x+4,y+16,HELPBUTFONT2,col);
		break;
		
	case SUBBUT: case SUBBUT2:
		col = DGREEN; if(ov == 1) col = GREEN;
		plottext(text,x+1,y+11,subfont,col);
		break;
	
	case BUBSELBUT:
		cv.beginPath();
		cv.lineWidth = 1;
		cv.rect(x,y,dx,dy);
		cv.strokeStyle = RED;
		cv.stroke();
		break;
		
	case TESTNAMEBUT:
		col = BLACK; if(ov == 1) col = BLUE;
		plottext(text,x+4,y+18,"18px arial",col);
		break;
		
	case CANUPLOADBUT:
		col = WHITE; col2 = RED; col3 = RED; if(ov == 1){ col = LLRED;}
		drawroundrect(x,y,dx,dy,12,col,col2);
		centertext(text,x+dx/2,y+21,INPUTFONT,col3);
		break;
		
	case DRAGBUT:
		cv.globalAlpha = 0.5;
		col = dragcol; if(ov == 1) col = darkcol(col);
		drawroundrect(x,y,dx,dy,Math.floor(0.2*dy),col,darkcol(col));
		centertext(text,x+dx/2,y+Math.floor(0.75*dy),Math.floor(dy*0.7)+  "px arial",WHITE);
		cv.globalAlpha = 1;	
		break;
		
	case TABLECOLBUT:
		if(ov == 1 && val >= ncoldef) fillrect(x, y, dx, dy, LLRED);
		break;
	
	case RELOADBUT:
		if(popplotinitfl == 2){ col = RED; if(ov == 1) col = LRED; reloadsign(x,y,col);}
		break;
	
	case RELOADBUT2:
		col = RED; if(ov == 1) col = LRED; reloadsign(x,y,col);
		break;
		
	case BUBBLEBUT:
		drawroundrect(x,y,dx,dy,20,LLLBLUE,LBLUE);
		if(cornbub == 0){
			drawline(bubx2,buby2,bubx3,buby3,LLLBLUE,NORMLINE);
			polypoint[0][0] = bubx1; polypoint[0][1] = buby1; 
			polypoint[1][0] = bubx2; polypoint[1][1] = buby2; 
			polypoint[2][0] = bubx3; polypoint[2][1] = buby3; 
			drawpolygon(3,LLLBLUE,LLLBLUE,THICKLINE);
			drawline(bubx1,buby1,bubx2,buby2,LBLUE,NORMLINE);
			drawline(bubx1,buby1,bubx3,buby3,LBLUE,NORMLINE);
		}
		break; 
		
	case BUBBLEOFFBUT:
		col = LRED; col2 = RED; if(ov == 1){ col = RED; col2 = DRED;}
		r = dx/2-1; r2 = r-3;
		x = x+r+1; y = y+r+1; 
		drawroundrect(x-r,y-r,2*r,2*r,r,col,col2);
		drawline(x-r2,y-r2,x+r2,y+r2,WHITE,THICKLINE);
		drawline(x+r2,y-r2,x-r2,y+r2,WHITE,THICKLINE);
		break;
		
	case BUBBLETEXTBUT:
		plottext(text,x+5,y+12,"16px arial",BLUE); 
		break;
		
	case BUBBLETEXTBUT2:
		plottext(text,x+5,y+12,"14px arial",BLACK); 
		break;

	case BUBBLETEXTBUT3:
		plottext(text,x+5,y+12,"bold 16px arial",BLUE); 
		break;
		
	case VIEWBUT:
		if(val2 == "table"){ col = RED; col2 = DRED; col3 = WHITE; if(ov == 1) col = LRED;}
		else{ col = BLUE; col2 = DBLUE; col3 = WHITE; if(ov == 1) col = LBLUE;}
	
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2,y+16,"18px arial",col3); 
		break;
		
	case DONEBUT:
		col = LBLUE; col2 = BLUE; col3 = WHITE; if(ov == 1){ col = BLUE; col2 = DBLUE;}
		//col = GREEN; col2 = DGREEN; col3 = WHITE; if(ov == 1) col3 = DDGREEN;
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2,y+16,"bold 17px arial",col3); 
		break;
		
	case CANCELBUT:
		col = LRED; col2 = RED; col3 = WHITE; if(ov == 1){ col = RED; col2 = DRED;}
		//col = BLUE; col2 = DBLUE; col3 = WHITE; if(ov == 1) col3 = DDBLUE;
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2,y+16,"bold 17px arial",col3); 
		break;
		
	case CLEARBUT:
		col = WHITE; col2 = RED; col3 = RED; if(ov == 1){ col = LLRED;}
		drawroundrect(x,y,dx,dy,12,col,col2);
		centertext(text,x+dx/2,y+21, "bold 18px arial",col3);
		break;
		
	case CLEARBUT2:
		col = WHITE; col2 = DGREEN; col3 = DGREEN; if(ov == 1){ col = LLGREEN;}
		drawroundrect(x,y,dx,dy,12,col,col2);
		centertext(text,x+dx/2,y+21, "bold 18px arial",col3);
		break;
		
	case ZOOMINBUT:
	case ZOOMOUTBUT:
		cv.globalAlpha = 0.95;
		drawroundrect(x+1,y+1,dx-2,dy-2,4,WHITE,WHITE);
		cv.globalAlpha = 1;
	
		r = 8; r2 = 5; r3 = 23;
		col = BLACK; if(ov == 1) col = DGREY;
		
		xx = x+dx-r; yy = y+r;
		circle(xx,yy,r,col,THICKLINE);
		drawline(xx-r2,yy,xx+r2,yy,col,THICKLINE);
		if(canbuttype[i] == ZOOMINBUT) drawline(xx,yy-r2,xx,yy+r2,col,THICKLINE);
		th = 2.2;
		drawline(xx+r*Math.cos(th),yy+r*Math.sin(th),xx+r3*Math.cos(th),yy+r3*Math.sin(th),col,VTHICKLINE);
		break;
	
	case REQUESTBUT:
		centertext(text,x+dx/2,y+16,"bold 16px arial",BLACK); 
		break;
		
	case CROSSBUT:
		col = RED; if(ov == 1) col = LRED;
		drawline(x+2,y+2,x+dx-2,y+dy-2,col,VTHICKLINE);
		drawline(x+dx-2,y+2,x+2,y+dy-2,col,VTHICKLINE);
		break;
	
	case DELBUT:
		col = LRED; col2 = RED; col3 = WHITE; if(ov == 1) col3 = RED;
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2,y+16,"17px arial",col3); 
		break;

	case DELETEBUT:
		col = RED; if(ov == 1) col = LRED;
		drawline(x+1,y+1,x+dx-1,y+dy-1,col,THICKLINE);
		drawline(x+1,y+dy-1,x+dx-1,y+1,col,THICKLINE);
		break;

	case NUMBUT:
		col = LORANGE; if(ov == 1) col = LLORANGE;
		drawroundrect(x,y,dx,dy,4,col,darkcol(col));
		centertext(numbut[val],x+dx/2,y+18,"17px arial",WHITE); 
		break;

	case ERRMSGBUT:
		if(val == 1) plottext(text,x+17,y+15,"17px arial",RED);
		else{
			j = text.length-1;
			do{
				j--;
				while(j > 0 && text.substr(j,1) != " ") j--;
				if(j <= 1) break;
			}while(textwidth(text.substr(0,j),"17px arial") > dx-50);
			plottext(text.substr(0,j),x+17,y+15,"17px arial",RED);	
			plottext(text.substr(j+1),x+17,y+32,"17px arial",RED);	
		}
		drawline(x,y+4,x+10,y+4+10,RED,THICKLINE); drawline(x,y+4+10,x+10,y+4,RED,THICKLINE);
		break;
	
	case TEXTBUT:
		col = DDGREY; if(ov == 1) col = GREY;
		plottext(text,x,y+14,"bold 16px arial",col);
		break;
		
	case TEXTSMBUT:
		col = BLACK;
		plottext(text,x,y+14,"14px arial",col);
		break;
		
	case LINKBUT:
		col = DDBLUE; if(ov == 1) col = BLUE;
		plottext(text,x,y+14,"14px arial",col);
		break;
		
	case CHOOSETRIALTIMEBUT:
		cv.clearRect(x,y,dx,dy);
		col = RED; if(ov == 1) col = LRED;
		plottext(text,x+4,y+18,HELPFONT,col);
		break;
		
	case TEXTBUT2:
		plottext(text,x+4,y+18,"17px arial",DDGREY);
		break;
		
	case MINMAXBUT:
		if(ov == 1) fillrect(x, y, dx, dy, LLGREEN);
		plottext(text,x+4,y+22,tablefont,DGREEN);
		break;
	
	case MINMAXBIGBUT:
		if(ov == 1) fillrect(x, y, dx, dy, LLGREEN);
		plottext(text,x+4,y+22,"bold 20px Times",BLACK);
		break;
		
	case MINMAXHEADBUT:
		plottext(text,x+4,y+16,tableheadfont,DDGREEN);
		break;
		
	case CANRADIOBUT:
		col=DGREY;
		switch(val2){
		case CANRADIOCHECK: selval = datatemp.type; if(addingdata == 2) ov = 0; break;
		case CANRADIOTESTRES: selval = datatemp.postestres[Math.floor(val/1000)]; val = val%1000; if(addingdata == 2) ov = 0; break;
		case CANRADIOXAXIS: selval = xaxisauto; break;
		case CANRADIOYAXIS: selval = yaxisauto; break;
		}

		if(val == selval){ if(addingdata != 2)  col2 = BLACK; else col2 = GREY;}
		else{
			if(ov == 1) col2 = DGREY;
			else col2 = WHITE
		}

		r = 7;
		drawroundrect(x+1,y+2,2*r,2*r,r,WHITE,col);

		if(val == selval){ if(addingdata != 2) col3 = BLACK; else col3 = GREY;}
		else{
			col3 = GREY;  if(ov == 1) col3 = DGREY;
		}
    
		plottext(text,x+21,y+14,"bold 16px arial",col3);
 
		if(col2 != WHITE){
			x += 2; y += 4; r -= 2;
			drawroundrect(x+1,y,2*r,2*r,r,col2,col2);
		}
		break;
	
	case BRACKETBUT:
		drawline(x,y,x,y+dy,BLACK,THICKLINE);
		drawline(x,y,x+dx,y,BLACK,THICKLINE);
		drawline(x,y+dy,x+dx,y+dy,BLACK,THICKLINE);
		drawline(x-8,y+Math.floor(dy/2),x,y+Math.floor(dy/2),BLACK,THICKLINE);	
		break;
		
	case TIMELINEBUT:
		righttext(text,x-10,y+4,"bold 14px arial","#cc2222"); 

		if(page == RUNPAGE) calcindprob(val,val2,x,y,dx); 
		else drawline(x,y,x+dx,y,BLACK,THICKLINE);
		break;
		
	case EVBUT:
		var ev;
		if(page == RUNPAGE) ev = infres.inddata.ind[val].cl[val2].ev[text];
		else ev = inddata.ind[val].cl[val2].ev[text];
			
		col = ev.col;
		jmax = col.length;
		if(jmax == 0) fillcircle(x+dx/2,y+dy/2,dx/2,BLACK,BLACK,NORMLINE);
		else{
			for(j = 0; j < jmax; j++){
				cv.beginPath();
				cv.moveTo(x+dx/2,y+dy/2);
			
				cv.arc(x+dx/2,y+dy/2,dx/2,2*Math.PI*(0.25+j/jmax),2*Math.PI*(0.25+(j+1)/jmax));
				co = cla[val2].comp[col[j]].col; if(ov == 1) co = darkcol(co); 
				cv.fillStyle = co;
				cv.fill();
			}
		}
		circle(x+dx/2,y+dy/2,dx/2,BLACK,NORMLINE);
		break;
	
	/*
	case EVBUT7:
		fillcircle(x+dx/2,y+dy/2,dx/2,WHITE,BLACK,NORMLINE);
		break;
		*/
		
	case EVBUT2:
		if(page == RUNPAGE) ev = infres.inddata.ind[val].cl[val2].ev[text];
		else ev = inddata.ind[val].cl[val2].ev[text];
			
		col = ev.col;
		co = cla[val2].comp[col[0]].col; if(ov == 1) co = darkcol(co); 
		fillrect(x,y,dx/2,dy,co);
		 
	    co = cla[val2].comp[col[1]].col; if(ov == 1) co = darkcol(co); 
		fillrect(x+dx/2,y,dx/2,dy,co);
		drawrect(x,y,dx,dy,BLACK,NORMLINE);
		break;
		
			
	case EVBUT3:
		if(page == RUNPAGE) ev = infres.inddata.ind[val].cl[val2].ev[text];
		else ev = inddata.ind[val].cl[val2].ev[text];
		
		if(ev.val == 1) fillrect(x,y,dx,dy,BLACK);
		else{ fillrect(x,y,dx,dy,WHITE); drawrect(x,y,dx,dy,BLACK,NORMLINE);}
		break;
	
		/*
	case EVBUT3:
		ev = inddata.ind[val].cl[val2].ev[text];
		col = ev.col;
		co = cla[val2].comp[col[0]].col; if(ov == 1) co = darkcol(co); 
		fillrect(x,y,dx,dy,co);
		drawrect(x,y,dx,dy,BLACK,NORMLINE);
		break;
		*/
		
	case CANSMALLTEXTBUT:
		plottext(text,x+2,y+15,"12px arial",val);
		break;
		
	case RESULTBUT:
		cv.drawImage(resultcan,0,0,dx,dy,x,y,dx,dy);
		drawline(x,y+dy,x,y-10,BLACK,THICKLINE);
		drawarrow(x,y-20,x,y+dy,15,BLACK);
		drawline(x,y+dy,x+dx+10,y+dy,BLACK,THICKLINE);
		drawarrow(x+dx+20,y+dy,x,y+dy,15,BLACK);
		break;

	case PARACANBUT:
		alignparagraph(text,dx-10);
		col = DDBLUE;
		var j; 
		fillcircle(x-4,y+10,3,BLACK,BLACK,NORMLINE);
		
		for(j = 0; j < nlines; j++) plottext(lines[j],x+5,y+18+linesy[j],HELPFONT,col);
		break;
		
	case PARACANBUT2:
		alignparagraph(text,dx-5,"bold 18px arial");
		col = DDBLUE;
		var j; 
		fillcircle(x-4,y+10,3,BLACK,BLACK,NORMLINE);
		
		for(j = 0; j < nlines; j++) plottext(lines[j],x+5,y+18+linesy[j],"bold 18px arial",col);
		break;
		
	case XTICKBUT:
		col = BLACK; if(ov == 1 && selectbub != XTICKBUT) col = DGREY;
		for(j = 0; j < ntickx; j++){
			xx = Math.floor(x+dx*(tickx[j]-axxmin)/(axxmax-axxmin));
			centertext(tickx[j],xx,y+dy/2+8,TICKFONT,col); 
			drawline(xx,y,xx,y-10,BLACK,NORMLINE); 
			if(val == -2) drawline(xx,y-graphdy,xx,y-graphdy+10,BLACK,NORMLINE); 
		}
		break;
		
	 case YTICKTRBUT:
		col = BLACK; if(ov == 1 && selectbub != YTICKTRBUT) col = DGREY;
		for(j = 0; j < nticky; j++){
			yy = Math.floor(y+dy-dy*(ticky[j]-axymin)/(axymax-axymin));
			righttext(ticky[j],x+dx-5,yy+6,TICKFONT,col); 
			drawline(x+dx,yy,x+dx+10,yy,BLACK,NORMLINE); 
		}
		break;
	
	case BURNINBUT:
		col = RED; //if(over == i) col = LRED;
		drawdashed(cv,x+dx/2,y,x+dx/2,y+dy,col);
		if(val == -1) plotangletext(text,x+dx/2+5,y+5,-Math.PI/2,MENUFONTSMALL,col);
		else plotangletext(text,x+dx/2+5-19,y+5,-Math.PI/2,MENUFONTSMALL,col);
		break;
	
	case XLABELBUT:
	 	col=BLACK; if(ov == 1){ col = GREY;}
		if(chooseaxis == 0) col = RED;
		plotxlabel(text,x+dx/2,y+dy/2+4,LABELFONT,col);
		break;
		
	case YLABELBUT:
		col=BLACK; if(ov == 1){ col = GREY;}
		if(chooseaxis == 1) col = RED;
		plotylabel(text,x+dx/2+5,y+dy/2,LABELFONT,col);
		break;
	
	case SLIDERBACKBUT:
		plottext(text,x-58,y+16,STATFONT,DGREY);
		drawline(x,y+dy/2,x+dx,y+dy/2,GREY,THICKLINE);
		break;

	case SLIDERBUT:
		col = WHITE; if(ov == 1) col = LGREY; if(drag == 10) col = RED;
		fillrect(x,y,slidedx,dy,col);
		drawrect(x,y,slidedx,dy,GREY,NORMLINE);
		break;
		
	case LABBUT:
		if(!(page == RUNPAGE && pagesub[page] == 6)) val2 = 0;
		drawline(x,y+dy/2,x+dx,y+dy/2,val,VTHICKLINE,val2);
		plottext(text,x+dx+5,y+12,KEYFONT,BLACK); 
		break;
		
	case WHITERECTBUT:
		fillrect(x,y,dx,dy,WHITE);
		break;
		
	case ARROWBUT:
		drawline(x,y,x+dx+10,y,BLACK,THICKLINE);
		drawarrow(x+dx+20,y,x,y,15,BLACK);
		break;
		
	case NEXTCANBUT:
		col = WHITE; col2 = RED; col3 = RED; if(ov == 1) col = LLRED;
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2-5,y+16,"17px arial",col3);
		drawline(x+dx-8,y+dy/2,x+dx-14,y+5,col3,THICKLINE);
		drawline(x+dx-8,y+dy/2,x+dx-14,y+dy-5,col3,THICKLINE);
		drawline(x+dx-8-6,y+dy/2,x+dx-14-6,y+5,col3,THICKLINE);
		drawline(x+dx-8-6,y+dy/2,x+dx-14-6,y+dy-5,col3,THICKLINE);
		break;
		
	case BACKCANBUT:
		col = WHITE; col2 = RED; col3 = RED; if(ov == 1) col = LLRED;
		drawroundrect(x,y,dx,dy,7,col,col2);
		centertext(text,x+dx/2+5,y+16,"17px arial",col3);
		drawline(x+8,y+dy/2,x+14,y+5,col3,THICKLINE);
		drawline(x+8,y+dy/2,x+14,y+dy-5,col3,THICKLINE);
		drawline(x+8+6,y+dy/2,x+14+6,y+5,col3,THICKLINE);
		drawline(x+8+6,y+dy/2,x+14+6,y+dy-5,col3,THICKLINE);
		break;
	
	case SPEECHBUT2:
		break;
		
	case PRHEADCANBUT:
		plottext(text,x+4,y+16,tableheadfont,DDBLUE);
		break;
		
	case HELPICONCANBUT:
		fillrect(x,y,dx,dy,WHITE);
		col = DRED; if(ov == 1) col = LRED;
		plottext(text,x+3,y+10,"bold 10px arial",col);
		break;
		
	default: alertp("Problem EC11."); break;
	}
}

function addcanbutton(text,x,y,dx,dy,ac,type,val,val2)                                              // Adds a canvas button
{
	canbuttext[ncanbut] = text;
	canbutx[ncanbut] = x;
	canbuty[ncanbut] = y;
	canbutdx[ncanbut] = dx;
	canbutdy[ncanbut] = dy;
	canbutac[ncanbut] = ac; 	
	canbuttype[ncanbut] = type;
	canbutover[ncanbut] = -1;
	canbutval[ncanbut] = val;
	canbutval2[ncanbut] = val2;
	ncanbut++;
}
