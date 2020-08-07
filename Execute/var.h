// Global variable declarations

long noout = 0;                                                   // Suppresses output (used when checking code)

const long SIR = 0, SI = 1;                                       // The type of model
long mod = SIR;

long nsamp, burnin, burning;                                      // The number of samples and the burnin period

const double upfac = 1.005, downfac = 0.9975;                     // Used in optimisating proposal distributions
const double upfacsig = 1.005, downfacsig = 0.9975;
const double PBPfacup = 1.1, PBPfacdown = 0.95, PBPfacmax = 1;
const double jumpPBPmax = 0.5;

const double big = 100000000;                                     // Represent a big number
const double tiny = 0.00000000001;                                // Represents a tiny number

const long defI = 0, defnotI = 1, unknownI = 2;                   // Classifies what is known about whether an individual is infected or not

const long UNIFORM = 0, GAMMA = 1, FIX = 2, NORMAL = 3, LOGNORMAL = 4;  // Different types of prior distribution

long snpfl = 0;                                                   // Set to 1 if SNP data
long diagtestfl = 0;                                              // Set to 1 if diagnostic test data
long unknownIfl = 0;                                              // Set to 1 if there exists unknown infection times
long shiftfl = 0;                                                 // Set to 1 if any events times not known
long randon=0;                                                    // Set to 1 if additive genetic effects on
long envon=0;                                                     // Set to 1 if residuals on
long geffon=0;                                                    // Set to 1 if group effects on
long domon=0;                                                     // Set to 1 if dominance is on

long ndiagtest;                                                   // Diagnostic tests
vector <double> diagtest_logSe, diagtest_logomSe;
vector <double> diagtest_logSp, diagtest_logomSp;
vector <long> diagtest_sens;
vector< vector <long> > ninddtest;
vector< vector< vector <long> > > inddtest;
vector< vector< vector <double> > > inddtestt;

long nprior;                                                      // Priors
vector <long> priorref;
vector <long> priornum;
vector <long> priorty;
vector <double> priorval1;
vector <double> priorval2;
long prior_a_g, prior_a_f, prior_a_r;
long prior_delta_g, prior_delta_f, prior_delta_r;
long prior_vare_gg, prior_vare_ff, prior_vare_rr, prior_vare_gf, prior_vare_gr, prior_vare_fr;
long prior_vara_gg, prior_vara_ff, prior_vara_rr, prior_vara_gf, prior_vara_gr, prior_vara_fr;;
long prior_G, prior_siggeff_g;
long prior_e_g, prior_e_f, prior_e_r;
long prior_q_g, prior_q_f, prior_q_r;
vector <long> prior_fixed_g, prior_fixed_f, prior_fixed_r;
long prior_beta, prior_gama, prior_k;
long prior_R0;

double tmin, tmax;                                                // The minimum and maximum inference times when changing events in a particular contact group

const double kappa = 0.05;                                        // Used in PBPs
long Z;                                                           // Number of contact groups
long nfi;                                                         // Number of fixed effects
vector< vector<string> > finame;                                  // Names of the fixed effects 

long N;                                                           // Number of individuals

long s;                                                           // The sample number

double phi = 1, phidt = 1;                                        // Inverse temperatures for the likelihood and diagnostic test likelihood
double J, K;                                                      // Used for calculating likelihoods

const long INF = 0, REC = 1, END = 4;                             // Event types
const long MBP = 0, PBP = 1;                                      // Model-based or posterior-based proposals

double beta, gama, kshape;                                        // Model Parameters
double a_g, a_f, a_r;

double vare_gg, vare_gf, vare_gr, vare_ff, vare_fr, vare_rr;
double vara_gg, vara_gf, vara_gr, vara_ff, vara_fr, vara_rr;
double Pgg, Pgf, Pgr, Pff, Pfr, Prr, det;
double Pgg_st, Pgf_st, Pgr_st, Pff_st, Pfr_st, Prr_st;

double delta_g, delta_f, delta_r;

double siggeff_g;
vector <double> geff_g;

vector <double> fi_g, fi_f, fi_r;

vector< vector <double> > X;                                      // The design matrix for fixed effects
vector <double> Xmagmax;                                          // The maximum size

vector <long> geno;                                               // The genotype at the SNP (0=AA, 1 = AB and 2=BB)
vector <double> g, f, r;                                          // Deviance in susceptibility, infectivity and recoverability

vector <double> q_g, q_f, q_r;                                    // Additive genetic contribution
vector <double> e_g, e_f, e_r;                                    // Residual contribution

vector <string> indid;                                            // Individual IDs

vector <double> It, Rt;                                           // Infection and recovery times
vector <double> Itmin, Itmax, Rtmin, Rtmax;                       // Minimum and maximum values for these
vector <long> Iposst;                                             // Determines what is known about infection status
vector <long> noRinrangest;                                       // Set to 1 if recovery event not within observed range
vector <long> noIinrangest;                                       // Set to 1 if infection event not within observed range
vector <long> infstat;                                            // if -1: no infection   0: infection   1: artificual infection

vector <double> nItsampav, Itsampav, Itsampav2;                   // Used for insert event sampler

vector <long> indtrial;                                           // The contact group an individual belongs to

