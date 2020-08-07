// Proposals for simulatenously changing e and q

void propeq()                                                // Makes changes which simulatanousl aleter environmental and additive contributions keep other things fixed
{
  long j, i, jj, loop;
  double y, fac, fac2, sum_g, sum_f, sum_r, var, mu, st_q, st_e, al, dPri;

  time_eq -= clock();

  for(loop = 0; loop < 4; loop++){
    getP(); Pgg_st = Pgg; Pgf_st =Pgf; Pgr_st = Pgr; Pff_st = Pff; Pfr_st = Pfr; Prr_st = Prr;
    getPa();

    for(j = 0; j < N; j++){
      y = e_g[j] + q_g[j];

      if(mod == SIR){
        fac = Ainvdiag[j];
        sum_g = 0; sum_f = fac*q_f[j]; sum_r = fac*q_r[j];
        for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj]; sum_r += fac2*q_r[jj]; }

        var = 1.0/(fac*Pgg+Pgg_st);
        mu = (y*Pgg_st + e_f[j]*Pgf_st + e_r[j]*Pgr_st - (sum_g*Pgg + sum_f*Pgf + sum_r*Pgr))*var;
      }
      else{
        fac = Ainvdiag[j];
        sum_g = 0; sum_f = fac*q_f[j];
        for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj];}

        var = 1.0/(fac*Pgg+Pgg_st);
        mu = (y*Pgg_st + e_f[j]*Pgf_st - (sum_g*Pgg + sum_f*Pgf))*var;
      }

      st_q = q_g[j]; st_e = e_g[j];
      q_g[j] = mu + normal_var(var);
      e_g[j] = y - q_g[j];

      dPri = priorind(prior_q_g,q_g[j])-priorind(prior_q_g,st_q)  + priorind(prior_e_g,e_g[j])-priorind(prior_e_g,st_e);

      al = exp(dPri);
      if(ran() < al){
        Pri += dPri; 
      }
      else{
        q_g[j] = st_q; e_g[j] = st_e;
      }

      y = e_f[j] + q_f[j];

      if(mod == SIR){
        fac = Ainvdiag[j];
        sum_f = 0; sum_g = fac*q_g[j]; sum_r = fac*q_r[j];
        for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj]; sum_r += fac2*q_r[jj]; }

        var = 1.0/(fac*Pff+Pff_st);
        mu = (y*Pff_st + e_g[j]*Pgf_st + e_r[j]*Pfr_st - (sum_g*Pgf + sum_f*Pff + sum_r*Pfr))*var;
      }
      else{
        fac = Ainvdiag[j];
        sum_f = 0; sum_g = fac*q_g[j];
        for(i = 0; i < nAinvlist[j]; i++){ jj = Ainvlist[j][i]; fac2 = Ainvlistval[j][i]; sum_g += fac2*q_g[jj]; sum_f += fac2*q_f[jj];}

        var = 1.0/(fac*Pff+Pff_st);
        mu = (y*Pff_st + e_g[j]*Pgf_st - (sum_g*Pgf + sum_f*Pff))*var;
      }

      st_q = q_f[j]; st_e = e_f[j];
      q_f[j] = mu + normal_var(var);
      e_f[j] = y - q_f[j];

      dPri = priorind(prior_q_f,q_f[j])-priorind(prior_q_f,st_q)  + priorind(prior_e_f,e_f[j])-priorind(prior_e_f,st_e);

      al = exp(dPri);
      if(ran() < al){
        Pri += dPri; 
      }
      else{
        q_f[j] = st_q; e_f[j] = st_e;
      }
    }

    Lie = likelihoode();
    Liq = likelihoodq();
    propvare(); propvara();
  }

  time_eq += clock();
}


