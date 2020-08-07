// Proposals for q_g + related covariance matrix elements

double Lpropa_g()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  J = 0;
  for(j = 0; j < N; j++){
    J += exp(q_g[j])*sumj[j];
    if(infstat[j] == 0) L += q_g[j];
  }
  L += NI*log(beta) - beta*J;

  return L;
}

void propq_g()                                             // Makes proposals to q_g
{
  long z, e, j, jj, i, loop, loop2, fi;
  double t, t2, F, q_old, q_new, al, dL, dLq, sum, val_f, val_g, val, dJ, dPri, sum_g, sum_f, sum_r, fac, fac2;

  time_q_g -= clock();
  time_q_ginit -= clock();

  for(j = 0; j < N; j++){
    if(snpfl == 1){
      switch(geno[j]){
        case 0: val_f = a_f; val_g = a_g; break;
        case 1: val_f = delta_f*a_f; val_g = delta_g*a_g; break;
        case 2: val_f = -a_f; val_g = -a_g; break;
      }
    }
    else{ val_f = 0; val_g = 0;}

    if(geffon == 1) val_g += geff_g[indtrial[j]];
    val_f += q_f[j] + e_f[j]; val_g += e_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
    exf[j] = exp(val_f); exg[j] = exp(val_g);
  }

  for(j = 0; j < N; j++) sumj[j] = 0;

  con = 0;
  for(z = 0; z < Z; z++){
    F = 0;

    t = -big;
    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];

      val = F*(t2-t);
      for(i = 0; i < ntrialevsus[z][e]; i++){
        j = trialevsus[z][e][i]; sumj[j] += exg[j]*val;
      }
      t = t2;

      j = trialevind[z][e];
      switch(trialevty[z][e]){
        case INF: if(infstat[j] == 0) con += log(F*exg[j]); F += exf[j]; break;
        case REC: F -= exf[j]; break;
        case END: e = ntrialev[z]; break;
      }
    }
  }
  getPa();
  time_q_ginit += clock();

  for(loop = 0; loop < 3; loop++){
    for(j = 0; j < N; j++){
      q_old = q_g[j];
      q_new = q_old + normal(0,jumpq_g);

      dJ = (exp(q_new)-exp(q_old))*sumj[j];
      dL = -beta*dJ;
      dPri = priorind(prior_q_g,q_new)-priorind(prior_q_g,q_old);

      if(infstat[j] == 0) dL += q_new - q_old;

      fac = Ainvdiag[j];
      sum_g = 0; sum_f = fac*q_f[j]; if(mod == SIR) sum_r = fac*q_r[j];
      for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj]; if(mod == SIR) sum_r += fac2*q_r[jj]; }

      if(mod == SIR) dLq = -((q_new*q_new - q_old*q_old)*fac*Pgg + 2*(q_new-q_old)*(sum_g*Pgg + sum_f*Pgf + sum_r*Pgr))/2;
      else dLq = -((q_new*q_new - q_old*q_old)*fac*Pgg + 2*(q_new-q_old)*(sum_g*Pgg + sum_f*Pgf))/2;

      al = exp(dL+dLq+dPri);

      ntr_q_g++;
      if(ran() < al){
        nac_q_g++;

        q_g[j] = q_new;
        Li += dL; J_mc += dJ; Pri += dPri;
        Liq += dLq;

        if(burning == 1) jumpq_g *= upfac;
      }
      else{
        if(burning == 1) jumpq_g *= downfac;
      }
    }

    propvara();
  }
  time_q_g += clock();
}
