void traceinit()                                                       // Initialises the trace plot
{
  long p, c, cl, f, z;

  cout << "1|";

  if(snpfl == 1){
    cout << "SNP|a_g|SNP effect for susceptibility|";
    cout << "SNP|a_f|SNP effect for infectivity|";
    if(mod == SIR) cout << "SNP|a_r|SNP effect for recoverability|";
    if(domon == 1){
      cout << "SNP|Δ_g|Dominance factor for susceptibility|";
      cout << "SNP|Δ_f|Dominance factor for infectivity|";
      if(mod == SIR) cout << "SNP|Δ_r|Dominance factor for recoverability|";
    }
  }

  for(f = 0; f < nfi; f++){
    cout << "Fix. Eff.|" << finame[0][f] << "|Fixed effect " << finame[0][f] << " for suceptibility|";
    cout << "Fix. Eff.|" << finame[1][f] << "|Fixed effect " << finame[1][f] << " for infectivity|";
    if(mod == SIR) cout << "Fix. Eff.|" << finame[2][f] << "|Fixed effect " << finame[2][f] << " for recoverability|";
  }

  cout << "Epi.|β|Contact rate|";
  if(mod == SIR) cout << "Epi.|γ|Recovery rate|";
  if(mod == SIR) cout << "Epi.|k|Shape parameter|";

  if(envon == 1){
    cout << "Covar.|Σ_gg|Covariance matrix Σ_gg for residule|";
    cout << "Covar.|Σ_gf|Covariance matrix Σ_gf for residule|";
    if(mod == SIR) cout << "Covar.|Σ_gr|Covariance matrix Σ_gr for residule|";
    cout << "Covar.|Σ_ff|Covariance matrix Σ_ff for residule|";
    if(mod == SIR) cout << "Covar.|Σ_fr|Covariance matrix Σ_fr for residule|";
    if(mod == SIR) cout << "Covar.|Σ_rr|Covariance matrix Σ_rr for residule|";
  }

  if(randon == 1){
    cout << "Covar.|Ω_gg|Covariance matrix Ω_gg for random effect|";
    cout << "Covar.|Ω_gf|Covariance matrix Ω_gf for random effect|";
    if(mod == SIR) cout << "Covar.|Ω_gr|Covariance matrix Ω_gr for random effect|";
    cout << "Covar.|Ω_ff|Covariance matrix Ω_ff for random effect|";
    if(mod == SIR) cout << "Covar.|Ω_fr|Covariance matrix Ω_fr for random effect|";
    if(mod == SIR) cout << "Covar.|Ω_rr|Covariance matrix Ω_rr for random effect|";
  }

  if(envon == 1 && randon == 1){
    cout << "Herit.|h2_g|Heritability of susceptibility|";
    cout << "Herit.|h2_f|Heritability of infectivity|";
    if(mod == SIR) cout << "Herit.|h2_r|Heritability of recoverability|";
  }


  if(geffon == 1 && Z > 1){
    cout << "Gr. Eff.|σ_G|Standard deviation in group effect" << z << "|";
    for(z = 0; z < Z; z++) cout << "Gr. Eff.|G" << z << "|Group effect for trial " << z << "|";
  }


  cout << "Misc.|L_inf|Infection likelihood|";
  if(mod == SIR) cout << "Misc.|L_rec|Recovery likelihood|";
  cout << "Misc.|L_DT|Likelihood of diagnostic tests|";
  cout << "Misc.|L_e|Environmental likelihood|";
  cout << "Misc.|L_G|Group effect likelihood|";
  cout << "Misc.|Pr|Prior|";

  cout << "\n";
  cout.flush();
}

