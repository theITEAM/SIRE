/* Functions for speech bubble popups */

function bubble()                                                                    // Draws a speech bubble for selected item
{
	var x, y, w, h, dx, dy, i, j, dl, dr, du, dd, orient, hh, ww;

	cornbub = 0;
	
	switch(selectbub){
	case EVBUT: bubw = 200; bubh = 90; break;
	case EVBUT2: bubw = 200; bubh = 60; break;	
	case EVBUT3: bubw = 200; bubh = 90; break;	
	case EMPTYBUB: bubw = 190; bubh = 57; break;
	case GENOTYPEBUB: bubw = 190; bubh = 57; break;
	case NUMPROBBUB: bubw = 120; bubh = 57; break;
	case INFRECPROBBUB: bubw = 180; bubh = 57; break;
	case STATEPROBBUB: bubw = 190; bubh = 57; break
	case DIAGTESTPROBBUB: bubw = 190; bubh = 57; break
	case SPEECHBUT2: bubw = 650; bubh = 275; break;
	case TESTNAMEBUT: bubw = 260; bubh = 102; break;
	case MINMAXBUT: case MINMAXBIGBUT: bubw = 205; bubh = 160; break;
	case CONVERTDATEBUB: bubw = 275; bubh = 102; break;
	case MULTISTATEBUB: bubw = 275; bubh = 102; break;
	case TABLEBUT: bubw = 275; bubh = 95; break;
	case TABLEDROPBUT: bubw = 200; bubh = 60; break;
	case TABLEBUT3: bubw = 175; bubh = 102; break;
	case TABLEHEADBUT: bubw = 230; bubh = 156; break;
	case SEARCHBUB: bubw = 230; bubh = 98; break;
	case SEARCHRESBUB: bubw = 230; bubh = 118; break;
	case REPLACEBUB: bubw = 230; bubh = 153; break;
	case REPLACEDONEBUB: bubw = 230; bubh = 63; break;
	case DELROWSDONEBUB: bubw = 230; bubh = 63; break;
	case DELROWSBUB: bubw = 230; bubh = 98; break;
	case ERRBUB: bubw = textwidth(errmsg,"17px arial")+50; bubh = 60; break;
	case XTICKBUT: bubw = 190; bubh = 202; if(xaxisauto == 0) bubh = 185; else bubh = 62; break; 
	case YTICKTRBUT: bubw = 190; bubh = 202; if(yaxisauto == 0) bubh = 185; else bubh = 62; break; 
	case EDITBUB: bubw = 140; bubh = 57; selectbubx = 800; selectbuby = 605; selectbubdx = 0; selectbubdy =0; break;
	}
	
	if(errmsg != "" && selectbub != ERRBUB){
		bubh += 15;
		if(textwidth(errmsg,"17px arial")+28 > bubw) bubh += 20;
	}	
	
	x = selectbubx; y = selectbuby; dx = selectbubdx; dy = selectbubdy; w = bubw; h = bubh; 
	switch(selectbub){
	case TABLEBUT: case TABLEDROPBUT: case TABLEBUT3: case TABLEHEADBUT: case MINMAXBUT: case MINMAXBIGBUT: case EQBUT: case SPEECHBUT2: case SEARCHRESBUB:
		addcanbutton("Bubble",x,y,dx,dy,-1,BUBSELBUT,-1,-1);
		break;
	}
	
	hh = canvasdy; ww = canvasdx;

	if(cornbub == 0){
		i = x+dx/2; j = y+dy/2;      	// works out the best way to orient the bubble
		
		i = x; j = y+dy/2; dl = i*i+(j-hh/2)*(j-hh/2);
		i = x+dx; j = y+dy/2; dr = (i-ww)*(i-ww)+(j-hh/2)*(j-hh/2);
		i = x+dx/2; j = y; du = (i-ww/2)*(i-ww/2)+j*j;
		i = x+dx/2; j = y+dy; dd = (i-ww/2)*(i-ww/2)+(j-hh)*(j-hh);

		if(page == PRIORPAGE) dl = 0;
		
		if(dr >= dl && dr >= du && dr >= dd) orient = RIGHT;
		else{
			if(dl >= dr && dl >= du && dl >= dd) orient = LEFT;
			else{
				if(dd >= dl && dd >= du && dd >= dr) orient = DOWN;
				else orient = UP;
			}
		}

		if(page == PRIORPAGE){ if(du < dd) orient = DOWN; else orient = UP;}
		
		if(orient == DOWN){
			if(y+dy+bubtag+h > hh){
				if(dl < dr) orient = RIGHT; else orient = LEFT;
			}
		}

		if(orient == UP){
			if(y-bubtag-h < 0){
				if(dl < dr) orient = RIGHT; else orient = LEFT;
			}
		}

		if(selectbub == EDITBUB) orient = UP;
		if(selectbub == SPEECHBUT2) orient = DOWN; 
		if(selectbub == MINMAXBUT && (selectbubval2 == 8 || selectbubval2 == 9)) orient = LEFT;
		
		switch(orient){
		case LEFT: 
			bubx = x-w-bubtag;
			bubx1 = x; buby1 = y+dy/2;
			bubx2 = bubx+w; buby2 = buby1+5;
			bubx3 = bubx+w; buby3 = buby1+bubtag2;
			buby = buby1-30;
			if(buby < 5) buby = 5;
			if(buby+h > hh-5) buby = hh-5-h;
			if(buby+bubh-20 < buby3) buby = buby3-bubh+20;
			break; 
			
		case RIGHT:
			bubx = x+dx+bubtag;
			bubx1 = x+dx; buby1 = y+dy/2;
			bubx2 = bubx; buby2 = buby1+5;
			bubx3 = bubx; buby3 = buby1+bubtag2;
			buby = buby1-30;
			if(buby < 5) buby = 5;
			if(buby+h > hh-5) buby = hh-5-h;
			if(buby+bubh-20 < buby3) buby = buby3-bubh+20;
			break; 
			
		case UP:
			buby = y-bubtag-h;
			bubx1 = x+dx/2; buby1 = y;
			bubx2 = bubx1+5; buby2 = y-bubtag;
			bubx3 = bubx1+bubtag2; buby3 = y-bubtag;
			bubx = bubx1-30;
			if(bubx < 5) bubx = 5;
			if(bubx+w > ww-5) bubx = ww-5-w;
			break;
		
		case DOWN:
			buby = y+dy+bubtag;
			bubx1 = x+dx/2; buby1 = y+dy;
			bubx2 = bubx1+5; buby2 = buby;
			bubx3 = bubx1+bubtag2; buby3 = buby;
			bubx = bubx1-30;
			if(bubx < 5) bubx = 5;
			if(bubx+w > ww-5) bubx = ww-5-w;
			break;
		}
		if(buby < 1){ ddy = 1 - buby; buby += ddy; buby1 += ddy; buby2 += ddy; buby3 += ddy;}
		if(buby+h > hh-1){ ddy = hh-1-h - buby; buby += ddy; buby1 += ddy; buby2 += ddy; buby3 += ddy;}
		if(bubx < 1){ ddx = 1 - bubx; bubx += ddx; bubx1 += ddx; bubx2 += ddx; bubx3 += ddx;}
		if(bubx+w > ww-1){ ddx = ww-1-w - bubx; bubx += ddx; bubx1 += ddx; bubx2 += ddx; bubx3 += ddx;}
		
		bubw = w; bubh = h;
	}
	else{ bubx = 20; buby = 30;}
	
	addcanbutton("Bubble",bubx,buby,w,h,BUBBLEBUT,BUBBLEBUT,-1,-1);

	addcanbutton("Bubble Close",bubx+w-22,buby+6,16,16,BUBBLEOFFBUT,BUBBLEOFFBUT,-1,-1);

	cursx = bubx+bubmar; cursy = buby + bubmar;

	bubblecontent(w);
}

