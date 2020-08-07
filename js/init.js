/* All the functions which initialise SIRE along with commonly used functions */

function init()                                                                 // Intialises the software
{
	var sum;

	var f=[];
	document.onselectstart = function() { return false; };

	if(fin == 0 && nwon == 1) require('nw.gui').Window.get().showDevTools();

	var os = require('os');
	ncpu = os.cpus().length; 

	for(i = 0; i < 4; i++) pagesub[i] = 0;
	
	logopic = new Image(); 
	logopic.src = "pics/sirelogonew.png";
	logopic.onload = function(){ buttonplot();};

	examppic[0] = new Image(); 
	examppic[0].src = "pics/SIR.png";
	examppic[0].onload = function(){ buttonplot();};
	
	examppic[1] = new Image(); 
	examppic[1].src = "pics/SI.png";
	examppic[1].onload = function(){ buttonplot();};
	
	speechpic = new Image(); 
	speechpic.src = "pics/speech.png";
	speechpic.onload = function(){ buttonplot();};
	
	newmodpic = new Image(); 
	newmodpic.src = "pics/newmod.png";
	newmodpic.onload = function(){ buttonplot();};
	
	manualpic = new Image(); 
	manualpic.src = "pics/manual.png";
	manualpic.onload = function(){ buttonplot();};
	
	paperpic = new Image(); 
	paperpic.src = "pics/paper.png";
	paperpic.onload = function(){ buttonplot();};
	
	warnpic = new Image(); 
	warnpic.src = "pics/warn.png";
	
	myc = ById("myCanvas");
	maincv = myc.getContext("2d");
	cv = maincv;

	mycover = ById("overlay");
	cvover = mycover.getContext("2d");

	cornx = menux + 80;
	corny = 120;
  
    graphcan = document.createElement('canvas');
    graphcv = graphcan.getContext('2d');

	resultcan = document.createElement('canvas');
    resultcv = resultcan.getContext('2d');

	nw.Window.get().on('close', function () {
		stopinference();
		this.close(true);
	});
	
	a = ById("main");
	
	a.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(myc, evt);
		mousemove(mousePos.x,mousePos.y);
	}, false);

	a.addEventListener('mousedown', function(evt) {
		var mousePos = getMousePos(myc, evt);
		mdown(mousePos.x,mousePos.y); 
	}, false);

	a.addEventListener ("mouseout", function(evt) {
		drag = 0; 
		buttoninit();
	}, false);
	
	a.addEventListener('mouseup', function(evt) {
		var mousePos = getMousePos(myc, evt); 
		ctrlkey = evt.ctrlKey;
		if(evt.altKey) location.reload(true);
		mup(mousePos.x,mousePos.y);
	}, false);

	nticksize = 0;
	for(sh = -5; sh <= 5; sh++){
		for(i = 0; i < 3; i++){   
			f = tickpo[i];
			if(sh < 0){ for(j = 0; j < -sh; j++) f /= 10;}
			else{ for(j = 0; j < sh; j++) f *= 10;}
			ticksize[nticksize] = f; nticksize++;
		}
	}
	
	ncla=1;
	cla.push({name:"DS", ncomp:0, comp:[], ntra:0, tra:[]});	
	cla[0].comp.push({name:"S", col:"#00ff00"}); cla[0].ncomp++;
	cla[0].comp.push({name:"I", col:"#ff0000"}); cla[0].ncomp++;
	cla[0].comp.push({name:"R", col:"#0000ff"}); cla[0].ncomp++;
	cla[0].tra.push({i:0, f:1}); cla[0].ntra++;
	cla[0].tra.push({i:1, f:2}); cla[0].ntra++;
	
	initcompmult();
	
	initvar();
	
	setsize();

	ById("bod").style.visibility = "visible";	
	
	xmlhttp = new XMLHttpRequest();                                               // Used for testing
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
			textFromFile = xmlhttp.responseText;
			load();	
			loading = 0;
			changepage(DESCPAGE,0); 
			buttoninit();
		}
	};
}

function setsize()                                                                // Sets the size of page objects (actives when resized)
{
	var w = window.innerWidth;
	var h = window.innerHeight;
	width = w-25; height = h-45;

	if(height < 598) height = 598;
	if(width < 1000) width = 1000;
	
	ById("overlay").style.width = width+"px";
	ById("overlay").style.height = height+"px";
	mycover.width = width;
	mycover.height = height;
	
	graphcan.width = width;
    graphcan.height = height;
 
    resultcan.width = width;
    resultcan.height = height;
  
	a = ById("pw");
	a.style.width = width+"px";
    xx = a.offsetLeft; yy = a.offsetTop; 
	
	a = ById("overlay").style; 
	a.left = xx+"px"; a.top = yy+"px";
		
    myc.width = width;
    myc.height = height;

    canw = width; canh = height;

	tablewidth = width-246; tableheight = height-193; tablewidthbig = width - 212;
	tablewidthdata = width-220; tableheightdata = height-223;
	tablewidthdesc = width-220; tableheightdesc = height-143;
	
	setupheight = Math.floor((height-133)/trialtimedy)*trialtimedy; setupwidth = width-222;
	
	priorheight =  Math.floor((height-213)/priordy)*priordy;
	rowmax = Math.floor(tableheight/tabledy)-1;
  
    indtablewidth = width-330; indtableheight = height-165;
  	graphdy = height - 255;
    rightval = width-350;
	tlinexmax = indtablewidth-20;
	exampheight = height - 415;
  
	indplotst=[];
  
	buttoninit();
	widthold = width; heightold = height;
 }

