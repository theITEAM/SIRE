// Code for checking the correct operation of the code

void check(long num)                                                          // Checks all parameters are correct
{
  long z, e, j, i, inf, p, NIch;
  double d, temp, betaav, gamaav, R0, tmi;

  time_check -= clock();
  if(isnan(Li)) emsg("Likelihood is not a number");
  if(isnan(J_mc)) emsg("Likelihood is not a number");
  if(mod == SIR){
    if(isnan(Lrec)) emsg("Recovery likelihood is not a number");
    if(isnan(K_mc)) emsg("Recovery likelihood is not a number");
  }
  if(envon == 1){
    if(isnan(Lie)) emsg("Likelihood of residual is not a number");
  }
  if(randon == 1){
    if(isnan(Liq)) emsg("Likelihood of random effects is not a number");
  }
  if(geffon == 1){
    if(isnan(Ligeff_g)) emsg("Likelihood of group effects is not a number");
  }
  if(diagtestfl == 1){
    if(isnan(Ldtest)) emsg("Likelihood of test results is not a number");
  }

  trialevcheck();

  temp = likelihood();
  d = Li - temp;
  if(d*d > 0.01){ cout << Li << " " << temp << " jj\n"; emsg("Likelihood error");}
  Li = temp;

  d = J_mc - J;
  if(d*d > 0.01) emsg("Likelihood error");
  J_mc = J;

  if(mod == SIR){
    temp = likelihood_rec();
    d = Lrec - temp;
    if(d*d > 0.001) emsg("Recovery likelihood error");
    Lrec = temp;

    d = K_mc - K; if(d*d > 0.001) emsg("Recovery likelihood error");
    K_mc = K;
  }

  getP();
  if(det < 0) emsg("Problem with matrix determinant\n");

  if(envon == 1){
    temp = likelihoode();
    d = Lie - temp; if(d*d > 0.01) emsg("Residual likelihood error");
    Lie = temp;
  }

  if(randon == 1){
    temp = likelihoodq();
    d = Liq - temp; if(d*d > 0.001) emsg("Additive genetic likelihood error");
    Liq = temp;
  }

  if(geffon == 1){
    temp = likelihoodgeff_g();
    d = Ligeff_g - temp; if(d*d > 0.001) emsg("Group effect likelihood error");
    Ligeff_g = temp;
  }

  if(diagtestfl == 1){
    temp = likelihood_dtest();
    d = Ldtest - temp; if(d*d > 0.001) emsg("Diagnostic test likelihood error");
    Ldtest = temp;
  }

  temp = prior();
  d = Pri - temp;

  if(d*d > 0.001){ cout << num << "Num\n"; emsg("Prior error");}
  Pri = temp;

  for(z = 0; z < Z; z++){
    for(e = 0; e < ntrialev[z]; e++){
      j = trialevind[z][e];
      switch(trialevty[z][e]){
        case INF: if(trialevt[z][e] != It[j]){ emsg("Infection time not right");} break;
        case REC: if(trialevt[z][e] != Rt[j]){ emsg("Recovery time not right");} break;
      }
    }
  }

  checkinfstat(-1);

  for(j = 0; j < N; j++){
    if(It[j] != -big && (It[j] < Itmin[j] || It[j] > Itmax[j])) emsg("Infection time out of range");
    if(Rt[j] != -big && (Rt[j] < Rtmin[j] || Rt[j] > Rtmax[j])) emsg("Recovery time out of range");
  }

  for(j = 0; j < N; j++){
    if(isnan(e_g[j]) || isnan(e_f[j]) || (mod == SIR && isnan(e_r[j]))) emsg("Residual not a number");
    if(!isfinite(e_g[j]) || !isfinite(e_f[j]) || (mod == SIR && !isfinite(e_r[j]))) emsg("Residual not finite");
  }

  NIch = 0; for(j = 0; j < N; j++){ if(infstat[j] == 0) NIch++;}
  if(NIch != NI) emsg("Number of infected individuals NI not right");
  NIch = 0; for(j = 0; j < N; j++){ if(infstat[j] >= 0) NIch++;}
  if(NIch != NItot) emsg("Number of infected individuals NItot not right");

  time_check += clock();
}

