function descbuts()
{
	x = menux+tab; y = 30;
	addbutton("Description",x,y,0,0,-1,TITLEBUT,27,-1); y += 50;
	addbutton("",x+20,y,tablewidthdesc,tableheightdesc,CANVASBUT,CANVASBUT,-1,-1);
	
	drawdesc();
	
	tableyfrac = tableheightdesc/ytot;
	if(tableyfrac < 1) addbutton("",menux+tab+20+tablewidthdata+10,y,13,tableheightdesc,SLIDEAC,YSLIDEBUT,-1,-1);
	
	addbutton("Edit",width-205,height-40,90,30,EDITDESCAC,ADDDATABUT,0,-1);
	addbutton("Next",width-105,height-40,90,30,NEXTBUT,NEXTBUT,0,-1);
}
	 
function drawdesc()
{
	var x, y, j;
	x = 0; y = 1;
	
	nob = 0;
	dx = width-menux-80;
	
	if(datanote == "") datanote = "Click here to place a comment about the data/analysis (optional).";
	
	var splw = datanote.split('\n');
	j = 0;
	while(j < splw.length){
		splw[j] = splw[j].trim();
		if(splw[j].length == 0) splw.splice(j,1);
		else j++;
	}		

	for(j = 0; j < splw.length; j++){
		if(j == 0){
			alignparagraph(splw[j],dx-10,"bold 18px arial");
			addob(x+5,y,OBSPEECH3,dx,nlines*23+5,splw[j]);
		}
		else{
			alignparagraph(splw[j],dx-10);
			addob(x+5,y,OBSPEECH,dx,nlines*23+5,splw[j]);
		}
		y += nlines*23+10;
	}
	addob(x,1,OBSPEECH2,dx,y);
	y += 10;
	
	ytot = y;
	
	placeob();
}