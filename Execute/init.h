// Initialisation

void init()                                                       // Initialises variables before posterior sampling can begin
{
  long i, j, z, e, ii, jj, jjj, kk, k, fi, pi, loop;
  double t, t2, val, tmi, tnew, Xmin, Xmax, dif;

  for(j = 0; j < N; j++){ if(Itmin[j] != Itmax[j] || Rtmin[j] != Rtmax[j] || Iposst[j] == unknownI){ shiftfl = 1; break;}}

  trialind.clear(); trialind.resize(Z); for(j = 0; j < N; j++) trialind[indtrial[j]].push_back(j);
  ntrialindav = 0; for(z = 0; z < Z; z++) ntrialindav += double(trialind[z].size())/Z;

  loop = 0;
  do{
    beta = priorsamp(prior_beta,0,big,0.1);
    if(mod == SIR){ gama = priorsamp(prior_gama,0,big,0.1); kshape = priorsamp(prior_k,1,10,3);}
    loop++;
  }while(loop < 1000000 && priorind(prior_R0,getpriorval(prior_R0)) == -big);
  if(loop == 1000000) emsg("Cannot find a consistent values for beta and gamma");

  if(snpfl == 1){
    a_g = priorsamp(prior_a_g,-5,5,0);
    a_f = priorsamp(prior_a_f,-5,5,0); 
    if(mod == SIR) a_r = priorsamp(prior_a_r,-5,5,0);
    if(domon == 1){ 
      delta_g = priorsamp(prior_delta_g,-5,5,0);
      delta_f = priorsamp(prior_delta_f,-5,5,0);
      if(mod == SIR) delta_r = priorsamp(prior_delta_r,-5,5,0);}
    else{ delta_g  = 0; delta_f = 0; delta_r = 0;}
  }
  else{
    a_g = 0; a_f = 0; if(mod == SIR) a_r = 0;
    delta_g = 0; delta_f = 0; if(mod == SIR) delta_r = 0;
  }

  if(envon == 0){ vare_gg = 0.00000001; vare_gf = 0; vare_ff = vare_gg; if(mod == SIR){ vare_gr = 0; vare_fr = 0; vare_rr = vare_gg;}}
  else{
    loop = 0;
    do{
      vare_gg = priorsamp(prior_vare_gg,0,5,1); vare_ff = priorsamp(prior_vare_ff,0,5,1);
      if(mod == SIR) vare_rr = priorsamp(prior_vare_rr,0,5,1);
      vare_gf = priorsamp(prior_vare_gf,-5,5,0); 
      if(mod == SIR){ vare_gr = priorsamp(prior_vare_gr,-5,5,0); vare_fr = priorsamp(prior_vare_fr,-5,5,0);}
      getP();
      loop++;
    }while(loop < 1000000 && (det <= 0 ||  Pgg <0 || Pff < 0 || (mod == SIR && Prr < 0)));
    if(det <= 0) emsg("Problem with covariance matrix");
  }

  if(randon == 0){ vara_gg = 0.00000001; vara_gf = 0; vara_gr = 0; vara_ff = vara_gg; vara_fr = 0; vara_rr = vara_gg;}
  else{
    loop = 0;
    do{
      vara_gg = priorsamp(prior_vara_gg,0,5,1); vara_ff = priorsamp(prior_vara_ff,0,5,1); 
      if(mod == SIR) vara_rr = priorsamp(prior_vara_rr,0,5,1);
      vara_gf = priorsamp(prior_vara_gf,-5,5,0); 
      if(mod == SIR){ vara_gr = priorsamp(prior_vara_gr,-5,5,0); vara_fr = priorsamp(prior_vara_fr,-5,5,0);}
      getPa();
      loop++;
    }while(loop < 1000000 && (det <= 0 ||  Pgg <0 || Pff < 0 || (mod == SIR && Prr < 0)));
    if(det <= 0) emsg("Problem with covariance matrix");
  }

  if(mod == SI){ vare_rr = 0.000001; vara_rr = 0.000001;}

  e_g.resize(N); e_f.resize(N); if(mod == SIR) e_r.resize(N);
  if(envon == 1){
    for(j = 0; j < N; j++){
      do{ e_g[j] = normal(0,sqrt(vare_gg));}while(priorind(prior_e_g,e_g[j]) == -big);
      do{ e_f[j] = normal(0,sqrt(vare_ff));}while(priorind(prior_e_f,e_f[j]) == -big);
      if(mod == SIR){ do{ e_r[j] = normal(0,sqrt(vare_rr));}while(priorind(prior_e_r,e_r[j]) == -big);}
    }
  }
  else{
    for(j = 0; j < N; j++){ e_g[j] = 0; e_f[j] = 0; if(mod == SIR) e_r[j] = 0;}
  }

  if(geffon == 1){
    geff_g.resize(Z);
    siggeff_g = priorsamp(prior_siggeff_g,0,5,0.1);
    for(z = 0; z < Z; z++){
      do{ geff_g[z] = normal(0,siggeff_g);}while(priorind(prior_G,geff_g[z]) == -big);
    }
  }

  q_g.resize(N); q_f.resize(N); if(mod == SIR) q_r.resize(N);
  if(randon == 1){
    for(j = 0; j < N; j++){
      do{ q_g[j] = normal(0,sqrt(vara_gg));}while(priorind(prior_q_g,q_g[j]) == -big);
      do{ q_f[j] = normal(0,sqrt(vara_ff));}while(priorind(prior_q_f,q_f[j]) == -big);
      if(mod == SIR){ do{ q_r[j] = normal(0,sqrt(vara_rr));}while(priorind(prior_q_r,q_r[j]) == -big);}
    }
  }
  else{
    for(j = 0; j < N; j++){ q_g[j] = 0; q_f[j] = 0; if(mod == SIR) q_r[j] = 0;}
  }

  fi_g.resize(nfi); fi_f.resize(nfi); if(mod == SIR) fi_r.resize(nfi);
  for(fi = 0; fi < nfi; fi++){
    fi_g[fi] = priorsamp(prior_fixed_g[fi],-5/Xmagmax[fi],5/Xmagmax[fi],0);
    fi_f[fi] = priorsamp(prior_fixed_f[fi],-5/Xmagmax[fi],5/Xmagmax[fi],0);
    if(mod == SIR) fi_r[fi] = priorsamp(prior_fixed_r[fi],-5/Xmagmax[fi],5/Xmagmax[fi],0);
  }

  jump_beta = beta/10; jump_gama = gama/10;
  jump_g = 0.1; jump_f = 0.1; jump_r = 0.1; jump_delg = 0.1; jump_delf = 0.1; jump_delr = 0.1; jump_kshape = 0.5;
  for(i = 0; i < 18; i++) jumpPBP[i] = 0.1;

  jumpe_g = 0.1; jumpe_f = 0.1; jumpe_r = 0.1;
  jumpvare_gg = 0.01; jumpvare_gf = 0.01; jumpvare_gr = 0.01; jumpvare_ff = 0.01; jumpvare_fr = 0.01; jumpvare_rr = 0.01;
  jumpvara_gg = 0.01; jumpvara_gf = 0.01; jumpvara_gr = 0.01; jumpvara_ff = 0.01; jumpvara_fr = 0.01; jumpvara_rr = 0.01;

  jumpq_g = 0.1; jumpq_f = 0.1; jumpq_r = 0.1;

  jumpgeff_g = 0.1;
  jumpsiggeff_g = 0.01;

  jumpfi_g.resize(nfi); jumpfi_f.resize(nfi); if(mod == SIR) jumpfi_r.resize(nfi);
  ntr_fi_g.resize(nfi); nac_fi_g.resize(nfi); ntr_fi_f.resize(nfi); nac_fi_f.resize(nfi);
  if(mod == SIR){ ntr_fi_r.resize(nfi); nac_fi_r.resize(nfi);}
  for(fi = 0; fi < nfi; fi++){
    Xmin = big; Xmax = -big;
    for(j = 0; j < N; j++){ if(X[j][fi] > Xmax) Xmax = X[j][fi]; if(X[j][fi] < Xmin) Xmin = X[j][fi];}
    dif = Xmax-Xmin; if(dif == 0) dif = 1;

    jumpfi_g[fi] = 0.1/dif; jumpfi_f[fi] = 0.1/dif; if(mod == SIR) jumpfi_r[fi] = 0.1/dif;
    ntr_fi_g[fi] = 0; nac_fi_g[fi] = 0; ntr_fi_f[fi] = 0; nac_fi_f[fi] = 0; 
    if(mod == SIR){ ntr_fi_r[fi] = 0; nac_fi_r[fi] = 0;}
  }

  ntr_I.resize(N); nac_I.resize(N); jumpI.resize(N);
  ntr_R.resize(N); nac_R.resize(N); jumpR.resize(N);
  ntr_addinf.resize(N); nac_addinf.resize(N);
  ntr_reminf.resize(N); nac_reminf.resize(N);
  for(j = 0; j < N; j++){
    ntr_I[j] = 0; nac_I[j] = 0; jumpI[j] = 0.5;
    ntr_R[j] = 0; nac_R[j] = 0; jumpR[j] = 0.5;
    ntr_addinf[j] = 0; nac_addinf[j] = 0;
    ntr_reminf[j] = 0; nac_reminf[j] = 0;
  }

  for(i = 0; i < 5; i++){ ntr[i] = 0; nac[i] = 0;}
  for(i = 0; i < 4; i++){ ntr_rec[i] = 0; nac_rec[i] = 0;}

  for(i = 0; i < 18; i++){ ntr_PBP[i] = 0; nac_PBP[i] = 0; nfa_PBP[i] = 0;}

  ntr_e_g = 0; nac_e_g = 0;
  ntr_e_f = 0; nac_e_f = 0;
  ntr_e_r = 0; nac_e_r = 0;

  ntr_e_vare_g = 0; nac_e_vare_g = 0;

  ntr_vare_gg = 0; nac_vare_gg = 0;
  ntr_vare_gf = 0; nac_vare_gf = 0;
  ntr_vare_gr = 0; nac_vare_gr = 0;
  ntr_vare_ff = 0; nac_vare_ff = 0;
  ntr_vare_fr = 0; nac_vare_fr = 0;
  ntr_vare_rr = 0; nac_vare_rr = 0;

  ntr_q_g = 0; nac_q_g = 0;
  ntr_q_f = 0; nac_q_f = 0;
  ntr_q_r = 0; nac_q_r = 0;

  ntr_vara_gg = 0; nac_vara_gg = 0;
  ntr_vara_gf = 0; nac_vara_gf = 0;
  ntr_vara_gr = 0; nac_vara_gr = 0;
  ntr_vara_ff = 0; nac_vara_ff = 0;
  ntr_vara_fr = 0; nac_vara_fr = 0;
  ntr_vara_rr = 0; nac_vara_rr = 0;

  ntr_geff_g = 0; nac_geff_g = 0;
  ntr_siggeff_g = 0; nac_siggeff_g = 0;

  g.resize(N); f.resize(N); r.resize(N);
  exg.resize(N); exf.resize(N); exf2.resize(N); exr.resize(N);

  infstat.resize(N);

  trialevind.clear(); trialevt.clear(); trialevty.clear();
  ntrialev.resize(Z); trialevind.resize(Z); trialevt.resize(Z); trialevty.resize(Z);
  for(j = 0; j < N; j++){
    z = indtrial[j];
    if(It[j] != -big){
      addev(z,j,It[j],INF);
      if(mod == SIR) addev(z,j,Rt[j],REC);
    }
  }
  for(z = 0; z < Z; z++) addev(z,-1,trialtmax[z],END);
  for(z = 0; z < Z; z++) ntrialev[z] = trialevind[z].size();

  for(z = 0; z < Z; z++){                                                               // makes sure event times do not coincide
    for(e = 1; e < ntrialev[z]; e++){
      t = trialevt[z][e];
      while(t <= trialevt[z][e-1] && t != trialtmin[z] && t != -big && t != big){
        if(e+1 < ntrialev[z]) tnew = trialevt[z][e-1] + 0.00000000001*(trialevt[z][e+1]-trialevt[z][e-1]);
        else tnew = trialevt[z][e-1] + 0.00000000001*(trialevt[z][e]-trialevt[z][e-1]);
        if(t == tnew) tnew += ranin()*0.0000000001;
        trialevt[z][e] = tnew;
        j = trialevind[z][e];
        switch(trialevty[z][e]){
          case INF: It[j] = tnew; if(Itmin[j] == t) Itmin[j] = tnew; if(Itmax[j] == t) Itmax[j] = tnew; break;
          case REC: Rt[j] = tnew; if(Rtmin[j] == t) Rtmin[j] = tnew; if(Rtmax[j] == t) Rtmax[j] = tnew; break;
        }
        t = tnew;
      }
    }
  }

  for(z = 0; z < Z; z++){
    tmi = big; for(i = 0; i < trialind[z].size(); i++){ j = trialind[z][i]; if(It[j] != -big && It[j] < tmi) tmi = It[j];}
    for(i = 0; i < trialind[z].size(); i++){ 
      j = trialind[z][i];
      if(It[j] == -big) infstat[j] = -1;
      else{
        if(It[j] == tmi) infstat[j] = 1; else infstat[j] = 0;
      }
    }
  }

  init2();

  if(randon == 1){
    /*
    if(simnum == 0){
    Ainvlist.clear(); Ainvlist2.clear();
    nAinvlist.resize(N); Ainvlist.resize(N); nAinvlist2.resize(N); Ainvlist2.resize(N);
    for(j = 0; j < N; j++){                                 // Makes a list of non-zero elements
      nAinvlist[j] = 0;
      nAinvlist2[j] = 0;
      for(i = 0; i < N; i++){
        if(i != j && Ainv[j][i] != 0){ Ainvlist[j].push_back(i); nAinvlist[j]++;}
        if(i != j && Ainv[j][i] != 0 && i < j){ Ainvlist2[j].push_back(i); nAinvlist2[j]++;}
      }
    }
    }
    */
    /*    // This is used for PBPs in q
    //vector< vector<double> > T;
    // Converts to a DAG
    T = Ainv;
    randmean.clear(); randmeanval.clear();
    randmeanvar.resize(N);
    nrandmean.resize(N); randmean.resize(N); randmeanval.resize(N);
    nrandmean_true.resize(N); randmean_true.resize(N); randmeanval_true.resize(N);
    for(j = N-1; j >= 0; j--){
      randmeanvar[j] = 1.0/T[j][j];

      nrandmean[j] = 0; nrandmean_true[j] = 0;
      for(jj = 0; jj < j; jj++){
        if(T[j][jj] != 0){
          randmean_true[j].push_back(jj);
          randmeanval_true[j].push_back(-T[j][jj]/T[j][j]);
          nrandmean_true[j]++;

          if(T[j][jj]/T[j][j] < -cut || T[j][jj]/T[j][j] > cut){
            randmean[j].push_back(jj);
            randmeanval[j].push_back(-T[j][jj]/T[j][j]);
            nrandmean[j]++;
          }
        }
      }

      for(jjj = 0; jjj < nrandmean_true[j]; jjj++){
        jj = randmean_true[j][jjj];
        for(kk = 0; kk < nrandmean_true[j]; kk++){
          k = randmean_true[j][kk];
          T[jj][k] -= T[j][jj]*T[j][k]/T[j][j];
        }
      }
    }
    */
  }

  Li = likelihood(); J_mc = J;
  Lrec = likelihood_rec(); K_mc = K;

  if(envon == 1) Lie = likelihoode();

  if(randon == 1) Liq = likelihoodq();

  if(geffon == 1) Ligeff_g = likelihoodgeff_g();

  if(diagtestfl == 1) Ldtest = likelihood_dtest();

  Pri = prior();

  check(0);

  for(loop = 0; loop < 10; loop++) prop_betagamak();

  if(noout == 0) traceinit();
}

