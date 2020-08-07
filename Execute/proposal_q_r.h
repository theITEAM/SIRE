// Proposals for q_r + related covariance matrix elements

double Lpropq_r()                                          // Fast calculation for likelihood based on precalculated quantities
{
  long j;
  double L;

  L = con;
  K = 0;
  for(j = 0; j < N; j++){
    if(infstat[j] >= 0){
      K += exp(q_r[j])*sumj[j];
      L += kshape*q_r[j];
    }
  }
  L += NItot*kshape*log(gama) - K*gama;

  return L;
}

void propq_r()                                             // Makes proposals to q_r
{
  long i, j, jj, fi, loop, loop2;
  double r, dt, al, dLq, dL, q_old, q_new, sum, sig_new, dK, dPri, fac, fac2, sum_g, sum_f, sum_r;

  time_q_r -= clock();
  time_q_rinit -= clock();

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
      r += e_r[j];
      dt = Rt[j]-It[j];
      sumj[j] = exp(r)*kshape*dt;
      con += kshape*r + (kshape-1)*log(dt);
    }
    else sumj[j] = 0;
  }
  getPa();

  time_q_rinit += clock();

  for(loop = 0; loop < 3; loop++){
    for(j = 0; j < N; j++){
      q_old = q_r[j];
      q_new = q_old + normal(0,jumpq_r);

      if(infstat[j] >= 0){
        dK = (exp(q_new)- exp(q_old))*sumj[j];
        dL = -gama*dK + kshape*(q_new-q_old);
      }
      else{ dL = 0; dK = 0;}
      dPri = priorind(prior_q_r,q_new)-priorind(prior_q_r,q_old);

      fac = Ainvdiag[j];
      sum_g = fac*q_g[j]; sum_f = fac*q_f[j]; sum_r = 0;
      for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj]; sum_r += fac2*q_r[jj]; }

      dLq = -((q_new*q_new - q_old*q_old)*fac*Prr + 2*(q_new-q_old)*(sum_r*Prr + sum_g*Pgr + sum_f*Pfr))/2;

      al = exp(phi*dL+dLq+dPri);

      ntr_q_r++;
      if(ran() < al){
        nac_q_r++;

        q_r[j] = q_new;
        Lrec += dL; K_mc += dK; Pri += dPri;
        Liq += dLq;

        if(burning == 1) jumpq_r *= upfac;
      }
      else{
        if(burning == 1) jumpq_r *= downfac;
      }
    }

    propvara();
  }
  time_q_r += clock();
}
