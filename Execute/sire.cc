// SIRE stands for “Susceptibility, Infectivity and Recoverability Estimation”.

// This is a software tool which allows simultaneous estimation of the genetic effect of a single nucleotide polymorphism (SNP), as well as environmental and non-genetic influence on host susceptibility, infectivity and recoverability.

// This work is descrivbed in:

// "Estimating individuals’ genetic and non-genetic effects underlying infectious disease transmission from temporal epidemic data"

// Christopher M. Pooley 1,2*, Glenn Marion 2&, Stephen C. Bishop&, Richard I. Bailey, and Andrea B. Doeschl-Wilson 1& 
// 1 The Roslin Institute, The University of Edinburgh, Midlothian, EH25 9RG, UK. 
// 2 Biomathematics and Statistics Scotland, James Clerk Maxwell Building, The King's Buildings, Peter Guthrie Tait Road, Edinburgh, EH9 3FD, UK 
// & Deceased

// Submitted to PLOS computational biology.


// This code takes the init.xml input file from the SIRE interface and performs MCMC analysis.
// This produces posterior samples for both paramters and event sequences which are then output to be read back by the SIRE interface.

// Compile using:    g++ sire.cc tinyxml2.cc -O3
// Run using a.out

#include "tinyxml2.h"

using namespace tinyxml2;

using namespace std;

#include <stdio.h>                                          // Libraries
#include <stdlib.h>
#include <fstream>
#include <iostream>
#include <math.h>
#include <time.h>
#include <sstream>
#include <iomanip>
#include <vector>
#include <algorithm>

// In var.h
void emsg(string msg);                                      // Outputs error messages

// In likelihood.h
double likelihood();                                        // The likelihood for the infection process
double likelihood_rec();                                    // The likelihood for the recovery process
double likelihoodgeff_g();                                  // The likelihood for the group effect
void getPa();                                               // Inverse of the covariance matrix for additive gentic effects
void getP();                                                // Gets the inverse of the covariance matrix for residuals
double likelihoode();                                       // Gets the likelihood for the residuals
double likelihoodq();                                       // Gets the likelilihood for the additive genetic contributions
double likelihood_dtest();                                  // Gets the likelihood for diagnostic tests

// In check.h
void check(long num);                                       // Checks all parameters are correct
void trialevcheck();                                        // Checks the event sequences for individuals are consistent
void checkinfstat(long num);                                // Checks the infection status of individuals
void checkevQ(long z);                                      // Checks evQ and evF are correct when performing event changes

// In propsoal.h
void prop_betagama();                                       // Makes proposals to beta and gamma
double Lpropfast();                                         // Fast calculation of the likelihood based of recalculated quantities
void prop_param();                                          // Makes proposal to a_g, a_f, delta_a, delta_f

// In proposal_rec.h
double likelihood_rec_fast();                               // Recovery likelihood using precalculated quantities
void prop_rec();                                            // Proposes changes to a_r, delta_r, and kshape

// In proposal_e_g.h
double Lprope_g();                                          // Likelihood based on precalculated quantities
void prope_g();                                             // Makes proposals to e_g
void PBPe_g();                                              // PBPs which similtaneously update e_g and covariance matrix

// In proposal_e_f.h
double Lprope_f();                                          // Likelihood based on precalculated quantities
void prope_f();                                             // Makes proposals to e_f
void PBPe_f();                                              // PBPs which similtaneously update e_f and covariance matrix
void MBPe_f();                                              // PBPs which similtaneously update e_f and covariance matrix

// In proposal_e_r.h
double Lprope_r();                                          // Likelihood based on precalculated quantities
void prope_r();                                             // Makes proposals to e_r
void PBPe_r();                                              // PBPs which similtaneously update e_r and covariance matrix

// In proposal_vare.h
void propvare();                                            // Proposes changes covariance matrix for residuals

// In proposal_q_g.h
double Lpropq_g();                                          // Fast calculation for likelihood based on precalculated quantities
void propq_g();                                             // Makes proposals to q_g

// In proposal_q_f.h
double Lpropq_f();                                          // Fast calculation for likelihood based on precalculated quantities
void propq_f();                                             // Makes proposals to q_f

// In proposal_q_r.h
double Lpropq_r();                                          // Fast calculation for likelihood based on precalculated quantities
void propq_r();                                             // Makes proposals to q_r

// In proposal_vara.h
void propvara();                                            // Proposes changes covariance matrix for additive genetic contribution

// In proposal_eq.h
void propeq();                                              // Makes changes which simulatanous alter environmental and additive contributions keep other things fixed

// In proposal_fi.h
void proposal_fi();                                         // Makes proposals to fixed effects

// In proposal_event.h
void propevent();                                           // Proposes event changes along the timelune
void shiftI(long e);                                        // Moves an infection event
void shiftR(long e);                                        // Moves a recovery event
void insertinf(long j);                                     // Creates infection / recovery events for individual j
void removeinf(long j);                                     // Removes infection / recovery events for individual j
void infsampler();                                          // Optimises the event sampler when adding and removing infections

// In proposal_geff_g.h
double Lpropgeff_g();                                       // Fast calculation for likelihood based on precalculated quantities
void propgeff_g();                                          // Makes proposals in the group contribution

