 // The various type of likelihodd used
 
double likelihood()                                     // The likelihood for the infection process
{
  long z, i, j, ii, jj, e, fi;
  double L, t, t2, Q, F, val_g, val_f;

  for(j = 0; j < N; j++){
    if(snpfl == 1){
      switch(geno[j]){
        case 0: val_g = a_g; val_f = a_f; break;
        case 1: val_g = delta_g*a_g; val_f = delta_f*a_f; break;
        case 2: val_g = -a_g; val_f = -a_f; break;
        default: emsg("Problem SNP value not correct"); break;
      }
    }
    else{ val_g = 0; val_f = 0;}

    if(geffon == 1) val_g += geff_g[indtrial[j]];

    for(fi = 0; fi < nfi; fi++){ val_g += X[j][fi]*fi_g[fi]; val_f += X[j][fi]*fi_f[fi];}
    exg[j] = exp(val_g + q_g[j] + e_g[j]); exf[j] = exp(val_f + q_f[j] + e_f[j]);
  }

  L = 0; J = 0;
  for(z = 0; z < Z; z++){
    F = 0; Q = 0; for(i = 0; i < trialind[z].size(); i++) Q += exg[trialind[z][i]];
    t = -big;

    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];
      j = trialevind[z][e];
      J += Q*F*(t2-t);
      if(Q < -0.1 || F < -0.1){ emsg("Problem EC1");}
      t = t2;
      switch(trialevty[z][e]){
        //case ENT: Q += exg[j]; break;

        case INF:
          if(infstat[j] == 0){
            if(F < tiny) emsg("Problem EC2");
            L += log(exg[j]*F);
          }
          F += exf[j]; Q -= exg[j];
          break;

        case REC:
          F -= exf[j];
          break;

        //case LEA: if(It[j] != -big && t < Rt[j]) F -= exf[j]; else Q -= exg[j]; break;

        case END:
          e = ntrialev[z];
          break;
      }
      t = t2;
    }
  }

  L += NI*log(beta) - beta*J;
  if(isnan(L)) emsg("Likelihood is not a number");

  return L;
}

double likelihood_rec()                               // The likelihood for the recovery process
{
  long fi, j;
  double L, dt, r, rr;

  if(mod == SI) return 0;

  L = 0; K = 0;
  for(j = 0; j < N; j++){
    if(infstat[j] >= 0){
      if(snpfl == 1){
        switch(geno[j]){
          case 0: r = a_r; break;
          case 1: r = delta_r*a_r; break;
          case 2: r = -a_r; break;
        }
      }
      else r = 0;

      for(fi = 0; fi < nfi; fi++) r += X[j][fi]*fi_r[fi];
      r += q_r[j] + e_r[j];

      exr[j] = exp(r);
      dt = Rt[j]-It[j]; if(dt <= 0) emsg("The time has become negative");
      K += exp(r)*kshape*dt;
      L += kshape*r + (kshape-1)*log(dt);
    }
  }

  L += NItot*kshape*log(kshape*gama) - NItot*lgamma(kshape) - K*gama;

  return L;
}

double likelihoodgeff_g()                                  // The likelihood for the group effect
{
  long z;
  double sum;

  sum = 0; for(z = 0; z < Z; z++) sum += geff_g[z]*geff_g[z];
  return -Z*log(siggeff_g) - sum/(2*siggeff_g*siggeff_g);
}

void getPa()                                              // Gets the inverse of the covariance matrix for additive gentic effects
{
  if(mod == SIR){
    det = vara_gg*(vara_ff*vara_rr-vara_fr*vara_fr) - vara_gf*(vara_gf*vara_rr - vara_gr*vara_fr) + vara_gr*(vara_gf*vara_fr - vara_gr*vara_ff);

    Pgg = (vara_rr*vara_ff - vara_fr*vara_fr)/det; Pgf = -(vara_rr*vara_gf - vara_fr*vara_gr)/det; Pgr = (vara_fr*vara_gf - vara_ff*vara_gr)/det;
    Pff = (vara_gg*vara_rr - vara_gr*vara_gr)/det; Pfr = -(vara_gg*vara_fr - vara_gf*vara_gr)/det; Prr = (vara_gg*vara_ff - vara_gf*vara_gf)/det;
  }
  else{
    det = vara_gg*vara_ff - vara_gf*vara_gf;
    Pgg = vara_ff/det; Pff = vara_gg/det; Pgf = -vara_gf/det;
  }
}

void getP()                                              // Gets the inverse of the covariance matrix for residuals
{
  if(mod == SIR){
    det = vare_gg*(vare_ff*vare_rr-vare_fr*vare_fr) - vare_gf*(vare_gf*vare_rr - vare_gr*vare_fr) + vare_gr*(vare_gf*vare_fr - vare_gr*vare_ff);

    Pgg = (vare_rr*vare_ff - vare_fr*vare_fr)/det; Pgf = -(vare_rr*vare_gf - vare_fr*vare_gr)/det; Pgr = (vare_fr*vare_gf - vare_ff*vare_gr)/det;
    Pff = (vare_gg*vare_rr - vare_gr*vare_gr)/det; Pfr = -(vare_gg*vare_fr - vare_gf*vare_gr)/det; Prr = (vare_gg*vare_ff - vare_gf*vare_gf)/det;
  }
  else{
    det = vare_gg*vare_ff - vare_gf*vare_gf;
    Pgg = vare_ff/det; Pff = vare_gg/det; Pgf = -vare_gf/det;
  }
}

