/* Lists all the variables used in the graphical interface */

var randon = 0;  // Determines if random effects are being incorporated
var envon;       // Determines if environment effects are included in analysis
var geon;        // Determines if group effects are included in analysis
var domon;       // Determines if SNP dominance is included

var ncol, ncoldef=0, ncoldefmax, colname=[], colx=[], colw=[];                     // Define tables of data
var nrow, row=[], rowwidth=[], rowcopy=[], tablehist=[];
var addingdata = 0, datashow=-1, datatemp, dataselected;

var runtype = "";                                                                  // Determines if inference is being performed

var	width, height, widthold, heightold, priorheight;

var nchrun=0, nchain=1;                                                            // The number of MCMC chains used in the analysis

var indplotst=[];                                                                  // Store information when plotting individual data

var maincv, graphcv, cv, resultcv;                                                 // Context used form plotting

var fileToLoad, newfile;                                                           // Name of loaded fileCreatedDate
var fileToLoadlist=[];                                                             // Stores loaded files                        
var IDcol;                                                                         // Stores column used for IDs                    

var datanote;                                                                      // Stores the analysis description

var starttime;                                                                     // Time when inference is started

var fixeddata=[];                                                                  // The datasources for fixed effects
//var fixedname=[];                                                                  // The names of the fixed efects

var helptype = -1;                                                                 // Determines what help window is open

var idlist=[];                                                                     // List of individual IDs

var intervalid;                                                                    // Periodically updates trace plots             

var obsloaded = 0;                                                                 // Changes when observation data is loaded up

var modelstart = 0;                                                                // Sets to one when a model is defined

var examppic=[];                                                                   // Stores all the images used

var xmlhttp;                                                                       // Used to load up text files

var ncla=0, cla=[];                                                                // Stores classifications

var chmin, chmax, smin, smax, popplotinitfl = 0, sstart, plotmi, plotma;           // Used then plotting populations
var ncomp, compmult=[], compval=[], cpop=[];

var param=[], paramnew=[];                                                         // Stores all the parameter in the model

var exporton = 0;                                                                  // Turms on when export submenu opens
var saveon = 0;                                                                    // Turms on when save submenu opens

var exe=[];                                                                        // Set to one if a chain is being executed

var cornx, corny;                                                                  // The position of the canvas region

var gdropinfo=[], gdropsel=-1, gdropfrac, gdropnum, gdropdy=20, gdropmyst;         // Used for drop down menus
var gdropfracst, gdropbut, gdropselop;

var psel;                                                                          // Selecting a parameter
var dsel;                                                                          // Selecting a data source

var ncpu;                                                                          // The number of CPUs

var nob, obx=[], oby=[], obty=[], obval=[], obval2=[], obval3=[], obval4=[], ytot; // Stores objects (collections of buttons)

var infrecfl;                                                                      // Set to one if there are infection/recovery data
                                                             
var datacol=[0,160,320,480,490,590,620,725];                                       // Positions for the data columns

var tlinetmin, tlinetmax;                                                          // The extent of the time line

var col, col2;                                                                     // Used to store colours

var tpostmin=large, tpostmax=-large, tobsmin=large, tobsmax=-large;                // Time ranges for data and inference
var tdatamin, tdatamax, trunmin, trunmax;
var trialtime = 0, tposttrialmin=[], tposttrialmax=[], tobstrialmin=[], tobstrialmax=[];

var nsampevmax = 1000;                                                             // The maximum number of event samples stored 
var nsampmax = 10000;                                                              // The maximum number of parameter samples stored 

var triallist=[];                                                                  // Stores the name of the contact groups

var inddata;                                                                       // Individual data

var data=[];                                                                       // The loaded data tables

var datatype;                                                                      // Data type

var nbut, buttext=[], butx=[], buty=[], butdx=[], butdy=[], butac=[], buttype=[];  // Store information about buttons
var butover=[], butval=[], butval2=[];
var ncanbut, canbuttext=[], canbutx=[], canbuty=[], canbutdx=[], canbutdy=[];
var canbutac=[], canbuttype=[], canbutover=[], canbutval=[], canbutval2=[];
var over = -1, oversub;

