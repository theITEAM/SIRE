// Proposals for covariance matrix elements for residual

void propvare()                                               // Proposes changes covariance matrix for residuals
{
  long j, lo, loop;
  double sumgg, sumgf, sumgr, sumff, sumfr, sumrr, al, Lie_pr, te, dPri;

  time_vare -= clock();

  if(mod == SIR){
    sumgg = 0; sumgf = 0; sumgr = 0; sumff = 0; sumfr = 0; sumrr = 0;
    for(j = 0; j < N; j++){
      sumgg += e_g[j]*e_g[j]; sumgf += e_g[j]*e_f[j]; sumgr += e_g[j]*e_r[j]; sumff += e_f[j]*e_f[j]; sumfr += e_f[j]*e_r[j]; sumrr += e_r[j]*e_r[j];
    }
  }
  else{
    sumgg = 0; sumgf = 0; sumff = 0;
    for(j = 0; j < N; j++){
      sumgg += e_g[j]*e_g[j]; sumgf += e_g[j]*e_f[j]; sumff += e_f[j]*e_f[j];
    }
  }

  for(loop = 0; loop < 4; loop++){
    for(lo = 0; lo < 6; lo++){
      if(mod == SIR || (mod == SI && (lo == 0 || lo == 1 || lo == 3))){
        switch(lo){
          case 0: te = vare_gg; vare_gg += normal(0,jumpvare_gg); dPri = priorind(prior_vare_gg,vare_gg)-priorind(prior_vare_gg,te); break;
          case 1: te = vare_gf; vare_gf += normal(0,jumpvare_gf); dPri = priorind(prior_vare_gf,vare_gf)-priorind(prior_vare_gf,te); break;
          case 2: te = vare_gr; vare_gr += normal(0,jumpvare_gr); dPri = priorind(prior_vare_gr,vare_gr)-priorind(prior_vare_gr,te); break;
          case 3: te = vare_ff; vare_ff += normal(0,jumpvare_ff); dPri = priorind(prior_vare_ff,vare_ff)-priorind(prior_vare_ff,te); break;
          case 4: te = vare_fr; vare_fr += normal(0,jumpvare_fr); dPri = priorind(prior_vare_fr,vare_fr)-priorind(prior_vare_fr,te); break;
          case 5: te = vare_rr; vare_rr += normal(0,jumpvare_rr); dPri = priorind(prior_vare_rr,vare_rr)-priorind(prior_vare_rr,te); break;
        }

        if(vare_gg < 0 || vare_ff < 0 || vare_rr < 0) al = 0;
        else{
          getP();
          if(det < 0) al = 0;
          else{
            if(mod == SIR) Lie_pr = -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumrr*Prr + 2*sumgf*Pgf + 2*sumgr*Pgr + 2*sumfr*Pfr)/2;
            else Lie_pr = -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + 2*sumgf*Pgf)/2;

            al = exp(Lie_pr - Lie + dPri);
          }
        }

        switch(lo){
          case 0: ntr_vare_gg++; break;
          case 1: ntr_vare_gf++; break;
          case 2: ntr_vare_gr++; break;
          case 3: ntr_vare_ff++; break;
          case 4: ntr_vare_fr++; break;
          case 5: ntr_vare_rr++; break;
        }

        if(ran() < al){
          switch(lo){
            case 0: nac_vare_gg++; if(burning == 1) jumpvare_gg *= upfac; break;
            case 1: nac_vare_gf++; if(burning == 1) jumpvare_gf *= upfac; break;
            case 2: nac_vare_gr++; if(burning == 1) jumpvare_gr *= upfac; break;
            case 3: nac_vare_ff++; if(burning == 1) jumpvare_ff *= upfac; break;
            case 4: nac_vare_fr++; if(burning == 1) jumpvare_fr *= upfac; break;
            case 5: nac_vare_rr++; if(burning == 1) jumpvare_rr *= upfac; break;
          }
          Lie = Lie_pr;
          Pri += dPri;
        }
        else{
          switch(lo){
            case 0: vare_gg = te; if(burning == 1) jumpvare_gg *= downfac; break;
            case 1: vare_gf = te; if(burning == 1) jumpvare_gf *= downfac; break;
            case 2: vare_gr = te; if(burning == 1) jumpvare_gr *= downfac; break;
            case 3: vare_ff = te; if(burning == 1) jumpvare_ff *= downfac; break;
            case 4: vare_fr = te; if(burning == 1) jumpvare_fr *= downfac; break;
            case 5: vare_rr = te; if(burning == 1) jumpvare_rr *= downfac; break;
          }

          if(jumpvare_gg < 0.001) jumpvare_gg = 0.001;
          if(jumpvare_gf < 0.001) jumpvare_gf = 0.001;
          if(jumpvare_gr < 0.001) jumpvare_gr = 0.001;
          if(jumpvare_ff < 0.001) jumpvare_ff = 0.001;
          if(jumpvare_fr < 0.001) jumpvare_fr = 0.001;
          if(jumpvare_rr < 0.001) jumpvare_rr = 0.001;
        }
      }
    }
  }
  getP();

  time_vare += clock();
}
