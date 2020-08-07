// Proposals for group effects

double Lpropgeff_g()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long z;
  double L;

  L = con;
  J = 0;
  for(z = 0; z < Z; z++){
    J += Jz[z]*exp(geff_g[z]);
    L += nIz[z]*geff_g[z];
  }
  L += NI*log(beta) - beta*J;

  return L;
}

void propgeff_g()                                              // Makes proposals in the group contribution
{
  long j, fi, z, i, e, nI, loop, loop2;
  double F, Q, val_f, val_g, t, t2, geff_old, geff_new, dJ, dL, dPri, al, dLgeff_g, sum, sig_new;

  time_geff_g -= clock();

  for(j = 0; j < N; j++){
    if(snpfl == 1){
      switch(geno[j]){
        case 0: val_f = a_f; val_g = a_g; break;
        case 1: val_f = delta_f*a_f; val_g = delta_g*a_g; break;
        case 2: val_f = -a_f; val_g = -a_g; break;
      }
    }
    else{ val_f = 0; val_g = 0;}

    val_f += q_f[j] + e_f[j]; val_g += q_g[j] + e_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
    exf[j] = exp(val_f); exg[j] = exp(val_g);
  }

  con = 0;
  for(z = 0; z < Z; z++){
    nI = 0;
    J = 0;
    F = 0; Q = 0;
    for(i = 0; i < trialind[z].size(); i++) Q += exg[trialind[z][i]];

    t = -big;

    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];
      j = trialevind[z][e];
      J += Q*F*(t2-t);
      t = t2;
      switch(trialevty[z][e]){
        case INF:
          if(infstat[j] == 0){ con += log(exg[j]*F); nI++;}
          F += exf[j]; Q -= exg[j];
          break;

        case REC:
          F -= exf[j];
          break;

        case END:
          e = ntrialev[z];
          break;
      }
      t = t2;
    }
    Jz[z] = J;
    nIz[z] = nI;
  }

  for(loop = 0; loop < 5; loop++){
    for(z = 0; z < Z; z++){
      geff_old = geff_g[z];
      geff_new = geff_old + normal(0,jumpgeff_g);

      dJ = (exp(geff_new) - exp(geff_old))*Jz[z];
      dL = -beta*dJ + (geff_new-geff_old)*nIz[z];
      dPri = priorind(prior_G,geff_new)-priorind(prior_G,geff_old);

      dLgeff_g = -(geff_new*geff_new - geff_old*geff_old)/(2*siggeff_g*siggeff_g);

      al = exp(dL+dLgeff_g+dPri);
      ntr_geff_g++;
      if(ran() < al){
        nac_geff_g++;

        geff_g[z] = geff_new;
        Li += dL; J_mc += dJ; Pri += dPri;
        Ligeff_g += dLgeff_g;

        if(burning == 1) jumpgeff_g *= upfac;
      }
      else{
        if(burning == 1) jumpgeff_g *= downfac;
      }
    }

    sum = 0; for(z = 0; z < Z; z++) sum += geff_g[z]*geff_g[z];

    for(loop2 = 0; loop2 < 10; loop2++){
      sig_new = siggeff_g + normal(0,jumpsiggeff_g);
      if(sig_new < 0) al = 0;
      else{
        dPri = priorind(prior_siggeff_g,sig_new) - priorind(prior_siggeff_g,siggeff_g);

        if(dPri < -big/2) al = 0;
        else{
          dLgeff_g = (-Z*log(sig_new) - sum/(2*sig_new*sig_new)) - (-Z*log(siggeff_g) - sum/(2*siggeff_g*siggeff_g));
          al = exp(dLgeff_g+dPri);
        }
      }

      ntr_siggeff_g++;
      if(ran() < al){
        nac_siggeff_g++;
        siggeff_g = sig_new;
        Ligeff_g += dLgeff_g;
        Pri += dPri;
        if(burning == 1) jumpsiggeff_g *= upfacsig;
      }
      else{
        if(burning == 1) jumpsiggeff_g *= downfacsig;
      }
    }
  }

  time_geff_g += clock();
}
