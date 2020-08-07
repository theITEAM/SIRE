/* The prior page */

function priorbuts()                                                                         // Draw prior page                      
{
	x = menux+tab; y = 30;
	
	collectvariables();
	
	addbutton("Priors",x,y,0,0,-1,TITLEBUT,12,-1); y += 50;
	
	addbutton("Priors are specified for each of the model parameters. The default choices are largely uninformative and appriopriate for most analyses. Fixing parameters is also a means of altering the model.",x+20,y,800,0,-1,PARAGRAPHBUT,1,-1);

	y += 60;
	
	addbutton("Name",x+20,y,100,0,-1,PRHEADBUT,-1,-1);
	addbutton("Prior",x+180,y,100,0,-1,PRHEADBUT,-1,-1);
	addbutton("Defining quantities",x+370,y,100,0,-1,PRHEADBUT,-1,-1);
	y += 30;
	
	cornx = x+20, corny = y;
	addbutton("",cornx,corny,tablewidth,priorheight,CANVASBUT,CANVASBUT,-1,-1);
	drawpriors();

	tableyfrac = priorheight/ytot;
	if(tableyfrac < 1) addbutton("",menux+tab+20+tablewidth+10,y,13,priorheight,SLIDEAC,YSLIDEBUT,-1,-1);
	
	addbutton("Next",width-105,height-40,90,30,NEXTBUT,NEXTBUT,0,-1);
}

function checkprior()                                                                         // Checks the values in the priors
{
	var p, val1, val2, fl;

	for(p = 0; p < param.length; p++){
		fl = 0;
		if(param[p].val[0].length == 0){ changepage(PRIORPAGE,0); alertp2("Prior not set for "+param[p].name+"."); return 1;}
		
		val1 = parseFloat(param[p].val[0]); if(isNaN(val1)) fl = 1;

		if(param[p].val[1]){
			if(param[p].val[1].length == 0){ changepage(PRIORPAGE,0); alertp2("Prior not set for "+param[p].name+"."); return 1;}
			if(param[p].val[1] == "∞") val2 = large; else{ val2 = parseFloat(param[p].val[1]); if(isNaN(val2)) fl = 1;}
		}
		
		switch(param[p].prior){
		case "Flat":
			if(val1 >= val2){
				changepage(PRIORPAGE,0);
				alertp("For "+param[p].name+" the maximum must be larger than the minimum.");					
				return 1;
			}
			if(val1 < 0 && param[p].defval[0] >= 0){
				changepage(PRIORPAGE,0);
				alertp(param[p].name+" is strictly positive.");					
				return 1;
			}
			break;
			
		case "Gamma":
			if(val1 <= 0){
				changepage(PRIORPAGE,0);
				alertp("For "+param[p].name+" the mean must be greater than zero.");					
				return 1;
			}

			if(val2 <= 0){
				changepage(PRIORPAGE,0);
				alertp("For "+param[p].name+" the variance must be greater than zero.");					
				return 1;
			}
			break;
	
		case "Normal": case "Log-Normal":
			if(val2 <= 0){
				changepage(PRIORPAGE,0);
				alertp("For "+param[p].name+" the variance must be greater than zero.");					
				return 1;
			}
			break;
			
		case "Fix":
			if(val1 <= 0 && param[p].defval[0] >= 0){
				changepage(PRIORPAGE,0);
				alertp(param[p].name+" is strictly positive.");					
				return 1;
			}
			break;
		}
	}
	return 0;
}

function drawpriors()                                                                                // Draws the prior buttons
{
	var x, y;
	
	x = 0; y = 8; nob = 0;
	
	for(p = 0; p < param.length; p++){ addob(x,y,OBPRIOR,p); y += priordy;}

	ytot = y;
	
	placeob();	
}

function isdata(ty)                                                                   // Determines the number of a particular type of data
{
	var d, num = 0;
	for(d = 0; d < data.length; d++) if(data[d].variety == ty && data[d].enable == 1) num++;
	return num;
}

function existdata(ty)                                                                   // Determines if data exits
{
	var d;
	for(d = 0; d < data.length; d++) if(data[d].variety == ty) return 1;
	return 0;
}

