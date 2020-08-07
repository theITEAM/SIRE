/* Functions related to mouse movement */

function mousemove(x,y)                                                                         // Fires when the mouse moves
{
	var overnew = -1;

	mx = x; my = y;

	switch(drag){    // Options for dragging different elements
	case 1:  // xslide
		tablexfr = tablexfrst + (mx-mxst)/tablewidth;
		if(tablexfr > 1-tablexfrac) tablexfr = 1-tablexfrac; if(tablexfr < 0) tablexfr = 0;
		break;
	
	case 2:  // yslide
		tableyfr = tableyfrst + (my-myst)/coheight;
		if(tableyfr > 1-tableyfrac) tableyfr = 1-tableyfrac; if(tableyfr < 0) tableyfr = 0;
		break;
	
	case 11: // drags indidual time lines
		//d = -(xaxisfixmax - xaxisfixmin)*(mx-mxlast)/tablewidth;
		//xaxisfixmax += d; xaxisfixmin += d;
		//mxlast = mx;		
		 
		tableyfr -= (my-mylast)/ytot;
		if(tableyfr > 1-tableyfrac) tableyfr = 1-tableyfrac; if(tableyfr < 0) tableyfr = 0;
		mylast = my;
		break;
		
	case 9:
		if(mx-mxst < colx[dragval] && dragval > 0){  // switches columns
			movecol(dragval,dragval-1);
			setcolumns();
			dragval--;
		}
		else{
			if(obsloaded == 1) imax = ncol; else imax = ncoldef;	
			
			if(mx-mxst > colx[dragval] + colw[dragval] + 10 && dragval < imax-1){  // switches columns
				movecol(dragval,dragval+1);
				setcolumns();
				dragval++;
			}
		}
		break;
	
	case 10:
		kde = kdest + (mx-mxst)*(kdemax-kdemin)/(slidex-slidedx);
		if(kde > kdemax) kde = kdemax; if(kde < kdemin) kde = kdemin;
		break;
	}
 	if(drag >= 1 && drag != 101) buttoninit();
	
	canbut = -1;
	for(i = nbut-1; i >= 0; i--){
		if(buttype[i] == CANVASBUT) canbut = i;
		if(butac[i] >= 0 && mx >= butx[i] && mx <= butx[i]+butdx[i] && my >= buty[i] && my <= buty[i]+butdy[i]){
			overnew = i; break;
		}
	}

	if(gdropsel >= 0){
		butplot(gdropbut,1);
		if(buttype[overnew] != GDROPSELBUT && buttype[overnew] != GDROPBUT){ gdropsel = -1; buttoninit(); }
	}
		
	if(exporton == 1){
		i = 0; while(i < nbut && !(buttype[i] == LOADBUT && butval2[i] == 3)) i++; if(i == nbut) alertp("Problem EC16.");
		if(mx < butx[i] || mx > butx[i]+butdx[i] || my > buty[i]+butdy[i]){ exporton = 0; buttoninit();}
	}

	if(saveon == 1){
		i = 0; while(i < nbut && !(buttype[i] == LOADBUT && butval2[i] == 1)) i++; if(i == nbut) alertp("Problem EC16.");
		if(mx < butx[i] || mx > butx[i]+butdx[i] || my > buty[i]+butdy[i]){ saveon = 0; buttoninit();}
	}
	
	if(canbut != -1){
		canovernew = -1;
		if(overnew == over && over == canbut){
			xx =  mx-butx[over]; yy = my-buty[over];
			for(i = ncanbut-1; i >= 0; i--){
				if(canbutac[i] >= 0 && xx >= canbutx[i] && xx < canbutx[i]+canbutdx[i] &&
									   yy >= canbuty[i] && yy < canbuty[i]+canbutdy[i]){
					canovernew = i;
					break;
				}
			}
		}
	
		if((canovernew != canover && over != -1 && buttype[over] == CANVASBUT)){
			canover = canovernew;
			butplot(canbut,-1);
		}
	}
	
	if(canover >= 0 && canbuttype[canover] == SLIDERBUT){
		butplot(canover,-1);
	}
	
	if(overnew != over || buttype[over] == XSLIDEBUT || buttype[over] == YSLIDEBUT){
		if(overx != -1){ cvover.clearRect(overx-1,overy-1,overdx+2,overdy+2); overx = -1;}
	
		overold = over; over = overnew;
		
		if(overold >= 0 && buttype[overold] != HELPBACKBUT) butplot(overold,-1);
		if(overnew >= 0 && buttype[overnew] != HELPBACKBUT) butplot(overnew,-1);
	}
	
	arrownew = 0;
	if(over == canbut && canover == -1 && ((page == DATAPAGE && pagesub[page] == 1) || (page == RUNPAGE && pagesub[page] == 4))){
		xq = mx-menux-tlinexmin-40; yq = my-40;
		if(xq > 0 && xq < tablewidth && yq >0 && yq < indtableheight) arrownew = 2;
	}
	
	if(arrownew != arrow){           // Sets the cursor (i.e. a hand is used for grabbing)
		arrow = arrownew;
		if(arrow > 0) document.getElementById("bod").style.cursor = "-webkit-grab"; 
		else document.getElementById("bod").style.cursor = "";
	}
}
