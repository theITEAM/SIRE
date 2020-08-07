 // Proposals for event sequences

void propevent()                                                   // Proposes event changes along the timelune
{
  long j, fi, z, i, e, ee, loop, k;
  double List, Lrecst, Kst, Jst, val_g, val_f, val_r, F, Q;

  time_events -= clock();
  for(j = 0; j < N; j++){
    if(snpfl == 1){
      switch(geno[j]){
        case 0: val_g = a_g; val_f = a_f; if(mod == SIR) val_r = a_r; break;
        case 1: val_g = delta_g*a_g; val_f = delta_f*a_f; if(mod == SIR) val_r = delta_r*a_r; break;
        case 2: val_g = -a_g; val_f = -a_f; if(mod == SIR) val_r = -a_r; break;
      }
    }
    else{ val_g = 0; val_f = 0; if(mod == SIR) val_r = 0;}

    if(geffon == 1) val_g += geff_g[indtrial[j]];
    for(fi = 0; fi < nfi; fi++){ val_g += X[j][fi]*fi_g[fi]; val_f += X[j][fi]*fi_f[fi]; if(mod == SIR) val_r += X[j][fi]*fi_r[fi];}
    exg[j] = exp(val_g + q_g[j] + e_g[j]); exf[j] = exp(val_f + q_f[j] + e_f[j]); if(mod == SIR) exr[j] = exp(val_r + q_r[j] + e_r[j]);
  }

  List = Li; Jst = J_mc;
  if(mod == SIR){ Lrecst = Lrec; Kst = K_mc;}

  for(z = 0; z < Z; z++){
    nev = ntrialev[z];
    evind = trialevind[z]; evt = trialevt[z]; evty = trialevty[z];
    tmin = trialtmin[z]; tmax = trialtmax[z];

    F = 0; Q = 0; for(i = 0; i < trialind[z].size(); i++) Q += exg[trialind[z][i]];
    evQ.resize(nev); evF.resize(nev);
    for(e = 0; e < nev; e++){
      j = evind[e];
      evQ[e] = Q; evF[e] = F;
      switch(evty[e]){
        //case ENT: Q += exg[j]; break;
        case INF: F += exf[j]; Q -= exg[j]; break;
        //case REC: if(evt[e] < leat[j])  F -= exf[j]; break;
        case REC: F -= exf[j]; break;
         //case LEA: if(It[j] != -big && evt[e] < Rt[j]) F -= exf[j]; else Q -= exg[j]; break;
        case END: e = nev; break;
      }
    }

    for(loop = 0; loop < 4; loop++){           // Shifts existing events
      for(ee = 0; ee < nev; ee++){
        e = long(ran()*nev);
        switch(evty[e]){
          case INF: shiftI(e); break;
          case REC: shiftR(e); break;
        }
      }

      if(unknownIfl == 1){
        time_addreminf -= clock();
        for(k = 0; k < trialunknownI[z].size(); k++){  // Adds and removes infection in individuals
          j = trialunknownI[z][k];
          Jst = J_mc;
          if(It[j] == -big) insertinf(j);
          else removeinf(j);
        }
        time_addreminf += clock();
      }
    }

    ntrialev[z] = nev; trialevind[z] = evind; trialevt[z] = evt; trialevty[z] = evty;
  }
  time_events += clock();
}

