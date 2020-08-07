/* Initialises and draws buttons on menus */

function buttoninit()                                                          // Initialises the buttons used on pages
{
	var dx = 120, dx2 = 100, dy = 32, i, overnew = -1, xx, ddy, dddy, dby = 13;
	
	over = -1;
	nbut = 0; ncanbut = 0;
	gdropinfo=[];
	
	ninput2 = 0;

	switch(page){
	case HOMEPAGE: homebuts(); break;
	case DESCPAGE: descbuts(); break;
	case MODELPAGE: modelbuts(); break;
	case DATAPAGE: databuts(); break;
	case PRIORPAGE: priorbuts(); break;
	case RUNPAGE: inferencebuts(); break;
	}

	addbutton("",0,0,menux,canh,-1,MENUBACKBUT,-1,-1);

	y = 100; ddy = 42;
 
	addbutton("Home",0,y,menux,40,TABBUT,TABBUT,HOMEPAGE,-1); y += ddy; y += dby;

	addbutton("Description",0,y,menux,40,TABBUT,TABBUT,DESCPAGE,-1); y += ddy; y += dby;
	
	addbutton("Data",0,y,menux,40,TABBUT,TABBUT,DATAPAGE,-1); y += ddy;
	if(page == DATAPAGE){
		nout = 0;
		out[nout]="Sources"; nout++; 
		out[nout]="Individuals"; nout++; 
		addsub(0);
	}
	y += dby;
	
	addbutton("Model",0,y,menux,40,TABBUT,TABBUT,MODELPAGE,-1); y += ddy; y += dby;

	addbutton("Prior",0,y,menux,40,TABBUT,TABBUT,PRIORPAGE,-1); y += ddy; y += dby;

	addbutton("Inference",0,y,menux,40,TABBUT,TABBUT,RUNPAGE,-1); y += ddy;

	if(page == RUNPAGE){
		nout = 0;
		out[nout]="Start"; nout++; 
		if(infres.result >= 1){
			out[nout]="Traces"; nout++; 
			out[nout]="Prob. Dist."; nout++;
			out[nout]="Scatter Plots"; nout++;
			out[nout]="Individuals"; nout++;
			out[nout]="Statistics"; nout++;
			out[nout]="Populations"; nout++;
		}
		addsub(0);
		for(j = 0; j < nout; j++) infpagename[j] = out[j];
	}
	y += dby;

    addbutton("",5,20,0,0,-1,LOGOBUT,-1,-1);

	if(selectbub >= 0) bubble();
	
	lastbut = nbut;

	if(page == HOMEPAGE){
		x = saveoptions(width-125);
		addbutton("Load",x,0,75,22,LOADBUT,LOADBUT,-1,0); 
		addbutton("[?]",width-45,0,15,20,HELPICONBUT,HELPICONBUT,30,-1);
	}
	
	if(page == RUNPAGE && pagesub[page] > 0){
		x = saveoptions(width-125);
		x = exportoptions(x);
		addbutton("[?]",width-45,0,15,20,HELPICONBUT,HELPICONBUT,31,-1);
	}
	
	for(i = 0; i < gdropinfo.length; i++){
		var gd = gdropinfo[i];
		addbutton(gd.val,gd.x,gd.y,gd.dx,gd.dy,GDROPBUT,GDROPBUT,i,gd.style);
	}
	
	if(gdropsel >= 0){
		gdropbut = nbut;
		var gd = gdropinfo[gdropsel];
		
		if(gd.click == "sampfilt"){ // works out options
			var ops=[];
			ops.push("All");
				var s;
				ch = 0;	
				for(s = 0; s < infres.ch[ch].nsampev; s++) ops.push(s+1);
				gd.options = ops;
		}
		gdropdy = gd.dy;
		gdropnum = gd.options.length;
		dy = (1+gdropnum)*gdropdy+8;
		if(gd.y+dy > height-10){
			gdropnum = Math.floor((height-10-gd.y-10)/gdropdy)-1; if(gdropnum < 1) gdropnum = 1; 
			dy = (1+gdropnum)*gdropdy+8;
		}
		addbutton(gd.val,gd.x,gd.y,gd.dx,dy,GDROPSELBUT,GDROPSELBUT,gd.options,gd.style);
	}
	
	if(helptype >= 0) helpbuts();
	if(fin == 0) addbutton("Reload",width-205-4*90,0,75,22,RELOADAC,LOADBUT,-1,0); 
	
	for(i = nbut-1; i >= 0; i--){
		if(butac[i] >= 0 && mx >= butx[i] && mx <= butx[i]+butdx[i] && my >= buty[i] && my <= buty[i]+butdy[i]){ over = i; break;}
	}
	
	buttonplot();

	relo = 1;
}

