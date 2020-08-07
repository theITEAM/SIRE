// Proposals for e_g + related covariance matrix elements

double Lprope_g()                                                        // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  J = 0;
  for(j = 0; j < N; j++){
    J += exp(e_g[j])*sumj[j];
    if(infstat[j] == 0) L += e_g[j];
  }
  L += NI*log(beta) - beta*J;

  return L;
}

void prope_g()                                                          // Makes proposals to e_g
{
  long z, e, j, i, loop, loop2, fi;
  double t, t2, F, e_old, e_new, al, dL, dLe, sum, sig_new, val_f, val_g, val, dJ, dPri;

  time_e_g -= clock();
  time_e_ginit -= clock();

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
    val_f += q_f[j] + e_f[j]; val_g += q_g[j]; for(fi = 0; fi < nfi; fi++){ val_f += X[j][fi]*fi_f[fi]; val_g += X[j][fi]*fi_g[fi];}
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
  time_e_ginit += clock();

  getP();

  for(loop = 0; loop < 3; loop++){
    for(j = 0; j < N; j++){
      e_old = e_g[j];
      e_new = e_old + normal(0,jumpe_g);

      dJ = (exp(e_new)-exp(e_old))*sumj[j];
      dL = -beta*dJ;
      dPri = priorind(prior_e_g,e_new)-priorind(prior_e_g,e_old);

      if(infstat[j] == 0) dL += e_new - e_old;
      if(mod == SIR) dLe = -0.5*((e_new*e_new - e_old*e_old)*Pgg + 2*(e_new - e_old)*(e_f[j]*Pgf + e_r[j]*Pgr));
      else dLe = -0.5*((e_new*e_new - e_old*e_old)*Pgg + 2*(e_new - e_old)*(e_f[j]*Pgf));

      al = exp(dL+dLe+dPri);
      ntr_e_g++;
      if(ran() < al){
        nac_e_g++;

        e_g[j] = e_new;
        Li += dL; J_mc += dJ; Pri += dPri;
        Lie += dLe;

        if(burning == 1) jumpe_g *= upfac;
      }
      else{
        if(burning == 1) jumpe_g *= downfac;
      }
    }
    propvare();
    PBPe_g();
  }

  time_e_g += clock();
}

void PBPe_g()                                                   // Performs posterior-based proposals which similtaneously update e_g and covariance matrix elements 
{
  long j, ac, ty, pty = PBP;
  double mu_mc, mu_pr, var_mc, var_pr, dvar, e_mc, e_pr, alpha, probif, probfi,  Li_pr, Lie_pr, vare_gg_st, vare_gf_st, vare_gr_st, al, ss, dPri;
  double Pgg_mc, Pgf_mc, Pgr_mc, Pgg_pr, Pgf_pr, Pgr_pr, mod_mc, mod_pr, va, val, grad, varmod_mc, varmod_pr, var, mu, e, z;

  time_PBPe_g -= clock();

  getP();
  Pgg_mc = Pgg; Pgf_mc = Pgf; Pgr_mc = Pgr;
  vare_gg_st = vare_gg; vare_gf_st = vare_gf; vare_gr_st = vare_gr;

  z = ran(); if(mod == SIR){ if(z < 0.5) ty = 0; else{ if(z < 0.75) ty = 1; else ty = 2;}} else{ if(z < 0.7) ty = 0; else ty = 1;}

  switch(ty){
    case 0: vare_gg += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gg,vare_gg) - priorind(prior_vare_gg,vare_gg_st); break;
    case 1: vare_gf += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gf,vare_gf) - priorind(prior_vare_gf,vare_gf_st); break;
    case 2: vare_gr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gr,vare_gr) - priorind(prior_vare_gr,vare_gr_st); break;
  }
  getP();
  if(dPri < -big/2 || vare_gg < 0 || det < 0){ vare_gg = vare_gg_st; vare_gf = vare_gf_st; vare_gr = vare_gr_st; getP(); time_PBPe_g += clock(); return;}

  Pgg_pr = Pgg; Pgf_pr = Pgf; Pgr_pr = Pgr; if(Pgg_mc < 0 || Pgg_pr < 0) emsg("Inverse covariance matrix negative");
  sto = e_g;

  probif = 0; probfi = 0;
  for(j = 0; j < N; j++){
    varmod_mc = 1.0/Pgg_mc;
    varmod_pr = 1.0/Pgg_pr;
    if(mod == SIR){
      mod_mc = -(Pgf_mc*e_f[j] + Pgr_mc*e_r[j])*varmod_mc;
      mod_pr = -(Pgf_pr*e_f[j] + Pgr_pr*e_r[j])*varmod_pr;
    }
    else{
      mod_mc = -Pgf_mc*e_f[j]*varmod_mc;
      mod_pr = -Pgf_pr*e_f[j]*varmod_pr;
    }

    e_mc = e_g[j];

    switch(pty){
      case MBP:
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc;
        mu_pr = mod_pr;
        break;

      case PBP:
        grad = -beta*exp(e_mc)*sumj[j]; if(infstat[j] == 0) grad += 1;
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
        grad = -beta*exp(e_pr)*sumj[j]; if(infstat[j] == 0) grad += 1;
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
      va = (var_mc/var_pr)*kappa*dvar; if(va < 0) emsg("PBP proposal problem");
      val = e_mc - ( mu_mc + (var_mc/var_pr)*alpha*(e_pr-mu_pr)); probfi += -0.5*log(va) - val*val/(2*va);
    }
    e_g[j] = e_pr;
    dPri += priorind(prior_e_g,e_pr)-priorind(prior_e_g,e_mc);
  }

  Li_pr = Lprope_g();
  Lie_pr = likelihoode();

  al = exp(phi*(Li_pr - Li) + Lie_pr  - Lie + probfi - probif + dPri); 

  if(dPri < -big/2) nfa_PBP[ty]++;

  ntr_PBP[ty]++;
  if(ran() < al){
    nac_PBP[ty]++;
    Li = Li_pr; J_mc = J;
    Lie = Lie_pr;
    Pri += dPri;

    if(burning == 1){ jumpPBP[ty] *= 1.01;}
  }
  else{
    vare_gg = vare_gg_st; vare_gf = vare_gf_st; vare_gr = vare_gr_st;
    getP();
    e_g = sto;

    if(burning == 1) jumpPBP[ty] *= 0.99;
  }
  time_PBPe_g += clock();
}