void shiftI(long e)                                                        // Moves an infection event
{
  long j, z, i, ee, enew, k, diat;
  double Q, F, t, t2, tnew, dF, dQ, dJ, dK, dLi, dLrec, dLdtest, dtold, dtnew, al, num;

  j = evind[e];

  if(Itmin[j] == Itmax[j]) return;

  t = evt[e];
  tnew = t + normal(0,jumpI[j]);
  if(tnew < Itmin[j] || tnew > Itmax[j]){ if(burning == 1) jumpI[j] *= 0.99; return;}

  if(noIinrangest[j] == 1){ if(tnew > obstmin[indtrial[j]] && tnew < obstmax[indtrial[j]]) return;}

  dtold = Rt[j]-It[j];
  dtnew = Rt[j]-tnew;

  if(dtnew <= 0) return;
  if(evty[e] != INF) emsg("Event not infection problem");

  dF = exf[j]; dQ = exg[j];
  dK = -exr[j]*kshape*(tnew - t);
  if(mod == SIR) dLrec = -gama*dK + (kshape-1)*log(dtnew/dtold); else dLrec = 0;

  dLi = 0; dJ = 0;
  if(tnew > t){
    enew = e+1;
    while(tnew > evt[enew]) enew++;
    if(tnew == evt[enew]) return; // makes sure times are not the same

    enew--;
    if(enew > e){
      for(ee = e+1; ee <= enew; ee++){
        F = evF[ee]; Q = evQ[ee];
        dJ += (evt[ee]-evt[ee-1])*((F-dF)*(Q+dQ)-F*Q);
        if(evty[ee] == INF){
          if(ee == 1) dLi -= log(exg[evind[ee]]*F);
          else{
            num = 1-dF/F; if(num < tiny) dLi -= big; else dLi += log(num);
          }
        }
      }
      F = evF[enew+1]; Q = evQ[enew+1];
      dJ += (tnew-evt[enew])*((F-dF)*(Q+dQ)-F*Q);
      if(e == 0){
        num = exg[j]*(F-dF); if(num < tiny) dLi -= big; else dLi += log(num);
      }
      else{
        num = (F-dF)/evF[e]; if(num < tiny) dLi -= big; else dLi += log(num);
      }
    }
    else{
      F = evF[e]; Q = evQ[e];
      dJ = (tnew-t)*(F*Q - (F+dF)*(Q-dQ));
    }
  }
  else{
    enew = e-1;
    while(enew >= 0 && tnew < evt[enew]) enew--;
    if(enew >= 0 && tnew == evt[enew]) return; // makes sure times are not the same

    enew++;
    if(enew < e){
      for(ee = e; ee > enew; ee--){
        F = evF[ee]; Q = evQ[ee];
        dJ += (evt[ee]-evt[ee-1])*((F+dF)*(Q-dQ)-F*Q);
      }
      F = evF[enew]; Q = evQ[enew];

      dJ += (evt[enew]-tnew)*((F+dF)*(Q-dQ)-F*Q);

      for(ee = e-1; ee >= enew; ee--){ 
        if(evty[ee] == INF){
          if(ee == 0){
            num = exg[evind[ee]]*(evF[ee]+dF); if(num < tiny) dLi -= big; else dLi += log(num);
          }
          else{
            num = 1+dF/evF[ee]; if(num < tiny) dLi -= big; else dLi += log(num);
          }
        }
      }
      if(enew == 0) dLi -= log(exg[j]*evF[e]);
      else{
        num = F/evF[e]; if(num < tiny) dLi -= big; else dLi += log(num);
      }
    }
    else{
      F = evF[e]; Q = evQ[e];
      dJ = (tnew-t)*(F*Q - (F+dF)*(Q-dQ));
    }
  }

  dLi += -beta*dJ;

  dLdtest = 0;
  if(diagtestfl == 1){
    for(diat = 0; diat < ndiagtest; diat++){
      if(tnew > t){
        k = 0; while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < t) k++;
        while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < tnew){
          if(inddtest[diat][j][k] == 1) dLdtest += diagtest_logomSp[diat] - diagtest_logSe[diat];
          else dLdtest += diagtest_logSp[diat] - diagtest_logomSe[diat];
          k++;
        }
      }
      else{
        k = ninddtest[diat][j]-1; while(k >= 0 && inddtestt[diat][j][k] > t) k--;
        while(k >= 0 && inddtestt[diat][j][k] > tnew){
          if(inddtest[diat][j][k] == 1) dLdtest += diagtest_logSe[diat] - diagtest_logomSp[diat];
          else dLdtest += diagtest_logomSe[diat] - diagtest_logSp[diat];
          k--;
        }
      }
    }
  }

  al = exp(phi*(dLi+dLrec) + phidt*dLdtest);

  ntr_I[j]++;
  if(ran() < al){
    nac_I[j]++;

    J_mc += dJ; Li += dLi; 
    if(mod == SIR){ K_mc += dK; Lrec += dLrec;}
    if(diagtestfl == 1) Ldtest += dLdtest;

    It[j] = tnew;
    if(tnew > t){
      if(enew > e){
        for(ee = e; ee < enew; ee++){          // shifts events down
          evty[ee] = evty[ee+1];
          evind[ee] = evind[ee+1];
          evt[ee] = evt[ee+1];
          evF[ee] = evF[ee+1] - dF;
          evQ[ee] = evQ[ee+1] + dQ;
        }

        evty[enew] = INF;
        evind[enew] = j;
        evt[enew] = tnew;
        evF[enew] = evF[enew+1] - dF;
        evQ[enew] = evQ[enew+1] + dQ;
        if(e == 0 && enew != 0){ infstat[j] = 0; infstat[evind[0]] = 1;}
      }
      else{
        evt[e] = tnew;
      }
    }
    else{
      if(enew < e){
        for(ee = e; ee > enew; ee--){          // shifts events down
          evty[ee] = evty[ee-1];
          evind[ee] = evind[ee-1];
          evt[ee] = evt[ee-1];
          evF[ee] = evF[ee-1] + dF;
          evQ[ee] = evQ[ee-1] - dQ;
        }

        evty[enew] = INF;
        evind[enew] = j;
        evt[enew] = tnew;
        evF[enew] = evF[enew+1] - dF;
        evQ[enew] = evQ[enew+1] + dQ;
        if(enew == 0 && e != 0){ infstat[j] = 1; infstat[evind[1]] = 0;}
      }
      else evt[e] = tnew;
    }

    if(burning == 1) jumpI[j] *= 1.01;
  }
  else{
    if(burning == 1) jumpI[j] *= 0.99;
  }
  num++;
}

