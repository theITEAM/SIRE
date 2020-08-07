// Proposals for e_f + related covariance matrix elements

double Lprope_f()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  J = Jcon;
  for(j = 0; j < N; j++){
    J += exp(e_f[j])*sumj[j];
    if(infstat[j] == 0) L += log(Fst[j]);
  }
  L += NI*log(beta) - beta*J;

  return L;
}

double Lprope_f_pr()                                             // Makes proposals to e_f
{
  long j, z, i, e;
  double L, F;

  L = con;
  J = Jcon;
  for(j = 0; j < N; j++){ J += exp(e_f[j])*sumj[j]; exf2[j] = exf[j]*exp(e_f[j]);}
  L += NI*log(beta) - beta*J;

  for(z = 0; z < Z; z++){
    F = 0;
    for(e = 0; e < ntrialev[z]; e++){
      j = trialevind[z][e]; 
      switch(trialevty[z][e]){
        case INF:
          if(infstat[j] == 0){ L += log(F); Fst_pr[j] = F;}
          F += exf2[j];
          break;
        case REC:
          F -= exf2[j];
          break;
      }
    }
  }

  return L;
}

void prope_f()                                              // Performs posterior-based proposals which similtaneously update e_f and covariance matrix elements
{
  long z, e, j, jj, i, loop, loop2, fi;
  double t, t2, e_old, e_new, al, dL, dLe, sum, sig_new, F, dF, val_f, val_g, val, va, dJ, dPri;

  time_e_f -= clock();
  time_e_finit -= clock();

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
    val_f += q_f[j]; val_g += q_g[j] + e_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
    exf[j] = exp(val_f); exf2[j] = exp(val_f+e_f[j]); exg[j] = exp(val_g);
  }

  for(j = 0; j < N; j++) sumj[j] = 0;

  con = 0;
  Jcon = 0;
  for(z = 0; z < Z; z++){
    t = -big;
    F = 0;
    for(e = 0; e < ntrialev[z]; e++){
      t2 = trialevt[z][e];

      sum = 0; for(i = 0; i < ntrialevsus[z][e]; i++) sum += exg[trialevsus[z][e][i]];
      val = sum*(t2-t);
      for(i = 0; i < ntrialevinf[z][e]; i++){ j = trialevinf[z][e][i]; sumj[j] += exf[j]*val;}
      t = t2;

      j = trialevind[z][e];
      switch(trialevty[z][e]){
        case INF:
          if(infstat[j] == 0){
            con += log(exg[j]);
            Fst[j] = F;
          }
          F += exf2[j];
          break;

        case REC:
          F -= exf2[j];
          break;

        case END:
          e = ntrialev[z];
          break;
      }
    }
  }
  time_e_finit += clock();

  for(loop = 0; loop < 3; loop++){
     for(j = 0; j < N; j++){
      e_old = e_f[j];
      e_new = e_old + normal(0,jumpe_f);

      va = exp(e_new) - exp(e_old);
      dF = exf[j]*va;
      dJ = va*sumj[j];
      dL = -beta*dJ;
      dPri = priorind(prior_e_f,e_new)-priorind(prior_e_f,e_old);

      for(i = 0; i < nindinf[j]; i++) dL += log(1 + dF/Fst[indinf[j][i]]);

      if(mod == SIR) dLe = -0.5*((e_new*e_new - e_old*e_old)*Pff + 2*(e_new - e_old)*(e_g[j]*Pgf + e_r[j]*Pfr));
      else dLe = -0.5*((e_new*e_new - e_old*e_old)*Pff + 2*(e_new - e_old)*(e_g[j]*Pgf));

      al = exp(phi*dL+dLe+dPri);

      ntr_e_f++;
      if(ran() < al){
        nac_e_f++;

        e_f[j] = e_new;
        for(i = 0; i < nindinf[j]; i++) Fst[indinf[j][i]] += dF;

        Li += dL; J_mc += dJ; Pri += dPri;
        Lie += dLe;

        if(burning == 1) jumpe_f *= upfac;
      }
      else{
        if(burning == 1) jumpe_f *= downfac;
      }
    }

    propvare();
    MBPe_f();
    //PBPe_fnew();
  }

  time_e_f += clock();
}

