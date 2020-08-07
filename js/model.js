function modelbuts()                                                                                 // Draws the model page
{
	var x, y;
	
	x = menux+tab; y = 30;
 
	addbutton("Model",x,y,0,0,-1,TITLEBUT,32,-1); y += 50;

	addbutton("Select model type",x+25,y,150,0,-1,SUBTEXTBUT,-1,-1); y += 30;
	
	addbutton(" ",x+30,y+10,20,15,RADIOBUT,RADIOBUT,0,RADIOMOD); addbutton("",x+55,y-5,229,45,MODBUT,MODBUT,0,-1);
	addbutton(" ",x+400,y+10,20,15,RADIOBUT,RADIOBUT,1,RADIOMOD); addbutton("",x+425,y-5,141,45,MODBUT,MODBUT,1,-1);
	y += 50;
	
	addbutton("This choice is dependent on whether individuals recover or not for the particular disease under analysis.",x+20,y,width-350,0,-1,PARAGRAPHBUT,1,-1);
	
	y += 80;
	xx = 600; dy = 38;

	if(existdata("snp") == 1){
		addbutton("Include SNP effect?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1);
		for(d = 0; d < data.length; d++){ if(data[d].variety == "snp") break;}
		addbutton("Yes",xx+30,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
		addbutton("No",xx+100,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
		y += dy;
		
		if(data[d].enable == 1){
			addbutton("Include dominance?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1);
			addbutton("Yes",xx+30,y,60,15,RADIOBUT,RADIOBUT,1,RADIODOM);
			addbutton("No",xx+100,y,60,15,RADIOBUT,RADIOBUT,0,RADIODOM);
			y += dy;
		}
	}
	
	for(d = 0; d < data.length; d++){ 
		if(data[d].variety == "fixed"){
			addbutton("Include covariate '"+data[d].name+"'?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1);
			addbutton("Yes",xx+30,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
			addbutton("No",xx+100,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
			y += dy;
		}
	}
	
	for(d = 0; d < data.length; d++){ 
		if(data[d].variety == "fixedcat"){
			addbutton("Include categorical '"+data[d].name+"'?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1);
			addbutton("Yes",xx+30,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
			addbutton("No",xx+100,y,60,15,RADIOBUT,RADIOBUT,d,RADIOENABLE);
			if(data[d].enable == 1){
				addbutton("Reference",xx+160,y-3,width-350,0,-1,PARAGRAPHBUT,-1,-1);
				gdropinfo.push({val:data[d].ref, x:xx+250, y:y, dx:120, dy:20, style:1, options:data[d].posval, d:d, click:"refcat"});
			}
			y += dy;
		}
	}
	
	addbutton("Include residual variation in traits?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1)
	addbutton("Yes",xx+30,y,70,15,RADIOBUT,RADIOBUT,1,RADIOENV);
	addbutton("No",xx+100,y,70,15,RADIOBUT,RADIOBUT,0,RADIOENV);
	y += dy;

	if(isdata("trial") == 1){
		addbutton("Include random group effect?",x+25,y+3,500,0,-1,SUBTEXTBUT,-1,-1);
		addbutton("Yes",xx+30,y,60,15,RADIOBUT,RADIOBUT,1,RADIOGE);
		addbutton("No",xx+100,y,60,15,RADIOBUT,RADIOBUT,0,RADIOGE);
		y += dy;
	}
	
	addbutton("Next",width-105,height-40,90,30,NEXTBUT,NEXTBUT,0,-1);
}