void shiftR(long e)                                             // Moves a recovery event
{
  long j, z, i, ee, enew, eebeg, k, diat;
  double Q, F, t, t2, tt, ttnew, tnew, dF, dQ, dJ, dK, dLi, dLrec, dtold, dtnew, al, num, dLdtest;

  t = evt[e];
  j = evind[e];
  if(evty[e] != REC) emsg("Event not recovery problem");

  tnew = t + normal(0,jumpR[j]); 

  if(tnew < Rtmin[j] || tnew > Rtmax[j]){ if(burning == 1) jumpR[j] *= 0.99; return;}
  if(noRinrangest[j] == 1){ if(tnew > obstmin[indtrial[j]] && tnew < obstmax[indtrial[j]]) return;}

  dtold = Rt[j]-It[j];
  dtnew = tnew-It[j];
  if(dtnew <= 0) return;

  dF = -exf[j]; dQ = 0;

  dK = exr[j]*kshape*(tnew - t);
  dLrec = -gama*dK + (kshape-1)*log(dtnew/dtold);

  dLi = 0; dJ = 0;
  if(tnew > t){
    enew = e+1;
    while(enew < nev && tnew > evt[enew]) enew++;
    if(tnew == evt[enew]) return; // makes sure times are not the same
    enew--;

    if(enew > e){
      tt = evt[e];
      for(ee = e+1; ee <= enew; ee++){
        if(tt >= tmax) break;
        F = evF[ee]; Q = evQ[ee];

        ttnew = evt[ee];
        dJ += (ttnew-tt)*((F-dF)*(Q+dQ)-F*Q);
        if(evty[ee] == INF){
          num = 1-dF/F; if(num < tiny) dLi -= big; else dLi += log(num);
        }
        tt = ttnew;
      }
      if(tnew < tmax){
        F = evF[enew+1]; Q = evQ[enew+1];
        dJ += (tnew-tt)*((F-dF)*(Q+dQ)-F*Q);
      }
    }
    else{
      if(tnew < tmax){
        F = evF[e]; Q = evQ[e];
        dJ = (tnew-t)*(F*Q - (F+dF)*(Q-dQ));
      }
    }
  }
  else{
    enew = e-1;
    while(enew >= 0 && tnew < evt[enew]) enew--;
    if(tnew == evt[enew]) return; // makes sure times are not the same
    enew++;

    if(enew < e){
      eebeg = e; while(eebeg >= enew && evt[eebeg] > tmax) eebeg--;
      for(ee = eebeg; ee > enew; ee--){
        F = evF[ee]; Q = evQ[ee];
        dJ += (evt[ee]-evt[ee-1])*((F+dF)*(Q-dQ)-F*Q);
      }
      if(tnew < tmax){
        F = evF[enew]; Q = evQ[enew];
        dJ += (evt[enew]-tnew)*((F+dF)*(Q-dQ)-F*Q);
      }
      for(ee = eebeg-1; ee >= enew; ee--){
        if(evty[ee] == INF){
          num = 1+dF/evF[ee]; if(num < tiny) dLi -= big; else dLi += log(num);
        }
      }
    }
    else{
      if(tnew < tmax){
        F = evF[e]; Q = evQ[e];
        dJ = (tnew-t)*(F*Q - (F+dF)*(Q-dQ));
      }
    }
  }

  dLi += -beta*dJ;

  dLdtest = 0;
  if(diagtestfl == 1){
    for(diat = 0; diat < ndiagtest; diat++){
      if(diagtest_sens[diat] == 1){
        if(tnew > t){
          k = 0; while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < t) k++;
          while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < tnew){
            if(inddtest[diat][j][k] == 1) dLdtest -= diagtest_logomSp[diat] - diagtest_logSe[diat];
            else dLdtest -= diagtest_logSp[diat] - diagtest_logomSe[diat];
            k++;
          }
        }
        else{
          k = ninddtest[diat][j]-1; while(k >= 0 && inddtestt[diat][j][k] > t) k--;
          while(k >= 0 && inddtestt[diat][j][k] > tnew){
            if(inddtest[diat][j][k] == 1) dLdtest -= diagtest_logSe[diat] - diagtest_logomSp[diat];
            else dLdtest -= diagtest_logomSe[diat] - diagtest_logSp[diat];
            k--;
          }
        }
      }
    }
  }

  al = exp(phi*(dLi+dLrec) + phidt*dLdtest);

  ntr_R[j]++;
  if(ran() < al){
    nac_R[j]++;

    J_mc += dJ; K_mc += dK;
    Li += dLi; Lrec += dLrec;
    if(diagtestfl == 1) Ldtest += dLdtest;

    Rt[j] = tnew;
    if(tnew > t){
      if(enew > e){
        for(ee = e; ee < enew; ee++){          // shifts events down
          evty[ee] = evty[ee+1];
          evind[ee] = evind[ee+1];
          evt[ee] = evt[ee+1];
          evF[ee] = evF[ee+1] - dF;
          evQ[ee] = evQ[ee+1] + dQ;
        }

        evty[enew] = REC;
        evind[enew] = j;
        evt[enew] = tnew;
        evF[enew] = evF[enew+1] - dF;
        evQ[enew] = evQ[enew+1] + dQ;
      }
      else evt[e] = tnew;
    }
    else{
      if(enew < e){
        for(ee = e; ee > enew; ee--){          // shifts events down
          evty[ee] = evty[ee-1];
          evind[ee] = evind[ee-1];
          evt[ee] = evt[ee-1];
          evF[ee] = evF[ee-1] + dF;
          evQ[ee] = evQ[ee-1] - dQ;
        }

        evty[enew] = REC;
        evind[enew] = j;
        evt[enew] = tnew;
        evF[enew] = evF[enew+1] - dF;
        evQ[enew] = evQ[enew+1] + dQ;
      }
      else evt[e] = tnew;
    }

    if(burning == 1) jumpR[j] *= 1.01;
  }
  else{
    if(burning == 1) jumpR[j] *= 0.99;
  }
}