function addsub(add)                                                                     // Used to add a sub-menu
{
	var i, xx = 15; dddy = 22;
 
	y -= 2;
	for(i = 0; i < nout; i++){
		ii = i; if(add) ii += add;
		addbutton(out[i],xx,y,menux-xx,22,PAGESUBBUT,PAGESUBBUT,ii,-1); y += dddy;
	}
	y += 2;
}

function changepage(pagenew, s)                                                       // Changes the page
{
	var te, pagest=page, addst;

	tableyfr = 0;
	if(selectbub != -1){ buboff(); if(selectbub != -1) return;}
	popplotinitfl = 0;
	
	addingdata = 0;
	if(pagenew != page) ById("add").innerHTML = "";
	xaxisauto = 1; yaxisauto = 1; 
	
	if(pagenew != -1) page = pagenew;
	if(s != -1) pagesub[page] = s;
	
	//if(pagenew == RUNPAGE && pagest != RUNPAGE) 
	
	if(page == RUNPAGE && infpagename[pagesub[page]] == "Populations") popplotinitfl = 0;
	if(page == RUNPAGE && infpagename[pagesub[page]] == "Statistics") startcalc();
	if(page == RUNPAGE && infpagename[pagesub[page]] == "Individuals") indplotst=[];

	buttoninit();
}