vector <vector <long> > trialind;                                 // The individuals within a contact group
vector <vector <long> > trialunknownI;                            // All individuls when it is not known if they become infected or not
double ntrialindav;                                               // The average contact group size

vector <long> ntrialev;                                           // Events in each contact group
vector <vector <long> > trialevind;
vector <vector <double> > trialevt;
vector <vector <long> > trialevty;

vector <double> trialtmin, trialtmax;                             // Inference time range for each contact group
vector <double> obstmin, obstmax;                                 // Observed time range for each contact group

long nev;                                                         // Events within a given contact group
vector <long> evind;
vector <double> evt;
vector <long> evty;
vector <double> evQ;
vector <double> evF;

vector <vector <long> > ntrialevsus;
vector <vector <long> > ntrialevinf;
vector< vector <vector <long> > > trialevsus;
vector< vector <vector <long> > > trialevinf;

vector <vector <double> > A, Ainv;                                // Relationship matrix
vector <double> Ainvdiag;
vector <long> nAinvlist;
vector <vector <long> >  Ainvlist;
vector <vector <double> >Ainvlistval;
vector <long> nAinvlist2;
vector <vector <long> > Ainvlist2;
vector <vector <double> > Ainvlistval2;

long NI;                                                          // Total number of infections excluding intial
long NItot;                                                       // Total number of infections including intial

vector <double> exg, exf, exf2, exr;                              // Temporary varaibles
vector <double> sto;
double con, Jcon, n_g[3], n_f[3], sumg[3], sumbase[3], sum[3][3], sumr[3], sumr2[3], sumldt;
long nssum;
vector <double> ssum0, ssum1, ssum2;
vector <double> sumj;
vector <double> Jz;
vector <double> Kz;
vector <long> nIz;
vector <double> Fst, Fst_pr;
vector <long> nindinf;
vector <vector <long> > indinf;
vector <double> indinfIsum;
vector <long> Ist;

double jump_beta, jump_gama, jump_g, jump_f, jump_r;              // Size of proposal distributions
double jump_delg, jump_delf, jump_delr, jump_kshape;
double jumpe_g, jumpe_f, jumpe_r;
double jumpvare_gg, jumpvare_gf, jumpvare_gr, jumpvare_ff, jumpvare_fr, jumpvare_rr;
double jumpPBP[18];

double jumpq_g, jumpq_f, jumpq_r;
double jumpvara_gg, jumpvara_gf, jumpvara_gr, jumpvara_ff, jumpvara_fr, jumpvara_rr;
double jumpgeff_g, jumpsiggeff_g;
vector <double> jumpfi_g, jumpfi_f, jumpfi_r;
vector <double> jumpI, jumpR, ntr_I, nac_I, ntr_R, nac_R;

vector <double> ntr_addinf, nac_addinf, ntr_reminf, nac_reminf;  // Number of tried an accepted proposals for each type

double ntr[5], nac[5];
double ntr_rec[4], nac_rec[4];

double ntr_PBP[18], nac_PBP[18], nfa_PBP[18];

double ntr_e_g, nac_e_g;
double ntr_e_f, nac_e_f;
double ntr_e_r, nac_e_r;

double ntr_e_vare_g, nac_e_vare_g;

double ntr_vare_gg, nac_vare_gg;
double ntr_vare_gf, nac_vare_gf;
double ntr_vare_gr, nac_vare_gr;
double ntr_vare_ff, nac_vare_ff;
double ntr_vare_fr, nac_vare_fr;
double ntr_vare_rr, nac_vare_rr;

double ntr_q_g, nac_q_g;
double ntr_q_f, nac_q_f;
double ntr_q_r, nac_q_r;

double ntr_vara_gg, nac_vara_gg;
double ntr_vara_gf, nac_vara_gf;
double ntr_vara_gr, nac_vara_gr;
double ntr_vara_ff, nac_vara_ff;
double ntr_vara_fr, nac_vara_fr;
double ntr_vara_rr, nac_vara_rr;

double ntr_geff_g, nac_geff_g;
double ntr_siggeff_g, nac_siggeff_g;

vector <double> ntr_fi_g, nac_fi_g;
vector <double> ntr_fi_f, nac_fi_f;
vector <double> ntr_fi_r, nac_fi_r;

double timetot = 0, time_param = 0, time_paraminit = 0;           // The CPU times for different proposal
double time_fi = 0, time_e_g = 0, time_e_ginit = 0;
double time_e_f = 0, time_e_finit = 0, time_check = 0;
double time_q_g = 0, time_q_ginit = 0, time_q_f = 0;
double time_q_finit = 0, time_e_r = 0, time_e_rinit = 0;
double time_q_r = 0, time_q_rinit = 0, time_geff_g = 0;
double time_PBPe_g = 0, time_PBPe_f = 0, time_PBPe_r = 0;
double time_vare = 0, time_vara = 0;
double time_rec = 0, time_recinit = 0;
double time_eq = 0;
double time_events = 0, time_init2 = 0, time_addreminf = 0;

double Li, J_mc, Lrec, K_mc, Lie, Liq, Ligeff_g, Ldtest;           // Likelihoods
double Pri;                                                        // Priors

void emsg(string msg)                                              // Outputs error messages
{
  cout << msg << "\n";
  exit (EXIT_FAILURE);
}
