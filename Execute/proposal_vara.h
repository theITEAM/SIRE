// Proposals for covariance matrix elements for additive gentics part

void propvara()                                            // Proposes changes covariance matrix for additive genetic contribution
{
  long j, lo, loop, k, jj;
  double sumgg, sumgf, sumgr, sumff, sumfr, sumrr, al, Liq_pr, te, dPri, fac;

  time_vara -= clock();

  if(mod == SIR){
    sumgg = 0; sumgf = 0; sumgr = 0; sumff = 0; sumfr = 0; sumrr = 0;
    for(j = 0; j < N; j++){
      fac = Ainvdiag[j];
      sumgg += q_g[j]*q_g[j]*fac; sumff += q_f[j]*q_f[j]*fac; sumrr += q_r[j]*q_r[j]*fac;
      sumgf += 2*q_g[j]*q_f[j]*fac; sumgr += 2*q_g[j]*q_r[j]*fac; sumfr += 2*q_f[j]*q_r[j]*fac;
      for(k = 0; k < nAinvlist2[j]; k++){
        jj = Ainvlist2[j][k];
        fac = 2*Ainvlistval2[j][k];
        sumgg += q_g[j]*q_g[jj]*fac; sumff += q_f[j]*q_f[jj]*fac; sumrr += q_r[j]*q_r[jj]*fac;
        sumgf += (q_g[j]*q_f[jj]+q_f[j]*q_g[jj])*fac; sumgr += (q_g[j]*q_r[jj]+q_r[j]*q_g[jj])*fac; sumfr += (q_f[j]*q_r[jj]+q_r[j]*q_f[jj])*fac;
      }
    }
  }
  else{
    sumgg = 0; sumgf = 0; sumff = 0;
    for(j = 0; j < N; j++){
      fac = Ainvdiag[j];
      sumgg += q_g[j]*q_g[j]*fac; sumff += q_f[j]*q_f[j]*fac; sumgf += 2*q_g[j]*q_f[j]*fac;
      for(k = 0; k < nAinvlist2[j]; k++){
        jj = Ainvlist2[j][k];
        fac = 2*Ainvlistval2[j][k];
        sumgg += q_g[j]*q_g[jj]*fac; sumff += q_f[j]*q_f[jj]*fac; sumgf += (q_g[j]*q_f[jj]+q_f[j]*q_g[jj])*fac;
      }
    }
  }

  for(loop = 0; loop < 4; loop++){
    for(lo = 0; lo < 6; lo++){
      if(mod == SIR || (mod == SI && (lo == 0 || lo == 1 || lo == 3))){
        switch(lo){
          case 0: te = vara_gg; vara_gg += normal(0,jumpvara_gg); dPri = priorind(prior_vara_gg,vara_gg)-priorind(prior_vara_gg,te); break;
          case 1: te = vara_gf; vara_gf += normal(0,jumpvara_gf); dPri = 0; break;
          case 2: te = vara_gr; vara_gr += normal(0,jumpvara_gr); dPri = 0; break;
          case 3: te = vara_ff; vara_ff += normal(0,jumpvara_ff); dPri = priorind(prior_vara_ff,vara_ff)-priorind(prior_vara_ff,te); break;
          case 4: te = vara_fr; vara_fr += normal(0,jumpvara_fr); dPri = 0; break;
          case 5: te = vara_rr; vara_rr += normal(0,jumpvara_rr); dPri = priorind(prior_vara_rr,vara_rr)-priorind(prior_vara_rr,te); break;
        }

        if(vara_gg < 0 || vara_ff < 0 || vara_rr < 0) al = 0;
        else{
          getPa();

          if(det < 0) al = 0;
          else{
            if(mod == SIR) Liq_pr = -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumrr*Prr + sumgf*Pgf + sumgr*Pgr + sumfr*Pfr)/2;
            else Liq_pr = -0.5*N*log(det) - (sumgg*Pgg + sumff*Pff + sumgf*Pgf)/2;
            al = exp(Liq_pr - Liq + dPri);
          }
        }

        switch(lo){
          case 0: ntr_vara_gg++; break;
          case 1: ntr_vara_gf++; break;
          case 2: ntr_vara_gr++; break;
          case 3: ntr_vara_ff++; break;
          case 4: ntr_vara_fr++; break;
          case 5: ntr_vara_rr++; break;
        }

        if(ran() < al){
          switch(lo){
            case 0: nac_vara_gg++; if(burning == 1) jumpvara_gg *= upfac; break;
            case 1: nac_vara_gf++; if(burning == 1) jumpvara_gf *= upfac; break;
            case 2: nac_vara_gr++; if(burning == 1) jumpvara_gr *= upfac; break;
            case 3: nac_vara_ff++; if(burning == 1) jumpvara_ff *= upfac; break;
            case 4: nac_vara_fr++; if(burning == 1) jumpvara_fr *= upfac; break;
            case 5: nac_vara_rr++; if(burning == 1) jumpvara_rr *= upfac; break;
          }
          Liq = Liq_pr;
          Pri += dPri;
        }
        else{
          switch(lo){
            case 0: vara_gg = te; if(burning == 1) jumpvara_gg *= downfac; break;
            case 1: vara_gf = te; if(burning == 1) jumpvara_gf *= downfac; break;
            case 2: vara_gr = te; if(burning == 1) jumpvara_gr *= downfac; break;
            case 3: vara_ff = te; if(burning == 1) jumpvara_ff *= downfac; break;
            case 4: vara_fr = te; if(burning == 1) jumpvara_fr *= downfac; break;
            case 5: vara_rr = te; if(burning == 1) jumpvara_rr *= downfac; break;
          }

          if(jumpvara_gg < 0.001) jumpvara_gg = 0.001;
          if(jumpvara_gf < 0.001) jumpvara_gf = 0.001;
          if(jumpvara_gr < 0.001) jumpvara_gr = 0.001;
          if(jumpvara_ff < 0.001) jumpvara_ff = 0.001;
          if(jumpvara_fr < 0.001) jumpvara_fr = 0.001;
          if(jumpvara_rr < 0.001) jumpvara_rr = 0.001;
        }
      }
    }
  }
  getPa();

  time_vara += clock();
}