function hexToRgb(hex) {                                                                    // Changes colour format
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function hex(c) {                                                                           // Converts decimal to hexidecimal
	var hex = (Math.floor(c)).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function darkcol(col)                                                                       // Darkens a colour
{ 
	if(col == BLACK) return GREY;
	var bigint, r, g, b, frac = 0.7;
	bigint = parseInt(col.substring(1), 16);	
	r = (bigint >> 16) & 255;
	g = (bigint >> 8) & 255;
	b = bigint & 255;
	return "#" + hex(frac*r) + hex(frac*g) + hex(frac*b);
}

function lightcol(col)                                                                      // Lightens a colour
{ 
	var bigint, r, g, b, frac = 0.13;
	bigint = parseInt(col.substring(1), 16);
	r = 255-(255-((bigint >> 16) & 255))*frac;
	g = 255-(255-((bigint >> 8) & 255))*frac;
	b = 255-(255-(bigint & 255))*frac;
	return "#" + hex(r) + hex(g) + hex(b);
}

function addbutton(text,x,y,dx,dy,ac,type,val,val2)                                         // Adds a button onto a page
{
	var i;
	if(type == CANVASBUT){ canx = x; cany = y;}
 
	buttext[nbut] = text;
	butx[nbut] = x;
	buty[nbut] = y;
	butdx[nbut] = dx;
	butdy[nbut] = dy;
	butac[nbut] = ac; 	
	buttype[nbut] = type;
	butover[nbut] = -1;
	butval[nbut] = val;
	butval2[nbut] = val2;
	nbut++;
	
	if(type == TITLEBUT && val >= 0) addbutton("[?]",x+textwidth(text,HUGEFONT)+15,y,15,20,HELPICONBUT,HELPICONBUT,val,-1);
	
	if(type == SMALLTEXTBUT && val2 >= 0){
		addbutton("[?]",parseFloat(x)+textwidth(text,"12px arial")+2,y+3,15,15,HELPICONBUT,HELPICONBUT,val2,-1);		
	}
}


function centerplotangletext(text,x,y,th,font,col,width)                                         // Draws centered text at an angle
{
	text = text.toString();
	if(text.search("_") == -1){   // looks for subscripts
		cv.font = font;
		if(width){
			if(cv.measureText(text).width > width-5){
				while(cv.measureText(text+"...").width > width-5) text = text.substr(0,text.length-1);
				text += "...";
			}	
		}
		
		cv.save();
		cv.translate(x, y);
		cv.rotate(-th);
		cv.textAlign = 'center';
		cv.fillStyle = col;
		cv.fillText(text, 0, 0);
		cv.restore();
	}
	else{
		lab = splitintosub(text,font);
		w = lab[lab.length-1].w+lab[lab.length-1].dw;
		cv.textAlign = 'left';
		cv.fillStyle = col;
		cv.save();
		cv.translate(x, y);
		cv.rotate(-th);	
		for(j = 0; j < lab.length; j++){
			cv.font = lab[j].font;
			cv.fillText(lab[j].frag, lab[j].w-w/2,lab[j].dy);
		}
		cv.restore();
	}
}

function centertext(text,x,y,font,col,width)                                                 // Centers some text in an area
{
	text = text.toString();
	if(text.search("_") == -1){   // looks for subscripts
		cv.font = font;

		if(width){
			if(cv.measureText(text).width > width-10){
				while(cv.measureText(text+"...").width > width-10) text = text.substr(0,text.length-1);
				text += "...";
			}	
		}
		
		cv.textAlign = 'center';
		cv.fillStyle = col;
		cv.fillText(text, x, y);
	}
	else{
		lab = splitintosub(text,font);
		w = lab[lab.length-1].w+lab[lab.length-1].dw;
		cv.textAlign = 'left';
		cv.fillStyle = col;
		for(j = 0; j < lab.length; j++){
			cv.font = lab[j].font;
			cv.fillText(lab[j].frag,x+lab[j].w-w/2,y+lab[j].dy);
		}
	}
}
function righttext(text,x,y,font,col,width)                                                   // Right aligns text in an area
{
	cv.font = font;
	if(width){
		if(cv.measureText(text).width > width-5){
			while(cv.measureText(text+"...").width > width-5) text = text.substr(0,text.length-1);
			text += "...";
		}	
	}
	cv.textAlign = 'right';
	cv.fillStyle = col;
	cv.fillText(text, x, y);
}

function plottext(text,x,y,font,col,width)                                                    // Left aligns text in an area
{
	text = text.toString();
	if(text.search("_") == -1){   // looks for subscripts
		cv.font = font;
		if(width){
			if(cv.measureText(text).width > width-5){
				while(cv.measureText(text+"...").width > width-5) text = text.substr(0,text.length-1);
				text += "...";
			}	
		}
		cv.textAlign = 'left';
		cv.fillStyle = col;
		cv.fillText(text, x, y);
	}
	else{
		lab = splitintosub(text,font);
		
		cv.textAlign = 'left';
		cv.fillStyle = col;
		for(j = 0; j < lab.length; j++){
			cv.font = lab[j].font;
			if(lab[j].w+lab[j].dw > width-5){
				te = lab[j].frag;
				while(x+lab[j].w+cv.measureText(te+"...").width > width-5 && te.length > 0) te = te.substr(0,te.length-1);
				te += "...";
				cv.fillText(te,x+lab[j].w,y+lab[j].dy);
				break;
			}
			cv.fillText(lab[j].frag,x+lab[j].w,y+lab[j].dy);
		}
	}
}

function splitintosub(st,font)
{
	var lab=[], j, font2, pos2, fsi, si;

	pos2 = font.search("px");
	si = parseInt(font.substr(pos2-2,2));
	fsi = Math.floor(0.7*si);
	font2 = font.substr(0,pos2-2)+fsi+font.substring(pos2);
		
	j = 0; w = 0;
	do{
		jst = j;
		while(j < st.length && st.substr(j,1) != "_") j++;
		frag = st.substr(jst,j-jst);
		dw = textwidth(frag,font)+1;
		lab.push({frag:frag, size:"big", w:w, dw:dw, font:font, dy:0});
		w += dw;
			
		if(j < st.length){
			j++; 
			jst = j;
			while(j < st.length && st.substr(j,1) != " " && st.substr(j,1) != "=") j++;
			frag = st.substr(jst,j-jst);
			if(frag != ""){
				dw = textwidth(frag,font2);
				lab.push({frag:frag, size:"small", w:w, dw:dw, font:font2, dy:0.2*si});
				w += dw;
			}
			//j++;
		}
	}while(j < st.length);
	return lab;
}

function plotangletext(text,x,y,th,font,col,width)                                             // Draws text at an angle
{
	cv.font = font;
	if(width){
		if(cv.measureText(text).width > width-5){
			while(cv.measureText(text+"...").width > width-5) text = text.substr(0,text.length-1);
			text += "...";
		}	
	}
	
	cv.save();
	cv.translate(x, y);
	cv.rotate(-th);
	cv.textAlign = 'left';
	cv.fillStyle = col;
	cv.fillText(text, 0, 0);
	cv.restore();
}

function textwidth(text,font)                                                                     // Returns the width of some text
{ 
	if(text.search("_") == -1){ 
		cv.font = font;
		return cv.measureText(text).width;
	}
	else{
		var lab = splitintosub(text,font);
		var j = lab.length-1;
		return lab[j].w+lab[j].dw;
	}
}

function drawrect(x1, y1, x2, y2, col, style)                                                     // Draws a rectangle
{
	cv.beginPath();
	switch(style){
	case NORMLINE: cv.lineWidth = 1; break;
	case THICKLINE: cv.lineWidth = 2; break;
	case VTHICKLINE: cv.lineWidth = 3; break;
	}
	cv.rect(x1,y1,x2,y2);
	cv.strokeStyle = col;
	cv.stroke();
}

function reloadsign(x,y,col)                                                                       // Draws reload symbol
{
	var dx = 20, dy = 20;
	cv.lineWidth = 3; 
	cv.beginPath();
	cv.arc(x+dx/2, y+dy/2+1, 8, -0.1, 1.5*Math.PI);
	cv.strokeStyle = col;
	cv.stroke(); 
	drawarrow(x+dx/2+7,y+3,x-100,y+6,8,col);
	centertext("Reload",x+dx/2,y+dy+9,"bold 10px arial",col);
}

function fillrect(x1, y1, x2, y2, col)                                                            // Draws a filled rectangle
{
	cv.beginPath();
	cv.rect(x1,y1,x2,y2);
	cv.fillStyle = col;
	cv.fill();
}

function drawdashed(cv, x1, y1, x2, y2, col)                                                      // Draws a dashed line
{
	var l, dx, dy, d = 15, step, ra;

	dx = x2-x1; dy = y2-y1;
	l = Math.sqrt(dx*dx+dy*dy);

	step = Math.floor(l/d);
	d = l/step;
	dx /= (l/d); dy /= (l/d);

	cv.lineWidth = 2;
	cv.strokeStyle = col;
	for(i = 0; i < step; i++){
		cv.beginPath();
		cv.moveTo(x1+i*dx,y1+i*dy);
		cv.lineTo(x1+(i+0.7)*dx,y1+(i+0.7)*dy);
		cv.stroke();
	}
}

function drawgradientline(x1, y1, x2, y2, f1, f2)                                                 // Draws a line with a colour gradient
{
	var grad= cv.createLinearGradient(x1,y1,x2,y2);
	v = Math.floor(f1*225); grad.addColorStop(0, "rgb("+v+","+v+","+v+")");
	v = Math.floor(f2*225); grad.addColorStop(1, "rgb("+v+","+v+","+v+")");

	cv.lineWidth = 4; 
	cv.beginPath();
	cv.moveTo(x1,y1);
	cv.lineTo(x2,y2);
	cv.strokeStyle = grad;
	cv.stroke();
}

function setdash(dash)                                                                              // Sets the dash type
{	
	var sm = 3*scale, md = 9*scale, bi = 14*scale;
	
	switch(dash%10){
	case 0: cv.setLineDash([]); break;
	case 1: cv.setLineDash([md*scale, sm]); break;
	case 2: cv.setLineDash([sm, sm]); break;
	case 3: cv.setLineDash([md, sm, sm, sm]); break;
	case 4: cv.setLineDash([bi, md]); break;
	case 5: cv.setLineDash([bi, sm, sm, sm]); break;
	case 6: cv.setLineDash([bi, sm, md, sm]); break;
	case 7: cv.setLineDash([bi, sm, sm, sm, sm, sm]); break;
	case 8: cv.setLineDash([bi, sm, md, sm, sm, sm]); break;
	case 9: cv.setLineDash([bi, sm, md, sm, md, sm]); break;
	}
}

function drawline(x1, y1, x2, y2, col, style, dash)                                                   // Draws a line
{
	switch(style){
	case NORMLINE: cv.lineWidth = 1; break;
	case THICKLINE: cv.lineWidth = 2; break;
	case VTHICKLINE: cv.lineWidth = 3; break;
	}

	if(dash) setdash(dash);

	cv.beginPath();
	cv.moveTo(x1,y1);
	cv.lineTo(x2,y2);
	cv.strokeStyle = col;
	cv.stroke();
	
	if(dash) cv.setLineDash([]);
}

function drawpolygon(npoint,col,col2, style)                                                           // Draws a polygon
{
	var i;

	switch(style){
	case NORMLINE: cv.lineWidth = 1; break;
	case THICKLINE: cv.lineWidth = 2; break;
	}

	cv.beginPath();
	cv.moveTo(polypoint[0][0],polypoint[0][1]);
	for(i = 1; i < npoint; i++) cv.lineTo(polypoint[i][0],polypoint[i][1]);
	cv.closePath();
	cv.fillStyle = col;
	cv.fill();
	cv.strokeStyle = col2;
	cv.stroke();
}

function drawroundrect(x,y,dx,dy,r,col,col2)                                                      // Draws a rectangle with round corners
{
	var th, i, nth = Math.floor(r/2);
	if(nth < 1){
		cv.lineWidth = 1;	
		cv.beginPath();
		cv.beginPath();
		cv.moveTo(x+r,y);
		cv.lineTo(x+dx-r,y);
		cv.lineTo(x+dx,y+r);
		cv.lineTo(x+dx,y+dy-r);
		cv.lineTo(x+dx-r,y+dy);
		cv.lineTo(x+r,y+dy);
		cv.lineTo(x,y+dy-r);
		cv.lineTo(x,y+r);
		cv.closePath();
		cv.fillStyle = col; 
		cv.fill();
		cv.strokeStyle = col2;
		cv.stroke();
		return;
	}
	
	cv.lineWidth = 1;
	cv.beginPath();
 
	cv.moveTo(x+r,y);

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.sin(th),y+r-r*Math.cos(th));
	}

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.cos(th),y+dy-r+r*Math.sin(th));
	}

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.sin(th),y+dy-r+r*Math.cos(th));
	}

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.cos(th),y+r-r*Math.sin(th));
	}

	cv.closePath();
	cv.fillStyle = col; 
	cv.fill();
	cv.strokeStyle = col2;
	cv.stroke();
}