void insertinf(long j)                                      // Creates infection / recovery events for individual j
{
  long ei, er, ee, diat, k, z, i;
  double mu, var, ti, tr, tnew, dF, dQ, dJ, dLi, dLrec, dLdtest, dK, t, t2, num, F, Q, probif, probfi, al;

  z = indtrial[j];

  if(ran() < 0.5){  // 1st sampler estimates posterior by normal
    mu = Itsampav[j]/nItsampav[j]; var = Itsampav2[j]/nItsampav[j] - mu*mu;
    ti = normal(mu,sqrt(var));
    if(ti < Itmin[j] || ti > Itmax[j]) return;
    probif = normalprob(ti,mu,var) ;
  }
  else{            // 2nd sampler randomly samples from time range
    if(Itmin[j] < trialtmin[z] || Itmax[j] > trialtmax[z]) emsg("Infection time out of range2");

    ti = Itmin[j]+ran()*(Itmax[j]-Itmin[j]);
    probif = log(1.0/(Itmax[j]-Itmin[j]));
  }

  if(noIinrangest[j] == 1){ if(ti > obstmin[z] && ti < obstmax[z]) return;}

  if(mod == SIR){
    tr = ti+gammasamp(kshape,kshape*gama*exr[j]);
    if(tr < Rtmin[j] || tr > Rtmax[j]) return;
    if(noRinrangest[j] == 1){ if(tr > obstmin[z] && tr < obstmax[z]) return;}
    probif += gammaprob(tr-ti,kshape, kshape*gama*exr[j]);
  }
  else tr = big;

  probfi = 0;

  ei = 0; while(ei < nev && ti > evt[ei]) ei++; if(ei == nev) return;

  if(ti == evt[ei]) return;
  if(mod == SIR){
    er = ei; while(er < nev && tr > evt[er]) er++;
    if(er == 0 && nev > 1) return;
    if(er < nev && tr == evt[er]) return;
  }
  else er = nev;

  dF = exf[j]; dQ = exg[j];

  if(ei == 0){
    dLi = 0; ee = 0; while(ee < nev && evty[ee] == INF && infstat[evind[ee]] == 1){ dLi += log(beta*exg[evind[ee]]*dF); ee++;}
  }
  else{
    if(evF[ei] < tiny) return;
    dLi = log(beta*dQ*evF[ei]);
  }

  dJ = 0;
  t = ti;
  for(ee = ei; ee <= er; ee++){
    F = evF[ee]; Q = evQ[ee];
    if(ee == er) t2 = tr; else t2 = evt[ee];
    dJ += ((F+dF)*(Q-dQ)-F*Q)*(t2-t);
    if(evty[ee] == INF && ee < er && infstat[evind[ee]] == 0){
       num = 1+dF/F; if(num < tiny) return;
      dLi += log(num);
    }
    t = t2;
    if(evty[ee] == END) break;
  }

  if(tr < trialtmax[indtrial[j]]){
    for(ee = er; ee < nev; ee++){
      t2 = evt[ee];
      dJ -= dQ*evF[ee]*(t2-t);
      t = t2;
      if(evty[ee] == END) break;
    }
  }

  dLi -= beta*dJ;

  if(mod == SIR){
    dK = exr[j]*kshape*(tr-ti);
    dLrec = kshape*log(exr[j]) + (kshape-1)*log(tr-ti) + kshape*log(kshape*gama) - lgamma(kshape) - dK*gama;
  }
  else{ dLrec = 0; dK = 0;}

  dLdtest = 0;
  if(diagtestfl == 1){
    for(diat = 0; diat < ndiagtest; diat++){
      if(diagtest_sens[diat] == 1) tnew = tr; else tnew = big;

      k = 0; while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < ti) k++;
      while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < tnew){
        if(inddtest[diat][j][k] == 1) dLdtest += diagtest_logSe[diat] - diagtest_logomSp[diat];
        else dLdtest += diagtest_logomSe[diat] - diagtest_logSp[diat];
        k++;
      }
    }
  }

  al = exp(phi*(dLi+dLrec) + phidt*dLdtest + probfi - probif);

  ntr_addinf[j]++;
  if(ran() < al){
    nac_addinf[j]++;
    if(mod == SIR){ evty.resize(nev+2); evind.resize(nev+2); evt.resize(nev+2); evF.resize(nev+2); evQ.resize(nev+2);}
    else{ evty.resize(nev+1); evind.resize(nev+1); evt.resize(nev+1); evF.resize(nev+1); evQ.resize(nev+1);}

    for(ee = nev-1; ee >= er; ee--){ evty[ee+2] = evty[ee]; evind[ee+2] = evind[ee]; evt[ee+2] = evt[ee]; evF[ee+2] = evF[ee]; evQ[ee+2] = evQ[ee]-dQ;}
    for(ee = er-1; ee >= ei; ee--){ evty[ee+1] = evty[ee]; evind[ee+1] = evind[ee]; evt[ee+1] = evt[ee]; evF[ee+1] = evF[ee]+dF; evQ[ee+1] = evQ[ee]-dQ;}

    evty[ei] = INF; evind[ei] = j; evt[ei] = ti;
    if(ei == 0){
      Q = 0; for(i = 0; i < trialind[z].size(); i++) Q += exg[trialind[z][i]];
      evF[ei] = 0; evQ[ei] = Q;
    }
    else{
      ee = ei-1; evF[ei] = evF[ee]; evQ[ei] = evQ[ee]; if(evty[ee] == INF){ evF[ei] += exf[evind[ee]]; evQ[ei] -= exg[evind[ee]];} else evF[ei] -= exf[evind[ee]];
    }
    nev++;

    if(mod == SIR){
      evty[er+1] = REC; evind[er+1] = j; evt[er+1] = tr;
      ee = er; evF[er+1] = evF[ee]; evQ[er+1] = evQ[ee]; if(evty[ee] == INF){ evF[er+1] += exf[evind[ee]]; evQ[er+1] -= exg[evind[ee]];} else evF[er+1] -= exf[evind[ee]];
      nev++;
    }
    It[j] = ti; Rt[j] = tr; NItot++;
    Li += dLi; J_mc += dJ; Lrec += dLrec; K_mc += dK; Ldtest += dLdtest;

    if(ei == 0){
      infstat[j] = 1; ee = 1; while(ee < nev && evty[ee] == INF && infstat[evind[ee]] == 1){ infstat[evind[ee]] = 0; NI++; ee++;}
    }
    else{ infstat[j] = 0; NI++;}
  }
  //checkevQ(indtrial[j]);
}