function addbubtext(text)                                                                         // Adds text to a bubble
{
  addcanbutton(text,cursx,cursy,0,0,-1,BUBBLETEXTBUT,-1,-1);
  cursy += 20;
}

function addinput(text,w)                                                                          // Adds input area to bubble
{
	if(inpon == 0){
		text = ""+text;
		st = "<input id='inp' autocomplete='off'  style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+w+"px; height:25px; background=#ffffff;' value='"+text+"' onblur='setTimeout(function() {if(inpon == 1) ById(\"inp\").focus();}, 0);' onkeypress='if(event.keyCode == 13){ if(selectbub == SEARCHBUB || selectbub == SEARCHRESBUB) buboff(0); else{ if(selectbub == DELROWSBUB) dodelrows(); else{ buboff(0); buttoninit();}}}' type='text' onfocus='foc=\"inp\";'/>";
		ById("add").innerHTML = st;
		a = ById("inp"); a.focus(); a.selectionStart = 0;  a.selectionEnd = text.length;
		inpon = 1;
	}
	else{
		a = ById("inp"); a.style = "text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+w+"px; height:25px; background=#ffffff;";
	}
	 
	cursy += 27;
}

function addtextarea(text,w,h,text2,w2)                                                      // Adds a text area to a bubble
{
	if(text2 != -1){
		if(h == 104) addcanbutton("Expand",cursx+w-50,cursy-20,50,15,EXPANDAC,LINKBUT,-1,-1);
		else addcanbutton("Reduce",cursx+w-50,cursy-20,50,15,REDUCEAC,LINKBUT,-1,-1);
	}
	
	if(inpon == 0){
		text = ""+text;
		st = "<textarea id='inptext' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+w+"px; height:"+h+"px; background=#ffffff;' onfocus='foc=\"inptext\";' ";

		st += "type='text'>"+text+"</textarea>";
		
		if(w2 > 0){
			st += "<input id='inp' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+h+37)+"px; left:"+(canx+cursx+12)+"px; width:"+w2+"px; height:25px; background=#ffffff;' value='"+text2+"' type='text' onfocus='foc=\"inp\";' />";
		}
		
		ById("add").innerHTML = st;
		a = ById("inptext"); a.focus();
		inpon = 1;
	}
	else{
		a = ById("inptext"); a.style = "text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+w+"px; height:"+h+"px; background=#ffffff;";
		
		if(w2 > 0){
			a = ById("inp"); a.style = "text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+h+37)+"px; left:"+(canx+cursx+12)+"px; width:"+w2+"px; height:25px; background=#ffffff;";
		}
	}
	 
	cursy += h+2;
}