double likelihoode()                                                 // Gets the likelihood for the residuals
{
  long j;
  double sumgg, sumgf, sumgr, sumff, sumfr, sumrr;

  if(mod == SIR){
    sumgg = 0; sumgf = 0; sumgr = 0; sumff = 0; sumfr = 0; sumrr = 0;
    for(j = 0; j < N; j++){
      sumgg += e_g[j]*e_g[j]; sumgf += e_g[j]*e_f[j]; sumgr += e_g[j]*e_r[j]; sumff += e_f[j]*e_f[j]; sumfr += e_f[j]*e_r[j]; sumrr += e_r[j]*e_r[j];
    }
    getP();
    return -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumrr*Prr + 2*sumgf*Pgf + 2*sumgr*Pgr + 2*sumfr*Pfr)/2;
  }
  else{
    sumgg = 0; sumgf = 0; sumff = 0;
    for(j = 0; j < N; j++){
      sumgg += e_g[j]*e_g[j]; sumgf += e_g[j]*e_f[j]; sumff += e_f[j]*e_f[j];
    }
    getP();
    return -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + 2*sumgf*Pgf)/2;
  }
}

double likelihoodq()                                                // Gets the likelilihood for the additive genetic contributions
{
  long j, jj, k;
  double sumgg, sumgf, sumgr, sumff, sumfr, sumrr, fac;

  if(mod == SIR){
    getPa();

    sumgg = 0; sumgf = 0; sumgr = 0; sumff = 0; sumfr = 0; sumrr = 0;
    for(j = 0; j < N; j++){
      fac = Ainvdiag[j];
      sumgg += q_g[j]*q_g[j]*fac; sumff += q_f[j]*q_f[j]*fac; sumrr += q_r[j]*q_r[j]*fac;
      sumgf += 2*q_g[j]*q_f[j]*fac; sumgr += 2*q_g[j]*q_r[j]*fac; sumfr += 2*q_f[j]*q_r[j]*fac;
      for(k = 0; k < nAinvlist2[j]; k++){
        jj = Ainvlist2[j][k];
        fac = 2*Ainvlistval2[j][k];
        sumgg += q_g[j]*q_g[jj]*fac; sumff += q_f[j]*q_f[jj]*fac; sumrr += q_r[j]*q_r[jj]*fac;
        sumgf += (q_g[j]*q_f[jj]+q_f[j]*q_g[jj])*fac; sumgr += (q_g[j]*q_r[jj]+q_r[j]*q_g[jj])*fac; sumfr += (q_f[j]*q_r[jj]+q_r[j]*q_f[jj])*fac;
      }
    }

    return -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumrr*Prr + sumgf*Pgf + sumgr*Pgr + sumfr*Pfr)/2;
  }
  else{
    getPa();

    sumgg = 0; sumgf = 0; sumff = 0;
    for(j = 0; j < N; j++){
      fac = Ainvdiag[j];
      sumgg += q_g[j]*q_g[j]*fac; sumff += q_f[j]*q_f[j]*fac; sumgf += 2*q_g[j]*q_f[j]*fac;
      for(k = 0; k < nAinvlist2[j]; k++){
        jj = Ainvlist2[j][k];
        fac = 2*Ainvlistval2[j][k];
        sumgg += q_g[j]*q_g[jj]*fac; sumff += q_f[j]*q_f[jj]*fac; sumgf += (q_g[j]*q_f[jj]+q_f[j]*q_g[jj])*fac; 
      }
    }

    return -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumgf*Pgf)/2;
  }
}

double likelihood_dtest()                                               // Gets the likelihood for diagnostic tests
{
  long j, k, diat;
  double L, inft, rect, t;

  L = 0;
  for(j = 0; j < N; j++){
    inft = It[j]; rect = Rt[j]; if(inft != -big && rect == -big) emsg("Infection and recovery times not consistent");
    for(diat = 0; diat < ndiagtest; diat++){
      for(k = 0; k < ninddtest[diat][j]; k++){
        t = inddtestt[diat][j][k];
        if(diagtest_sens[diat] == 1){                                   // sensitive to I only
          if(inft != -big && t > inft && t < rect){   // "Infected"
            if(inddtest[diat][j][k] == 1) L += diagtest_logSe[diat]; else L += diagtest_logomSe[diat];
          }
          else{                                       // Not "infected"
            if(inddtest[diat][j][k] == 0) L += diagtest_logSp[diat]; else L += diagtest_logomSp[diat];
          }
        }
        else{                                                          // sensitive to I and R
          if(inft != -big && t > inft){               // "Infected"
            if(inddtest[diat][j][k] == 1) L += diagtest_logSe[diat]; else L += diagtest_logomSe[diat];
          }
          else{                                       // Not "infected"
            if(inddtest[diat][j][k] == 0) L += diagtest_logSp[diat]; else L += diagtest_logomSp[diat];
          }
        }
      }
    }
  }
  return L;
}
