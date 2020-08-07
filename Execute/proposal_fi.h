// Proposals for fixed effects

void proposal_fi()                                  // Makes proposals to fixed effects
{
  long fi;
  double Lf, al, temp, Lrec_pr, dPri;

  time_fi -= clock();
  for(fi = 0; fi < nfi; fi++){
    temp = fi_g[fi];
    dPri = -priorind(prior_fixed_g[fi],fi_g[fi]);
    fi_g[fi] += normal(0,jumpfi_g[fi]);
    dPri += priorind(prior_fixed_g[fi],fi_g[fi]);

    if(dPri < -big/2) al = 0;
    else{
      Lf = likelihood();
      al = exp(phi*(Lf-Li)+dPri);
    }

    ntr_fi_g[fi]++;
    if(ran() < al){
      nac_fi_g[fi]++;
      Li = Lf; J_mc = J; Pri += dPri;
      if(burning == 1) jumpfi_g[fi] *= 1.02;
    }
    else{
      fi_g[fi] = temp;
      if(burning == 1) jumpfi_g[fi] *= 0.99;
    }

    temp = fi_f[fi];
    dPri = -priorind(prior_fixed_f[fi],fi_f[fi]);
    fi_f[fi] += normal(0,jumpfi_f[fi]);
    dPri += priorind(prior_fixed_f[fi],fi_f[fi]);

    if(dPri < -big/2) al = 0;
    else{
      Lf = likelihood();
      al = exp(phi*(Lf-Li)+dPri);
    }

    ntr_fi_f[fi]++;
    if(ran() < al){
      nac_fi_f[fi]++;
      Li = Lf; J_mc = J; Pri += dPri;
      if(burning == 1) jumpfi_f[fi] *= 1.02;
    }
    else{
      fi_f[fi] = temp;
      if(burning == 1) jumpfi_f[fi] *= 0.99;
    }

    if(mod == SIR){
      temp = fi_r[fi];
      dPri = -priorind(prior_fixed_r[fi],fi_r[fi]);
      fi_r[fi] += normal(0,jumpfi_r[fi]);
      dPri += priorind(prior_fixed_r[fi],fi_r[fi]);

      if(dPri < -big/2) al = 0;
      else{
        Lrec_pr = likelihood_rec();
        al = exp(phi*(Lrec_pr-Lrec)+dPri);
      }

      ntr_fi_r[fi]++;
      if(ran() < al){
        nac_fi_r[fi]++;
        Lrec = Lrec_pr; K_mc = K; Pri += dPri;
        if(burning == 1) jumpfi_r[fi] *= 1.02;
      }
      else{
        fi_r[fi] = temp;
        if(burning == 1) jumpfi_r[fi] *= 0.99;
      }
    }
  }
  time_fi += clock();
}