function drawloadrect(x,y,dx,dy,r,col,col2)                                                    // Draws rectangle rounded at bottom
{
	var th, i, nth = Math.floor(r/2);
	if(nth < 1) nth = 1;

	cv.lineWidth = 1;
	cv.beginPath();
 
	cv.moveTo(x,y);
	cv.lineTo(x+dx,y);

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.cos(th),y+dy-r+r*Math.sin(th));
	}

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.sin(th),y+dy-r+r*Math.cos(th));
	}
	cv.lineTo(x,y);

	cv.closePath();
	cv.fillStyle = col; 
	cv.fill();
	cv.strokeStyle = col2;
	cv.stroke();
}

function drawroundmenutop(x,y,dx,dy,r,col,col2)                                             // Draws rounded rectangle with title
{
	var th, i, nth = Math.floor(r/2);
	if(nth < 1) nth = 1;

	cv.lineWidth = 1;
	cv.beginPath();
 
	cv.moveTo(x+r,y);

	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.sin(th),y+r-r*Math.cos(th));
	}
	cv.lineTo(x+dx,y+dy);
	cv.lineTo(x,y+dy);
	
	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.cos(th),y+r-r*Math.sin(th));
	}

	cv.closePath();
	cv.fillStyle = col; 
	cv.fill();
	cv.strokeStyle = col2;
	cv.stroke();
}

