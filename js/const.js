/* This file lists all the constant values used within the interface */

var fin = 1, nwon = 0;     // Flags used when code is begin tested

const spawn = require('child_process').spawn;  // Used to start up threads which run c++ code which performs analysis

// Various quantities used to define the interface
var menux = 140;
var tab = 20;
var large = 100000000;
var tiny = 0.000000001;
var slidedx = 8, slidedy = 20, slidex = 100;
var tableheight, indtablewidth, indtableheight, tablewidthbig, indtablemar = 70, tablewidth, tottablewidth, tottableheight;
var tablewidthdata, tableheightdata, tablewidthdesc, tableheightdesc;
var setupheight, setupwidth, tabledy = 20, exampheight, rowmax, tablexfr=0, tableyfr=0, tableyfrac, tablexfrac; 
var priordy = 30, trialtimedy = 30;
var graphdy, graphdx, graphdy;
var rightval;
var scale = 1;
var rwid = 138;
var tlinexmin = 50, tlinexmax;
var gridsize = 10;
var MOD = 0;
var selbutdx = 100;
var RIGHT=0, LEFT=1, UP=2, DOWN=3;
var bubmar = 10, bubtag = 25, bubtag2 = 20;

// Define canvas buttons (note, these are arbitrary numerical definitions). Here "canvas" are used to plot graphs and the model
var TABLEHEADBUT = 0, TABLEBUT = 1, TABLECOLBUT = 2, BUBBLEBUT = 4, BUBBLEOFFBUT = 5,  BUBBLETEXTBUT = 6, COLBUT = 7;
var REQUESTBUT = 14, BUBBLETEXTBUT2 = 16, DONEBUT = 8, NUMBUT = 20, DELBUT = 21;
var ERRMSGBUT = 26, PRIORBUT = 27, MINMAXBUT = 28, MINMAXHEADBUT = 29, CANCELBUT = 31;
var DRAGBUT = 34, CANRADIOBUT = 35, CROSSBUT = 37, CLEARBUT = 39;
var BRACKETBUT = 42, TEXTBUT = 43, TEXTBUT2 = 44, TESTNAMEBUT = 45, VIEWBUT = 47;
var DELETEBUT = 49, TIMELINEBUT = 50, EVBUT = 51, ZOOMINBUT  = 52, ZOOMOUTBUT = 53, TABLEBUT3 = 56, EVBUT2 = 57, BUBSELBUT = 58;
var TABLEDROPBUT = 62, EVBUT3 = 63, RESULTBUT = 64, XLABELBUT = 66, YLABELBUT = 67;
var XTICKBUT = 68, YTICKTRBUT = 69, BURNINBUT = 70, SLIDERBACKBUT = 71, SLIDERBUT = 72, LABBUT = 73, EQBUT = 74, SUBBUT = 75;
var SUBBUT2 = 76, PARAMBUT = 77, BUBBLETEXTBUT3 = 80, WHITERECTBUT = 81, ARROWBUT = 82;
var CANUPLOADBUT = 85, LINKBUT = 93, CANSMALLTEXTBUT = 95, CLEARBUT2 = 99;
var MINMAXBIGBUT = 704, EXAMPMODBUT = 706;
var EXAMPBUT = 707, PARACANBUT = 709, RELOADBUT = 710, NEXTCANBUT = 711, BACKCANBUT = 712, TEXTSMBUT = 713;
var SPEECHBUT2 = 714,  RELOADBUT2 = 715,PRHEADCANBUT = 716, PARACANBUT2 = 717;

var CONVERTAC = 105, CHNAMEAC = 106, DELROWAC = 107, SEARCHAC = 108;
var REPLACEAC = 109, DELROWSAC = 110, TESTRESAC = 111, DOSEARCHAC = 112, DOREPLACEAC = 113, DODELROWSAC = 114, SORTAC = 115;
var ADDLINKAC = 117, DATADROPAC = 121, ADDDERAC = 122, INDAC = 129, SENSAC = 130, JOINCOLSAC = 131, CHOOSETRIALTIMEBUT = 132;
var HELPICONCANBUT = 133;

// Defines specific actions when canvas buttons are clicked
var NEXTSEARCHAC = 136, BACKSEARCHAC = 137, UNDOAC = 138;	
var CONVERTDATEBUB = 201, SEARCHBUB = 202, REPLACEBUB = 203, DELROWSBUB = 204, ERRBUB = 205;
var EMPTYBUB = 208, MULTISTATEBUB = 209, EDITBUB = 210, TRANSPLBIGBUB = 213;
var SEARCHRESBUB = 214, REPLACEDONEBUB = 215, DELROWSDONEBUB = 216;
var GENOTYPEBUB = 217, NUMPROBBUB = 218, STATEPROBBUB = 219, DIAGTESTPROBBUB = 220, INFRECPROBBUB = 221;

