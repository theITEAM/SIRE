const long PR_prior_e_g = 0, PR_prior_e_f = 1, PR_prior_e_r = 2, PR_prior_q_g = 3, PR_prior_q_f = 4, PR_prior_q_r = 5;
const long PR_prior_G = 6, PR_prior_siggeff_g = 7, PR_prior_a_g = 8, PR_prior_a_f = 9, PR_prior_a_r = 10, PR_prior_delta_g = 11, PR_prior_delta_f = 12, PR_prior_delta_r = 13;
const long PR_prior_vare_gg = 14, PR_prior_vare_ff = 15, PR_prior_vare_rr = 16, PR_prior_vare_gf = 17, PR_prior_vare_gr = 18, PR_prior_vare_fr = 19;
const long PR_prior_vara_gg = 20, PR_prior_vara_ff = 21, PR_prior_vara_rr = 22, PR_prior_vara_gf = 23, PR_prior_vara_gr = 24, PR_prior_vara_fr = 25;
const long PR_prior_fixed_g = 26, PR_prior_fixed_f = 27, PR_prior_fixed_r = 28, PR_prior_k = 29, PR_prior_beta = 30, PR_prior_gama = 31, PR_prior_R0 = 32;

void priorinit()                                                            // Initialises priors
{
  long fi, j, z;

  nprior = 0;

  prior_beta = nprior; addprior(PR_prior_beta,-1,UNIFORM,0,big);
  if(mod == SIR){
    prior_gama = nprior; addprior(PR_prior_gama,-1,UNIFORM,0,big);
    prior_k = nprior; addprior(PR_prior_k,-1,UNIFORM,1,10);
    prior_R0 = nprior; addprior(PR_prior_R0,-1,UNIFORM,0,20);
  }

  if(envon == 1){
    prior_e_g = nprior; for(j = 0; j < N; j++) addprior(PR_prior_e_g,j,UNIFORM,-3.45,3.45);
    prior_e_f = nprior; for(j = 0; j < N; j++) addprior(PR_prior_e_f,j,UNIFORM,-3.45,3.45);
    if(mod == SIR){ prior_e_r = nprior; for(j = 0; j < N; j++) addprior(PR_prior_e_r,j,UNIFORM,-3.45,3.45);}
   }

  if(randon == 1){
    prior_q_g = nprior; for(j = 0; j < N; j++) addprior(PR_prior_q_g,j,UNIFORM,-3.45,3.45);
    prior_q_f = nprior; for(j = 0; j < N; j++) addprior(PR_prior_q_f,j,UNIFORM,-3.45,3.45);
    if(mod == SIR){ prior_q_r = nprior; for(j = 0; j < N; j++) addprior(PR_prior_q_r,j,UNIFORM,-3.45,3.45);}
  }

  if(geffon == 1){
    prior_G = nprior; for(z = 0; z < Z; z++) addprior(PR_prior_G,z,UNIFORM,-2.3,2.3);
    prior_siggeff_g = nprior; addprior(PR_prior_siggeff_g,-1,UNIFORM,0,3);
  }

  if(snpfl == 1){
    prior_a_g = nprior; addprior(PR_prior_a_g,-1,UNIFORM,-2.3,2.3);
    prior_a_f = nprior; addprior(PR_prior_a_f,-1,UNIFORM,-2.3,2.3);
    if(mod == SIR){ prior_a_r = nprior; addprior(PR_prior_a_r,-1,UNIFORM,-2.3,2.3);}
    prior_delta_g = nprior; addprior(PR_prior_delta_g,-1,UNIFORM,-1,1);
    prior_delta_f = nprior; addprior(PR_prior_delta_f,-1,UNIFORM,-1,1);
    if(mod == SIR){ prior_delta_r = nprior; addprior(PR_prior_delta_r,-1,UNIFORM,-1,1);}
  }

  if(envon == 1){
    prior_vare_gg = nprior; addprior(PR_prior_vare_gg ,-1,UNIFORM,0.01,4);
    prior_vare_ff = nprior; addprior(PR_prior_vare_ff,-1,UNIFORM,0.01,4);
    if(mod == SIR){ prior_vare_rr = nprior; addprior(PR_prior_vare_rr,-1,UNIFORM,0.01,4);}

    prior_vare_gf = nprior; addprior(PR_prior_vare_gf,-1,UNIFORM,-big,big);
    if(mod == SIR){
      prior_vare_gr = nprior; addprior(PR_prior_vare_gr,-1,UNIFORM,-big,big);
      prior_vare_fr = nprior; addprior(PR_prior_vare_fr,-1,UNIFORM,-big,big);
    }
  }

  if(randon == 1){
    prior_vara_gg = nprior; addprior(PR_prior_vara_gg,-1,UNIFORM,0.01,4);
    prior_vara_ff = nprior; addprior(PR_prior_vara_ff,-1,UNIFORM,0.01,4);
    if(mod == SIR){ prior_vara_rr = nprior; addprior(PR_prior_vara_rr,-1,UNIFORM,0.01,4);}

    prior_vara_gf = nprior; addprior(PR_prior_vara_gf,-1,UNIFORM,-big,big);
    if(mod == SIR){
      prior_vara_gr = nprior; addprior(PR_prior_vara_gr,-1,UNIFORM,-big,big);
      prior_vara_fr = nprior; addprior(PR_prior_vara_fr,-1,UNIFORM,-big,big);
    }
  }

  for(fi = 0; fi < nfi; fi++){
    prior_fixed_g.push_back(nprior); addprior(PR_prior_fixed_g,fi,UNIFORM,-2.3,2.3);
    prior_fixed_f.push_back(nprior); addprior(PR_prior_fixed_f,fi,UNIFORM,-2.3,2.3);
    if(mod == SIR){ prior_fixed_r.push_back(nprior); addprior(PR_prior_fixed_r,fi,UNIFORM,-2.3,2.3);}
  }
}

