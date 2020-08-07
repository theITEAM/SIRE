// Proposals for parameters related to infection

void prop_betagamak()                                  // Makes proposals to beta and gamma
{
  long loop, j, fi;
  double pst, al, dLi, dLrec, dPri, L, K, Kfac, dtfac, dt, r, rfac;

  if(mod == SIR){    // Initialises proposals
    Kfac = 0; dtfac = 0; rfac = 0;
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

        dt = Rt[j]-It[j]; if(dt <= 0) emsg("The time has become negative");
        Kfac += exp(r)*dt;
        rfac += r; dtfac += log(dt);
      }
    }
  }

  for(loop = 0; loop < 20; loop++){
    pst = beta;
    dPri = -priorind(prior_beta,beta)-priorind(prior_R0,getpriorval(prior_R0));
    beta += normal(0,jump_beta);
    if(beta < 0) al = 0;
    else{
      dPri += priorind(prior_beta,beta)+priorind(prior_R0,getpriorval(prior_R0));
      dLi = NI*log(beta) - beta*J_mc - (NI*log(pst) - pst*J_mc);

      al = exp(phi*dLi+dPri);
    }

    ntr[0]++;
    if(ran() < al){
      nac[0]++;
      Li += dLi; Pri += dPri;

      if(burning == 1) jump_beta *= 1.02;
    }
    else{
      beta = pst;
      if(burning == 1) jump_beta *= 0.99;
    }

    if(mod == SIR){
      pst = gama;
      dPri = -priorind(prior_gama,gama)-priorind(prior_R0,getpriorval(prior_R0));
      gama += normal(0,jump_gama);
      dPri += priorind(prior_gama,gama)+priorind(prior_R0,getpriorval(prior_R0));

      if(gama < 0) al = 0;
      else{
        dLrec = NItot*kshape*log(kshape*gama) - NItot*lgamma(kshape) - K_mc*gama - (NItot*kshape*log(kshape*pst) 
              - NItot*lgamma(kshape) - K_mc*pst);
        al = exp(phi*dLrec+dPri);
      }

      ntr_rec[0]++;
      if(ran() < al){
        nac_rec[0]++;
        Lrec += dLrec; Pri += dPri;

        if(burning == 1) jump_gama *= 1.02;
      }
      else{
        gama = pst;
        if(burning == 1) jump_gama *= 0.99; 
      }
    }

    if(mod == SIR){
      pst = kshape;
      dPri = -priorind(prior_k,kshape);
      kshape += normal(0,jump_kshape);
      dPri += priorind(prior_k,kshape);

      if(kshape < 0) al = 0;
      else{
        K = Kfac*kshape;
        L = kshape*rfac + (kshape-1)*dtfac + NItot*kshape*log(kshape*gama) - NItot*lgamma(kshape) - K*gama;

        al = exp(phi*(L-Lrec)+dPri);
      }

      ntr_rec[3]++;
      if(ran() < al){
        nac_rec[3]++;
        Lrec = L; K_mc = K; Pri += dPri;

        if(burning == 1) jump_kshape *= 1.02;
      }
      else{
        kshape = pst;
        if(burning == 1) jump_kshape *= 0.99;
      }
    }
  }
}

double Lpropfast()                                                         // Fast calculation of the likelihood based of recalculated quantities
{
  long i, j;
  double L;

  n_g[0] = exp(a_g); n_g[1] = exp(a_g*delta_g); n_g[2] = exp(-a_g);
  n_f[0] = exp(a_f); n_f[1] = exp(a_f*delta_f); n_f[2] = exp(-a_f);

  J = 0;
  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      J += n_g[i]*n_f[j]*sum[i][j];
    }
  }

  L = NI*log(beta) - beta*J + sumg[0]*a_g + sumg[1]*a_g*delta_g - sumg[2]*a_g + con;

  for(i = 0; i < nssum; i++) L += log(n_f[0]*ssum0[i] + n_f[1]*ssum1[i] + n_f[2]*ssum2[i]);

  return L;
}