function buboff(close)                                                                       // Turns a bubble off
{
	var cl, i, j, st;

	errmsg = "";
	if(close == 1){ selectbub = -1; ById("add").innerHTML = ""; inpon = 0;}
	
	cl = selectbubval; i = selectbubval2;
	switch(selectbub){
	case SPEECHBUT2:
		st = ById("inptext").value;
		if(st == "") errmsg = "Must enter text";
		else datanote = st;
		break;
	
	case TESTNAMEBUT:
		st = ById("inp").value;
		if(st == "") errmsg = "Must enter an expression";
		else{
			datatemp.testname = st;
		}
		break;
			
	case MINMAXBUT: case MINMAXBIGBUT:
		st = ById("inp").value; 
		if(st.length == 0) errmsg = "Must be set";
		else{
			if(st != "∞" && isNaN(st)) errmsg = "Must a number"; 
			else{
				if(st != "∞") st = parseFloat(st);
				switch(selectbubval2){
				case 0: case 20: case 22: case 24: param[selectbubval].val[0] = st; break;
				case 1: case 21: case 23: param[selectbubval].val[1] = st; break;
				case 4: if(st > tdatamin) errmsg = "Must be before data"; else tpostmin = st; break;
				case 5: if(st < tdatamax) errmsg = "Must be after data"; else tpostmax = st; break;
				case 6: tposttrialmin[selectbubval] = st; break;
				case 7: tposttrialmax[selectbubval] = st; break;
				case 8: if(st <= 0 || st >= 1) errmsg = "Must be in the range between 0 and 1"; else data[selectbubval].Se = st; break;
				case 9: if(st <= 0 || st >= 1) errmsg = "Must be in the range between 0 and 1"; else data[selectbubval].Sp = st; break;
				case 10: tobsmin = st; break;
				case 11: tobsmax = st; break;	
				case 12: tobstrialmin[selectbubval] = st; break;
				case 13: tobstrialmax[selectbubval] = st; break;
				case 14: if(st < 1) errmsg = "Must be at least 1"; else nsampmax = st; break;
				case 15: if(st < 1) errmsg = "Must be at least 1"; else nsampevmax = st; break;
				}
			}
		}
		break;
	
	case TABLEHEADBUT:
		st = ById("inp").value.trim();
		if(st == "")  errmsg = "Cannot be blank";
		else{
			colname[selectbubval] = st; 
			setcolumns();
		}
		break;
		
	case TABLEBUT:
		val = ById("inp").value.trim(); 
		if(errmsg == ""){
			row[selectbubval2][selectbubval] = ById("inp").value.trim(); 
			cv.font = tableheadfont; 
			rowwidth[selectbubval2][selectbubval] = Math.floor(cv.measureText(ById("inp").value).width);
			setcolumns();
		}
		break;
		
	case TABLEBUT3:
		data[selectbubval].name = ById("inp").value; break;
		break;
		
	case SEARCHBUB:
	case SEARCHRESBUB:
		if(ById("inp").value == "") errmsg = "Must enter a search term";
		else searchterm = ById("inp").value; 
		break;
		
	case DELROWSBUB:
		searchterm = ById("inp").value; 
		break;
		
	case XTICKBUT: case YTICKTRBUT:
		if((selectbub == XTICKBUT && xaxisauto == 0) || (selectbub == YTICKTRBUT && yaxisauto == 0)){
			if(isNaN(ById("inp").value) || isNaN(ById("inp2").value)) errmsg = "Not a number!";
			else{
				num1 = parseFloat(ById("inp").value); num2 = parseFloat(ById("inp2").value)+0.0000000001;
		
				if(num1 > num2) errmsg = "Wrong order!";
				else{
					if(selectbub == XTICKBUT){
						xaxisfixmin = num1; xaxisfixmax = num2;
						if(page == RUNPAGE &&  infpagename[pagesub[RUNPAGE]] == "Populations") popplotinitfl = 0;	
					}
					else{ yaxisfixmin = num1; yaxisfixmax = num2;}
				}
			}
		}
		if(errmsg == "" && page == RUNPAGE) indplotst=[];
		break;
	}

	if(errmsg != "") return;
	selectbubst = selectbub;
	selectbub = -1; ById("add").innerHTML = ""; inpon = 0; errmsg = "";
	
	switch(selectbubst){
	case SEARCHBUB:
	case SEARCHRESBUB:
		dosearch();
		break;
	}
}