struct EVV { long ty; double t; long i;};
bool compare(EVV lhs, EVV rhs) { return lhs.t < rhs.t; }
void trialevcheck()                                                           // Checks the event sequences for individuals are consistent
{
  long j, z, i, N, e;
  vector <EVV> evl;

  for(z = 0; z < Z; z++){
    evl.clear();
    N = trialind[z].size();
    for(j = 0; j < N; j++){
      i = trialind[z][j];
      if(It[i] != -big){
        if(It[i] > Rt[i]) emsg("Infection time greater than recovery time");
        if(It[i] > trialtmax[z]) emsg("Infection time outside inference time");
        if(It[i] < trialtmin[z]) emsg("Infection time outside inference time");
        if(noIinrangest[i] == 1){
          if(It[i] > obstmin[z] && It[i] < obstmax[z]) emsg("Infection time should not be in observation time");
        }

        if(noRinrangest[i] == 1){
          if(Rt[i] > obstmin[z] && Rt[i] < obstmax[z]) emsg("Recovery time should not be in observation time");
        }

        EVV evnew; evnew.ty = INF; evnew.t = It[i]; evnew.i = i; evl.push_back(evnew);
        if(mod == SIR){ EVV evnew2; evnew2.ty = REC; evnew2.t = Rt[i]; evnew2.i = i; evl.push_back(evnew2);}
      }
    }
    EVV evnew3; evnew3.ty = END; evnew3.t = trialtmax[z]; evnew3.i = -1; evl.push_back(evnew3);
    sort(evl.begin(),evl.end(),compare);

    if(evl.size() != trialevind[z].size()) emsg("Number of events not correct");
    for(e = 0; e < evl.size(); e++){
      if(evl[e].ty !=  trialevty[z][e]) emsg("Tyoe if events not correct");
      if(evl[e].t != trialevt[z][e]) emsg("Event times not correct");
      if(evl[e].i != trialevind[z][e] && evl[e].t != evl[0].t) emsg("Individuals not correct");
    }
  }
}

void checkinfstat(long num)                                       // Checks the infection status of individuals
{
  long z, i, j, inf, e;
  double tmi, t;

  for(z = 0; z < Z; z++){
    for(e = 0; e < ntrialev[z]-1; e++){
      t = trialevt[z][e];
      if(t == trialevt[z][e+1] && trialevt[z][e] != trialtmin[z] && t != big && t != -big) emsg("Events have the same time");
    }
  }

  for(z = 0; z < Z; z++){
    tmi = big; for(i = 0; i < trialind[z].size(); i++){ j = trialind[z][i]; if(It[j] != -big && It[j] < tmi) tmi = It[j];}

    for(i = 0; i < trialind[z].size(); i++){ 
      j = trialind[z][i];
      if(It[j] == -big) inf = -1;
      else{
        if(It[j] == tmi) inf = 1; else inf = 0;
      } 
      if(infstat[j] != inf) emsg("Problem with infection status");
    }
  }
}

void checkevQ(long z)                                             // Checks evQ and evF are correct when performing event changes
{
  long e, j, i;
  double F, Q, dd;

  for(e = 0; e < nev-1; e++){
    if(evt[e] > evt[e+1]) emsg("Events in the wrong order");
  }

  F = 0; Q =0; for(i = 0; i < trialind[z].size(); i++) Q += exg[trialind[z][i]];
  for(e = 0; e < nev; e++){
    j = evind[e];
    dd = evQ[e] - Q; if(dd*dd > tiny) emsg("Q wrong");
    dd = evF[e] - F; if(dd*dd > tiny) emsg("F wrong");

    switch(evty[e]){
      case INF: F += exf[j]; Q -= exg[j]; break;
      case REC: F -= exf[j]; break;
      case END: e = nev; break;
    }
  }
}