void PBPe_f()                                             // Performs posterior-based proposals which similtaneously update e_f and covariance matrix elements
{
  long j, ac, ty, pty = PBP;
  double mu_mc, mu_pr, var_mc, var_pr, dvar, e_mc, e_pr, alpha, probif, probfi,  Li_pr, Lie_pr, vare_ff_st, vare_gf_st, vare_fr_st, al, ss, dPri;
  double Pff_mc, Pgf_mc, Pfr_mc, Pff_pr, Pgf_pr, Pfr_pr, mod_mc, mod_pr, va, val, grad, varmod_mc, varmod_pr, var, mu, e, z;

  time_PBPe_f -= clock();

  getP();
  Pff_mc = Pff; Pgf_mc = Pgf; Pfr_mc = Pfr;
  vare_ff_st = vare_ff; vare_gf_st = vare_gf; vare_fr_st = vare_fr;

  z = ran(); if(mod == SIR){ if(z < 0.5) ty = 3; else{ if(z < 0.75) ty = 4; else ty = 5;}}else{ if(z < 0.7) ty = 3; else ty = 4;}

  switch(ty){
    case 3: vare_ff += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_ff,vare_ff) - priorind(prior_vare_ff,vare_ff_st); break;
    case 4: vare_gf += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gf,vare_gf) - priorind(prior_vare_gf,vare_gf_st); break;
    case 5: vare_fr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_fr,vare_fr) - priorind(prior_vare_fr,vare_fr_st); break;
  }
  getP();
  if(dPri < -big/2 || vare_ff < 0 || det < 0){ vare_ff = vare_ff_st; vare_gf = vare_gf_st; vare_fr = vare_fr_st; getP(); time_PBPe_f += clock(); return;}

  Pff_pr = Pff; Pgf_pr = Pgf; Pfr_pr = Pfr; if(Pff_mc < 0 || Pff_pr < 0) emsg("Inverse covariance matrix negative");
  sto = e_f;

  probif = 0; probfi = 0;
  for(j = 0; j < N; j++){
    varmod_mc = 1.0/Pff_mc;
    varmod_pr = 1.0/Pff_pr;
    if(mod == SIR){
      mod_mc = -(Pgf_mc*e_g[j] + Pfr_mc*e_r[j])*varmod_mc;
      mod_pr = -(Pgf_pr*e_g[j] + Pfr_pr*e_r[j])*varmod_pr;
    }
    else{
      mod_mc = -Pgf_mc*e_g[j]*varmod_mc;
      mod_pr = -Pgf_pr*e_g[j]*varmod_pr;
    }

    e_mc = e_f[j];

    switch(pty){
      case MBP:
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc;
        mu_pr = mod_pr;
        break;

      case PBP:
        grad = -beta*exp(e_mc)*sumj[j] + indinfIsum[j];
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc + var_mc*grad;
        mu_pr = mod_pr + var_pr*grad;
        break;
    }

    dvar = var_pr - var_mc;                                                           // Performs the posterior based proposal using the APD from above

    if(dvar > 0){
      alpha = sqrt((1-kappa)*(dvar/var_mc)+1);
      va = kappa*dvar;
      val = normal_var(va); probif += -0.5*log(va) - val*val/(2*va);
      e_pr = mu_pr + alpha*(e_mc-mu_mc) + val;
    }
    else{
      alpha = sqrt((1-kappa)*(-dvar/var_pr)+1);
      va = -(var_pr/var_mc)*kappa*dvar; 
      val = normal_var(va); probif += -0.5*log(va) - val*val/(2*va);
      e_pr = mu_pr + (var_pr/var_mc)*alpha*(e_mc-mu_mc) + val;
    }

     // looks at reverse
    switch(pty){
      case MBP:
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc;
        mu_pr = mod_pr;
        break;

      case PBP:
        grad = -beta*exp(e_pr)*sumj[j] + indinfIsum[j];
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc + var_mc*grad;
        mu_pr = mod_pr + var_pr*grad;
        break;
    }

    dvar = var_pr - var_mc;

    if(-dvar > 0){
      alpha = sqrt((1-kappa)*(-dvar/var_pr)+1);
      va = -kappa*dvar;
      val = e_mc - (mu_mc + alpha*(e_pr-mu_pr)); probfi += -0.5*log(va) - val*val/(2*va);
    }
    else{
      alpha = sqrt((1-kappa)*(dvar/var_mc)+1);
      va = (var_mc/var_pr)*kappa*dvar;  if(va < 0) emsg("PBP proposal problem");
      val = e_mc - ( mu_mc + (var_mc/var_pr)*alpha*(e_pr-mu_pr)); probfi += -0.5*log(va) - val*val/(2*va);
    }
    e_f[j] = e_pr;

    dPri += priorind(prior_e_f,e_pr)-priorind(prior_e_f,e_mc);
  }

  Li_pr = Lprope_f_pr();
  Lie_pr = likelihoode();

  al = exp(phi*(Li_pr - Li) + Lie_pr  - Lie + probfi - probif + dPri);

  if(dPri < -big/2) nfa_PBP[ty]++;

  ntr_PBP[ty]++;
  if(ran() < al){
    nac_PBP[ty]++;
    Li = Li_pr; J_mc = J;
    Lie = Lie_pr;
    Pri += dPri;
    Fst = Fst_pr;

    if(burning == 1) jumpPBP[ty] *= 1.01;
  }
  else{
    vare_ff = vare_ff_st; vare_gf = vare_gf_st; vare_fr = vare_fr_st;
    getP();
    e_f = sto;

    if(burning == 1) jumpPBP[ty] *= 0.99;
  }
  time_PBPe_f += clock();
}

