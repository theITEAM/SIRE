/* The data page */

function databuts()                                                                         // Draws button for the data page
{			
	x = menux+tab; y = 30;

	res = datares;
	
	switch(addingdata){
	case 0:
		switch(pagesub[DATAPAGE]){
		case 0:
			addbutton("Data Sources",x,y,0,0,-1,TITLEBUT,11,-1); y += 40;

			addbutton("Using the buttons below add any combination of information about infection times, recovery times, disease status measurements or diagnostic test results along with details of which individuals belong to which contact group. SNP or fixed effects can also be added to determine how they affect the traits.",x+20,y,800,0,-1,PARAGRAPHBUT,1,-1);

			y += 95;
		
			cornx = x+20; corny = y;
			addbutton("",x+20,y,tablewidthdata,tableheightdata,CANVASBUT,CANVASBUT,-1,-1);
	
			drawdata();
	
			tableyfrac = tableheightdata/ytot;
			if(tableyfrac < 1) addbutton("",menux+tab+20+tablewidthdata+10,y,13,tableheightdata-22,SLIDEAC,YSLIDEBUT,-1,-1);
		 
			x = menux+tab; y = height-50; dx = 180;
			
			if(randon == 1) y -= 20;
			
			addop("Contact Group","trial",1); x += dx;
			addop("SNP","snp",2); x += dx;
			addop("Covariate FE","fixed",3); x += dx;
			addop("Categorical FE","fixedcat",4); x += dx;
			x = menux+tab; y += 20;
			addop("Disease Status","state",5); x += dx;
			addop("Diag. Test","diagtest",6); x += dx;
			addop("Infection Times","infection",7); x += dx;
			addop("Recovery Times","recovery",8); x += dx;
			
			//x = menux+tab; y += 20;
			//te = "Entry Times"; addbutton(te,x+20,y,textwidth(te,addfont)+22,20,ADDDATAAC,ADDBUT2,OBSFILE,"entry"); x += dx;
			//te = "Leave Times"; addbutton(te,x+20,y,textwidth(te,addfont)+22,20,ADDDATAAC,ADDBUT2,OBSFILE,"leave"); x += dx;
			
			if(randon  == 1){
				x = menux+tab; y += 20;
				te = "Rel. Matrix"; addbutton(te,x+20,y,textwidth(te,addfont)+22,20,ADDDATAAC,ADDBUT2,OBSFILE,"rel"); x += dx;
				te = "Inv. Rel. List"; addbutton(te,x+20,y,textwidth(te,addfont)+22,20,ADDDATAAC,ADDBUT2,OBSFILE,"invrellist"); x += dx;
				te = "Pedigree"; addbutton(te,x+20,y,textwidth(te,addfont)+22,20,ADDDATAAC,ADDBUT2,OBSFILE,"ped"); x += dx;
			}
			break;
		
		case 1:
			indplot();
			break;
		}
		//if(isdata("state")+isdata("infection")+isdata("recovert")+isdata("diagtest") > 0) ff = NEXTBUT; else ff = -1;
		addbutton("Next",width-105,height-40,90,30,NEXTBUT,NEXTBUT,0,-1);
		break;
		
	case 1: // Adding data
	case 2: // Viewing data
	case 3: // Editing data
		switch(datashow){
		case "table":
			switch(addingdata){
			case 1:
				switch(datatype){
				case "state": addbutton("Add state data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "infection": addbutton("Add infection data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "recovery": addbutton("Add recovery data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "enter": addbutton("Add entry data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "leave": addbutton("Add leave data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "trial": addbutton("Add contact group data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "diagtest": addbutton("Add diagnostic test data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "snp": addbutton("Add SNP data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "fixed": addbutton("Add fixed effect data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "fixedcat": addbutton("Add fixed effect categorical data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "rel": addbutton("Add relationship matrix",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "invrel": addbutton("Add inverse relationship matrix",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "invrellist": addbutton("Add nonzero elements of inverse relationship matrix",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "ped": addbutton("Add Pedigree",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				case "presence": addbutton("Add presence data",x,y,0,0,-1,TITLEBUT,-1,-1); break;
				}

				y += 50;
				switch(datatype){
				case "rel": case "invrel": case "invrellist":
					addbutton("Please edit entries if needed and press 'Done' when complete.",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
					
					addbutton("Cancel",width-205,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
					addbutton("Done",width-105,height-40,90,30,DONEAC,ADDDATABUT,0,-1);
					break;
					
				case "presence":
					switch(ncoldef){
					case 0:
						addbutton("Please select the column representing individual IDs:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
						addbutton("Cancel",width-105,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
						break;
					
					case 1:
						addbutton("Please select the column representing observation times",x+20,y,450,0,-1,PARAGRAPHBUT,-1,-1);
						addbutton("(or choose a specific time here)",x+425,y,300,20,CHOOSETIMEBUT,CHOOSETIMEBUT,-1,-1);
						addbutton("Back",width-205,height-40,90,30,TABBACKAC,BACKBUT,0,-1);
						addbutton("Cancel",width-105,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
						break;

					case 2: 
						addbutton("Please edit entries if needed and press 'Done' to finish.",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
					
						addbutton("Back",width-305,height-40,90,30,TABBACKAC,BACKBUT,0,-1);
						addbutton("Cancel",width-205,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
						addbutton("Done",width-105,height-40,90,30,DONEAC,ADDDATABUT,0,-1);
						break;
					}
					break;
					
				default:
					if(ncoldef == ncoldefmax){
						addbutton("Please edit entries if needed and press 'Done' when complete.",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
					
						addbutton("Back",width-305,height-40,90,30,TABBACKAC,BACKBUT,0,-1);
						addbutton("Cancel",width-205,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
						addbutton("Done",width-105,height-40,90,30,DONEAC,ADDDATABUT,0,-1);
					}
					else{
						switch(ncoldef){
						case 0:
							addbutton("Please select the column representing individual IDs:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
							break;
						case 1:
							switch(datatype){
							case "state": case "diagtest":
								addbutton("Please select the column representing observation times",x+20,y,450,0,-1,PARAGRAPHBUT,-1,-1);
								addbutton("(or choose a specific time here)",x+425,y,300,20,CHOOSETIMEBUT,CHOOSETIMEBUT,-1,-1);
								break;
								
							case "infection":
								addbutton("Please select the column representing infection times",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								addbutton("(or choose a specific time here)",x+425,y,300,20,CHOOSETIMEBUT,CHOOSETIMEBUT,-1,-1);
								break;
								
							case "recovery":
								addbutton("Please select the column representing recovery times:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
								
							case "entry":
								addbutton("Please select the column representing entry times:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
								
							case "leave":
								addbutton("Please select the column representing leave times:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
								
							case "trial":
								addbutton("Please select the column representing the contact group:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;	
							
							case "snp":
								addbutton("Please select the column representing the SNP:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
								
							case "fixed":
								addbutton("Please select the column representing the fixed effect:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
							
							case "fixedcat":
								addbutton("Please select the column representing the categorical fixed effect:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
								
							case "ped":
								addbutton("Please select the column representing first parent:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
							}
							break;

						case 2:
							switch(datatype){
							case "state":
								if(modtype == SIR) bra = "S, I or R"; else bra = "S or I";
								addbutton("Please select the column giving disease status ("+bra+"):",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
							
							case "diagtest":
								addbutton("Please select the column giving diagnostic test result:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
							
							case "ped":
								addbutton("Please select the column giving second parent:",x+20,y,800,0,-1,PARAGRAPHBUT,-1,-1);
								break;
							}
							break;
						}
						if(ncoldef > 0) addbutton("Back",width-205,height-40,90,30,TABBACKAC,BACKBUT,0,-1);
						addbutton("Cancel",width-105,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
					}
					break;
				}
				y += 40;
			
				drawtable();
				break;
			
			case 2:
				addbutton("Data Table",x,y,0,0,-1,TITLEBUT,-1,-1); y += 50;
				drawtable();
				addbutton("Back",width-205,height-40,90,30,BACKBUT,BACKBUT,0,-1);
				addbutton("Edit",width-105,height-40,90,30,DONEAC,ADDDATABUT,0,-1);
				break;
			
			case 3:
				addbutton("Edit Data Table",x,y,0,0,-1,TITLEBUT,-1,-1); y += 50;
				drawtable();
				addbutton("Done",width-105,height-40,90,30,DONEAC,ADDDATABUT,0,-1);
				addbutton("Cancel",width-205,height-40,90,30,CANCELBUT2,CANCELBUT2,0,-1);
				break
			}
			
			cornx = x+40; corny = y;
			addbutton("",cornx,corny,tablewidth,tableheight,CANVASBUT,CANVASBUT,-1,-1);
			tableyfrac = rowmax/nrow;
			if(tableyfrac < 1) addbutton("",x+40+ tablewidth+10,y+22,13,tableheight-22,SLIDEAC,YSLIDEBUT,-1,-1);

			tablexfrac = tablewidth/tottablewidth;
			if(tablexfrac < 1) addbutton("",x+40,y+tableheight+10,tablewidth,13,SLIDEAC,XSLIDEBUT,-1,-1);
			break;
		}
		break;
		
	case 4:
		addbutton("Time range for observation",x,y,150,0,-1,PRHEADBUT,-1,-1); y += 25;
	
		if(trialtime == 1){
				addbutton("Define the beginning and ending observation time of each contact group.",x+15,y,150,0,-1,NORMTEXTBUT,-1,-1);y += 25;
				addbutton("To set the same times for contact groups click",x+15,y,150,0,-1,NORMTEXTBUT,-1,-1);
				addbutton("here.",x+364,y,300,20,CHOOSETRIALTIMEAC,CHOOSETIMEBUT,-1,-1);
				y += 35;
				addbutton("Group",x+70,y,100,0,-1,PRHEADBUT,-1,-1);
				addbutton("Begin",x+270,y,100,0,-1,PRHEADBUT,-1,-1);
				addbutton("End",x+470,y,100,0,-1,PRHEADBUT,-1,-1);
				y += 20;
				w = trialtimewidth;
			}
			else w = tablewidthbig;
			
			cornx = menux+tab+20; corny = y;
			addbutton("",cornx,corny,w,trialtimeheight,CANVASBUT,CANVASBUT,-1,-1);
		
			drawsetup();
		break;
	}
}

function indplot()                                                                        // Plots data on individuals
{
	var x, y;
	
	if(page == DATAPAGE) addbutton("Individuals",menux+tab,30,0,0,-1,TITLEBUT,28,-1);
	else addbutton("Individuals",menux+tab,30,0,0,-1,TITLEBUT,29,-1);
		
	if((page == DATAPAGE && data.length == 0) || getnind() == 0){
		addbutton("There is no individual-based data.",menux+tab+20,80,500,0,-1,BOLDFONTBUT,-1,-1);
	}
	else{
		if(tdatamin == large){
			addbutton("There is no individual-based time data.",menux+tab+20,80,500,0,-1,BOLDFONTBUT,-1,-1);
		}
		else{		
			rightmenu(width-rwid,75,"ind");
			
			y = 50;
			cornx = menux+20; corny = 80;
			addbutton("",cornx,corny,indtablewidth,indtableheight+indtablemar,CANVASBUT,CANVASBUT,-1,-1);

			drawinddata();
			
			tableyfrac = indtableheight/ytot;
			if(tableyfrac < 1) addbutton("",menux+22+indtablewidth,corny,13,indtableheight,SLIDEAC,YSLIDEBUT,-1,-1);
				
			setxtics();
		}
	}
}	

function addop(te,ty,he)
{
	var dx = textwidth(te,addfont)+19;
	addbutton(te,x+20,y,dx,20,ADDDATAAC,ADDBUT2,OBSFILE,ty);
	addbutton("[?]",x+20+dx,y,15,20,HELPICONBUT,HELPICONBUT,he,-1);
}
	
function orderind()
{
	switch(page){
	case DATAPAGE: indd = inddata.ind; break;
	case RUNPAGE: indd = infres.inddata.ind; break;
	default: alertp("Error EC1"); break;
	}
	
	switch(order){
	case IDORD:
		indd.sort( function(a, b){ return orderstring(a.id,b.id);});
		break;
		
	case GROUPORD:
		indd.sort( function(a, b){ return orderstring(a.trial,b.trial);});
		break;
		
	case TIMEORD:
		indd.sort( function(a, b){
				var t1, t2;
				if(a.cl[0].ev.length == 0) t1 = -large; else t1 = a.cl[0].ev[0].t;
				if(b.cl[0].ev.length == 0) t2 = -large; else t2 = b.cl[0].ev[0].t;
				return t1-t2;
			}
		);
		break;
	}
}

function orderstring(x,y)
{
	if(!isNaN(x)) x = toString(x); if(!isNaN(y)) y = toString(y);
	x = x.toLowerCase(), y = y.toLowerCase();
	var j = 0; while(j < x.length && j < y.length && x.substr(j,1) == y.substr(j,1) && isNaN(x.substr(j,1))) j++;
	if(j < x.length && j < y.length){
		xi = Number(x.substring(j));
		yi = Number(y.substring(j));
		if(!isNaN(xi) && !isNaN(yi)){
			if(xi < yi) return -1; if(xi > yi) return 1; return 0;
		}
	}
	if(x < y) return -1; if (x > y) return 1; return 0;	
}

function loadobsfile()                                                                       // Fires when loading up a observation file
{
	if(fiformat == ".csv"){ if(loadobsfile2(",") == 0) return 0;}
	else{
		if(loadobsfile2("\t") == 0) return 0;
		if(loadobsfile2(",") == 0) return 0;
		if(loadobsfile2(" ") == 0) return 0;
	}
	return 1;
}

function loadobsfile2(sep)                                                              // Fires when loading up a observation file
{
	var lines = textFromFile.split('\n');

	j = 0;
	
	if(datatype == "invrellist"){ // read off the top line
		idlist = lines[0].split(sep);
		ncol = 3;
		colname[0] = "x"; colname[1] = "y"; colname[2] = "Value";
		j++;
	}
	else{
		j = 0; 
		do{
			trr = lines[j].trim();
			j++;
			if(trr != "" && trr.substr(0,1) != "#"){
				spli = spl(trr,sep); //trr.split(sep);
				ncol = spli.length;
				for(i = 0; i < ncol; i++) colname[i] = spli[i];
				if(ncol < 2) return 1;
				break;
			}
		}while(j < lines.length);
	}
	if(j == lines.length) return 1;

	nrow = 0;
	do{
		trr = lines[j];
		if(trr != ""){
			spli = trr.split(sep); 
			for(i = 0; i < spli.length; i++) spli[i] = spli[i].trim();
		
			if(spli.length != ncol){ alertp("Column sizes do not match!"); return 1;}
			row[nrow]=[];
			for(i = 0; i < ncol; i++) row[nrow][i] = spli[i];
			nrow++;
		}
		j++;
	}while(j < lines.length);
	calcrowwidth();
	
	obsloaded = 1; 
	setcolumns();
	
	return 0;
}

function spl(inp,sep)
{
	if(sep == " "){
		var myRegexp = /[^\s"]+|"([^"]*)"/gi;
		var myArray = [];
		do{
			var match = myRegexp.exec(inp);
			if (match != null){	myArray.push(match[1] ? match[1] : match[0]);}
		}while(match != null);	
		return myArray;
	}
	return inp.split(sep);
}

function calcrowwidth()                                                                 // Calculates the widths for elements in a table
{
	var r;

	cv.font = tableheadfont;
	rowwidth=[];	
	for(r = 0; r < nrow; r++){
		rowwidth[r]=[];
		for(i = 0; i < ncol; i++) rowwidth[r][i] = Math.floor(cv.measureText(row[r][i]).width);	
	}
}

function dosort(i,type,op)                                                               // Sorts a column in a table
{
	var sor=[];

	for(j = 0; j < nrow; j++) sor[j] = {si:row[j][i],srow:row[j],swidth:rowwidth};
	
	if(type == "num") sor.sort(function(a, b){return a.si - b.si}); 
	else sor.sort(function(a, b){ return orderstring(a.si,b.si);});

	flag = 0;
	for(j = 0; j < nrow; j++){ if(row[j] != sor[j].srow){ flag = 1; row[j] = sor[j].srow; rowwidth[j] = sor[j].srowwidth;}}
		
	if(op == "swap" && flag == 0){      // If no change sorts in the reverse order 
		for(j = 0; j < nrow; j++){
			row[j] = sor[nrow-j-1].srow;
			rowwidth[j] = sor[nrow-j-1].srowwidth;
		}
	}
}

function movecol(fr,to)                                                                       // Moves a column in the table
{
	if(to == fr) return;
	if(to < fr){
		temp = colname[fr];
		for(i = fr; i > to; i--) colname[i] = colname[i-1];
		colname[to] = temp;
		
		for(j = 0; j < nrow; j++){
			temp = row[j][fr];
			tempw = rowwidth[j][fr];
			for(i = fr; i > to; i--){ row[j][i] = row[j][i-1]; rowwidth[j][i] = rowwidth[j][i-1];}
			row[j][to] = temp;
			rowwidth[j][to] = tempw;
		}		
	}
	else{
		temp = colname[fr];
		for(i = fr; i < to; i++) colname[i] = colname[i+1];
		colname[to] = temp;
		
		for(j = 0; j < nrow; j++){
			temp = row[j][fr];
			tempw = rowwidth[j][fr];
			for(i = fr; i < to; i++){
				row[j][i] = row[j][i+1];
				rowwidth[j][i] = rowwidth[j][i+1];
			}
			row[j][to] = temp;
			rowwidth[j][to] = tempw;
		}		
	}
	
	setcolumns();
}

function setcolumns()                                                                     // Sets the spacing for the columns in the table
{ 
	xx = 0;

	for(i = 0; i < ncol; i++){
		w = 0;
		
		cv.font = tableheadfont; 
		na = colname[i];
		ww = Math.floor(cv.measureText(na).width); if(ww > w) w = ww;
		
		cv.font = tablefont; 
		for(j = 0; j < nrow; j++){
			ww = rowwidth[j][i]; if(ww > w) w = ww;
		}
		w += 25;
		
		if(w < 100) w = 100;
		
		colx[i] = xx; colw[i] = w;
		
		xx += w;	
		if(i == ncoldef-1) xx += 50;
 
	}
	tottablewidth = xx;
}

function drawtable()                                                                             // Draws a table of data
{
	jmin = Math.floor(tableyfr*nrow); jmax = jmin+rowmax; if(jmax > nrow) jmax = nrow;
	off = Math.floor(tablexfr*tottablewidth);
	
	if(ncoldef == ncoldefmax) onlycol = 0; else onlycol = 1;
	
	if(onlycol == 1) fac = 0; else fac = 1;
	if(addingdata == 2) fac = 0;
	fac2 = fac;
	
	for(i = 0; i < ncol; i++){
		if(colx[i]-off < tablewidth && colx[i]+colw[i]-off > 0){
			if(i >= ncoldef) fac = 0;
			
			if(onlycol == 1){
				if(nrow >= rowmax) addcanbutton("",colx[i]-off,0,colw[i],tableheight,TABLECOLBUT,TABLECOLBUT,i,-1);
				else addcanbutton("",colx[i]-off,0,colw[i],(1+nrow)*tabledy+3,TABLECOLBUT,TABLECOLBUT,i,-1);
			}
			addcanbutton(colname[i],colx[i]-off,0,colw[i],fac2*tabledy,TABLEHEADBUT,TABLEHEADBUT,i,-1);
			//addcanbutton(colname[i],colx[i]-off,0,colw[i],tabledy,TABLEHEADBUT,TABLEHEADBUT,i,-1);

			for(j = jmin; j < jmax; j++){		
				if(addingdata == 3 && i == ncol-1 && datatemp.variety == "state"){
					addcanbutton(row[j][i],colx[i]-off,22+(j-jmin)*tabledy,colw[i],fac*tabledy,TABLEDROPBUT,TABLEDROPBUT,i,j);
				}
				else addcanbutton(row[j][i],colx[i]-off,22+(j-jmin)*tabledy,colw[i],fac*tabledy,TABLEBUT,TABLEBUT,i,j);		
			}
		}
	}
	
	addbutton("# Rows:"+(row.length),210,height-30,0,0,-1,STATBUT2,-1,-1);
	if(row.length > 0) addbutton("# Cols:"+(row[0].length),360,height-30,0,0,-1,STATBUT2,-1,-1);
}

function selectelement(r,i,bub)                                                            // Selects an element in the table
{
	if(selectbub != -1) buboff(1);
		
	off = Math.floor(tablexfr*tottablewidth);
	jmin = Math.floor(tableyfr*nrow);

	if(r-jmin > rowmax-1 || r-jmin < 0){
		if(r-jmin > rowmax-1) tableyfr = (r - (rowmax-5))/nrow;
		if(r-jmin < 0) tableyfr = (r - 5)/nrow;
		if(tableyfr < 0) tableyfr = 0;
		if(tableyfr > 1-tableyfrac) tableyfr = 1-tableyfrac;
		jmin = Math.floor(tableyfr*nrow);
	}
	
	selectbubx = colx[i]-off; selectbuby = 22+(r-jmin)*tabledy; selectbubdx = colw[i]; selectbubdy = tabledy;
	selectbub = bub;
	selectbubval = i;
	selectbubval2 = r;	
	buttoninit();
}

function selecthead(i,bub)                                                              // Select the head of a column
{
	off = Math.floor(tablexfr*tottablewidth);
	jmin = Math.floor(tableyfr*nrow);
	
	selectbubx = colx[i]-off; selectbuby = 1; selectbubdx = colw[i]; selectbubdy = tabledy;
	selectbub = bub;
	selectbubval = i;
	selectbubval2 = -1;	
}
 
 function selecttablecol(val)
 {
	movecol(val,ncoldef);
	tablehist.push({name:colname[ncoldef], val:val, ncoldef:ncoldef});

	if(ncoldef == 0){
		colname[0] = "ID";
	}
	if(ncoldef == 1){
		switch(datatype){
		case "state": case "diagtest":colname[1] = "Time"; break;
		case "ped": colname[1] = "Parent 1"; break;
		}
		
		/*
		case "entry": case "leave": colname[1] = "Time"; break; 
		case "trial": colname[1] = "Contact group"; break;
		case "snp": colname[1] = "Genotype"; break;
		case "fixed": colname[1] = "Fixed Effect"; break;
		*/
	}

	if(ncoldef == 2){
		switch(datatype){
		//case "state": colname[2] = "Disease status"; break;
		//case "diagtest": colname[2] = "Test result"; break;
		case "ped": colname[2] = "Parent 2"; break;	
		}
	}

	ncoldef++; setcolumns(); tablexfr = 0;
}
			
function loadsta()                                                                      // Starts loading a file
{
	startloading();
	ById("fileToLoad").click();	
}

function savesta()                                                                      // Starts saving a file
{
	startloading();
	ById("fileToSave").click();	
}

function loadfile()                                                                     // Loads a file
{
	var na = ById("fileToLoad").value, fna;	
	
	fileToLoad = ById("fileToLoad").files[0];
	fna = fileToLoad.name;
	if(fna.length > 4) fiformat = fna.substring(fna.length-4).toLowerCase(); else fiformat = "";
	
	if(!fileToLoad){ return;}

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){	
		newfile = 1;
		textFromFile = fileLoadedEvent.target.result;
		loadedfile();
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
	ById("fileToLoad").value="";
}

function loadedfile()
{
	switch(fitype){
	case OBSFILE: 
		res = loadobsfile(); 
		if(res == 0){
			datashow = "table";
			dataselected = data.length;
			addingdata = 1; 

			ncoldef = 0;
			switch(datatype){
			case "state":
				var pos=[]; if(modtype == SIR) pos = ["S","I","R","."]; else pos = ["S","I","."];
				datatemp = {variety:"state", name:"", enable:1, id:[], t:[], val:[], cl:0, tmin:0, tmax:0, pos:pos};
				ncoldefmax = 3;
				break;
			
			case "diagtest":
				datatemp = {variety:"diagtest", name:"", enable:1, id:[], t:[], val:[], cl:0, Se:0.5, Sp:0.95, sens:"I", tmin:0, tmax:0};
				ncoldefmax = 3;
				break;
				
			case "presence":
				datatemp = {variety:"presence", name:"", enable:1, id:[], t:[]};
				ncoldefmax = 2;
				break;
				
			case "infection":
				datatemp = {variety:"infection", name:"", enable:1, id:[], t:[], cl:0, tmin:0, tmax:0, pos:[], transi:"S", transf:"I"};
				ncoldefmax = 2;
				break;
		
			case "recovery":
				datatemp = {variety:"recovery", name:"", enable:1, id:[], t:[], cl:0, tmin:0, tmax:0, pos:[], transi:"I", transf:"R"};
				ncoldefmax = 2;
				break;
				
			case "entry":
				datatemp = {variety:"entry", name:"", enable:1, id:[], t:[], cl:0, tmin:0, tmax:0, pos:[]};
				ncoldefmax = 2;
				break;
				
			case "leave":
				datatemp = {variety:"leave", name:"", enable:1, id:[], t:[], cl:0, tmin:0, tmax:0, pos:[]};
				ncoldefmax = 2;
				break;
				
			case "trial":
				datatemp = {variety:"trial", name:"", enable:1, id:[], val:[]};
				ncoldefmax = 2;
				break;
			
			case "snp":
				datatemp = {variety:"snp", name:"", enable:1, id:[], val:[]};
				ncoldefmax = 2;
				break;
			
			case "fixed":
				datatemp = {variety:"fixed", name:"", enable:1, id:[], val:[]};
				ncoldefmax = 2;
				break;
				
			case "fixedcat":
				datatemp = {variety:"fixedcat", name:"", enable:1, id:[], val:[], posval:[], ref:""};
				ncoldefmax = 2;
				break;
				
			case "ped":
				datatemp = {variety:"ped", name:"", enable:1, id:[], par1:[], par2:[]};
				ncoldefmax = 3;
				break;
				
			case "rel":
				if(ncol != nrow){ alertp("Matrix not square!"); addingdata = 0; loading = 0; return;}
				datatemp = {variety:"rel", name:"", enable:1, id:[], mat:[]};
				ncoldef = ncol;
				ncoldefmax = ncol;
				break;
			
			case "invrel":
				if(ncol != nrow){ alertp("Matrix not square!"); addingdata = 0; loading = 0; return;}
				datatemp = {variety:"invrel", name:"", enable:1, id:[], mat:[]};
				ncoldef = ncol;
				ncoldefmax = ncol;
				break;
				
			case "invrellist":
				datatemp = {variety:"invrellist", name:"", enable:1, id:[], x:[], y:[], val:[]};
				ncoldef = 3;
				ncoldefmax = 3;
				break;
			}
		}
		break;
	
	case SIREFILE: res = load(); break;
	}

	loading = 0; 
	if(res == 1){ alertp("There was a problem loading this file"); return;}
	buttoninit();
}

function convertdates()                                                              // Converts dates into continuous time
{
	var format, nmonthdays =  new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	
	for(r = 0; r < nrow; r++){  // tries to work out format
		d = row[r][1].split(/[\/\-\.]/, 3);
		if(parseInt(d[0]) > 12){ format = 0; break;}
		if(parseInt(d[1]) > 12){ format = 1; break;}
	}
	if(r == nrow){ alertp("Could not establish format"); return;}
	
	for(r = 0; r < nrow; r++){
		d = getdate(row[r][1],format);
		
		if(d){
			beginyear = new Date(d.getFullYear(),0,1);
			endyear = new Date(d.getFullYear()+1,0,1);
			row[r][1] = d.getFullYear()+(d.getTime()-beginyear.getTime())/(endyear.getTime()-beginyear.getTime());
			row[r][1] = row[r][1].toFixed(3);
		}
	}
	setcolumns();
}

function dataname(val)
{
	switch(data[val].variety){
	case "state": return "Disease Status";
	case "diagtest": return "Diag. Test";
	case "infection": return "Infection Times";
	case "recovery": return "Recovery Times";
	case "presence": return "Presence";
	case "trial": return "Contact Group";
	case "snp": return "SNP"; 
	case "fixed": return "Covariate FE";
	case "fixedcat": return "Catergorical FE";
	case "ped": return "Pedegree"; 
	case "rel": return "Rel. Matrix";
	case "invrel": return "Inv. Rel. Matrix";
	case "invrellist": return "Inv. Rel. List";
	}
}

function getdate(mdy,format)                                                                   // Gets the date
{
	d = mdy.split(/[\/\-\.]/, 3);

	if (d.length != 3) return null;

	// Check if date is valid
	if(format == 0){ mon = parseInt(d[1]), day = parseInt(d[0]), year= parseInt(d[2]);}
	if(format == 1){ mon = parseInt(d[0]), day = parseInt(d[1]), year= parseInt(d[2]);}
	
	if (d[2].length == 2) year += 2000;
	if (day <= 31 && mon <= 12) return new Date(year, mon - 1, day);
	return null; 
}

function adddata()
{
	if(checkdata() == 0) return;
	
	tableyfr = 0;
	
	switch(datatemp.variety){
	case "state":
		datatemp.name = colname[2]; 
		datatemp.id=[];
		for(r = 0; r < nrow; r++){
			datatemp.id[r] = row[r][0];
			datatemp.t[r] = parseFloat(row[r][1]);
			datatemp.val[r] = row[r][2];
		}
		break;
	
	case "diagtest":
		datatemp.name = colname[2]; 
		datatemp.id=[];
		for(r = 0; r < nrow; r++){
			datatemp.id[r] = row[r][0];
			datatemp.t[r] = parseFloat(row[r][1]);
			datatemp.val[r] = row[r][2];
		}
		break;
		
	case "infection": case "recovery": case "entry": case "leave":
		datatemp.name = colname[1]; 
		datatemp.id=[];
		for(r = 0; r < nrow; r++){
			datatemp.id[r] = row[r][0];
			if(row[r][1] == "no") datatemp.t[r] = "no";
			else{
				if(row[r][1] == ".") datatemp.t[r] = ".";
				else datatemp.t[r] = parseFloat(row[r][1]);
			}
		}
		break;
		
	case "trial": case "snp": case "fixed": case "fixedcat":  
		datatemp.name = colname[1]; 
		datatemp.id=[];
		for(r = 0; r < nrow; r++){
			datatemp.id[r] = row[r][0];
			datatemp.val[r] = row[r][1];
		}
		break;
		
	case "ped":
		datatemp.name = "Pedigree"; 
		datatemp.id=[];
		for(r = 0; r < nrow; r++){
			datatemp.id[r] = row[r][0];
			datatemp.par1[r] = row[r][1];
			datatemp.par2[r] = row[r][2];
		}
		break;
		
	case "rel": case "invrel":
		datatemp.name = "Rel. mat."; 
		datatemp.id=[];
		
		for(j = 0; j < ncol; j++) datatemp.id[j] = colname[j];
		
		datatemp.mat=[];
		for(r = 0; r < nrow; r++){
			datatemp.mat[r]=[];
			for(j = 0; j < ncol; j++) datatemp.mat[r][j] = row[r][j];
		}
		break;
		
	case "invrellist":
		datatemp.name = "Inv. Rel. mat."; 
		datatemp.id=[]; for(j = 0; j < idlist.length; j++) datatemp.id[j] = idlist[j];
		
		datatemp.x=[]; datatemp.y=[]; datatemp.val=[];
		for(r = 0; r < nrow; r++){
			datatemp.x[r] = row[r][0]; datatemp.y[r] = row[r][1]; datatemp.val[r] = row[r][2];
		}
		break;
	}
	
	switch(datatemp.variety){
	case "state": case "diagtest": case "infection": case "recovery": case "entry": case "leave":
		tma = -large; tmi = large;
		for(r = 0; r < nrow; r++){ t = datatemp.t[r]; if(t < tmi) tmi = t; if(t > tma) tma = t;}
		datatemp.tmin = tmi; datatemp.tmax = tma; 
		break;
	}
	
	data[dataselected] = datatemp;
	converttoobs("data");
	addingdata = 0;
}

function reloaddata(val)                                                                   // Loads up a particular data item 
{
	datatemp = data[val];
	row = [];
	switch(datatemp.variety){
	default:
		nrow = datatemp.id.length;
		colname[0] = "ID";
		switch(datatemp.variety){
		case "state":
			ncol = 3;
			colname[1] = "Time";
			colname[2] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.t[r]; row[r][2] = datatemp.val[r];}
			break;
		
		case "diagtest":
			ncol = 3;
			colname[1] = "Time";
			colname[2] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.t[r]; row[r][2] = datatemp.val[r];}
			break;
			
		case "infection": case "recovery": case "entry": case "leave":
			ncol = 2;
			colname[1] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.t[r];}
			break;
			
		case "snp":
			ncol = 2;
			colname[1] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.val[r];}
			break;
			
		case "trial":
			ncol = 2;
			colname[1] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.val[r];}
			break;
		
		case "fixed":
			ncol = 2;
			colname[1] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.val[r];}
			break;
		
		case "fixedcat":
			ncol = 2;
			colname[1] = datatemp.name;
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.val[r];}
			break;
			
		case "ped":
			ncol = 3;
			colname[1] = "Parent 1"; colname[2] = "Parent 2";
			for(r = 0; r < nrow; r++){
				row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.par1[r]; row[r][2] = datatemp.par2[r];
			}
			break;
			
		case "presence":
			ncol = 2;
			colname[1] = "Time";
			for(r = 0; r < nrow; r++){ row[r]=[]; row[r][0] = datatemp.id[r]; row[r][1] = datatemp.t[r];}
			break;
			
		case "rel": case "invrel":
			ncol = nrow;
			for(j = 0; j < ncol; j++) colname[j] = datatemp.id[j];
			
			for(r = 0; r < nrow; r++){
				for(j = 0; j < ncol; j++) row[r][j] = datatemp.mat[r][j];
			}
			break;
		
		case "invrellist":
			ncol = 3; colname[0] = "x"; colname[1] = "y"; colname[2] = "Value"; 
			for(r = 0; r < nrow; r++){
				row[r]=[];
				row[r][0] = datatemp.x[r]; row[r][1] = datatemp.y[r]; row[r][2] = datatemp.val[r];
			}
			break;
		}
	}
	ncoldef = ncol; ncoldefmax = ncol;
	
	calcrowwidth();
	setcolumns();
	 
	dataselected = val;
	datashow = val2;
	addingdata = 2;
}

function checkdata()                                                                                        // Checks the data
{
	var rownew=[], rowwidthnew=[];

	if(datatemp.variety == "invrellist") return 1;
	
	if(datatemp.variety == "rel" || datatemp.variety == "invrel"){
		for(r = 0; r < nrow; r++){
			for(j = 0; j < ncol; j++){
				st = ""+row[r][j];
				if(isNaN(st)){ selectelement(r,j,NUMPROBBUB); return 0;}	
			}
		}
		return 1;
	}
	
	for(r = 0; r < nrow; r++){                                      // Checks times
		if(row[r][0] == ""){ selectelement(r,0,EMPTYBUB); return 0;}
		
		switch(datatemp.variety){
		case "state": case "diagtest": case "infection": case "recovery":  case "entry": case "leave": case "presence":
			st = ""+row[r][1];
			if(!((st == "no" || st == ".") && (datatemp.variety == "infection" || datatemp.variety == "recovery"))){
				if(st == ""){ selectelement(r,1,EMPTYBUB); return 0;}
				if(isNaN(st)){
					parts = st.split('/');
					if(parts.length == 3){ selectelement(r,1,CONVERTDATEBUB); return 0;}
					else{ selectelement(r,1,INFRECPROBBUB); return 0;}
				}
			}
			break;
		}

		switch(datatemp.variety){
		case "state":
			st = row[r][2];
			if(st != "." && st != "S" && st != "I" && !(modtype == SIR && st == "R")){ selectelement(r,0,STATEPROBBUB); return 0;}
			break;
		
		case "diagtest":
			st = row[r][2];
			if(st != "0" && st != "1" && st != "."){ selectelement(r,2,DIAGTESTPROBBUB); return 0;}
			break;
			
		case "trial":
			st = row[r][1];
			if(st == ""){ selectelement(r,1,EMPTYBUB); return 0;}
			break;
			
		case "snp":
			st = row[r][1];
			if(st != "AA" && st != "AB" && st != "BA" && st != "BB"){ selectelement(r,1,GENOTYPEBUB); return 0;}
			break;
		
		case "fixed":
			st = ""+row[r][1];
			if(isNaN(st)){ selectelement(r,1,NUMPROBBUB); return 0;}
			break;
		}
	}
		
	 // removes repeated records
	if(datatemp.variety == "state" || datatemp.variety == "diagtest" || datatemp.variety == "infection"
 	   || datatemp.variety == "recovery" ||  datatemp.variety == "presence" || datatemp.variety == "entry" || datatemp.variety == "leave"){
		dosort(1,"num");  
	}
	dosort(0,"alph"); 

	nrownew = 0;
	for(r = 0; r < nrow; r++){
		id = row[r][0]; 
		if(nrownew == 0 || row[r][0] != rownew[nrownew-1][0] || row[r][1] != rownew[nrownew-1][1] || 
		  (datatemp.variety == "state" && row[r][2] != rownew[nrownew-1][2]) ||
		  (datatemp.variety == "diagtest" && row[r][2] != rownew[nrownew-1][2])){
			rownew[nrownew] = row[r]; rowwidthnew[nrownew] = rowwidth[r]; nrownew++;
		}
		else{
			switch(datatemp.variety){
				case "state":
					if(row[r][0] == rownew[nrownew-1][0] && row[r][1] == rownew[nrownew-1][1] && row[r][2] != rownew[nrownew-1][2]){ 
						selectelement(r,0,MULTISTATEBUB); return 0;
					}
					break;
				
				case "diagtest":
					if(row[r][0] == rownew[nrownew-1][0] && row[r][1] == rownew[nrownew-1][1] && row[r][2] != rownew[nrownew-1][2]){ 
						selectelement(r,0,MULTISTATEBUB); return 0;
					}
					break;
					
				case "presence":
					if(row[r][0] == rownew[nrownew-1][0] && row[r][1] != rownew[nrownew-1][1]){ 
						selectelement(r,0,MULTISTATEBUB); return 0;
					}
					break;
					
				case "infection": case "recovery":
					break;
					
				case "entry": case "leave":
					break;
			}
			
		}
	}
	
	row = rownew; rowwidth = rowwidthnew; nrow = nrownew;
;
	return 1;
}

function converttoobs(ty)                                                         // Converts data sources into individual measurements
{
	var nindtotal, ind=[], i, j, first;
	var dat, probexp=[], nDT;

	da = data; tdatamin = large; tdatamax = -large;
	
	dataerror="";
	
	nindtotal = 0;
	ind=[];
	
	nDT = 0;
	
	fixeddata=[];
	for(d = 0; d < da.length; d++){
		dat = da[d];

		if(dat.variety == "fixedcat"){
			var posval=[];
			for(i = 0; i < dat.id.length; i++){
				val = dat.val[i];
				j = 0; while(j < posval.length && posval[j] != val) j++;
				if(j == posval.length) posval.push(val);
			}
			posval.sort(function(a, b){ return orderstring(a,b);});
			
			dat.posval = posval;
			if(posval.length > 0) dat.ref = posval[posval.length-1];
		}		
	
		switch(dat.variety){
		case "state": case "diagtest": case "infection": case "recovery": case "entry": case "leave": case "trial": 
		case "snp": case "fixed": case "fixedcat": case "ped":
		
			for(i = 0; i < dat.id.length; i++){
				id = dat.id[i]; 
				
				switch(dat.variety){
				case "state": case "diagtest": case "infection": case "recovery": case "entry": case "leave":
					if(dat.t[i] != "no" && dat.t[i] != "."){
						dat.t[i] = parseFloat(dat.t[i]);
						t = dat.t[i]; if(t < tdatamin) tdatamin = t; if(t > tdatamax) tdatamax = t;
					}
					else t = dat.t[i];
				}
				
				j = 0; while(j < nindtotal && ind[j].id != id) j++;	
				if(j == nindtotal){
					ind[nindtotal] = {id:id, ref:0, cl:[], trial:"", trialnum:0, snp:"", fixed:[], par1:"", par2:"", It:".", Rt:".", entry:"", leave:"", state:[], diagtest:[]};
					for(cl = 0; cl < ncla; cl++) ind[nindtotal].cl[cl] = {ev:[]};
					nindtotal++;
				}
		
				cl = dat.cl;
				
				switch(dat.variety){
				case "state":
					val = dat.val[i];
					if(val != "."){
						ind[j].state.push({val:val, t:t});
						
						p = 0; pmax = dat.pos.length; while(p < pmax && dat.pos[p] != val) p++;
						if(p == pmax){ alertp("Error EC4");}
				
						for(k = 0; k < cla[cl].ncomp; k++){
							if(p == 3) probexp[k] = "1";	
							else{
								if(k != p) probexp[k] = "0";
								else probexp[k] = "1";	
							}
						}
				
						k = 0; kmax = ind[j].cl[cl].ev.length; 
						while(k < kmax && (t > ind[j].cl[cl].ev[k].t || 
							(t == ind[j].cl[cl].ev[k].t && ind[j].cl[cl].ev[k].variety != "state"))) k++;
							
						if(k < kmax && t == ind[j].cl[cl].ev[k].t){  // multiple times
							alertp("Observation more than once");	
						}
				
						newev = {t:t, variety:"state", probexp:copy(probexp), desc:dataname(d), obsdata:d, obsdatai:i, col:[]};
						ind[j].cl[cl].ev.splice(k,0,newev);
					}
					break;
				
				case "diagtest":
					val = dat.val[i];
					if(val != "."){
						if(!ind[j].diagtest[nDT]) ind[j].diagtest[nDT]=[];
						ind[j].diagtest[nDT].push({val:val, t:t});
					
						k = 0; kmax = ind[j].cl[cl].ev.length; while(k < kmax && t > ind[j].cl[cl].ev[k].t) k++;
						newev = {t:t, variety:"diagtest", val:val, desc:dataname(d), obsdata:d, obsdatai:i, col:[], nDT:nDT};
						ind[j].cl[cl].ev.splice(k,0,newev);
					}
					break;
				
				case "infection":
				case "recovery":
					if(dat.variety == "infection"){
						if(ind[j].It != "."){
							dataerror="Error! The infection time for individual "+ind[j].id + " is set more than once.";
							alertp(dataerror);
							return;
						}
						ind[j].It = t;
					}
					else{
						if(ind[j].Rt != "."){
							dataerror="Error! The recovery time for individual "+ind[j].id + " is set more than once.";
							alertp(dataerror);
							return;
						}
						ind[j].Rt = t;
					}
					
					if(t != "no" && t != "."){
						k = 0; kmax = ind[j].cl[cl].ev.length; while(k < kmax && t > ind[j].cl[cl].ev[k].t) k++;
						if(k < kmax && t == ind[j].cl[cl].ev[k].t){ alertp("Same time error!"); return;}
						else{	
							newev = {t:t, variety:dat.variety, obsdata:d, obsdatai:i, desc:dataname(d), transi:dat.transi, transf:dat.transf, col:[]};
							ind[j].cl[cl].ev.splice(k,0,newev);
						}	
					}
					break;
					
				case "entry":
				case "leave":
					if(dat.variety == "entry") ind[j].entry = t;
					else ind[j].leave = t;
					break;
					
				case "trial":
					if(ind[j].trial != ""){
						dataerror="Error! The contact group for individual "+ind[j].id + " is set more than once.";
						alertp(dataerror);
						return;
					}
					ind[j].trial = dat.val[i];
					break;
					
				case "snp":
					if(ind[j].snp != ""){
						dataerror="Error! The SNP for individual "+ind[j].id + " is set more than once.";
						alertp(dataerror);
						return;
					}
					ind[j].snp = dat.val[i];
					break;
					
				case "fixed": case "fixedcat": ind[j].fixed[fixeddata.length] = dat.val[i]; break;
					
				case "ped": ind[j].par1 = dat.par1[i]; ind[j].par2 = dat.par2[i]; break;
				}
			}
			break;
		}
		if(dat.variety == "fixed" || dat.variety == "fixedcat") fixeddata.push(d);
		
		if(dat.variety == "diagtest") nDT++;
	}
	
	for(d = 0; d < da.length; d++){
		dat = da[d];
		if(dat.variety == "presence"){
			for(i = 0; i < dat.id.length; i++){
				id = dat.id[i];
				
				dat.t[i] = parseFloat(dat.t[i]);
				t = dat.t[i];
				if(t < tdatamin) tdatamin = t; if(t > tdatamax) tdatamax = t;
					
				j = 0; while(j < nindtotal && ind[j].id != id) j++;	
				if(j == nindtotal){
					ind[nindtotal] = {id:id, cl:[]};
					for(cl = 0; cl < ncla; cl++) ind[nindtotal].cl[cl] = {ev:[]};
					nindtotal++;
				}
				
				cl = 0;
				
				k = 0; kmax = ind[j].cl[cl].ev.length; 
				while(k < kmax && (t > ind[j].cl[cl].ev[k].t || 
					    (t == ind[j].cl[cl].ev[k].t && ind[j].cl[cl].ev[k].variety != "state"))) k++;
				if(k == kmax || t > ind[j].cl[cl].ev[k].t){ 
					newev = {t:t, variety:"presence", desc:dataname(d)};
					ind[j].cl[cl].ev.splice(k,0,newev);
				}		
			}				
		}
	}
	
	for(i = 0; i < nindtotal; i++){                                	// Works out colours
		for(cl = 0; cl < ncla; cl++){
			for(e = 0; e < ind[i].cl[cl].ev.length; e++){
				ev = ind[i].cl[cl].ev[e];
				switch(ev.variety){
				case "state":
					for(j = 0; j < cla[cl].ncomp; j++){ if(ev.probexp[j] != "0") ev.col.push(j);}
					break;
					
				case "infection": case "recovery":
					for(j = 0; j < cla[cl].ncomp; j++) if(cla[cl].comp[j].name == ev.transi){ ev.col.push(j); break;}
					if(j == cla[cl].ncomp) alertp("Error EC1");
					for(j = 0; j < cla[cl].ncomp; j++) if(cla[cl].comp[j].name == ev.transf){ ev.col.push(j); break;}
					if(j == cla[cl].ncomp) alertp("Error EC2");
					break;
					
				case "diagtest":
					break;
				}
			}			
		}
	}
	
	var indlist=[]; for(i = 0; i < nindtotal; i++) indlist.push(ind[i].id);
	datares={ indlist:indlist, tmin:tdatamin, tmax:tdatamax};
	
	inddata = {nindtotal:nindtotal, ind:ind};
	dt = tdatamax-tdatamin;
	
	triallist=[];
	if(isdata("trial") > 0){
		N = inddata.nindtotal;
		for(i = 0; i < N; i++){
			stt = inddata.ind[i].trial; j = 0; while(j < triallist.length && stt != triallist[j]) j++;
			if(j == triallist.length) triallist.push(stt);
		}
		triallist.sort(function(a, b){ return orderstring(a,b);});
			
		for(i = 0; i < N; i++){
			stt = inddata.ind[i].trial; j = 0; while(j < triallist.length && stt != triallist[j]) j++;
			if(j == triallist.length) alertp("Error EC3");
			inddata.ind[i].trialnum = (j+1);
		}
	}
	else triallist.push("Contact group");
	
	collectvariables();
}

function drawdata()                                                                               // Draws the data sources table
{
	var x, y, d;
	x = 0; y = 1;
	
	nob = 0;
	addob(x,y,OBDATAHEAD); y += 40;
	for(d = 0; d < data.length; d++){ addob(x,y,OBDATA,d); y += 45;}
	ytot = y;
	
	placeob();	
}

function indzoom(x,fac)                                                                          // Zooms in on a particular individual
{
	if(xaxisauto == 1){ xaxisfixmin = axxmin; xaxisfixmax = axxmax; xaxisauto = 0;}
				
	xaxisfixmin = parseFloat(xaxisfixmin);
	xaxisfixmax = parseFloat(xaxisfixmax);
	d = xaxisfixmax - xaxisfixmin;
	mid = xaxisfixmin + d*x/tablewidth;
	xaxisfixmin = mid - d*fac/2;
	xaxisfixmax = mid + d*fac/2;
	buttoninit();
}

function drawinddata()                                                                           // Draws individual data
{
	var x, y, dy, imin, imax, n;

	dy = 55;
	n = isdata("diagtest"); if(n > 1) dy += 14*(n-1);
	
	if(xaxisauto == 1){
		if(page == DATAPAGE){ tlinetmin = tdatamin; tlinetmax = tdatamax;}
		else{
			if(groupsel == "All"){
				tlinetmin = infres.tmin; tlinetmax = infres.tmax; 
			}
			else{
				z = 0; while(z < infres.triallist.length && infres.triallist[z] != groupsel) z++;
				if(z == infres.triallist.length) alertp("Error EC6");
				tlinetmin = infres.trialtmin[z]; linetmax = infres.trialtmax[z];
			}
		}
		
		axxmin = tlinetmin-0.000001; axxmax = tlinetmax+0.0000001;	
	}
	else{ axxmin = xaxisfixmin; axxmax = xaxisfixmax; }

	nind = 0;
	var indlist=[];
	if(page == DATAPAGE){
		for(i = 0; i < inddata.nindtotal; i++){
			if(groupsel == "All" || groupsel == inddata.ind[i].trial){ indlist.push(i); nind++;}
		}
	}
	else{
		for(i = 0; i < infres.nindmax; i++){
			if(groupsel == "All" || groupsel == infres.inddata.ind[i].trial){ indlist.push(i); nind++;}
		}
	}
	
	nob = 0;
	
	ytot = dy*nind;
	
	ysh = Math.floor(tableyfr*ytot);
	imin = Math.floor(ysh/dy);
	imax = Math.floor((ysh+indtableheight)/dy)+1; if(imax > nind) imax = nind;
	
	x = 0; y = imin*dy;
	for(i = imin; i < imax; i++){ addob(x,y,OBIND,indlist[i]); y += dy;}

	placeob();			
	
	addcanbutton("",0,indtableheight,tablewidth,indtablemar,-1,WHITERECTBUT,-1,-1);
	addcanbutton("",tlinexmin,indtableheight+20,tlinexmax-tlinexmin,30,-1,ARROWBUT,-1,-1);
	addcanbutton("X ticks",tlinexmin,indtableheight+20,tlinexmax-tlinexmin,30,XTICKBUT,XTICKBUT,-1,-1);
	addcanbutton("Time",tlinexmin,indtableheight+20+30,tlinexmax-tlinexmin,30,-1,XLABELBUT,-1,-1);
	
	xx = indtablewidth-30; yy = indtableheight+60; dx = 22; dy = 26; dd = 3;
	addcanbutton("",xx+dd,yy-dy/2,dx,dy,ZOOMINBUT,ZOOMINBUT,UP,-1);
	addcanbutton("",xx-dd-dx,yy-dy/2,dx,dy,ZOOMOUTBUT,ZOOMOUTBUT,UP,-1); 	
	
	if(page == RUNPAGE) addcanbutton("Reload",14,indtableheight+20+20,20,20,RELOADBUT2,RELOADBUT2,-1,-1); 
}

function getnind()                                                                       // Gets the number of individuals
{
	var nind;
	if(page == DATAPAGE) nind = inddata.nindtotal; else nind = infres.nindmax; 
	return nind;
}

function dosearch()                                                                      // Does a search on the table
{
	var frag=[], fragsum=[], st;
	
	col = selectbubval;

	frag = searchterm.split("*");
	searchres=[];
	if(frag.length == 1){  // simple search
		for(r = 0; r < nrow; r++){
			st = ""+row[r][col].trim(); 
			if(st.toLowerCase() == searchterm.toLowerCase()) searchres.push(r);
		}
	}
	else{
		sum = 0; for(j = 0; j < frag.length; j++){ fragsum[j] = sum; sum += frag[j].length;}
		for(j = 0; j < frag.length; j++) fragsum[j] -= sum;
		
		for(r = 0; r < nrow; r++){
			st = ""+row[r][col].trim();; 
	
			len = st.length;
			if(len >= sum){
				k = 0;
				for(j = 0; j < frag.length; j++){
					len2 = frag[j].length;
					if(j == 0){ k = 0; kmax = 1;}
					else{
						if(j == frag.length-1){ k = len-len2; kmax = k+1;}
						else kmax = len+fragsum[j];
					}
				
					while(k < kmax && st.substr(k,len2) != frag[j]) k++;
					if(k == kmax) break;
					k += len2;
				}
				if(j == frag.length) searchres.push(r);
			}
		}	
	}
	
	if(searchres.length == 0){
		for(i = 0; i < ncanbut; i++) if(canbuttype[i] == TABLEHEADBUT && canbutval[i] == selectbubval) break;
		if(i == ncanbut) alertp("Error EC7");
		selbut(i);
		selectbub = SEARCHBUB; errmsg = "Sorry no results";
		buttoninit();
	}
	else{
		jmin = Math.floor(tableyfr*nrow);
		searchresnum = 0; while(searchresnum < searchres.length && searchres[searchresnum] < jmin) searchresnum++;
		if(searchresnum == searchres.length) searchresnum = 0;
		
		selectelement(searchres[searchresnum],selectbubval,SEARCHRESBUB);
	}
}

function doreplace()                                                                   // Replaces elements on a table
{
	var frag=[], fragsum=[], fragrep=[], st, kst=[];
	
	rowcopy = copy(row);
	
	col = selectbubval;
	
	nreplace = 0;
	frag = searchterm.split("*");

	if(frag.length == 1){  // simple replace
		for(r = 0; r < nrow; r++){
			st = ""+row[r][col].trim(); 
			if(st.toLowerCase() == searchterm.toLowerCase()){ row[r][col] = replaceterm; nreplace++;}
		}
	}
	else{
		fragrep = replaceterm.split("*");
	
		if(fragrep.length != frag.length){ errmsg = "Must have same number of wildcards."; return;}
	
		sum = 0; for(j = 0; j < frag.length; j++){ fragsum[j] = sum; sum += frag[j].length;}
		for(j = 0; j < frag.length; j++) fragsum[j] -= sum;
		
		for(r = 0; r < nrow; r++){
			st = ""+row[r][col].trim();
	
			len = st.length;
			if(len >= sum){
				k = 0;
				for(j = 0; j < frag.length; j++){
					len2 = frag[j].length;
					if(j == 0){ k = 0; kmax = 1;}
					else{
						if(j == frag.length-1){ k = len-len2; kmax = k+1;}
						else kmax = len+fragsum[j];
					}
				
					while(k < kmax && st.substr(k,len2) != frag[j]) k++;
					if(k == kmax) break;
					kst.push(k);
					k += len2;
				}
				if(j == frag.length){
					for(j = frag.length-1; j >= 0; j--){
						st = st.substr(0,kst[j])+fragrep[j]+st.substring(kst[j]+frag[j].length);
					}
					row[r][col] =  st; nreplace++;
				}
			}
		}	
	}
	
	if(nreplace == 0) errmsg = "Could not find";
	else{
		calcrowwidth(); setcolumns();
		for(i = 0; i < ncanbut; i++) if(canbuttype[i] == TABLEHEADBUT && canbutval[i] == selectbubval) break;
		if(i == ncanbut) alertp("Error EC8");
		selbut(i);
		selectbub = REPLACEDONEBUB;
	}
	buttoninit();
}

function dodelrows()                                                                        // Deletes rows on a table
{
	var frag=[], fragsum=[], st;
	
	searchterm = ById("inp").value;
	
	rowcopy = copy(row);
	
	col = selectbubval;
	
	ndel = 0;
	frag = searchterm.split("*");

	if(frag.length == 1){  // simple replace
		for(r = nrow-1; r >= 0; r--){
			st = ""+row[r][col].trim(); 
			if(st.toLowerCase() == searchterm.toLowerCase()){ row.splice(r,1); rowwidth.splice(r,1); nrow--; ndel++;}
		}
	}
	else{
		sum = 0; for(j = 0; j < frag.length; j++){ fragsum[j] = sum; sum += frag[j].length;}
		for(j = 0; j < frag.length; j++) fragsum[j] -= sum;
		
		for(r = nrow-1; r >= 0; r--){
			st = ""+row[r][col].trim();
	
			len = st.length;
			if(len >= sum){
				k = 0;
				for(j = 0; j < frag.length; j++){
					len2 = frag[j].length;
					if(j == 0){ k = 0; kmax = 1;}
					else{
						if(j == frag.length-1){ k = len-len2; kmax = k+1;}
						else kmax = len+fragsum[j];
					}
				
					while(k < kmax && st.substr(k,len2) != frag[j]) k++;
					if(k == kmax) break;
					kst.push(k);
					k += len2;
				}
				if(j == frag.length){ row.splice(r,1); rowwidth.splice(r,1); nrow--; ndel++;}
			}
		}	
	}
	
	if(ndel == 0) errmsg = "Could not find";
	else{
		calcrowwidth(); setcolumns();
		for(i = 0; i < ncanbut; i++) if(canbuttype[i] == TABLEHEADBUT && canbutval[i] == selectbubval) break;
		if(i == ncanbut) alertp("Error EC9");
		selbut(i);
		selectbub = DELROWSDONEBUB;
	}
	buttoninit();
}