function collectvariables()                                                           // Collects together all the variables in the model
{
	var cl, i, n, d;

	paramnew = [];
	addvar("Parameter","β","This parameter gives the population average contact rate.",0,"∞");
	if(modtype == SIR){
		addvar("Parameter","γ","This parameter gives the population average recovery rate.",0,"∞");
		addvar("Parameter","R_0","This parameter gives the basic reproductive ratio defined by β(<N>-1)/γ, where <N> is the average contact group size.",0,20);
		addvar("Parameter","k","This parameter gives the shape parameter that characterises the gamma distributed infection duration.",1,10);
	}
	
	if(isdata("snp") == 1){
		addvar("Parameter","a_g","This parameter gives the fractional change in susceptibility coming from an A allele compared to a B allele.",-2.3,2.3);
		addvar("Parameter","a_f","This parameter gives the fractional change in infectivity coming from an A allele compared to a B allele.",-2.3,2.3);
		if(modtype == SIR) addvar("Parameter","a_r","This parameter gives the fractional change in recoverability coming from an A allele compared to a B allele.",-2.3,2.3);
		if(domon == 1){
			addvar("Parameter","Δ_g","This parameter gives the scaled dominance factor for the susceptibility SNP effect (1 when A is completely dominant over B).",-1,1);
			addvar("Parameter","Δ_f","This parameter gives the scaled dominance factor for the infectivity SNP effect (1 when A is completely dominant over B).",-1,1);
			if(modtype == SIR) addvar("Parameter","Δ_r","This parameter gives the scaled dominance factor for the recoverbility SNP effect (1 when A is completely dominant over B).",-1,1);
		}
	}
	
	if(geon == 1 && isdata("trial") == 1){
		addvar("Parameter","G","This parameter gives the fractional difference in transmission rate for the specified group.",-2.3,2.3);
		addvar("Parameter","σ_G","This parameter gives the standard deviation in group effects.",0.01,3);
	}
	
	if(envon == 1){
		if(isdata("ped")+isdata("rel")+isdata("invrel") > 0){
			addvar("Parameter","q_g","",-2.3,2.3);
			addvar("Parameter","q_f","",-2.3,2.3);
			if(modtype == SIR) addvar("Parameter","q_r","",-2.3,2.3);
			
			addvar("Parameter","Ω_gg","",0.01,4);
			addvar("Parameter","Ω_ff","",0.01,4);
			if(modtype == SIR) addvar("Parameter","Ω_rr","",0.01,4);
		}
		
		addvar("Parameter","ε_g","This parameter gives the residual contribution to the fractional change in susceptibility (that is individual-based variation over and above that coming from the SNP and fixed effects).",-3.45,3.45);
		addvar("Parameter","ε_f","This parameter gives the residual contribution to the fractional change in infectivity (that is individual-based variation over and above that coming from the SNP and fixed effects).",-3.45,3.45);
		if(modtype == SIR) addvar("Parameter","ε_r","This parameter gives the residual contribution to the fractional change in recoverability (that is individual-based variation over and above that coming from the SNP and fixed effects).",-3.45,3.45);
		
		addvar("Parameter","Σ_gg","This parameter gives the gg element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).",0.01,4);
		addvar("Parameter","Σ_ff","This parameter gives the ff element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).",0.01,4);
		if(modtype == SIR) addvar("Parameter","Σ_rr","This parameter gives the rr element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).",0.01,4);
		
		addvar("Parameter","Σ_gf","This parameter gives the gf element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).","-∞","∞");
		if(modtype == SIR){
			addvar("Parameter","Σ_gr","This parameter gives the gr element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).","-∞","∞");
			addvar("Parameter","Σ_fr","This parameter gives the fr element of the 3x3 covariance matrix for residual contributions. This accounts for potential correlations between traits (e.g. more susceptible individuals may also be more infectious).","-∞","∞");
		}		
	}
	
	var col = 0;
	for(f = 0; f < fixeddata.length; f++){
		d = fixeddata[f];
		if(data[d].enable == 1){
			switch(data[d].variety){
			case "fixed":
				var min = large, max = -large;
				for(i = 0; i < data[d].val.length; i++){
					if(data[d].val[i] < min) min = data[d].val[i];
					if(data[d].val[i] > max) max = data[d].val[i];
				}
				var dif = (max-min); if(dif == 0) dif = 1;
				var bo = (2.3/dif).toPrecision(3)
				addvar("Parameter","b_g,"+repspace(data[d].name),"This parameter gives the slope between the fractional change in suscepbility and "+data[d].name+".",-bo,bo,col);
				addvar("Parameter","b_f,"+repspace(data[d].name),"This parameter gives the slope between the fractional change in infectivity and "+data[d].name+".",-bo,bo,col);
				if(modtype == SIR) addvar("Parameter","b_r,"+data[d].name,"This parameter gives the slope between the fractional change in recoverability and "+repspace(data[d].name)+".",-bo,bo,col);
				col++;
				break;
				
			case "fixedcat":
				for(j = 0; j < data[d].posval.length; j++){
					if(data[d].posval[j] != data[d].ref){
						addvar("Parameter","b_g,"+repspace(data[d].posval[j]),"This parameter gives the fractional change in suscepbility for "+data[d].name+"="+data[d].posval[j]+" compared to "+data[d].name+"="+data[d].ref+".",-2.3,2.3,col);
						addvar("Parameter","b_f,"+repspace(data[d].posval[j]),"This parameter gives the fractional change in infectivity for "+data[d].name+"="+data[d].posval[j]+" compared to "+data[d].ref+".",-2.3,2.3,col);
						if(modtype == SIR) addvar("Parameter","b_r,"+repspace(data[d].posval[j]),"This parameter gives the fractional change in recoverability for "+data[d].name+"="+data[d].posval[j]+" compared to "+data[d].ref+".",-2.3,2.3,col);
						col++;
					}
				}
				break;
			}
		}
	}
	param = copy(paramnew);
}

function repspace(st){ return st.replace(/ /g,"-");}

function addvar(clname,st,desc,min,max,col)                                                              // Adds a variables to the model
{
	if(desc.substr(0,15) == "This parameter ") desc = st+" "+desc.substring(15); 
	
	v = 0; while(v < param.length && param[v].name != st) v++;
	if(v == param.length){
		paramnew.push({name:st, classname:clname, prior:"Flat", desc:desc, val:[min,max], defval:[min,max], col:col});
	}
	else{
		if(param[v].defval[0] != min || param[v].defval[1] != max){
			if(param[v].val[0] == param[v].defval[0] && param[v].val[1] == param[v].defval[1]){
				param[v].val[0] = min; param[v].val[1] = max; 
			}
			param[v].defval[0] = min; param[v].defval[1] = max; 
		}
		param[v].col = col;
		
		paramnew.push(param[v]);
	}
}

function copy(inp){ return JSON.parse(JSON.stringify(inp));}                                          // Copies an object

function findparam(na)                                                                                // Finds a paramter from a name
{
	var vpri, dep=[], p, k, kk, cl, clname;

	for(p = 0; p < infres.param.length; p++){
		if(infres.param[p].name == na) return p;
	}
	return infres.param.length;
}