void MBPe_f()                                             // Performs model-based proposals which similtaneously update e_f and covariance matrix elements
{
  long j, ac, ty;
  double mu_mc, mu_pr, var_mc, var_pr, dvar, e_mc, e_pr, alpha, Li_pr, Lie_pr, vare_ff_st, vare_gf_st, vare_fr_st, al, ss, dPri;
  double Pff_mc, Pgf_mc, Pfr_mc, Pff_pr, Pgf_pr, Pfr_pr, va, val, grad, var, mu, e, z;

  time_PBPe_f -= clock();

  getP();
  Pff_mc = Pff; Pgf_mc = Pgf; Pfr_mc = Pfr;
  vare_ff_st = vare_ff; vare_gf_st = vare_gf; vare_fr_st = vare_fr;

  z = ran(); if(mod == SIR){ if(z < 0.5) ty = 3; else{ if(z < 0.75) ty = 4; else ty = 5;}}else{ if(z < 0.7) ty = 3; else ty = 4;}

  switch(ty){
    case 3: vare_ff += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_ff,vare_ff) - priorind(prior_vare_ff,vare_ff_st); break;
    case 4: vare_gf += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gf,vare_gf) - priorind(prior_vare_gf,vare_gf_st); break;
    case 5: vare_fr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_fr,vare_fr) - priorind(prior_vare_fr,vare_fr_st); break;
  }
  getP();
  if(dPri < -big/2 || vare_ff < 0 || det < 0){ vare_ff = vare_ff_st; vare_gf = vare_gf_st; vare_fr = vare_fr_st; getP(); time_PBPe_f += clock(); return;}

  Pff_pr = Pff; Pgf_pr = Pgf; Pfr_pr = Pfr; if(Pff_mc < 0 || Pff_pr < 0) emsg("Inverse covariance matrix negative");
  sto = e_f;

  for(j = 0; j < N; j++){
    var_mc = 1.0/Pff_mc;
    var_pr = 1.0/Pff_pr;
    if(mod == SIR){
      mu_mc = -(Pgf_mc*e_g[j] + Pfr_mc*e_r[j])*var_mc;
      mu_pr = -(Pgf_pr*e_g[j] + Pfr_pr*e_r[j])*var_pr;
    }
    else{
      mu_mc = -Pgf_mc*e_g[j]*var_mc;
      mu_pr = -Pgf_pr*e_g[j]*var_pr;
    }

    e_mc = e_f[j];

    dvar = var_pr - var_mc;                                                           // Performs the posterior based proposal using the APD from above

    if(dvar > 0){
      alpha = sqrt((1-kappa)*(dvar/var_mc)+1);
      va = kappa*dvar;
      val = normal_var(va);
      e_pr = mu_pr + alpha*(e_mc-mu_mc) + val;
    }
    else{
      alpha = sqrt((1-kappa)*(-dvar/var_pr)+1);
      va = -(var_pr/var_mc)*kappa*dvar; 
      val = normal_var(va);
      e_pr = mu_pr + (var_pr/var_mc)*alpha*(e_mc-mu_mc) + val;
    }
    e_f[j] = e_pr;

    dPri += priorind(prior_e_f,e_pr)-priorind(prior_e_f,e_mc);
  }

  Li_pr = Lprope_f_pr();

  al = exp(phi*(Li_pr - Li) + dPri);

  if(dPri < -big/2) nfa_PBP[ty]++;

  ntr_PBP[ty]++;
  if(ran() < al){
    nac_PBP[ty]++;
    Li = Li_pr; J_mc = J;
    Lie = likelihoode();
    Pri += dPri;
    Fst = Fst_pr;

    if(burning == 1) jumpPBP[ty] *= 1.01;
  }
  else{
    vare_ff = vare_ff_st; vare_gf = vare_gf_st; vare_fr = vare_fr_st;
    getP();
    e_f = sto;

    if(burning == 1) jumpPBP[ty] *= 0.99;
  }

  time_PBPe_f += clock();
}