void traceplot()                                                      // Outputs varaible values
{
  long f, z;

  cout <<"0|";
  if(snpfl == 1){
    cout << a_g << "|" << a_f << "|"; if(mod == SIR) cout << a_r << "|";
    if(domon == 1){
      cout << delta_g << "|" << delta_f << "|"; if(mod == SIR) cout << delta_r << "|";
    }
  }

  for(f = 0; f < nfi; f++){ cout << fi_g[f] << "|" << fi_f[f] << "|"; if(mod == SIR) cout << fi_r[f] << "|";}

  cout << beta << "|"; if(mod == SIR) cout << gama << "|" << kshape << "|";

  if(envon == 1){
    if(mod == SIR) cout << vare_gg << "|" << vare_gf << "|" << vare_gr << "|" << vare_ff << "|" << vare_fr << "|" << vare_rr << "|";
    else cout << vare_gg << "|" << vare_gf << "|" << vare_ff << "|";
  }

  if(randon == 1){
    if(mod == SIR) cout << vara_gg << "|" << vara_gf << "|" << vara_gr << "|" << vara_ff << "|" << vara_fr << "|" << vara_rr << "|";
    else cout << vara_gg << "|" << vara_gf << "|" << vara_ff << "|";
  }

  if(envon == 1 && randon == 1){
    cout << vara_gg/(vara_gg+vare_gg) << "|";
    cout << vara_ff/(vara_ff+vare_ff) << "|";
    if(mod == SIR) cout << vara_rr/(vara_rr+vare_rr) << "|";
  }


  if(geffon == 1 && Z > 1){
    cout << siggeff_g << "|";
    for(z = 0; z < Z; z++) cout << geff_g[z] << "|";
  }

  cout << Li << "|";
  if(mod == SIR) cout << Lrec << "|";

  cout << Ldtest << "|" << Lie << "|" << Ligeff_g << "|" << Pri << "|";
  cout << "\n";
  cout.flush();
}

void eventplot()                                            // Outputs infection and recovery events
{
  long i, z, k;
  vector <long> list;
  vector <double> listt;

  cout << "5|";

  cout << N << "|";
  for(i = 0; i < N; i++){
    z = indtrial[i];
    list.clear(); listt.clear();
    list.push_back(0); listt.push_back(trialtmin[z]);

    if(It[i] != -big){
      list.push_back(1); listt.push_back(It[i]);
      if(Rt[i] < trialtmax[z]){ list.push_back(2); listt.push_back(Rt[i]);}
    }

    list.push_back(-1); listt.push_back(trialtmax[z]);

    for(k = 0; k < list.size()-1; k++) if(listt[k] > listt[k+1]) emsg("Order of events not right");

    cout << list.size() << "|"; for(k = 0; k < list.size(); k++) cout << list[k] << "|" << listt[k] << "|";
  }
  cout << "\n";
}

