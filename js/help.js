function helpbuts()
{
	var wid, hei, title, text;

	wid = 550; 
	switch(helptype){
	case 0:   // Importing
		title = "Importing";
		if(fileToLoadlist.length == 0){
			text = "Currently you have no files imported. Click on 'Load' to import the relevant file (in .csv or .txt format).";
		}
		else{
			wid = 570;
			text = "Either use a previously imported table or click on 'Load' to import the relevant file (in .csv or .txt format).";
		}
		break;
		
	case 1: 
		title = "Contact group data";
		text = "This determines which individuals belong to which contact group. If this data is absent, it is assumed that all individuals share the same contact group.\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID and one giving the name of the contact group (with potentially other columns).";
		break;
		
	case 2:
		title = "SNP data";
		text = "This provides the genotypes of individuals at a particular SNP under investigation (these must take one of the following possibilities: “AA”, “AB”, “BA” or “BB”).\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID and one giving SNP genotype (with potentially other columns).";
		break;
		
	case 3: 
		title = "Covariate fixed effect";
		text = "This provides numerical covariate data (e.g. age) which potentially modifies the three epidemiological trait values. Here the outputted fixed effects represent regression slopes relating the individual-based fractional changes in the traits to the data. Note, this approach can also be used to represent binary classifications, e.g. 1 or 0 elements representing male or female (in which case the fixed effects represent fractional sex-based differences in the traits).\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID and one giving the covariate (with potentially other columns).";
		break;
		
	case 4:
		title = "Categorical fixed effect";
		text = "The data consists of the category to which an individual belongs (e.g. breed). A reference category is selected and the fixed effects represent the fractional change in the three epidemiological traits compared to this reference.\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID and one giving the category (with potentially other columns).";
		break;
		
	case 5:
		title = "Disease status";
		text = "This gives the infection status of individuals at particular points in time.\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID, one giving time of observation and one giving disease status (these must take one of the following possibilities: “S”, “I”, “R” or “.” if unknown).";
		break;
	
	case 6:
		title = "Diagnostic test results";
		text = "This gives diagnostic test results at particular points in time. Additionally, the test has an associated sensitivity Se and specificity Sp which must be set. Note, tests can be selected to be sensitive to both the I and R states (e.g. appropriate for a serological test), or just the I state (e.g. appropriate for a culture test). Multiple sets of results from different diagnostic tests (e.g. ELISA/ γ-interferon / culture) can be incorporated into the same analysis.\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID, one giving time of observation and one giving test result (these must take the values “1” or “0” corresponding to positive or negative test results or “.” if unknown).";
		break;
		
	case 7:
		title = "Infection times";
		text = "This provides the times at which individuals become infected.\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID, one giving infection time (with potentially other columns). If no infection is observed then the entry “no” is used and if not known then “.” is used.";
		break;
	
	case 8:
		title = "Recovery times";
		text = "This provides the times at which individuals recover (or die in the case of disease induced mortality).\nFORMAT: Requires a table in .csv or .txt format with column headings, one column giving individual ID, one giving recovery time (with potentially other columns). If no recovery is observed then the entry “no” is used and if not known then “.” is used.";
		break;
		
	case 10:
		title = "Examples";
		text = "This section introduces some simple examples to demonstrate the versatility of SIRE applied to many different data scenarios.\nThe examples demonstrate how different data types are sequentially loaded into SIRE.\nThey can be altered or experimented on in any way and reloading from this page will return them to their default settings. The source tables for generating these tables are provided in the 'Datasets' folder.";
		break;
		
	case 11:
		title = "Data sources";
		text = "Rather than loading all data at once, SIRE works by loading different sources of data one at a time (in any order). This is done by clicking on the data options at the bottom of the page. Note not all data types are needed. For example in some cases only the death times of individuals are known (which are inputted as 'Recovery Times'), or in other scenarios only diagnostic test results are available. Any individual-based knowledge (such as sex, breed, age) can be loaded as fixed effects which can then be incorporated into the model (or not). Data can be deleted by clicking on the corresponding red cross."; 
		break;
		
	case 12:
		title = "Priors";
		text = "Priors are specified for each of the model parameters. The default choices are largely uninformative but do place upper and lower bounds on many of the key parameters (this stops them straying into biologically unrealistic regimes during inference).\nSIRE supports the following prior specifications: flat, which relates to a uniform probability distribution across a range, and the gamma, normal, and log-normal distributions, as well as the possibility to fix parameters to specific known values. Additionally the prior can be chosen to return to its default setting.\nFixing parameters is also a means of altering the model. For example setting shape parameter k=1 corresponds to assuming exponentially distributed infection durations (i.e. the model becomes Markovian).";
		break;
		
	case 13:
		title ="Setup";
		text = "This page provides several options which must be selected before inference can start.";
		break;
		
	case 14:
		title = "Trace plot";
		text = "";
		if(psel >= 0) text = infres.param[psel].desc+"\n"; 
		text += "MCMC works by successively drawing parameter samples (represented by the x-axis) from the posterior. Ideally these samples should be randomly distributed, but in reality they are correlated (which manifests itself by structure within these plots). Note, when the number of parameter samples exceeds the maximum value (as specified on the start page), samples are thinned by a factor of two and subsequently gathered at half the rate (this is implemented to ensure that computational memory is not exhausted). The vertical dashed red line represents the so-called burn-in period (before which samples are discarded). This period is dynamically shifted as more posterior sample are generated.\nMultiple variables can be selected by holding the control key.";
		break;
	
	case 15:
		title = "Probability distribution";
		text = "";
		if(psel >= 0) text = infres.param[psel].desc+"\n"; 
		text += "This graph shows the posterior probability distribution for a given model parameter (generated from the posterior samples using kernel density estimation with smoothing parameter adjusted by means of the slider in the bottom left hand corner).\nMultiple parameters can be selected by holding down the control key.";
		break;
		
	case 16:
		title = "Scatter plot";
		text = "Scatter plots enable the user to display the posterior samples of one variable against another. This is achieved by means of clicking the x-axis selecting the relevant variable and then doing the same for the y-axis. Scatter plots are a useful tool to investigate confounding between different model parameters.";
		break;
		
	case 17: 
		title = "Statistics";
		text = "SIRE summarises the posterior probability distributions (specifically the mean and 95% credible intervals) for all the model parameters. The credible intervals for SNP or fixed effects are of particular importance because whether they bound zero can be used to establish if they are statistically significant or not.";
		break;
		
	case 18:
		title = "Population plots";
		text = "The number of susceptible, infected and recovered individuals are plotted as a function of time. Here the lines represent posterior means and the shaded areas give 95% credible intervals. The results can be filtered by MCMC run, contact group or sample number.";
		break;
		
	case 20:
		title = "The SIR model";
		text = "This is a simple model used to describe epidemic behaviour. Individuals are classified as being either susceptible to infection (S), infected and infectious (I), or recovered/removed/dead (R).\nA susceptible individual has a probability per unit time of becoming infected as a result of other infected individuals sharing the same contact group. For those individuals that do become infected, a recovery rate determines the duration over which they are infectious. Note, the standard SIR model assumes the infection duration is exponentially distributed, but SIRE allows the greater flexibility of a gamma distribution.";
		break;
		
	case 21:
		title = "The SI model";
		text = "This is a simple model used to describe epidemic behaviour. Individuals are classified as being either susceptible to infection (S) or infected and infectious (I).\nA susceptible individual has a probability per unit time of becoming infected as a result of other infected individuals sharing the same contact group.";
		break;

	case 22:
		title = "Selecting parameters";
		text = "This drop-down menu classifies different types of variable:\n“SNP” gives parameters related to the SNP.\n“Fix. Eff.” gives any fixed effects.\n“Epi.” gives epidemiological parameters.\n“Gr. Eff.” gives the group effects.\n“Covar.” gives the covariance matrix.\n“Misc.” gives other quantities, e.g. likelihoods and prior.";
		break;
	
	case 23:
		title = "Selecting run";
		text = "SIRE can run multiple MCMC chains in parallel. This drop-down menu selects how these runs should be displayed. They can either be individually selected or the 'All Runs' options shows the results separately, or the 'Combine' option uses information from all runs simultaneously.";
		break;
		
	case 24:
		title = "Selecting group";
		text = "This drop-down menu selects results to be shown for a particular contact group or for all of them at the same time.";
		break;
		
	case 25:
		title = "Selecting sample";
		text = "This drop-down menu selects results to be shown for a particular posterior sample or for all of them simultaneously.";
		break;
		
	case 26:
		title = "Selecting order";
		text = "This drop-down menu selects the order in which individuals are displayed, either by their ID or by first observation time.";
		break;
		
	case 27:
		title = "Description";
		text = "SIRE allows users to provide a brief description of the data, model and analysis. This is not only useful to keep track for personal use, but also makes it easier and more transparent for others to understand any analysis that has been performed. The description can be edited by clicking on the 'Edit' button (note, bullet points are automatically generated for each carriage return in the editable text box).\nFor an explanation of the details mentioned in the examples, see section 2.1 in the manual.";
		break;
	
	case 28:
		title = "Individual data";
		text = "This shows timelines summarising data for each of the individuals in the population. Different symbols are used to represent infection times, recovery times, disease status measurements and diagnostic test results. Green, red and blue colours are used to indicate susceptible, infectious and recovered, respectively.";
		break;
	
	case 29:
		title = "Individual posteriors";
		text = "This shows posterior distributions for individual timelines. Here the colours indicate the posterior probabilities for the disease status of individuals as a function of time. Green indicates that an individual is susceptible, red indicates infectious and blue indicates recovered. Gradations in colour between these extremes represent posterior uncertainty. Overlaid are the actual data.";
		break;
		
	case 30:
		title = "Loading and saving analyses";
		text = "SIRE permits users to load and save analyses in a special “.sire” format. This is useful because it conveniently allows description, data and analysis to all be contained in a single file for future reference.\nWhen saving, two options are available: “With results” includes the posterior samples along with the model and data (so that inference does not need to be run again when the file is loaded), and “W/o results” does not store the results from inference (leading to a much smaller file size, which can, for example, be emailed)."; 
		break;
	
	case 31:
		title = "Saving and exporting";
		text ="SIRE permits users to load and save analyses in a special “.sire” format. This is useful because it conveniently allows description, data and analysis to all be contained in a single file for future reference. When saving, two options are available: “With results” includes the posterior samples along with the model and data (so that inference does not need to be run again when the file is loaded), and “W/o results” which does not store the results from inference (leading to a much smaller file size, which can, for example, be emailed).\nVarious outputs can be exported from SIRE including graphs (such as trace, scatter and population plots), posterior samples for parameters and events (in text format) and MCMC diagnostic information."; 
		break;
	
	case 32:
		title = "The model";
		text = "Various features of the model can be altered:\nFixed and SNP effects - These can be switched on or off.\nResidual variation - In most standard analyses this variation (i.e. in addition to individual-based variation coming from the fixed effects) is ignored. In reality, however, these contributions may play an important role is determining disease dynamic behaviour, and so it is recommended to incorporate them.\nGroup effect - In a well-controlled disease challenge experiment, where extraneous factors are largely controlled, it may be appropriate to neglect group effects (inclusion in the model leads to an unnecessary reduction in parameter precision). On the other hand, for most real-world field data environmental variation across different locations would doubtless lead to substantial variation in disease transmission rate, and so inclusion of group effects becomes a necessity.";
		break;
	
	case 33:
		title = "Bayes Factor";
		text = "A Bayes factor (BF) is the ratio of the likelihood of one particular hypothesis to the likelihood of another. The BF comparing the full model to one in which a particular parameter is fixed (usually to zero) can be calculated using this button. This is one way to determine statistically significant SNP and fixed effects affecting the three traits. A BF between 3 and 10 represent moderate evidence for one hypothesis over another and exceeding 10 is considered strong evidence.";
		break;
	
	case 34:
		title = "Bayes Factor";
		text = BFtext;
		break;
		
	case 35:
		title = "Parameter";
		text = param[psel].desc+"\n"; 
		break;
		
	case 99:
		title = "Replace";
		text = "This information already exists. Would you like to replace it?";
		break;
		
	case 100:
		title = "An error has occurred!";
		text = errormsg;
		break;
		
	case 101:
		title = "Missing information";
		text = errormsg;
		break;
		
	default: alerton("Help page could not be found!"); return;
	}

	hei = 90;
	
	var d, div;
	div = text.split("\n");
	
	for(d = 0; d < div.length; d++){
		alignparagraph(div[d],wid-35,HELPBUTFONT2);
		hei += nlines*25+10;
	}
	
	if(helptype == 0) hei += fileToLoadlist.length*30;
	
	x = menux+(width-menux)/2-wid/2; y = height/2-hei/2;
	addbutton(div,x,y,wid,hei,HELPBACKBUT,HELPBACKBUT,title,-1);
	
	switch(helptype){
	case 0:
		for(j = 0; j < fileToLoadlist.length; j++){
			te = fileToLoadlist[j].name;
			addbutton(te,x+40,y + nlines*25 + 70 + j*30,textwidth(te,HELPBUTFONT)+20,20,LOADFILEBUT,LOADFILEBUT,j,-1);
		}
		addbutton("Load",x+wid-90,y+hei-40,75,30,IMPBUT,IMPBUT,0,-1);
		break;
		
	case 99:
		addbutton("Cancel",x+wid-90-85,y+hei-40,75,30,IMPBUT,IMPBUT,-1,-1);
		addbutton("OK",x+wid-90,y+hei-40,75,30,IMPBUT,IMPBUT,1,-1);
		break;
		
	default:
		addbutton("OK",x+wid-90,y+hei-40,75,30,IMPBUT,IMPBUT,-1,-1);
		break;
	}
	
	addbutton("",x+wid-40,y+10,25,25,HELPCLOSEBUT,HELPCLOSEBUT,-1,-1);
}

function alertp(st)
{
	errormsg = st;
	helptype = 100;
}

function alertp2(st)
{
	errormsg = st;
	helptype = 101;
}