function circle(x,y,r,col,style)                                                                    // Draws circle
{
	switch(style){
	case NORMLINE: cv.lineWidth = 1; break;
	case THICKLINE: cv.lineWidth = 2; break;
	case VTHICKLINE: cv.lineWidth = 4; break;
	}

	cv.beginPath();
	cv.arc(x,y,r,0,2*Math.PI);
	cv.strokeStyle = col;
	cv.stroke();
}

function fillcircle(x,y,r,col,col2,style)                                                           // Draws filled circle
{
	switch(style){
	case NORMLINE: cv.lineWidth = 1; break;
	case THICKLINE: cv.lineWidth = 2; break;
	case VTHICKLINE: cv.lineWidth = 4; break;
	}

	cv.beginPath();
	cv.arc(x,y,r,0,2*Math.PI);
	cv.fillStyle = col;
	cv.fill();
  
	cv.strokeStyle = col2;
	cv.stroke();
}

function drawcorners(x,y,dx,dy,r,col,col2)                                                        // Draws the corners of the main page
{
	var th, i, nth = Math.floor(r/3);
	if(nth < 1) nth = 1;

	cv.lineWidth = 2;
	cv.beginPath();
	cv.fillStyle = col; 

	cv.moveTo(x+dx,y);
	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.sin(th),y+r-r*Math.cos(th));
	} 
	cv.closePath();
	cv.fill();

	cv.moveTo(x+dx,y+dy);
	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+dx-r+r*Math.cos(th),y+dy-r+r*Math.sin(th));
	}
	cv.closePath();
	cv.fill();

	cv.moveTo(x,y+dy);
	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.sin(th),y+dy-r+r*Math.cos(th));
	}
	cv.closePath();
	cv.fill();

	cv.moveTo(x,y);
	for(i = 0; i <= nth; i++){
		th = i*Math.PI/(2*nth);
		cv.lineTo(x+r-r*Math.cos(th),y+r-r*Math.sin(th));
	}
	cv.closePath();
	cv.fill();
}

