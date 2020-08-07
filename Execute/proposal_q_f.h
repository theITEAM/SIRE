// Proposals for q_f + related covariance matrix elements

double Lpropq_f()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  J = Jcon;
  for(j = 0; j < N; j++){
    J += exp(q_f[j])*sumj[j];
    if(infstat[j] == 0) L += log(Fst[j]);
  }
  L += NI*log(beta) - beta*J;

  return L;
}

void propq_f()                                             // Makes proposals to q_f
{
  long z, e, j, jj, i, loop, loop2, fi;
  double t, t2, q_old, q_new, al, dL, dLq, sum, F, dF, val_f, val_g, val, va, dJ, dPri, fac, fac2, sum_g, sum_r, sum_f;

  time_q_f -= clock();
  time_q_finit -= clock();

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
    val_f += e_f[j]; val_g += e_g[j] + q_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
    exf[j] = exp(val_f); exf2[j] = exp(val_f+q_f[j]); exg[j] = exp(val_g);
  }

  for(j = 0; j < N; j++) sumj[j] = 0;

  con = 0;
  Jcon = 0;
  for(z = 0; z < Z; z++){
    t = -big;
    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];

      sum = 0; for(i = 0; i < ntrialevsus[z][e]; i++) sum += exg[trialevsus[z][e][i]];
      val = sum*(t2-t);
      for(i = 0; i < ntrialevinf[z][e]; i++){ j = trialevinf[z][e][i]; sumj[j] += exf[j]*val;}
      t = t2;

      switch(trialevty[z][e]){
        case INF:
          j = trialevind[z][e];
          if(infstat[j] == 0){
            con += log(exg[j]);

            F = 0;
            for(i = 0; i < ntrialevinf[z][e]; i++){
              jj = trialevinf[z][e][i];
              F += exf2[jj];
            }
            Fst[j] = F;
          }
          break;

        case END:
          e = ntrialev[z];
          break;
      }
    }
  }
  getPa();
  time_q_finit += clock();

  for(loop = 0; loop < 3; loop++){
    if(s%1 == 0){
      for(j = 0; j < N; j++){
        q_old = q_f[j];
        q_new = q_old + normal(0,jumpq_f);

        va = exp(q_new) - exp(q_old);
        dF = exf[j]*va;
        dJ = va*sumj[j];
        dL = -beta*dJ;
        dPri = priorind(prior_q_f,q_new)-priorind(prior_q_f,q_old);

        for(i = 0; i < nindinf[j]; i++) dL += log(1 + dF/Fst[indinf[j][i]]);

        fac = Ainvdiag[j];
        sum_g = fac*q_g[j]; sum_f = 0; if(mod == SIR) sum_r = fac*q_r[j];
        for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj]; if(mod == SIR) sum_r += fac2*q_r[jj]; }

        if(mod == SIR) dLq = -((q_new*q_new - q_old*q_old)*fac*Pff + 2*(q_new-q_old)*(sum_f*Pff + sum_g*Pgf + sum_r*Pfr))/2;
        else dLq = -((q_new*q_new - q_old*q_old)*fac*Pff + 2*(q_new-q_old)*(sum_f*Pff + sum_g*Pgf))/2;

        al = exp(phi*dL+dLq+dPri);

        ntr_q_f++;
        if(ran() < al){
          nac_q_f++;

          q_f[j] = q_new;
          for(i = 0; i < nindinf[j]; i++) Fst[indinf[j][i]] += dF;

          Li += dL; J_mc += dJ; Pri += dPri;
          Liq += dLq;

          if(burning == 1) jumpq_f *= upfac;
        }
        else{
          if(burning == 1) jumpq_f *= downfac;
        }
      }

      propvara();
    }
  }

  time_q_f += clock();
}