void diagnostic()                                                          // Outputs MCMC diagnostics
{
  long i, fi, ty;
  double timeto = timetot + clock(), fav, fmin, fmax, f, nfav;

  cout << "6|";
  cout <<  "Acceptance Ratios|";
  for(i = 0; i < 5; i++) cout << nac[i]/ntr[i] << " " ; cout << " Parameters|";
  if(mod == SIR){ for(i = 0; i < 4; i++) cout << nac_rec[i]/ntr_rec[i] << " " ; cout << " Rec Param|";}

  if(envon == 1){
    cout << nac_e_g/ntr_e_g << " e_g   ";
    cout << nac_e_f/ntr_e_f << " e_f    ";
    if(mod == SIR) cout << nac_e_r/ntr_e_r << " e_r";
    cout << "|";

    for(ty = 0; ty < 9; ty++)  cout << nac_PBP[ty]/ntr_PBP[ty] << " fa:" <<  nfa_PBP[ty]/ntr_PBP[ty] << " " <<jumpPBP[ty] << " PBP   "<< ty << "|";

    cout << nac_vare_gg/ntr_vare_gg << " vare_gg   ";
    cout << nac_vare_gf/ntr_vare_gf << " vare_gf   ";
    if(mod == SIR) cout << nac_vare_gr/ntr_vare_gr << " vare_gr   ";
    cout << nac_vare_ff/ntr_vare_ff << " vare_ff   ";
    if(mod == SIR) cout << nac_vare_fr/ntr_vare_fr << " vare_fr   ";
    if(mod == SIR) cout << nac_vare_rr/ntr_vare_rr << " vare_rr   ";
    cout << "|";
  }

  if(randon == 1){
    cout << nac_q_g/ntr_q_g << " q_g   ";
    cout << nac_q_f/ntr_q_f << " q_f    ";
    if(mod == SIR) cout << nac_q_r/ntr_q_r << " q_r    ";
    cout << "|";
    cout << nac_vara_gg/ntr_vara_gg << " vara_gg   ";
    cout << nac_vara_gf/ntr_vara_gf << " vara_gf   ";
    if(mod == SIR)cout << nac_vara_gr/ntr_vara_gr << " vara_gr   ";
    cout << nac_vara_ff/ntr_vara_ff << " vara_ff   ";
    if(mod == SIR) cout << nac_vara_fr/ntr_vara_fr << " vara_fr   ";
    if(mod == SIR) cout << nac_vara_rr/ntr_vara_rr << " vara_rr";
    cout << "|";
  }

  if(geffon == 1){
    cout << nac_geff_g/ntr_geff_g << " geff_g   ";
    cout << nac_siggeff_g/ntr_siggeff_g << " siggeff_g  |";
  }

  for(fi = 0; fi < nfi; fi++){
    cout << fi << " " << nac_fi_g[fi]/ntr_fi_g[fi] << " fi_g   ";
    cout << fi << " " << nac_fi_f[fi]/ntr_fi_f[fi] << " fi_f   ";
    if(mod == SIR) cout << fi << " " << nac_fi_r[fi]/ntr_fi_r[fi] << " fi_r";
    cout << "|";
  }

  long j;

  fmin = 1; fmax = 0; fav = 0; nfav = 0;
  for(j = 0; j < N; j++){ if(ntr_I[j] > 0){ f = nac_I[j]/ntr_I[j]; if (f > fmax) fmax = f; if(f < fmin) fmin = f; fav += f; nfav++;}}
  cout << "shiftI ac:" << fav/nfav << ", " << fmin << "-" << fmax << "|";

  if(mod == SIR){
    fmin = 1; fmax = 0; fav = 0; nfav = 0;
    for(j = 0; j < N; j++){ if(ntr_R[j] > 0){ f = nac_R[j]/ntr_R[j]; if (f > fmax) fmax = f; if(f < fmin) fmin = f; fav += f; nfav++;}}
    cout << "shiftR ac:" << fav/nfav << ", " << fmin << "-" << fmax << "|";
  }

  fmin = 1; fmax = 0; fav = 0; nfav = 0;
  for(j = 0; j < N; j++){ if(Iposst[j] == unknownI && ntr_addinf[j] > 0){ f = nac_addinf[j]/ntr_addinf[j]; if (f > fmax) fmax = f; if(f < fmin) fmin = f; fav += f; nfav++;}}
  cout << "addinf ac:" << fav/nfav << ", " << fmin << "-" << fmax << "|";

  fmin = 1; fmax = 0; fav = 0; nfav = 0;
  for(j = 0; j < N; j++){ if(Iposst[j] == unknownI && ntr_reminf[j] > 0){ f = nac_reminf[j]/ntr_reminf[j]; if (f > fmax) fmax = f; if(f < fmin) fmin = f; fav += f; nfav++;}}
  cout << "reminf ac:" << fav/nfav << ", " << fmin << "-" << fmax << "|";

  cout << "Times:|";
  cout << long(100*time_param/timeto) << " "  << long(100*time_paraminit/timeto) << " time param|";
  cout << long(100*time_rec/timeto) << " "  << long(100*time_recinit/timeto) << " time rec|";

  if(envon == 1){
    cout << long(100*time_e_g/timeto) << " " << long(100*time_e_ginit/timeto) << " time e_g|";
    cout << long(100*time_e_f/timeto) << " " << long(100*time_e_finit/timeto) << " time e_f|";
    if(mod == SIR) cout << long(100*time_e_r/timeto) << " " << long(100*time_e_rinit/timeto) << " time e_r|";

    cout << long(100*time_eq/timeto) << " time eq|";
    cout << long(100*time_PBPe_g/timeto) << " time PBPe_g  ";
    cout << long(100*time_PBPe_f/timeto) << " time PBPe_f   ";
    if(mod == SIR) cout << long(100*time_PBPe_r/timeto) << " time PBPe_r";
    cout << "|";
  }

  if(randon == 1){
    cout << long(100*time_q_g/timeto) << " " << long(100*time_q_ginit/timeto) << " time q_g|";
    cout << long(100*time_q_f/timeto) << " " << long(100*time_q_finit/timeto) << " time q_f|";
    if(mod == SIR) cout << long(100*time_q_r/timeto) << " " << long(100*time_q_rinit/timeto) << " time q_r|";
    cout <<  long(100*time_vara/timeto) << " time vara|";
  }

  if(geffon == 1){
    cout << long(100* time_geff_g /timeto) << " time greff_g|";
  }

  cout << long(100*time_fi/timeto) << " time fi|";
  cout << long(100*time_events/timeto) << " time events|";
  cout << long(100*time_addreminf/timeto) << " time addreminf|";
  cout << long(100*time_init2/timeto) << " time init2|";

  cout << long(100*time_check/timeto) << " time check|";
  cout << timeto/(60.0*CLOCKS_PER_SEC) << "Total time|";

  cout << "\n";
  cout.flush();
}