void prop_param()                                                                  // Makes proposal to a_g, a_f, delta_a, delta_f
{
  long i, j, z, e, loop, p, pmax, fi;
  double t, t2, pst, al, Li_new, val, val_f, val_g, va, dPri;

  time_param -= clock();

  time_paraminit -= clock();

  con = 0;
  for(i = 0; i < 3; i++){
    sumg[i] = 0; sumbase[i] = 0;
    for(j = 0; j < 3; j++){
      sum[i][j] = 0;
    }
  }

  for(j = 0; j < N; j++){
    val_f = q_f[j] + e_f[j]; val_g = q_g[j] + e_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
    if(geffon == 1) val_g += geff_g[indtrial[j]];
    g[j] = val_g; exf[j] = exp(val_f); exg[j] = exp(val_g);
  }

  nssum = 0; ssum0.clear(); ssum1.clear(); ssum2.clear();
  for(z = 0; z < Z; z++){
    n_g[0] = 0; n_g[1] = 0; n_g[2] = 0;
    n_f[0] = 0; n_f[1] = 0; n_f[2] = 0;

    for(i = 0; i < trialind[z].size(); i++){
      j = trialind[z][i];
      n_g[geno[j]] += exg[j];
    }

    t = -big;
    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];

      for(i = 0; i < 3; i++){
        va = n_g[i]*(t2-t);
        sumbase[i] += va;
        for(j = 0; j < 3; j++) sum[i][j] += va*n_f[j];
      }
      t = t2;

      j = trialevind[z][e];
      switch(trialevty[z][e]){
        case INF:
          if(infstat[j] == 0){
            con += g[j];
            sumg[geno[j]]++;

            ssum0.push_back(n_f[0]); ssum1.push_back(n_f[1]); ssum2.push_back(n_f[2]); nssum++;
          }

          n_f[geno[j]] += exf[j]; n_g[geno[j]] -= exg[j];
          break;

        case REC:
          n_f[geno[j]] -= exf[j];
          break;

        case END:
          e = ntrialev[z];
          break;
      }
    }
  }
  time_paraminit += clock();

  if(domon == 1) pmax = 5; else pmax = 3;

  for(loop = 0; loop < 10; loop++){
    for(p = 1; p < pmax; p++){
       switch(p){
        case 1: pst = a_g; dPri = -priorind(prior_a_g,a_g); a_g += normal(0,jump_g); dPri += priorind(prior_a_g,a_g); break;
        case 2: pst = a_f; dPri = -priorind(prior_a_f,a_f); a_f += normal(0,jump_f); dPri += priorind(prior_a_f,a_f); break;
        case 3: pst = delta_g; dPri = -priorind(prior_delta_g,delta_g); delta_g += normal(0,jump_delg); dPri += priorind(prior_delta_g,delta_g); break;
        case 4: pst = delta_f; dPri = -priorind(prior_delta_f,delta_f); delta_f += normal(0,jump_delf); dPri += priorind(prior_delta_f,delta_f); break;
      }

      if(dPri < -big/2) al = 0;
      else{
        Li_new = Lpropfast();
        al = exp(phi*(Li_new-Li)+dPri);
      }

      ntr[p]++;
      if(ran() < al){
        nac[p]++;
        Li = Li_new; J_mc = J; Pri += dPri;

        if(burning == 1){  // adapts jumping size for efficient jumping
          switch(p){
            case 1: jump_g *= 1.02; break;
            case 2: jump_f *= 1.02; break;
            case 3: jump_delg *= 1.02; break;
            case 4: jump_delf *= 1.02; break;
          }
        }
      }
      else{
        switch(p){
          case 1: a_g = pst; break;
          case 2: a_f = pst; break;
          case 3: delta_g = pst; break;
          case 4: delta_f = pst; break;
        }

        if(burning == 1){  // adapts jumping size for efficient jumping
          switch(p){
            case 1: jump_g *= 0.99; break;
            case 2: jump_f *= 0.99; break;
            case 3: jump_delg *= 0.99; break;
            case 4: jump_delf *= 0.99; break;
          }
        }
      }
    }
  }
  time_param += clock();
}