void removeinf(long j)                                         //  Removes infection / recovery events for individual j
{
  long ei, er, ee, diat, k;
  double mu, var, ti, tr, tnew, dF, dQ, dJ, dLi, dLrec, dLdtest, dK, t, t2, num, F, Q, probif, probfi, al, tt;

  ti = It[j]; tr = Rt[j];

  if(ran() < 0.5){
    mu = Itsampav[j]/nItsampav[j]; var = Itsampav2[j]/nItsampav[j] - mu*mu;
    probfi = normalprob(ti,mu,var);
  }
  else{
    probfi = log(1.0/(Itmax[j]-Itmin[j]));
  }
  if(mod == SIR) probfi += gammaprob(tr-ti,kshape,kshape*gama*exr[j]);

  probif = 0;

  ei = 0; while(ei < nev && ti != evt[ei]) ei++; if(ei == nev) emsg("Cannot find event");
  if(mod == SIR){
    er = ei+1; while(er < nev && tr != evt[er]) er++; if(er == nev) emsg("Cannot find event");
  }
  else er = nev;

  dF = exf[j]; dQ = exg[j];
  if(infstat[j] == 1){
    dLi = 0;
    if(nev > 0){
      tt = evt[1];
      ee = 1; while(ee < nev && evty[ee] == INF && infstat[evind[ee]] == 0 && evt[ee] == tt){ dLi -= log(beta*exg[evind[ee]]*dF); ee++;}
    }
  }
  else{
    tt = big;
    dLi = -log(beta*dQ*evF[ei]);
  }

  dJ = 0;
  t = ti;
  for(ee = ei+1; ee <= er; ee++){
    F = evF[ee]; Q = evQ[ee];
    t2 = evt[ee];
    dJ += ((F-dF)*(Q+dQ)-F*Q)*(t2-t);
    if(ee < er && evty[ee] == INF && evt[ee] != tt){ num = 1-dF/F; if(num < tiny) dLi -= big; else dLi += log(num);}
    t = t2;
    if(evty[ee] == END) break;
  }

  if(tr < trialtmax[indtrial[j]]){
    for(ee = er+1; ee < nev; ee++){
      t2 = evt[ee];
      dJ += dQ*evF[ee]*(t2-t);
      t = t2;
      if(evty[ee] == END) break;
    }
  }
  dLi -= beta*dJ;

  if(mod == SIR){
    dK = -exr[j]*kshape*(tr-ti);
    dLrec = -(kshape*log(exr[j]) + (kshape-1)*log(tr-ti) + kshape*log(kshape*gama) - lgamma(kshape)) - dK*gama;
  }
  else{ dLrec = 0; dK = 0;}

  dLdtest = 0;
  if(diagtestfl == 1){
    for(diat = 0; diat < ndiagtest; diat++){
      if(diagtest_sens[diat] == 1) tnew = tr; else tnew = big;

      k = 0; while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < ti) k++;
      while(k < ninddtest[diat][j] && inddtestt[diat][j][k] < tnew){
        if(inddtest[diat][j][k] == 1) dLdtest += diagtest_logomSp[diat] - diagtest_logSe[diat];
        else dLdtest +=  diagtest_logSp[diat] - diagtest_logomSe[diat];
        k++;
      }
    }
  }

  al = exp(phi*(dLi+dLrec) + phidt*dLdtest + probfi - probif);

  ntr_reminf[j]++;
  if(ran() < al){
    nac_reminf[j]++;
    for(ee = ei; ee < er-1; ee++){ evty[ee] = evty[ee+1]; evind[ee] = evind[ee+1]; evt[ee] = evt[ee+1]; evF[ee] = evF[ee+1]-dF; evQ[ee] = evQ[ee+1]+dQ;}
    for(ee = er-1; ee < nev-2; ee++){ evty[ee] = evty[ee+2]; evind[ee] = evind[ee+2]; evt[ee] = evt[ee+2]; evF[ee] = evF[ee+2]; evQ[ee] = evQ[ee+2]+dQ;}
    if(mod == SIR){
      evty.resize(nev-2); evind.resize(nev-2); evt.resize(nev-2); evF.resize(nev-2); evQ.resize(nev-2);
      nev -= 2;
    }
    else{
      evty.pop_back(); evind.pop_back(); evt.pop_back(); evF.pop_back(); evQ.pop_back();
      nev--;
    }

    if(ei == 0){
      ee = 0; while(ee < nev && evty[ee] == INF && infstat[evind[ee]] == 0 && evt[ee] == evt[0]){ infstat[evind[ee]] = 1; NI--; ee++;}
    }
    else NI--;

    It[j] = -big; Rt[j] = -big; infstat[j] = -1; NItot--;
    Li += dLi; J_mc += dJ; Lrec += dLrec; K_mc += dK; Ldtest += dLdtest;
  }
  //checkevQ(indtrial[j]);
}

void infsampler()                                        // Optimises the event sampler when adding and removing infections
{
  long z, i, j;

  for(z = 0; z < Z; z++){
    for(i = 0; i < trialunknownI[z].size(); i++){
      j = trialunknownI[z][i];
      if(It[j] != -big){ Itsampav[j] += It[j]; Itsampav2[j] += It[j]*It[j]; nItsampav[j]++;}
    }
  }
}
