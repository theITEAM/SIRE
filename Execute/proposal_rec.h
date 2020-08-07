// Proposals for parameters related to recovery

double likelihood_rec_fast()                                        // Fast calculation of recovery likelihood based on precalculated quantities
{
  double L;

  K = kshape*(exp(a_r)*sumr[0] + exp(delta_r*a_r)*sumr[1] + exp(-a_r)*sumr[2]);
  L = kshape*(NItot*log(kshape) + con + sumr2[0]*a_r + sumr2[1]*delta_r*a_r - sumr2[2]*a_r) + (kshape-1)*sumldt - NItot*lgamma(kshape);

  L += NItot*kshape*log(gama) - K*gama;

  return L;
}

void prop_rec()                                                    // Proposes changes to a_r, delta_r, and kshape
{
  long i, j, fi, loop, p, pmax;
  double dt, r, al, pst, Lrec_new, dPri;

  time_rec -= clock();

  time_recinit -= clock();
  for(i = 0; i < 3; i++){ sumr[i] = 0; sumr2[i] = 0;}

  con = 0; sumldt = 0;
  for(j = 0; j < N; j++){
    if(infstat[j] >= 0){
      r = q_r[j] + e_r[j];
      for(fi = 0; fi < nfi; fi++) r += X[j][fi]*fi_r[fi];
      dt = Rt[j]-It[j];
      sumr[geno[j]] += dt*exp(r);
      sumr2[geno[j]]++;
      con += r;
      sumldt += log(dt);
    }
  }
  time_recinit += clock();

  if(domon == 1) pmax= 3; else pmax = 2;

  for(loop = 0; loop < 10; loop++){
     for(p = 1; p < pmax; p++){
       switch(p){
        case 1: pst = a_r; dPri = -priorind(prior_a_r,a_r); a_r += normal(0,jump_r); dPri += priorind(prior_a_r,a_r); break;
        case 2: pst = delta_r; dPri = -priorind(prior_delta_r,delta_r); delta_r += normal(0,jump_delr); dPri += priorind(prior_delta_r,delta_r); break;
      }

      if(dPri < -big/2) al = 0;
      else{
        Lrec_new = likelihood_rec_fast();
        al = exp(phi*(Lrec_new-Lrec)+dPri);
      }

      ntr_rec[p]++;
      if(ran() < al){
        nac_rec[p]++;
        Lrec = Lrec_new;
        K_mc = K;
        Pri += dPri;

        if(burning == 1){  // adapts jumping size for efficient jumping
          switch(p){
            case 1: jump_r *= 1.02; break;
            case 2: jump_delr *= 1.02; break;
          }
        }
      }
      else{
        switch(p){
          case 1: a_r = pst; break;
          case 2: delta_r = pst; break;
        }

        if(burning == 1){  // adapts jumping size for efficient jumping
          switch(p){
            case 1: jump_r *= 0.99; break;
            case 2: jump_delr *= 0.99; break;
          }
        }
      }
    }
  }
  time_rec += clock();
}