function addbubcol(colnum)                                                                     // Adds a pallete button to bubble
{
	addcanbutton("",cursx-2,cursy,26,15,COLBUT,COLBUT,colnum,-1);
	cursx += 31;
}

function addbubbut(text,type,ac)                                                               // Adds a button to a bubble
{
  var w, x, y;
  w = textwidth(text,BUTFONT)+20;
  x = bubx + bubw-w-8; y = buby+bubh-25;
  addcanbutton(text,x,y,w,20,ac,type,-1,-1);
}

function addbubbut2(text,type,ac,text2,type2,ac2)                                              // Adds two buttons to a bubble
{
  var w, x, y;
  w = textwidth(text2,BUTFONT)+20; if(type == BACKCANBUT) w += 15;
  x = bubx + bubw-w-8; y = buby+bubh-25;
  addcanbutton(text2,x,y,w,20,ac2,type2,-1,-1);

  w = textwidth(text,BUTFONT)+20; if(type == BACKCANBUT) w += 15;
  x = x-w-8; y = buby+bubh-25;
  addcanbutton(text,x,y,w,20,ac,type,-1,-1);
}

function inserttext(text)                                                                      // Adds text to a bubble 
{
	a = ById(foc);
	if(!a) return;

	startPos = a.selectionStart; endPos = a.selectionEnd;
	st = a.value;
	a.value = st.substr(0,startPos)+text+st.substr(endPos,st.length);

	a.selectionStart = startPos+text.length;  a.selectionEnd = a.selectionStart;
	a.focus();
}

