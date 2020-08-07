/* The home page */

function homebuts()                                                                             // The buttons for the home page
{
	x = menux+tab; y = 30;
 
	addbutton("About",x,y,0,0,-1,TITLEBUT,-1,-1); y += 35;

	addbutton("",x+width-300,y,99,99,NEWMODBUT,NEWMODBUT,-1,-1);
	
	addbutton("SIRE stands for 'Susceptibility Infectivity and Recoverability Estimation'. This software facilates estimation of these epidemiolgical traits from individual-based data.",x+20,y,width-340,0,-1,PARAGRAPHBUT,1,-1);

	y = 115;
	addbutton("To start SIRE begin a new analysis (right), load an existing analysis (top right) or try one of the examples below. Note, help is provided by clicking on the [?] icons.",x+20,y,width-350,0,-1,PARAGRAPHBUT,1,-1);

	y = 175;
	addbutton("Documentation",x,y,0,0,-1,TITLEBUT,-1,-1); y += 35;
	addbutton("",x+width-280,y,79,79,PDFBUT,PDFBUT,-1,-1);
	addbutton("",x+width-370,y,79,79,PDFBUT2,PDFBUT2,-1,-1);
	
	addbutton("A description of how to use this software is provided in the attached manual. Further details of the methodology, along with an empirical study, are given in a paper hosted on bioRxiv.",x+20,y,width-400,0,-1,PARAGRAPHBUT,1,-1);

	y = 295;
	addbutton("Examples",x,y,0,0,-1,TITLEBUT,10,-1); y += 35;

	addbutton("The current version of SIRE supports both the SIR and SI disease transmission models. The following examples illustrate how different data types can be used to inform model parameters:",x+20,y,width-200,0,-1,PARAGRAPHBUT,1,-1);
	y += 60;

	cornx = x+20, corny = y;
	exampwidth = width-230;
	addbutton("",cornx,corny,exampwidth,exampheight,CANVASBUT,CANVASBUT,-1,-1);
	
	drawexample();
	
	tableyfrac = exampheight/ytot;
	if(tableyfrac < 1) addbutton("",menux+tab+20+exampwidth+10,y,13,exampheight,SLIDEAC,YSLIDEBUT,-1,-1);
}

function drawexample()                                                                         // Draws the examples on the home page
{
	var x, y;
	
	x = 0; y = 6; nob = 0;
	
	xx = x + Math.floor(exampwidth*0.45);
	xxx = Math.floor(exampwidth*0.25)-180;
	
	yst = y;
	addob(xx,y,OBEXAMP,"EX 1: Known infection and recovery times","Example 1"); y += 25;
	addob(xx,y,OBEXAMP,"EX 2: Staggered contact group timings","Example 2"); y += 25;
	addob(xx,y,OBEXAMP,"EX 3: Known recovery times","Example 3"); y += 25;
	addob(xx,y,OBEXAMP,"EX 4: Disease transmission experiment","Example 4"); y += 25;
	addob(xx,y,OBEXAMP,"EX 5: Known infection times","Example 5"); y += 25;
	addob(xx,y,OBEXAMP,"EX 6: Periodic disease status checks with perfect test","Example 6"); y += 25;
	addob(xx,y,OBEXAMP,"EX 7: Imperfect disease diagnostic test results","Example 7"); y += 25;
	addob(xx,y,OBEXAMP,"EX 8: Two diagnostic tests sensitive to I and I+R","Example 8"); y += 25;
	addob(xx,y,OBEXAMP,"EX 9: Time censoring end of epidemics","Example 9"); y += 25;
	addob(xx,y,OBEXAMP,"EX 10: Time censoring beginning of epidemics","Example 10"); y += 25;
	
	addob(xx-20,yst,OBBRACKET,y-yst);
	addob(xxx,Math.floor((y+yst)/2 - 22),OBEXAMPPIC,0,"SIR model",20);
	
	y += 20;
	
	yst = y;
	addob(xx,y,OBEXAMP,"EX 11: Known infection times","Example 11"); y += 25;
	addob(xx,y,OBEXAMP,"EX 12: Staggered contact group timings","Example 12"); y += 25;
	addob(xx,y,OBEXAMP,"EX 13: Periodic disease status checks with perfect test","Example 13"); y += 25;
	addob(xx,y,OBEXAMP,"EX 14: Imperfect disease diagnostic test results","Example 14"); y += 25;
	addob(xx,y,OBEXAMP,"EX 15: Time censoring end of epidemics","Example 15"); y += 25;
	addob(xx,y,OBEXAMP,"EX 16: Time censoring beginning of epidemics","Example 16"); y += 25;
	
	addob(xx-20,yst,OBBRACKET,y-yst);
	addob(xxx,Math.floor((y+yst)/2 - 22),OBEXAMPPIC,1,"SI model",21);
	
	y += 20;
	
	ytot = y;
	
	placeob();		
}
