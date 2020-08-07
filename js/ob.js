/* Deals with "objects", which are collections of buttons/text */

function placeob()                                                                                // Places objects onto a canvas
{
	var x, y;

	if(ytot > canvasdy){
		if(tableyfr*ytot+canvasdy > ytot) tableyfr = (ytot-canvasdy)/ytot;
	}
	else tableyfr = 0;
	ysh = Math.floor(tableyfr*ytot);

	if(page == PRIORPAGE) ysh = Math.floor(ysh/priordy)*priordy;
	if(page == RUNPAGE && pagesub[page] == 0) ysh = Math.floor(ysh/trialtimedy)*trialtimedy;
	
	for(i = 0; i < nob; i++){
		y = oby[i]-ysh; 
		
		x = obx[i]; val = obval[i]; val2 = obval2[i]; val3 = obval3[i]; val4 = obval4[i];
		switch(obty[i]){
		case OBSETUP:
			addcanbutton("Number of independent runs",x,y,150,0,-1,PRHEADCANBUT,-1,-1); y += 30;
	
			addcanbutton("Speed up MCMC convergence and facilitate convergence disgnostics.",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
			y += 25;
			addcanbutton(ncpu+" processing cores are detected on your computer.",x+15,y,150,0,-1,TEXTBUT2,-1,-1); y += 25;

			if(y > 15 && y < setupheight-26){
				gdropinfo.push({val:nchain, x:width-180, y:y+46, dx:100, dy:26, style:5, options:[1,2,3,4,5,6,7,8], click:"nchain"});
			}
			
			y += 20;
			addcanbutton("Samples",x,y,150,0,-1,PRHEADCANBUT,-1,-1); y += 30;
			
			addcanbutton(nsampmax,width-350,y-5,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,14);
			addcanbutton("Maximum number of parameter samples",x+15,y,150,0,-1,TEXTBUT2,-1,-1); y += 30;
			
			addcanbutton(nsampevmax ,width-350,y-5,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,15);
			addcanbutton("Maximum number of event sequence (all infections and recoveries) samples",x+15,y,150,0,-1,TEXTBUT2,-1,-1); y += 25;
		
			y += 20;

			infrecfl = 0; if(isdata("infection")+isdata("recovery")) infrecfl = 1;

			if(infrecfl == 0) addcanbutton("Time range for inference",x,y,150,0,-1,PRHEADCANBUT,-1,-1);
			else addcanbutton("Time ranges",x,y,150,0,-1,PRHEADCANBUT,-1,-1);
			y += 25;
			break;
		
		case OBSETUP2:
			if(infrecfl == 0){ 
				addcanbutton("Begin: "+tpostmin,width-350,y,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,4);
				addcanbutton("End: "+tpostmax,width-350,y+30,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,5);
				
				addcanbutton("This represents the range in time over which interence is performed.",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
				y += 25;
				addcanbutton("Note, all individuals are assumed susceptible prior to the beginning time.",x+15,y,150,0,-1,TEXTBUT2,-1,-1); y += 58;
			}
			else{
				addcanbutton("Begin: "+tpostmin,width-350,y,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,4);
				addcanbutton("End: "+tpostmax,width-350,y+30,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,5);
		
				addcanbutton("Begin: "+tobsmin,width-350,y+80,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,10);
				addcanbutton("End: "+tobsmax,width-350,y+110,125,30,MINMAXBIGBUT,MINMAXBIGBUT,-1,11);
				
				addcanbutton("This represents the range in time over which interence is performed.",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
				y += 25;
				addcanbutton("Note, all individuals are assumed susceptible prior to the beginning time.",x+15,y,150,0,-1,TEXTBUT2,-1,-1); y += 58;
				
				addcanbutton("The time range over which infection and/or recovery events are observed",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
				y += 58;
			}

			addcanbutton("To choose different times for each contact group click",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
			addcanbutton("here.",x+421,y,70,20,CHOOSETRIALTIMEBUT,CHOOSETRIALTIMEBUT,-1,-1);
			break;
		
		case OBSETUP3:		
			addcanbutton("Define the beginning and ending observation time of each contact group.",x+15,y,150,0,-1,TEXTBUT2,-1,-1);y += 25;
			addcanbutton("To set the same times for different contact groups click",x+15,y,150,0,-1,TEXTBUT2,-1,-1);
			addcanbutton("here.",x+430,y,70,20,CHOOSETRIALTIMEBUT,CHOOSETRIALTIMEBUT,-1,-1);
			y += 35;
			if(infrecfl == 0){ 
				addcanbutton("Group",x+70,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("Begin",x+270,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("End",x+470,y,100,0,-1,PRHEADCANBUT,-1,-1);
			}
			else{
				dx = 120;
				addcanbutton("Group",x+40,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("Inf. begin",x+40+dx,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("Inf. end",x+40+2*dx,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("Obs. begin",x+40+3*dx,y,100,0,-1,PRHEADCANBUT,-1,-1);
				addcanbutton("Obs. end",x+40+4*dx,y,100,0,-1,PRHEADCANBUT,-1,-1);
			}
			y += 20;
			break;
			
		case OBSPEECH:
			if(val2 > 0) addcanbutton(val3,x+8,y,val,val2,-1,PARACANBUT,-1,-1);	
			break;
		
		case OBSPEECH2:
			addcanbutton("",x,y,val,val2,SPEECHBUT2,SPEECHBUT2,-1,-1);
			break;
		
		case OBSPEECH3:
			if(val2 > 0) addcanbutton(val3,x+8,y,val,val2,-1,PARACANBUT2,-1,-1);	
			break;
			
		case OBEXAMPPIC:
			addcanbutton(val2,x,y-20,25,0,-1,TEXTBUT,-1,-1);
			addcanbutton("",x,y,0,0,-1,EXAMPMODBUT,val,-1);
			addcanbutton("[?]",x+textwidth(val2,"bold 16px arial")+2,y-23,15,20,HELPICONCANBUT,HELPICONCANBUT,val3,-1);
			break;
		
		case OBEXAMP:
			if(val3) addcanbutton(val,x,y,textwidth(val,examplefont)+20,40,EXAMPBUT,EXAMPBUT,val2,val3);
			else addcanbutton(val,x,y,textwidth(val,examplefont)+20,20,EXAMPBUT,EXAMPBUT,val2,-1);
			break;

		case OBTEXT:
			addcanbutton(val,x,y,150,0,-1,TEXTBUT,-1,-1);
			break;
		
		case OBLINK:
			addcanbutton(val,x,y,150,20,LINKBUT,LINKBUT,val2,val3);
			break;
			
		case OBTEXTEDIT:
			addcanbutton(val,x,y,val2,25,EDITDBUT,EDITDBUT,val3,-1);
			break;
		
		case OBTEXT2:
			addcanbutton(val,x,y,150,0,-1,TEXTBUT2,-1,-1);
			break;
	
		case OBMINMAX:	
			addcanbutton(val,x,y-7,val3,30,MINMAXBUT,MINMAXBUT,0,val2);
			break;
			
		case OBDATAHEAD:
			if(data.length == 0) addcanbutton("No data loaded.",x,y,180,0,-1,TABLEHEADBUT,-1,-1); 
			else{
				addcanbutton("Name",x+datacol[0],y,130,0,-1,TABLEHEADBUT,-2,-1); 
				addcanbutton("Type",x+datacol[1],y,130,0,-1,TABLEHEADBUT,-2,-1); 
				addcanbutton("Time Range",x+datacol[2],y,130,0,-1,TABLEHEADBUT,-1,-1); 
			}
			break;
		
		case OBDATA:
			if(data[val].name) addcanbutton(data[val].name,x+datacol[0],y,130,22,TABLEBUT3,TABLEBUT3,val,-1); 
			addcanbutton(dataname(val),x+datacol[1],y,130,30,-1,TABLEBUT,-2,-1); 
			
			var te = "---";
			switch(data[val].variety){
			case "state": case "diagtest": case "infection": case "recovery":
				te = data[val].tmin + " — " + data[val].tmax;
				break;
			}
			addcanbutton(te,x+datacol[2],y,130,30,-1,TABLEBUT,-1,-1); 
			
			
			if(data[val].variety == "diagtest"){
				addcanbutton("Se:"+data[val].Se,x+datacol[2]+100,y-7,80,30,MINMAXBUT,MINMAXBUT,val,8);
				addcanbutton("Sp:"+data[val].Sp,x+datacol[2]+180,y-7,80,30,MINMAXBUT,MINMAXBUT,val,9);
				var ops=[]; if(modtype == SIR) ops=["I","I+R"]; else ops=["I"]; 
				gdropinfo.push({val:data[val].sens, x:cornx+x+datacol[2]+260, y:corny+y, dx:60, dy:20, style:2, 
									options:ops, click:"sens", j:val});
			}
			
			addcanbutton("Data",x+datacol[6]+30,y,70,22,VIEWBUT,VIEWBUT,val,"table"); 
			
			addcanbutton("",x+datacol[7]+20,y,20,20,DELETEBUT,DELETEBUT,val,-1); 
			break;
		
		case OBPRIORHEAD:
			addcanbutton("Name",0,y,100,0,-1,PRHEADBUT,-1,-1);
			addcanbutton("Prior",160,y,100,0,-1,PRHEADBUT,-1,-1);
			addcanbutton("Defining quantities",350,y,100,0,-1,PRHEADBUT,-1,-1);
			break;
		
		case OBPRIOR:
			p = val;	
			addcanbutton(param[p].name,0,y,0,0,-1,PARAMBUT,-1,-1);
			
			w = textwidth(param[p].name,tablefont);
			x = w+5;
			addcanbutton("[?]",x,y,15,20,HELPICONCANBUT,HELPICONCANBUT,35,p);
		
			if(y >= 0 && y < priorheight-20){
				var op=[];
				if(param[p].name == "β" || param[p].name == "γ" || param[p].name == "k" || param[p].name == "R_0" || param[p].name == "σ_G" || 
				  param[p].name == "Σ_gg" || param[p].name == "Σ_ff" || param[p].name == "Σ_rr" ||
				  param[p].name == "Ω_gg" || param[p].name == "Ω_ff" || param[p].name == "Ω_rr") op = priortext2;
				else op = priortext;
			
				gdropinfo.push({val:param[p].prior, x:cornx+160, y:corny+y, dx:120, dy:20, style:2, 
									options:op, click:"prior", j:p});
			}
			
			x = 350;
			switch(param[p].prior){
			case "Flat":
				addcanbutton("Min.: "+param[p].val[0],x,y-7,200,30,MINMAXBUT,MINMAXBUT,p,0);
				addcanbutton("Max.: "+param[p].val[1],x+200,y-7,200,30,MINMAXBUT,MINMAXBUT,p,1);
				break;

			case "Gamma":
				addcanbutton("Mean: "+param[p].val[0],x,y-7,200,30,MINMAXBUT,MINMAXBUT,p,20);
				addcanbutton("Var.: "+param[p].val[1],x+200,y-7,200,30,MINMAXBUT,MINMAXBUT,p,21);
				break;
				
			case "Normal":
				addcanbutton("Mean: "+param[p].val[0],x,y-7,200,30,MINMAXBUT,MINMAXBUT,p,20);
				addcanbutton("Var.: "+param[p].val[1],x+200,y-7,200,30,MINMAXBUT,MINMAXBUT,p,21);
				break;
			
			case "Log-Normal":
				addcanbutton("Mean (logscale): "+param[p].val[0],x,y-7,200,30,MINMAXBUT,MINMAXBUT,p,22);
				addcanbutton("Var. (logscale): "+param[p].val[1],x+200,y-7,200,30,MINMAXBUT,MINMAXBUT,p,23);
				break;
			
			case "Fix":
				addcanbutton("Value: "+param[p].val[0],x,y-7,200,30,MINMAXBUT,MINMAXBUT,p,24);
				break;
			};
			break;
		
		case OBNAME:
			st = datatemp.testname;
			addcanbutton(st,x,y,textwidth(st,"18px arial")+40,20,TESTNAMEBUT,TESTNAMEBUT,-1,-1);
			break;
			
		case OBRADIO:
			addcanbutton("Single",x,y,110,22,CANRADIOBUT,CANRADIOBUT,"simple",val);
			addcanbutton("Multiple",x+110,y,110,22,CANRADIOBUT,CANRADIOBUT,"binary",val);
			addcanbutton("Diagnostic test",x+220,y,110,22,CANRADIOBUT,CANRADIOBUT,"test",val);
			addcanbutton("General",x+380,y,150,22,CANRADIOBUT,CANRADIOBUT,"expression",val);
			break;
			
		case OBRADIO2:
			addcanbutton("+ve Test result",x,y,150,22,CANRADIOBUT,CANRADIOBUT,1000*val+1,CANRADIOTESTRES);
			addcanbutton("-ve Test result",x+170,y,150,22,CANRADIOBUT,CANRADIOBUT,1000*val+0,CANRADIOTESTRES);
			addcanbutton("No test",x+340,y,150,22,CANRADIOBUT,CANRADIOBUT,1000*val+2,CANRADIOTESTRES);
			break;
		
		case OBRADIO3:
			addcanbutton(val2,x,y,340,22,CANRADIOBUT,CANRADIOBUT,val,CANRADIODEFINE);
			break;
			
		case OBBRACKET:
			addcanbutton("",x,y,10,val,-1,BRACKETBUT,-1,-1);
			break;
		
		case OBIND:
			var indi;
			switch(page){
			case DATAPAGE: indi = inddata.ind[val]; break;
			case RUNPAGE: indi = infres.inddata.ind[val]; break;
			default: alertp("Problem EC88"); break;
			}
			
			//addcanbutton(indi.id,x,y,textwidth(indi.id,"bold 16px arial")+5,20,INDAC,TEXTBUT,val,-1);
			addcanbutton(indi.id,x,y,textwidth(indi.id,"bold 16px arial")+5,20,-1,TEXTBUT,val,-1);
			
			st = "";
			if(indi.trial != ""){ if(st != "") st += ", "; st += "Group:"+indi.trial;}
			if(indi.snp != ""){ if(st != "") st += ", "; st += "SNP:"+indi.snp;}
			for(f = 0; f < fixeddata.length; f++){ if(st != "") st += ", "; st += data[fixeddata[f]].name+":"+indi.fixed[f];}
			if(indi.par1 != ""){ if(st != "") st += ", "; st += "Parent 1:"+indi.par1;}
			if(indi.par2 != ""){ if(st != "") st += ", "; st += "Parent 2:"+indi.par2;}
			//addcanbutton(st,x+150,y,0,0,INDAC,TEXTSMBUT,val,-1);
			addcanbutton(st,x+150,y,0,0,-1,TEXTSMBUT,val,-1);
		
			yy = y+30;
			for(cl = 0; cl < ncla; cl++){
				addcanbutton("",tlinexmin,yy,tlinexmax-tlinexmin,1,-1,TIMELINEBUT,val,cl); yy += 25;
			}
			
			yy = y+30;

			numon = 0;
			for(cl = 0; cl < ncla; cl++){
				numon++;
				for(e = 0; e < indi.cl[cl].ev.length; e++){
					var ev = indi.cl[cl].ev[e];
					
					r = 6;
					if(ev.t >= axxmin && ev.t < axxmax){
						x = tlinexmin + Math.floor((tlinexmax-tlinexmin)*(ev.t-axxmin)/(axxmax-axxmin));
						switch(ev.variety){
						case "state":
							if(page == DATAPAGE) addcanbutton(e,x-r,yy-r,2*r,2*r,EVBUT,EVBUT,val,cl);
							else addcanbutton(e,x-r,yy-r,2*r,2*r,-1,EVBUT,val,cl);
							break;

						case "diagtest":
							if(page == DATAPAGE) addcanbutton(e,x-r,yy-r+14*ev.nDT,2*r,2*r,EVBUT3,EVBUT3,val,cl);
							else addcanbutton(e,x-r,yy-r+14*ev.nDT,2*r,2*r,-1,EVBUT3,val,cl);
							break;

						case "infection": case "recovery":					
							if(ev.col[0] >= 0){
								if(page == DATAPAGE) addcanbutton(e,x-r,yy-r,2*r,2*r,EVBUT2,EVBUT2,val,cl);
								else addcanbutton(e,x-r,yy-r,2*r,2*r,-1,EVBUT2,val,cl); 
							}
							break;
						}
					}
				}
				yy += 25;
			}
			break;
		
		case OBUPLOAD:
			addcanbutton(val2,val3,y,80,30,val,CANUPLOADBUT,-1,-1);
			break;
			
		case OBSELIND:
			var ops=[]; for(j = 0; j < cla[val].ncomp; j++) ops.push(cla[val].comp[j].name); ops.push("All");
			
			addcanbutton(cla[val].name+":",x,y,150,20,-1,TEXTBUT2,-1,-1);
			gdropinfo.push({val:clagendata[val], x:cornx+x+val2+3, y:corny+y+2, dx:95, dy:20, style:2, options:ops, click:"gendata", cl:val});
			break;
			
		case OBTRIALTIME:
			if(infrecfl == 0){ 
				addcanbutton(triallist[val],x+80,y+3,200,30,-1,TEXTBUT2,-1-1); 
				addcanbutton(tposttrialmin[val],x+280,y,200,30,MINMAXBUT,MINMAXBUT,val,6);
				addcanbutton(tposttrialmax[val],x+480,y,200,30,MINMAXBUT,MINMAXBUT,val,7);
			}
			else{
				dx = 120;
				addcanbutton(triallist[val],x+49,y+3,dx,30,-1,TEXTBUT2,-1-1); 
				addcanbutton(tposttrialmin[val],x+49+dx,y,dx,30,MINMAXBUT,MINMAXBUT,val,6);
				addcanbutton(tposttrialmax[val],x+49+2*dx,y,dx,30,MINMAXBUT,MINMAXBUT,val,7);
				addcanbutton(tobstrialmin[val],x+49+3*dx,y,dx,30,MINMAXBUT,MINMAXBUT,val,12);
				addcanbutton(tobstrialmax[val],x+49+4*dx,y,dx,30,MINMAXBUT,MINMAXBUT,val,13);
			}
			break;
		}
	}
}

function addob(x,y,ty,val,val2,val3,val4)                                                                 // Adds an object to a canvas
{
	obx[nob]=x; oby[nob]=y; obty[nob]=ty; obval[nob]=val; obval2[nob]=val2; obval3[nob]=val3; obval4[nob]=val4; nob++;
}