// In prior.h
void priorinit();                                           // Initialises priors
void addprior(long ref, long num, long ty, double val1, double val2);   // Adds a nerw prior
double priorsamp(long pr);                                  // Samples from the prior
double prior();                                             // Calculates the total prior probability
double priorind(long pr, double val);                       // Calculates the prior probability for a particulat distribution
double getpriorval(long pr);                                // Gets the value of a variable connected to a prior
double priorR0();                                           // The prior for the basic reprodctive ratio R0

// In init.h
void init();                                                // Initialises variables before posterior sampling can begin
void init2();                                               // Initialises quantities for perfoming event changes
void addev(long z, long j, double t, long ty);              // Adds an events to the time line

// In dist.h
double gammaprob(double x, double a, double b);             // The log of the probability from the gamma distribution
double gammasamp(double a, double b);                       // Draws a sample from the gamma distribution x^(a-1)*exp(-b*x)
double normalprob(double x, double mean, double var);       // The log of the probability from the normal distribution
double lognormalprob(double x, double mean, double var);    // The log of the probability from the lognormal distribution
double betaprob(double x, double a, double b);              // The log of the probability from the beta distribution
double binomialprob(double p, int N, int k);                // The log of the probability from the bonomial distribution
double ran();                                               // Random uniform sample between 0 and 1 inclussive
double ranin();                                             // Random uniform sample between 0 and 1 exclussive
double normal(float mu, double  sd);                        // Draws a sample from the normal distribution
double normal_var(double var);                              // Draws a normally distributed sample with zero mean

// In io.h
string get(XMLNode* node, string attr);                     // Gets an attribute from an XML node
bool exi(XMLNode* node, string attr);                       // Checks if an attibute exists on an XML node
double getnum(XMLNode* node, string attr);                  // Gets a number attribute from an XML node
vector<string> getcommasep(string a);                       // Comma seperates a string
void readfile(string file);                                 // Reads the input file
void invertmatrix();                                        // Inverts the relationship matrix
void initevents();                                          // enerates the initial set of infection and recovery times

// In output.h

void traceinit();                                           // Initialises the trace plot
void traceplot();                                           // Outputs varaible values
void diagnostic();                                          // Outputs MCMC diagnostics

#include "var.h"                                            // Global variable declarations
#include "dist.h"                                           // Functions related to mathematical distributions
#include "likelihood.h"                                     // The various type of likelihodd used
#include "check.h"                                          // Code for checking the correct operation of the code

#include "proposal.h"                                       // Proposals for parameters related to infection
#include "proposal_rec.h"                                   // Proposals for parameters related to recovery
#include "proposal_e_g.h"                                   // Proposals for e_g + related covariance matrix elements
#include "proposal_e_f.h"                                   // Proposals for e_f + related covariance matrix elements
#include "proposal_e_r.h"                                   // Proposals for e_r + related covariance matrix elements
#include "proposal_vare.h"                                  // Proposals for covariance matrix elements for residual
#include "proposal_q_g.h"                                   // Proposals for q_g + related covariance matrix elements
#include "proposal_q_f.h"                                   // Proposals for q_f + related covariance matrix elements
#include "proposal_q_r.h"                                   // Proposals for q_r + related covariance matrix elements
#include "proposal_vara.h"                                  // Proposals for covariance matrix elements for additive gentics part
#include "proposal_eq.h"                                    // Proposals for simulatenously changing e and q
#include "proposal_fi.h"                                    // Proposals for fixed effects
#include "proposal_event.h"                                 // Proposals for event sequences
#include "proposal_geff_g.h"                                // Proposals for group effects

#include "prior.h"                                          // Functions related to the prior
#include "init.h"                                           // Initialisation
#include "io.h"                                             // Loading the input file
#include "output.h"                                         // Output for the SIRE interface

int main (int argc, char *argv[])
{
  long l, i, fi, loop, simnum=0;
  string file;

  if(argc == 1){  noout = 1; file = "init.xml";}
  if(argc > 1){ file = argv[1]; simnum = atoi(argv[2]);}      // Creates a different seed for different chains
  for(l = 0; l < 5555*simnum; l++) ran();

  readfile(file);                                             // Reads in the input file

  init();                                                     // Initialises MCMC quantites

  timetot -= clock();
  for(s = 0; s < nsamp; s++){                                 // Performs MCMC sampling
    if(s < burnin) burning = 1; else burning = 0;

    if(noout == 1 && s%1 == 0) cout << s << " / " << nsamp << "\n";

    prop_betagamak();

    if(snpfl == 1){ prop_param(); if(mod == SIR) prop_rec();}

    if(envon == 1 || randon == 1) init2();

    if(envon == 1){
      prope_g();
      prope_f();
      if(mod == SIR) prope_r();
    }

    if(randon == 1){
      propq_g();
      propq_f();
      if(mod == SIR) propq_r();
    }

    if(envon == 1 && randon == 1){
      propeq();
    }

    if(geffon == 1) propgeff_g();

    if(nfi > 0) proposal_fi();

    if(shiftfl == 1){
      propevent();
      if(unknownIfl == 1 && burning == 1) infsampler();
    }

    if(s%5 == 0) check(1);

    if(noout == 0){
      if(s%1 == 0) traceplot();
      if(s%50 == 0) eventplot();
      if(s%100 == 0 && s != 0) diagnostic();
    }
  }
  timetot += clock();
}