// Define ordinary buttons (used for menus, text etc...)
var TABBUT = 0, TITLEBUT = 1, PARAGRAPHBUT = 2,  CANVASBUT = 3, UPLOADBUT = 5, XSLIDEBUT = 6, YSLIDEBUT = 7; 
var MENUBACKBUT = 8, NEXTBUT = 9, LOGOBUT = 10, LOADBUT = 11, BOLDTEXTBUT = 12, CHBUT = 13, CHPLUSBUT = 14;
var CHMINUSBUT = 15, RADIOBUT = 16;
var GRAPHBUT = 17, RUNSELBUT = 23, STATBUT = 27, STATBUT2 = 28, STATBUT3 = 29, PAGESUBBUT = 30, EXPORTBUT = 32;
var BACKBUT = 34, WARNBUT = 35, BULLETBUT = 36, POPFILTBUT = 37, BAYESBUT = 39, EXPORTMINIBUT = 40,ADDBUT2 = 43;
var ADDDATABUT = 44, CANCELBUT2 = 45, PLOTTIMEBUT = 46;
var GDROPBUT = 47, GDROPSELBUT = 48, CHOOSETIMEBUT = 49, XTICKBUT2 = 50, XLABELBUT2 = 51, TEXTSUBTITLEBUT =52;
var SMALLTEXTBUT = 53, CHECKBUT = 54,  GREENBUT = 56, PROGRESSBUT = 57, NEWMODBUT = 58,  RELOADSTATBUT = 59, SUBTEXTBUT = 60;
var MODBUT = 61, PRHEADBUT = 62, NORMTEXTBUT = 63, BOLDFONTBUT = 64, HELPBACKBUT = 66, IMPBUT = 67;
var HELPCLOSEBUT = 68, LOADFILEBUT = 69, HELPICONBUT = 70, PDFBUT = 71, PDFBUT2 = 72;

// Define specific actions for ordinary buttons 
var SLIDEAC = 101, CHPLUSAC2 = 102, CHMINUSAC2 = 103, STARTAC = 104, EXPORTPARAMAC = 105, SAVEAC = 106, EXPORTSTATEAC = 107;
var EXPORTDIAGNOSTICAC = 108, DONEAC = 109, BACKAC = 110, BACKAC2 = 111, RELOADAC = 114, ERRORBACKAC = 115, SIMTYAC = 116;
var ADDDATAAC = 122, TABBACKAC = 125, NEXTEVDATAAC = 128, BACKEVDATAAC = 129, BACKEVDATAAC2 = 130;
var BACKAC3 = 137, EXPORTAC = 139, CHOOSEEXISTAC = 140, EDITDESCAC = 142;

// Define objects (these are collections of buttons which may need to be rearragned e.g. as a result of scrolling)
var OBPARAM = 0, OBTEXT = 1, OBTIME = 2, OBDATA = 4, OBRADIO = 5, OBBRACKET = 7, OBTEXT2 = 9;
var OBRADIO2 = 10, OBNAME = 11, OBDATAHEAD = 13, OBIND = 14, OBRADIO3 = 16, OBSIMNUM = 17, OBRADIO4 = 18;
var OBPRIORHEAD = 22, OBPRIOR = 23, OBDERIVEHEAD = 24, OBDERIVE = 25, OBSELIND = 26, OBTIMEP = 27, OBTEXTEDIT = 31;
var OBMINMAX = 37, OBUPLOAD = 39, OBLINK = 40,  OBEXAMPPIC = 44, OBEXAMP = 45, OBSPEECH = 46, OBTRIALTIME = 47;
var OBSPEECH2 = 48, OBSETUP = 49, OBSETUP2 = 50, OBSETUP3 = 51,  OBSPEECH3 = 52;

// Used to order individuals
var order, IDORD = 0, GROUPORD = 1, TIMEORD = 2;