function alignparagraph(text,dx,fontset)                                                    // Aligns lines of a paragraph within a certain width
{
	var i, ist, len, yy, font, di;

	dx -= 8;
	if(fontset){ font = fontset; lineheight = 25;} else{ font = HELPFONT; lineheight = 23;}

	text = ""+text;
	nlines = 0;
	i = 0; len = text.length;

	di = Math.floor(len*dx/textwidth(text,font));
	
	yy = 0;
	while(i < len){
		ist = i;
		i += di; if(i > len) i = len; while(i < len && text.substr(i,1) != " ") i++;
		 
		if(textwidth(text.substr(ist,i-ist),font) > dx){
			do{
				i--; while(text.substr(i,1) != " " && i > ist) i--;
				
			}while(textwidth(text.substr(ist,i-ist),font) > dx);
			i++;
		}
		else{
			do{
				ist2 = i;
				i++;
				while(i < len && text.substr(i,1) != " ") i++;
			}while(i < len && textwidth(text.substr(ist,i-ist),font) < dx);
			i = ist2;
		}
		
		lines[nlines] = text.substr(ist,i-ist);
		while(i < len && text.substr(i,1) == " ") i++;
		linesy[nlines] = yy;
		yy += lineheight;
		nlines++;
	}

	hsto = yy;
}

function drawarrow(x,y,x2,y2,size,col)                                                         // Draws an arrow
{
	var nx, ny, px, py, r;

	nx = x2-x; ny = y2-y;
	r = Math.sqrt(nx*nx+ny*ny);
	if(size > r/5) size = r/5;
	nx *= size/r; ny *= size/r; 
	px = 0.5*ny; py = -0.5*nx;

	polypoint[0][0] = x; polypoint[0][1] = y; 
	polypoint[1][0] = x+Math.round(nx*0.8); polypoint[1][1] = y+Math.round(ny*0.8);
	polypoint[2][0] = x+Math.round(nx+px); polypoint[2][1] = y+Math.round(ny+py);
	drawpolygon(3,col,col,NORMLINE);
	polypoint[2][0] = x+Math.round(nx-px); polypoint[2][1] = y+Math.round(ny-py);
	drawpolygon(3,col,col,NORMLINE);
}