void addprior(long ref, long num, long ty, double val1, double val2)   // Adds a nerw prior
{
  priorref.push_back(ref);
  priornum.push_back(num);
  priorty.push_back(ty);
  priorval1.push_back(val1);
  priorval2.push_back(val2);
  nprior++;
}

double priorsamp(long pr, double min, double max, double mid)                       // Samples from the prior
{
  long loop;
  double val, val1, val2;
  val1 = priorval1[pr]; val2 = priorval2[pr];

  for(loop = 0; loop < 100000; loop++){
    switch(priorty[pr]){
      case UNIFORM:
        if(val1 < min) val1 = min; if(val2 > max) val2 = max;
        if(val2 == big) val2 = val1 + 0.2;
        if(mid < val1) mid = val1; if(mid > val2) mid = val2; 
        val = normal(mid,0.1*(val2-val1));
        break;
      case GAMMA: val = gammasamp(val1,val2); break;
      case FIX: val = val1; break;
      case NORMAL: val = normal(val1,sqrt(val2)); break;
      case LOGNORMAL: val = exp(normal(val1,sqrt(val2))); break;
    }
    if(val >= min && val <= max) return val;
  }
  emsg("Prior specification invalid");
  return -1;
}

double prior()                                               // Calculates the total prior probability
{
  long pr;
  double Pr;

  Pr = 0; for(pr = 0; pr < nprior; pr++) Pr += priorind(pr,getpriorval(pr));
  return Pr;
}

double priorind(long pr, double val)                         // Calculates the prior probability for a particulat distribution
{
  double val1, val2;

  val1 = priorval1[pr]; val2 = priorval2[pr];
  switch(priorty[pr]){
    case UNIFORM:
      if(val < val1 || val > val2) return -big;
      else return 0;//log(1.0/(val2-val1));

    case GAMMA:
      if(val <= 0) return -big;
      return gammaprob(val,val1,val2);

    case NORMAL:
      return normalprob(val,val1,val2);

    case LOGNORMAL:
      if(val < 0) return -big;
      return lognormalprob(val,val1,val2);

    case FIX:
      if(val != val1) return -big;
      else return 0;
  }
  emsg("Prior problem");
  return -1;
}

double getpriorval(long pr)                                     // Gets the value of a variable connected to a prior
{
  long fi;

  switch(priorref[pr]){
    case PR_prior_e_g: return e_g[priornum[pr]];
    case PR_prior_e_f: return e_f[priornum[pr]];
    case PR_prior_e_r: return e_r[priornum[pr]];
    case PR_prior_q_g: return q_g[priornum[pr]];
    case PR_prior_q_f: return q_f[priornum[pr]];
    case PR_prior_q_r: return q_r[priornum[pr]];
    case PR_prior_G: return geff_g[priornum[pr]];
    case PR_prior_siggeff_g: return siggeff_g;
    case PR_prior_a_g: return a_g;
    case PR_prior_a_f: return a_f;
    case PR_prior_a_r: return a_r;
    case PR_prior_delta_g: return delta_g;
    case PR_prior_delta_f: return delta_f;
    case PR_prior_delta_r: return delta_r;
    case PR_prior_vare_gg: return vare_gg;
    case PR_prior_vare_ff: return vare_ff;
    case PR_prior_vare_rr: return vare_rr;
    case PR_prior_vare_gf: return vare_gf;
    case PR_prior_vare_gr: return vare_gr;
    case PR_prior_vare_fr: return vare_fr;
    case PR_prior_vara_gg: return vara_gg;
    case PR_prior_vara_ff: return vara_ff;
    case PR_prior_vara_rr: return vara_rr;
    case PR_prior_vara_gf: return vara_gf;
    case PR_prior_vara_gr: return vara_gr;
    case PR_prior_vara_fr: return vara_fr;
    case PR_prior_fixed_g: return fi_g[priornum[pr]];
    case PR_prior_fixed_f: return fi_f[priornum[pr]]; 
    case PR_prior_fixed_r: return fi_r[priornum[pr]];
    case PR_prior_k: return kshape;
    case PR_prior_beta: return beta;
    case PR_prior_gama: return gama;
    case PR_prior_R0: if(mod == SI) return 0; else return beta*(ntrialindav-1)/gama;
    default: emsg("Prior problem");
  }
  return -1;
}