function bubblecontent(w)                                                                       // The content of bubbles
{
	var i, sel;

	switch(selectbub){
	case EVBUT:
		var ev;
		if(page == RUNPAGE) ev = infres.inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		else ev = inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		
		addbubtext(ev.desc); cursy += 3;
	
		d = ev.obsdata; i = ev.obsdatai;
		if(page == RUNPAGE){
			addbubtext("Classification: "+infres.data[d].val[i]); 
		}
		else{
			var pos=[]; if(modtype == SIR) pos = ["S","I","R"]; else pos = ["S","I"];
			gdropinfo.push({val:data[d].val[i], x:cornx+cursx+95, y:corny+cursy-2, dx:65, dy:20, style:1, options:pos, d:d, i:i, click:"dataname2"});
		
			addbubtext("Classification:"); 
		}
		
		addbubtext("Time: "+ev.t);
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;
	
	case EVBUT2:
		var ev;
		if(page == RUNPAGE) ev = infres.inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		else ev = inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		
		addbubtext(ev.desc); 
		addbubtext("Time: "+ev.t);
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;	
		
	case EVBUT3:
		var ev;
		if(page == RUNPAGE) ev = infres.inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		else ev = inddata.ind[selectbubval].cl[selectbubval2].ev[selectbubtext];
		
		addbubtext(ev.desc); cursy += 3;
	
		d = ev.obsdata; i = ev.obsdatai;
		if(page == RUNPAGE) addbubtext("Test result: "+infres.data[d].val[i]); 
		else{
			var pos=[0,1];
			gdropinfo.push({val:data[d].val[i], x:cornx+cursx+90, y:corny+cursy-4, dx:65, dy:20, style:1, options:pos, d:d, i:i, click:"dataname2"});
			addbubtext("Test result:"); 
		}
		addbubtext("Time: "+ev.t);
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;
	
	case TESTNAMEBUT:
		addbubtext("Test name:");
		addinput(datatemp.testname,w-20);
		cursy += 10;
		adderrmsg();
		
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;
	
	case SPEECHBUT2:
		addcanbutton("Description:",cursx,cursy,0,0,-1,BUBBLETEXTBUT3,-1,-1); cursy += 23;
		addtextarea(datanote,w-20,203,-1);
		cursy += 10;
		adderrmsg();
		
		addbubbut2("Cancel",CANCELBUT,CANCELBUT,"Done",DONEBUT,DONEBUT);
		break;
		
	case MINMAXBUT: case MINMAXBIGBUT:
		switch(selectbubval2){
		case 0:
			addbubtext("Minimum:");
			addinput(param[selectbubval].val[0],w-20);
			break;
		case 1:
			addbubtext("Maximum:");
			addinput(param[selectbubval].val[1],w-20);
			break;
			
		case 20:
			addbubtext("Mean:");
			addinput(param[selectbubval].val[0],w-20);
			break;
			
		case 21:
			addbubtext("Variance:");
			addinput(param[selectbubval].val[1],w-20);
			break;
		
		case 22:
			addbubtext("Mean (logscale):");
			addinput(param[selectbubval].val[0],w-20);
			break;
			
		case 23:
			addbubtext("Variance (logscale):");
			addinput(param[selectbubval].val[1],w-20);
			break;	

		case 24:
			addbubtext("Value:");
			addinput(param[selectbubval].val[0],w-20);
			break;			
			
		case 4:
			addbubtext("Minimum time:");
			addinput(tpostmin,w-20);
			break;
		case 5:
			addbubtext("Maximum time:");
			addinput(tpostmax,w-20);
			break;
		
		case 6:
			addbubtext("Minimum time:");
			addinput(tposttrialmin[selectbubval],w-20);
			break;
		case 7:
			addbubtext("Maximum time:");
			addinput( tposttrialmax[selectbubval],w-20);
			break;
			
		case 8:
			addbubtext("Sensitivity:");
			addinput(data[selectbubval].Se,w-20);
			break;
		case 9:
			addbubtext("Specificity:");
			addinput(data[selectbubval].Sp,w-20);
			break;
			
		case 10:
			addbubtext("Minimum time:");
			addinput(tobsmin,w-20);
			break;
		case 11:
			addbubtext("Maximum time:");
			addinput(tobsmax,w-20);
			break;
			
		case 12:
			addbubtext("Minimum time:");
			addinput(tobstrialmin[selectbubval],w-20);
			break;
		case 13:
			addbubtext("Maximum time:");
			addinput( tobstrialmax[selectbubval],w-20);
			break;
			
		case 14:
			addbubtext("Maximum:");
			addinput(nsampmax,w-20);
			break;
			
		case 15:
			addbubtext("Maximum:");
			addinput(nsampevmax,w-20);
			break;
		}
		
		cursy += 15;
		adderrmsg();
	
		cursx = bubx+bubmar+3;
		for(i = 0; i <6; i++){
			addcanbutton("",cursx,cursy,22,26,NUMBUT,NUMBUT,i,-1);
			cursx += 31;
		}
		cursx = bubx+bubmar+3+15; cursy += 30;
		for(i = 6; i < nnumbut; i++){
			addcanbutton("",cursx,cursy,22,26,NUMBUT,NUMBUT,i,-1);
			cursx += 31;
		}
		
		addbubbut("Done",DONEBUT,DONEBUT);
		break;

	case CONVERTDATEBUB:
		addbubtext("This looks like a date which");
		addbubtext("needs to be converted to decimal.");
		addbubtext("Would you like to convert?");
		addbubbut2("Cancel",CANCELBUT,CANCELBUT,"Convert",DONEBUT,CONVERTAC);
		break;
		
	case MULTISTATEBUB:
		addbubtext("This individual has multiple");
		addbubtext("states associated with it.");
		break;
		
	case TABLEBUT:
		addbubtext("Value:");
		addinput(row[selectbubval2][selectbubval],w-20);  cursy += 15;
		adderrmsg();
		addbubbut2("Delete Row",CANCELBUT,DELROWAC,"Done",DONEBUT,DONEBUT);	
		break;
		
	case TABLEDROPBUT:
		addbubtext("Value:");
		
		gdropinfo.push({val:row[selectbubval2][selectbubval], x:cornx+cursx+58, y:corny+cursy-25, dx:105, dy:20, style:2, options:datatemp.pos, click:"tabledrop", j:selectbubval2, i:selectbubval});
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;
	
	case TABLEBUT3:
		addbubtext("Name:");
		addinput(data[selectbubval].name,w-20);
		adderrmsg();
		addbubbut("Done",DONEBUT,DONEBUT);	
		break;	
		
	case TABLEHEADBUT:
		addbubtext("Name:");
		addinput(colname[selectbubval],w-20); cursy += 13;
		adderrmsg();
	
		addcanbutton("Search",cursx,cursy,100,20,SEARCHAC,DELBUT,-1,-1);
		addcanbutton("Replace",cursx+110,cursy,100,20,REPLACEAC,DELBUT,-1,-1);
		cursy += 28;
		addcanbutton("Sort (A-Z)",cursx,cursy,100,20,SORTAC,DELBUT,0,-1);
		addcanbutton("Sort (0-9)",cursx+110,cursy,100,20,SORTAC,DELBUT,1,-1);
		cursy += 28;	
		addcanbutton("Delete rows",cursx,cursy,100,20,DELROWSAC,DELBUT,-1,-1);
		//addcanbutton("Join cols",cursx,cursy,100,20,JOINCOLSAC,DELBUT,-1,-1);
		break;
		
	case SEARCHBUB:
		addbubtext("Search for:");
		addinput(searchterm,w-20); cursy += 13;
		adderrmsg();
		addbubbut2("Cancel",CANCELBUT,CANCELBUT,"Search",DONEBUT,DOSEARCHAC);	
		break;
		
	case SEARCHRESBUB:
		addbubtext("Search for:");
		addinput(searchterm,w-20); cursy += 13;
		adderrmsg();
		addbubtext((searchresnum+1)+" out of "+searchres.length);
		addbubbut2("Back",BACKCANBUT,BACKSEARCHAC,"Next",NEXTCANBUT,NEXTSEARCHAC);	
		break;
		
	case REPLACEBUB:
		addbubtext("Replace:");
		
		st = "<input id='inp' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"
		     +(canx+cursx+12)+"px; width:"+(w-20)+"px; height:25px; background=#ffffff;' value='"+searchterm
			 +"' onkeypress='if(event.keyCode == 13) ById(\"inp2\").focus();' oninput='searchterm=ById(\"inp\").value;' type='text'/>";
		cursy += 37;
		
		addbubtext("With:");
	 
		st += "<input id='inp2' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"
		      +(canx+cursx+12)+"px; width:"+(w-20)+"px; height:25px; background=#ffffff;' value='"+replaceterm
			  +"' onkeypress='if(event.keyCode == 13) doreplace();' oninput='replaceterm=ById(\"inp2\").value;' type='text'/>";
		cursy += 37;
		adderrmsg();

		ById("add").innerHTML = st;
		a = ById("inp"); a.focus(); a.selectionStart = 0;  a.selectionEnd = text.length;
		addbubbut2("Cancel",CANCELBUT,CANCELBUT,"Replace",DONEBUT,DOREPLACEAC);	
		break;
		
	case REPLACEDONEBUB:
		addbubtext(nreplace +" entries replaced");
		addbubbut2("Undo",CANCELBUT,UNDOAC,"Done",DONEBUT,CANCELBUT);	
		break;
	
	case DELROWSBUB:
		addbubtext("Delete all rows with:");
		addinput(searchterm,w-20); cursy += 13;
		adderrmsg();
		addbubbut2("Cancel",CANCELBUT,CANCELBUT,"Delete",DONEBUT,DODELROWSAC);	
		break;
		
	case DELROWSDONEBUB:
		addbubtext(ndel +" entries deleted");
		addbubbut2("Undo",CANCELBUT,UNDOAC,"Done",DONEBUT,CANCELBUT);	
		break;
		
	case ERRBUB:
		addbubtext(errmsg);
		addbubbut("OK",DONEBUT,DONEBUT);
		break;
		
	case XTICKBUT:
	case YTICKTRBUT:
		if(selectbub == XTICKBUT){ mi = xaxisfixmin; ma = xaxisfixmax; rad = CANRADIOXAXIS;}
		else{ mi = yaxisfixmin; ma = yaxisfixmax; rad = CANRADIOYAXIS;}
		 
		addcanbutton("Auto",cursx,cursy,70,20,CANRADIOBUT,CANRADIOBUT,1,rad);
		addcanbutton("Define",cursx+70,cursy,70,20,CANRADIOBUT,CANRADIOBUT,0,rad);
		
		if((xaxisauto == 0 && selectbub == XTICKBUT) || (yaxisauto == 0 && selectbub == YTICKTRBUT)){
			mi = rn(parseFloat(mi)); ma = rn(parseFloat(ma));	
			
			cursy += 30;
			addbubtext("Minimum:");
		
			if(inpon == 0){
				st = "<input id='inp' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+(bubw-20)+"px; height:25px; background=#ffffff;' value='"+mi+"' onkeypress='if(event.keyCode == 13) ById(\"inp2\").focus();' type='text'/>";
				cursy += 35;
		
				addbubtext("Maximum:");
				st += "<input id='inp2' style='text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+(bubw-20)+"px; height:25px; background=#ffffff;' value='"+ma+"' onkeypress='if(event.keyCode == 13){ buboff(0); buttoninit();}' type='text'/>";
		
				ById("add").innerHTML = st;
				inpon = 1;
			}
			else{
				a = ById("inp"); a.style = "text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+(bubw-20)+"px;";
				cursy += 35;
				addbubtext("Maximum:");
				a = ById("inp2"); a.style = "text-align:left; position:absolute;  font-size:22px; top:"+(cany+cursy+9)+"px; left:"+(canx+cursx+12)+"px; width:"+(bubw-20)+"px;";
			}
			cursy += 40;
			adderrmsg();
		}
		
		addbubbut("Done",DONEBUT,DONEBUT);
		break;
		
	case EMPTYBUB:
		addbubtext("This element should");
		addbubtext("not be blank!");
		break;
		
	case GENOTYPEBUB:
		addbubtext("Genotype must be");
		addbubtext("AA, AB, BA or BB!");
		break;
		
	case STATEPROBBUB:
		addbubtext("State must be ");
		addbubtext("S, I, R or .");
		break;
	
	case DIAGTESTPROBBUB:
		addbubtext("Result must be ");
		addbubtext("0, 1 or .");
		break;
		
	case NUMPROBBUB:
		addbubtext("Must be");
		addbubtext("a number!");
		break;
	
	case INFRECPROBBUB:
		addbubtext("Must be a number,");
		addbubtext("'no' or '.'.");
		break;
		
	case EDITBUB:
		addbubtext("Click here to");
		addbubtext("edit the model!");
		break;
	}
}

function adderrmsg(st)                                                                          // Adds an error message to a bubble
{
	if(errmsg != ""){
		if(textwidth(errmsg,"17px arial")+28 > bubw){
			addcanbutton(errmsg,cursx,cursy-5,bubw,20,-1,ERRMSGBUT,2,-1);
			cursy += 35;
		}
		else{
			addcanbutton(errmsg,cursx,cursy-5,bubw,20,-1,ERRMSGBUT,1,-1);
			cursy += 15;
		}
	}
}
		