function plotlabel(text,x,y,font,col,width)                                                // Plots the variables on right menu
{
	plottext(text,x,y,font,col,width);
}

function plotxlabel(text,x,y,font,col)                                                     // Plots the x label on a graph
{
	centertext(text,x,y,font,col); 
}

function plotylabel(text,x,y,font,col)                                                     // Plots the y label on a graph
{
	centerplotangletext(text,x,y,Math.PI/2,font,col);
}

function overlaytext(text,x,y)                                                             // Plots text on the overlay layer
{
	cvover.font = "bold 12px arial";

	overx = x; overy = y;
	overdx = cvover.measureText(text).width+10;
	overdy = 18;
	cvover.beginPath();
	cvover.rect(overx,overy,overdx,overdy);
	cvover.fillStyle = DDBLUE;
	cvover.fill();
	cvover.strokeStyle = BLACK;
	cvover.stroke();
	
	cvover.textAlign = 'left';
	cvover.fillStyle = WHITE;
	cvover.fillText(text,x+5,y+13);
}

function startloading()                                                                      // Starts the loading symbol
{
	if(loading == 0){ loading = 1; percent = 0; loadoff = 0; loadingfunc(1);}
}

function loadingfunc(ite)                                                                    // Animates the loading symbol
{
	x = 0.5*(menux+width); y = height/2; r = 20; rr = 4;
	cvover.clearRect(x-(r+rr+1), y-(r+rr+1),2*(r+rr+1),2*(r+rr+1));
	if(loading == 1){
		loadoff++;
		
		cvover.lineWidth = 1;
		cvover.fillStyle = RED; 
		for(i = 0; i < 12; i++){
			th = (i-loadoff)*2*Math.PI/12.0;
			cvover.globalAlpha = Math.exp(-i*0.5);
			cvover.beginPath();
			cvover.arc(Math.floor(x+r*Math.sin(th)),Math.floor(y+r*Math.cos(th)),rr,0,2*Math.PI);
			cvover.fill();
		}
		cvover.globalAlpha = 1;

        cvover.font = "14px arial";
		cvover.textAlign = 'center';
		cvover.fillStyle = RED;
		cvover.fillText(percent,x,y+4);
		if(ite == 1) setTimeout(function(){ loadingfunc(1)},80);
	}
}

function indbuttonplot(i)                                                                      // Plots an individual button
{
	cv.clearRect (butx[i],buty[i],butdx[i],butdy[i]);
	butplot(i,0);
}

function gettabcol(val,dy)                                                                     // Gets the colour for a column in a table
{
	if(val < 0){  if(val == -2) col = DRED; else col = BLACK; return;}
	
	if(page == DATAPAGE && addingdata == 0){ // Data sources page
		if(dy == 0) col = BLACK; else col = BLUE;  
		col2 = LLBLUE; 
		if(val == 0) col = DDRED;
		return;
	}

	if(val < ncoldef){
		switch(datatemp.variety){
			case "state": case "diagtest": case"ped": if(val == 0) ty = "ID"; else{ if(val == 1) ty = "TIME"; else ty = "VAL";} break;
			case "presence": case "infection": case "recovery": if(val == 0) ty = "ID"; else ty = "TIME"; break;
			case "entry": case "leave": if(val == 0) ty = "ID"; else ty = "TIME"; break;
			case "snp": case "trial": case "fixed": case "fixedcat": if(val == 0) ty = "ID"; else ty = "VAL"; break;
			case "rel": case "invrel": case "invrellist": ty="ID"; break;
		}

		switch(ty){
			case "ID": col = DBLUE; col2 = LLBLUE; break;
			case "TIME": col = DRED; col2 = LLRED; break;
			case "VAL": col = DORANGE; col2 = LLORANGE; break;
		}
	}
	else{ col = LLGREY; col2 = LLGREY; if(dy > 0){ col = DGREY; col2 = LLBLUE;}}
}