void init2()                                                       // Initialises quantities for perfoming event changes
{
  long z, i, j, e;
  double val;
  vector <long> suslist, inflist;
  vector <long> indref;

  time_init2 -= clock();

  indref.resize(N);

  trialevsus.clear(); trialevinf.clear(); ntrialevsus.clear(); ntrialevinf.clear();
  trialevsus.resize(Z); trialevinf.resize(Z); ntrialevsus.resize(Z); ntrialevinf.resize(Z);
  for(z = 0; z < Z; z++){
    suslist.clear(); for(i = 0; i < trialind[z].size(); i++){ j = trialind[z][i]; suslist.push_back(j); indref[j] = i;}
    inflist.clear();

    for(e = 0; e < ntrialev[z]; e++){
      trialevsus[z].push_back(suslist); ntrialevsus[z].push_back(suslist.size());
      trialevinf[z].push_back(inflist); ntrialevinf[z].push_back(inflist.size());

      j = trialevind[z][e];
      switch(trialevty[z][e]){
        case INF:
          i = indref[j];
          if(suslist[i] != j) emsg("Probem with susceptible list");
          if(i < suslist.size()-1){
            suslist[i] = suslist[suslist.size()-1];
            indref[suslist[i]] = i;
          }
          suslist.pop_back();

          indref[j] = inflist.size();
          inflist.push_back(j);
          break;

        case REC:
          i = indref[j];
          if(inflist[i] != j){ emsg("Problem with infected list");}
          if(i < inflist.size()-1){
            inflist[i] = inflist[inflist.size()-1];
            indref[inflist[i]] = i;
          }
          inflist.pop_back();
          break;

        case END:
          e = ntrialev[z];
          break;
      }
    }
  }

  NI = 0; NItot = 0;
  for(z = 0; z < Z; z++){
    for(i = 0; i < trialind[z].size(); i++){
      j = trialind[z][i];
      if(infstat[j] == 0) NI++;
      if(infstat[j] >= 0) NItot++;
    }
  }

  Jz.resize(Z); nIz.resize(Z); Kz.resize(Z);

  sumj.resize(N);
  Fst.resize(N); Fst_pr.resize(N);
  indinf.clear(); indinf.resize(N); nindinf.resize(N); Ist.resize(N); indinfIsum.resize(N);
  for(z = 0; z < Z; z++){
    for(e = 0; e < ntrialev[z]; e++){
      if(trialevty[z][e] == INF){
        j = trialevind[z][e];
        if(infstat[j] == 1) Ist[j] = 0;
        else{
          Ist[j] = ntrialevinf[z][e]; 
          for(i = 0; i < ntrialevinf[z][e]; i++) indinf[trialevinf[z][e][i]].push_back(j);
        }
      }
    }
  }

  for(j = 0; j < N; j++){
    nindinf[j] = indinf[j].size();
    val = 0; for(i = 0; i < nindinf[j]; i++) val += 1.0/Ist[indinf[j][i]];
    indinfIsum[j] = val;
  }

  time_init2 += clock();
}

void addev(long z, long j, double t, long ty)                                          // Adds an events to the time line
{
  long e;

  if(ty == REC && t < trialtmin[z]-2*tiny) emsg("Event out of range");
  if(ty == INF && t > trialtmax[z]) emsg("Event out of range");

  e = 0; while(e < trialevt[z].size() && t > trialevt[z][e]) e++;
  if(e == trialevt[z].size()){
    trialevind[z].push_back(j); trialevt[z].push_back(t); trialevty[z].push_back(ty);
  }
  else{
    trialevind[z].insert(trialevind[z].begin()+e,j); trialevt[z].insert(trialevt[z].begin()+e,t); trialevty[z].insert(trialevty[z].begin()+e,ty);
  }
}