// Define radio buttons
var CANRADIORATE = 10, CANRADIOCHECK = 12, CANRADIOTESTRES = 13, CANRADIODEFINE = 14, CANRADIOSIMTY = 15;
var CANRADIOTERM = 16, CANRADIOXAXIS = 17, CANRADIOYAXIS = 18, CANRADIOCHECK2 = 20;
var CANRADIOWHICH = 21, CANRADIOPD = 22, CANRADIOMANUAL = 23;
var RADIOTERM = 0, RADIOVAR = 1, RADIOCHOOSE = 3, RADIOLABEL = 4, RADIOSTYLE = 5, RADIONAMLAB = 6, RADIOMOD = 7, RADIOENV = 8;
var RADIOGE = 9, RADIOORDER = 10, RADIOENABLE = 11, RADIODOM = 12;

// Fonts used 
var tableheadfont = "bold 17px arial", tablefont = "17px arial", subfont = "11px arial", classvalfont = "18px arial";
var MENUFONT = "bold 17px arial",  MENUFONT2 = "16px arial", MENUFONTSMALL = "bold 14px arial", MENUFONTSMALL2 = "12px arial";
var HELPFONT = "17px arial", HUGEFONT = "bold 24px Times", RADIOFONT = "16px times", INPUTFONT = "bold 18px arial";
var LABELFONT = "25px times", NORMFONT = "17px arial",  TICKFONT = "20px times", TILEFONT = "18px arial"; 
var BUTFONT = "bold 16px arial", HELPBUTFONT = "bold 20px arial", HELPBUTFONT2 = "bold 17px arial";

var ADDFONT = "17px arial", STATFONT = "16px arial", KEYFONT = "18px times", addfont = "17px arial",  examplefont = "17px arial";

// Colours used
var BLACK = "#000000", GREEN = "#22FF22", RED = "#FF2222", BLUE = "#4444FF", PURPLE = "#FF44FF";
var WHITE = "#ffffff", GREY = "#bbbbbb"; 
var LGREEN = "#aaFFaa", LRED = "#FFaaaa", LBLUE = "#aaaaFF", LPURPLE = "#ffaaff", LGREY = "#dddddd";
var DGREEN = "#009900", DRED = "#990000", DBLUE = "#000099", DPURPLE = "#aa00aa", DGREY = "#777777";
var DDGREEN = "#005500", DDRED = "#550000", DDBLUE = "#000055", DDPURPLE = "#550055", DDGREY = "#444444";
var LLGREEN = "#ddFFdd", LLRED = "#FFdddd", LLBLUE = "#ddddFF", LLPURPLE = "#FFddFF", LLGREY = "#eeeeee";
var LLLBLUE = "#eeeeFF";
var LLLGREY = "#eeeeee", LLGREY = "#cccccc";
var ORANGE = "#ff9900", DORANGE = "#cc6600", LORANGE = "#ffcc55",  DDORANGE = "#441100", LLORANGE = "#ffee99";
var DDBLUE = "#000055";
var BROWN = "#cb6a00", LBROWN = "#edbb99", DBROWN = "#974500", DDBROWN = "#431200";

// Used in popup speech bubbles
var nfuncti = 4, functi = new Array("exp","cos","sin","log");
var nopbut = 6, opbut = new Array("+","-","\u00d7","\u2215","(",")");
var nnumbut = 11, numbut = new Array("0","1","2","3","4","5","6","7","8","9",".");
var ncollist = 28;
var collist = new Array(LGREEN,LRED,LBLUE,LPURPLE,LORANGE,LBROWN,LGREY,GREEN,RED,BLUE,PURPLE,ORANGE,BROWN,GREY,DGREEN,DRED,DBLUE,
						DPURPLE,DORANGE,DBROWN,DGREY,DDGREEN,DDRED,DDBLUE,DDPURPLE,DDORANGE,DDBROWN,BLACK);

// Define the types of line
var NORMLINE = 0, THICKLINE = 1, DOTTEDLINE = 2, VTHICKLINE = 3;

// Define how tick are arraged on axes
var tickpo = new Array(1,2,5);

// Define different main pages
var HOMEPAGE = 0, DESCPAGE = 5, MODELPAGE = 4, DATAPAGE = 1, PRIORPAGE = 2, RUNPAGE = 3;

// Defines model type
var modtype, SIR = 0, SI = 1;

// File types
var OBSFILE = 0, SIREFILE = 1;

// Definition of prior types
var priortext = new Array("Flat","Gamma","Normal","Log-Normal","Fix","Default");
var priortext2 = new Array("Flat","Gamma","Log-Normal","Fix","Default");

// The colours for different curves
var chcol = [BLUE,GREEN,RED,ORANGE,PURPLE,LBLUE,LGREEN,LRED,BLUE,GREEN,RED,ORANGE,PURPLE,LBLUE,LGREEN,LRED];