function getMousePos(canvas, evt)                                                                // Gets the mouse position
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function ById(a){ return document.getElementById(a);}                                            // Gets an element in DOM

function mdown(xx,yy)                                                                            // Fires if mouse down
{
    var d = new Date(); timedown = d.getTime();

	if(timedown-timeup < 300 && timeclick < 300){ mousedblclick(); timedown = 0; return;}
	
	drag = 0; 
	if(selectbub != -1 && (over == -1 || (buttype[over] != CANVASBUT && buttype[over] != GDROPBUT && buttype[over] != GDROPSELBUT) || canover == -1)) buboff();
	if(over >= 0){
		switch(buttype[over]){
		case GDROPSELBUT:
			if(gdropslider == 1){
				gdropmyst = my; drag = 101; gdropfracst = gdropfrac;
			}
			break;
			
	    case XSLIDEBUT:
			i = over;
			x = butx[i]; dx = butdx[i];
			x1 = x+tablexfr*dx; x2 = x+dx*(tablexfr+tablexfrac);
			if(mx >= x1 && mx <= x2){ mxst = mx; myst = my; tablexfrst = tablexfr; drag = 1;}
			else{
				if(mx > x2){ tablexfr += tablexfrac; if(tablexfr > 1-tablexfrac) tablexfr = 1-tablexfrac; buttoninit();}
				else{
					if(mx < x1){ tablexfr -= tablexfrac; if(tablexfr < 0) tablexfr = 0; buttoninit();}
				}
			}
			break;
		
        case YSLIDEBUT:
			i = over;
			if(my >= sliy1 && my <= sliy2){ mxst = mx; myst = my; tableyfrst = tableyfr; coheight = butdy[over]; drag = 2;}
			else{
				if(my > sliy2){ tableyfr += tableyfrac; if(tableyfr > 1-tableyfrac) tableyfr = 1-tableyfrac; buttoninit();}
				else{
					if(my < sliy1){ tableyfr -= tableyfrac; if(tableyfr < 0) tableyfr = 0; buttoninit();}
				}
			}
			break;
		
		case CANVASBUT:
			if(canover >= 0){
				switch(canbuttype[canover]){
					
				case TABLECOLBUT: case TABLEHEADBUT:
					mxst = butx[over]; myst = buty[over]; 
					dragval = canbutval[canover]; drag = 9;
					break;
					
				case SLIDERBUT:
					mxst = mx; myst = my; kdest = kde; drag = 10;
					break;
				}
			}
			else{
				if(arrow == 2){ 
					if(xaxisauto == 1){ xaxisfixmin = axxmin; xaxisfixmax = axxmax; xaxisauto = 0;}
					mxst = mx; mxlast = mx; myst = my; mylast = my;
					drag = 11;
				}
				if(arrow == 1){ mxst = mx; myst = my; mxlast = mx; mylast = my; drag = 4;}
			}
			break;
		}
	}
	if(drag > 0 && selectbub >= 0) buboff(1);
}

function mup(xx,yy)                                                                             // Fires when mouse click up
{
    var i, j, time;

	timeup = (new Date()).getTime();
	timeclick  = timeup-timedown; 
	if(drag != 0){ drag = 0; if(timeclick > 200) buttoninit();}
	//if(timeclick > 200) return;
	
	mouseclick(xx,yy);
}

function initvar()                                                                              // Initialises variables for a new model
{
	var i;

	datanote = "";
 	kde = 10; kdemin = 1; kdemax = 20;   
	for(i = 0; i < 4; i++) pagesub[i] = 0;	
}

function startnewmodel()                                                                        // Initialises a new model
{
	if(modelstart == 1){
		if(confirm("Are you sure you want to discard the currently loaded model?")); else return; 
	}
	initvar();
	
	nchain=3;
	data=[];
	param=[];
	fixeddata=[];
	
	nsampmax = 10000; nsampevmax = 1000;

	modelstart = 1; groupsel = "All";
	tpostmin = ""; tpostmax = "";
	tobsmin = ""; tobsmax = "";
	
	modtype = SIR; envon = 1; geon = 1; domon = 1; order = IDORD; trialtime = 0; tposttrialmin=[]; tposttrialmax=[];
	infres={}; varval=[];
	fileToLoadlist=[];
	changepage(DESCPAGE,-1);
}

function pr(te){ console.log(te);}                                                              // Prints to the console

function alerton(te){ if(alertfl == 0){ alert(te); alertfl = 1;}}                               // Outputs error message
