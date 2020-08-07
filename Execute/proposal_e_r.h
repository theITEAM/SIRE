// Proposals for e_r + related covariance matrix elements

double Lprope_r()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  K = 0;
  for(j = 0; j < N; j++){
    if(infstat[j] >= 0){
      K += exp(e_r[j])*sumj[j];
      L += kshape*e_r[j];
    }
  }
  L += NItot*kshape*log(gama) - K*gama;

  return L;
}

void prope_r()                                             // Makes proposals to e_r
{
  long j, fi, loop, loop2;
  double r, dt, al, dLe, dL, e_old, e_new, sum, sig_new, dK, dPri;

  time_e_r -= clock();
  time_e_rinit -= clock();

  con = NItot*(kshape*log(kshape) - lgamma(kshape));

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
      r += q_r[j];
      dt = Rt[j]-It[j];
      sumj[j] = exp(r)*kshape*dt;
      con += kshape*r + (kshape-1)*log(dt);
    }
    else sumj[j] = 0;
  }

  time_e_rinit += clock();
  for(loop = 0; loop < 3; loop++){
    for(j = 0; j < N; j++){
      e_old = e_r[j];
      e_new = e_old + normal(0,jumpe_r);

      if(infstat[j] >= 0){
        dK = (exp(e_new)- exp(e_old))*sumj[j];
        dL = -gama*dK + kshape*(e_new-e_old);
      }
      else{ dL = 0; dK = 0;}
      dPri = priorind(prior_e_r,e_new)-priorind(prior_e_r,e_old);

      dLe = -0.5*((e_new*e_new - e_old*e_old)*Prr + 2*(e_new - e_old)*(e_g[j]*Pgr + e_f[j]*Pfr));

      al = exp(phi*dL+dLe+dPri);

      ntr_e_r++;
      if(ran() < al){
        nac_e_r++;

        e_r[j] = e_new;
        Lrec += dL; K_mc += dK; Pri += dPri;
        Lie += dLe;

        if(burning == 1) jumpe_r *= upfac;
      }
      else{
        if(burning == 1) jumpe_r *= downfac;
      }
    }

    propvare();
    PBPe_r();
  }

  time_e_r += clock();
}

void PBPe_r()                                              // Performs posterior-based proposals which similtaneously update e_r and covariance matrix elements
{
  long j, ac, ty, pty = PBP;
  double mu_mc, mu_pr, var_mc, var_pr, dvar, e_mc, e_pr, alpha, probif, probfi,  Lrec_pr, Lie_pr, vare_gr_st, vare_fr_st, vare_rr_st, al, ss, dPri;
  double Pgr_mc, Pfr_mc, Prr_mc, Pgr_pr, Pfr_pr, Prr_pr, mod_mc, mod_pr, va, val, grad, varmod_mc, varmod_pr, var, mu, e, z;

  time_PBPe_r -= clock();

  getP();
  Pgr_mc = Pgr; Pfr_mc = Pfr; Prr_mc = Prr;
  vare_gr_st = vare_gr; vare_fr_st = vare_fr; vare_rr_st = vare_rr;

  z = ran(); if(z < 0.5) ty = 6; else{ if(z < 0.75) ty = 7; else ty = 8;}

  switch(ty){
    case 6: vare_rr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_rr,vare_rr) - priorind(prior_vare_rr,vare_rr_st); break;
    case 7: vare_gr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_gr,vare_gr) - priorind(prior_vare_gr,vare_gr_st); break;
    case 8: vare_fr += normal(0,jumpPBP[ty]); dPri = priorind(prior_vare_fr,vare_fr) - priorind(prior_vare_fr,vare_fr_st); break;
  }
  getP();
  if(dPri < -big/2 || vare_rr < 0 || det < 0){ vare_gr = vare_gr_st; vare_fr = vare_fr_st; vare_rr = vare_rr_st; getP(); time_PBPe_r += clock(); return;}

  Pgr_pr = Pgr; Pfr_pr = Pfr; Prr_pr = Prr; if(Prr_mc < 0 || Prr_pr < 0) emsg("Inverse covariance matrix negative");
  sto = e_r;

  probif = 0; probfi = 0;
  for(j = 0; j < N; j++){
    varmod_mc = 1.0/Prr_mc;
    varmod_pr = 1.0/Prr_pr;
    mod_mc = -(Pgr_mc*e_g[j] + Pfr_mc*e_f[j])*varmod_mc;
    mod_pr = -(Pgr_pr*e_g[j] + Pfr_pr*e_f[j])*varmod_pr;

    e_mc = e_r[j];

    switch(pty){
      case MBP:
        var_mc = varmod_mc;
        var_pr = varmod_pr;
        mu_mc = mod_mc;
        mu_pr = mod_pr;
        break;

      case PBP:
        if(infstat[j] >= 0) grad = -gama*exp(e_mc)*sumj[j]+kshape; else grad = 0;
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
        if(infstat[j] >= 0) grad = -gama*exp(e_pr)*sumj[j]+kshape; else grad = 0;
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
    e_r[j] = e_pr;
    dPri += priorind(prior_e_r,e_pr)-priorind(prior_e_r,e_mc);
  }

  Lrec_pr = Lprope_r();
  Lie_pr = likelihoode();

  al = exp(phi*(Lrec_pr - Lrec) + Lie_pr  - Lie + probfi - probif + dPri);

  if(dPri < -big/2) nfa_PBP[ty]++;

  ntr_PBP[ty]++;
  if(ran() < al){
    nac_PBP[ty]++;
    Lrec = Lrec_pr; K_mc = K;
    Lie = Lie_pr;
    Pri += dPri;

    if(burning == 1){ jumpPBP[ty] *= 1.01;}
  }
  else{
    vare_gr = vare_gr_st; vare_fr = vare_fr_st; vare_rr = vare_rr_st;
    getP();
    e_r = sto;

    if(burning == 1) jumpPBP[ty] *= 0.99;
  }
  time_PBPe_r += clock();
}