var canover = -1;

var nvarlist, varlist=[], vardeplist=[];                                           // Information about variables

var canvasdx, canvasdy;                                                            // The size of the canvas

var nid, id=[];                                                                    // The IDs for all the individuals

var canx, cany;                                                                    // The canvas position

var page = HOMEPAGE, pagesub=[];                                                   // Current page

var fitype;                                                                        // File type

var mx,my, mxst, myst, mxlast, mylast, gx, gy;                                     // Used for mouse movements
var overx=-1, overy, overdx, overdy;

var drag, dragval, dragval2, dragx, dragy, dragdx, dragdy, dragdh, dragww;         // Used for dragging objects

var nticksize, ticksize=[];                                                        // Used for drawing graphs
var axxmin, axxmax, axymin, axymax;
var axtickx, axticky;
var ntickx, tickx=[], nticky, ticky=[];
var B = 200, nbin=[], bin=[];
var JX = 200, Jbin=[], Jbinpriorfac=[];
var nrunlab, runlab=[], runsel, nrunpoplab, runpoplab=[], runpopsel;      
var POPX;
var popfilter=[], poptmin, poptmax, poppage, poppagesub;
var popinit=[], popch=[], npop;
var lablist=[], labcollist=[];
var varsel=[], varselx, varsely, groupop=[], groupsel;
var curvevar=[], curvech=[];
var indcalc=[];
var xaxisauto = 1, xaxisfixmin, xaxisfixmax, yaxisauto = 1, yaxisfixmin, yaxisfixmax;
var ctrlkey;
var chooseaxis;

var timeup=0, timedown=0;                                                          // Timings for mouse click

var arrow = 0;                                                                     // The type of arrow

var polypoint=[]; for(i = 0; i < 10; i++) polypoint[i] = [];                       // Used in plotting
var nlines, lines=[], linesy=[], lineheight = 25;
var nout, out=[];
var inpon=0;
var percentrun, percentload, loading = 0;

var alertfl = 0;

var errmsg="", errormsg="";                                                        // Stores error messages

var child=[];                                                                      // MCMC run as a child process

var nvar, varname=[], vardesc=[], vartype=[], varval=[], varCImin=[];              // Information about variables
var varCImax=[], varESS=[], varGR=[], varmean=[];

var nsamp=[], burnin, nsamppl, nsampread=[], sampthin;                             // Variable samples

var infres={result:-1};                                                            // All information about inference

var canvash;                                                                       // Stores the canvas height

var datares;                                                                       // Data                                   

var leftover=[];                                                                   // Used when processing output from c code 
  
var infpagename=[];                                                                // The name of the subpage

var filt, filter=[], filtervar=[];                                                 // Filters used when plotting
var indfilt;
var sampfilt;

var sliy1, sliy2;                                                                  // Range for yslider

var popshow=[];                                                                    // Shows which populations to plot

var tableyfr, tableyfrac;                                                          // Used for y slider

var vcalc, vcalced=[];                                                             // Used for calculating statistics
var tempCI=[], CImin, CImax, mean, sd;
var nquant, quant=[], quanteqn=[], quantcol=[], quantmean=[], quantCImin=[]; 
var quantCImax=[], quantname=[],  quantmaxi=[];

var searchterm="", replaceterm="", searchres=[], searchresnum, nreplace, ndel;     // Used to modify data table

var fiformat;                                                                      // Stores the file format

var warning=[];                                                                    // Warnings created by code
var warnpic;

var foc;                                                                           // Sets the focus

var BFtext;                                                                        // Text output from BF calculation

var kde, kdest, kdemin, kdemax;                                                    // KDE smoothing

var selectbub, selectbubval, selectbubval2, selectbubtext;                         // Used for the popup speech bubbles
var bubx, buby, bubw, bubh, bubdx, bubdy, bubx1, bubx2, bubx3
var selectbubx, selectbuby, selectbubdx, selectbubdy;

var cursx, cursy;                                                                  // The cursor position in text box 
