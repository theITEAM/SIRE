// Loading the input file

string get(XMLNode* node, string attr)                                   // Gets an attribute from an XML node
{
  if(node->ToElement()->Attribute(attr.c_str())) return node->ToElement()->Attribute(attr.c_str());
  return "";
}

bool exi(XMLNode* node, string attr)                                    // Checks if an attibute exists on an XML node
{
  if(node->ToElement()->Attribute(attr.c_str())) return true;
  return false;
}

double getnum(XMLNode* node, string attr)                                // Gets a number attribute from an XML node
{
  string a =  node->ToElement()->Attribute(attr.c_str());

  return atof(a.c_str());
}

vector<string> getcommasep(string a)                                     // Comma seperates a string
{
  long j, jst;
  vector<string> commasep;

  j = 0;
  while(j < a.length()){
    jst = j;
    while(j < a.length() && a.substr(j,1) != ",") j++;
    commasep.push_back(a.substr(jst,j-jst));
    j++;
  }

  return commasep;
}

void readfile(string file)                                                     // Reads the input file
{
  long i, ist, fl;
  long z, gen, fi, j, jj, zcol, SNPcol, Itcol, Rtcol, enttcol, leatcol, statecol, pr, pr2, copy, flag, Ipos, noRinrange, noIinrange, diat;
  double Iti, Rti, val, Itmi, Itma, Rtmi, Rtma, tt, tmi, tma, mean, var, su, sdav, obsdt, t, reg;

  vector <long> Xcols;
  vector <long> diagtestcols;
  vector<string> commasep;
  vector <double> Xt;
  vector <vector <double> > tlist;
  vector <vector <long> > reslist;
  string s1, s2, s3, li, li2, li3;

  ifstream inp(file.c_str());

  XMLNode* child;
  XMLNode* child2;
  XMLNode* child3;
  XMLDocument doc;

  stringstream strStream;
  strStream << inp.rdbuf();
  string str = strStream.str();
  if(str.size() == 0) emsg("No input file");

  i = 0;    // Removes comments
  do{
    while(i < str.size()-4 && str.substr(i,4) != "<!--") i++;
    if(i == str.size()-4) break;

    ist = i;
    i += 4;
    while(i < str.size()-3 && str.substr(i,3) != "-->") i++;
    if(i == str.size()-3) emsg("Problem reading file");

    str = str.substr(0,ist) + str.substr(i+3,str.size()-(i+3));

    i = ist;
  }while(1 == 1);

  char *xml=new char[str.size()+1];
  xml[str.size()]=0;
  memcpy(xml,str.c_str(),str.size());
  doc.Parse(xml);

  XMLElement* root = doc.FirstChildElement();

  nfi = 0; randon = 0;
  zcol = -1; SNPcol = -1; Itcol = -1; Rtcol = -1; enttcol = -1; leatcol = -1; statecol = -1;

  Xcols.clear();
  indtrial.clear(); geno.clear(); X.clear(); It.clear(); Rt.clear();// entt.clear(); leat.clear();
  Itmin.clear(); Itmax.clear(); Iposst.clear(); noIinrangest.clear();
  Rtmin.clear(); Rtmax.clear(); noRinrangest.clear();

  Z = 0; envon = 0; geffon = 0;
  for(child = root->FirstChild(); child; child = child->NextSibling()){                                     // works out all the compartments
    s1 = child->Value();

    if(s1.compare("mcmc") == 0){
      if(exi(child,"nsample")){ nsamp = long(getnum(child,"nsample")); if(nsamp < 0 || isnan(nsamp)) emsg("Problem with sample number");}
      if(exi(child,"burnin")){ burnin = long(getnum(child,"burnin")); if(burnin < 0 || isnan(burnin)) emsg("Problem with burnin number");}
    }

    if(s1.compare("model") == 0){
      s2 = get(child,"type");
      if(s2 == "SIR") mod = SIR;
      else{
        if(s2 == "SI") mod = SI;
        else emsg("Model type wrong");
      }

      s2 = get(child,"residual");
      if(s2 == "on") envon = 1;
      else{
        if(s2 == "off") envon = 0;
        else emsg("Residual wrong");
      }

      s2 = get(child,"groupeff");
      if(s2 == "on") geffon = 1;
      else{
        if(s2 == "off") geffon = 0;
        else emsg("Group effect wrong");
      }

      s2 = get(child,"dominance");
      if(s2 == "on") domon = 1;
      else{
        if(s2 == "off") domon = 0;
        else emsg("Dominance wrong");
      }
    }

    if(s1.compare("data") == 0){  // model
      if(exi(child,"N")){ N = long(getnum(child,"N")); if(N < 0 || isnan(N)) emsg("Problem with number of individuals");}
      if(exi(child,"Z")){ 
        Z = long(getnum(child,"Z")); if(Z < 0 || isnan(Z)) emsg("Problem with contact group number"); 
        trialtmin.resize(Z); trialtmax.resize(Z);
        obstmin.resize(Z); obstmax.resize(Z);
      }
    }
  }

  ndiagtest = 0;
  for(child = root->FirstChild(); child; child = child->NextSibling()){                                     // works out all the compartments
    s1 = child->Value();
    if(s1.compare("diagtest") == 0){
      val = getnum(child,"Se"); if(isnan(val)) emsg("Problem with sensitivity");
      diagtest_logSe.push_back(log(val)); diagtest_logomSe.push_back(log(1-val));

      val = getnum(child,"Sp"); if(isnan(val)) emsg("Problem with specificity");
      diagtest_logSp.push_back(log(val)); diagtest_logomSp.push_back(log(1-val));

      s2 = get(child,"sens");
      if(s2 == "I") diagtest_sens.push_back(1);
      else diagtest_sens.push_back(2);
      ndiagtest++;
    }
  }

  for(child = root->FirstChild(); child; child = child->NextSibling()){
    s1 = child->Value();
    if(s1.compare("inference") == 0){  // observation period
      if(Z == 0) emsg("Must set contact group number before observation time");

      if(exi(child,"tmin")){ tmi = getnum(child,"tmin"); if(isnan(tmi)) emsg("Problem with inference time");}else emsg("Problem with inference time");
      if(exi(child,"tmax")){ tma = getnum(child,"tmax"); if(isnan(tma)) emsg("Problem with inference time");}else emsg("Problem with inference time");
      if(exi(child,"group")){
        z = long(getnum(child,"group"))-1; if(z < 0 || z >= Z) emsg("Group number out of range");
        trialtmin[z] = tmi; trialtmax[z] = tma;
       }
      else{
        for(z = 0; z < Z; z++){ trialtmin[z] = tmi; trialtmax[z] = tma;}
      }
    }

    if(s1.compare("observation") == 0){  // observation period
      if(Z == 0) emsg("Must set contact group number before observation time");

      if(exi(child,"tmin")){ tmi = getnum(child,"tmin"); if(isnan(tmi)) emsg("Problem with observation time");}else emsg("Problem with observation time");
      if(exi(child,"tmax")){ tma = getnum(child,"tmax"); if(isnan(tma)) emsg("Problem with observation time");}else emsg("Problem with observation time");
      if(exi(child,"group")){
        z = long(getnum(child,"group"))-1; if(z < 0 || z >= Z) emsg("Group number out of range");
        obstmin[z] = tmi; obstmax[z] = tma;
      }
      else{
        for(z = 0; z < Z; z++){ obstmin[z] = tmi; obstmax[z] = tma;}
      }
    }
  }

  if(ndiagtest > 0){ ninddtest.resize(ndiagtest); inddtest.resize(ndiagtest); inddtestt.resize(ndiagtest); tlist.resize(ndiagtest); reslist.resize(ndiagtest);}

  for(child = root->FirstChild(); child; child = child->NextSibling()){
    s1 = child->Value();
    if(s1.compare("datatable") == 0){  // model
      if(exi(child,"trial") == true){
        zcol = long(getnum(child,"trial"))-1; if(zcol < 0) emsg("Problem with contact group column number");
      }
      else{
        if(Z > 1) emsg("Data must include the contact group number");
      }

      if(exi(child,"SNP") == true){
        snpfl = 1;
        SNPcol = long(getnum(child,"SNP"))-1;
      }

      if(exi(child,"It") == true){
        Itcol = long(getnum(child,"It"))-1;
      }

      if(exi(child,"Rt") == true){
        Rtcol = long(getnum(child,"Rt"))-1;
      }

      if(exi(child,"entt") == true){
        enttcol = long(getnum(child,"entt"))-1;
      }

      if(exi(child,"leat") == true){
        leatcol = long(getnum(child,"leat"))-1;
      }

      if(exi(child,"state") == true){
        statecol = long(getnum(child,"state"))-1;
      }

      if(exi(child,"X") == true){
        commasep = getcommasep(get(child,"X"));
        for(i = 0; i < commasep.size(); i++){
          Xcols.push_back(atoi(commasep[i].c_str())-1);
        }
        nfi = Xcols.size();
        Xt.resize(nfi);
      }

      if(exi(child,"diagtest") == true){
        diagtestfl = 1;
        commasep = getcommasep(get(child,"diagtest")); if(commasep.size() != ndiagtest) emsg("Diagnostic test problem");
        for(i = 0; i < commasep.size(); i++){
          diagtestcols.push_back(atoi(commasep[i].c_str())-1);
        }
      }

      for(child2 = child->FirstChild(); child2; child2 = child2->NextSibling()){
        s2 = child2->Value();
        stringstream ss (s2);

        while(getline(ss, li)){
          stringstream ss2(li);
          vector <string> sti;
          while(getline(ss2, li2, '\t')) {
            sti.push_back(li2);
          }
          if(sti.size() >= 3){

            if(zcol >= 0) z = atoi(sti[zcol].c_str())-1; else z = 0;
            gen = -1;
            if(SNPcol >= 0){
              if(sti[SNPcol] == "AA" || sti[SNPcol] == "aa" || sti[SNPcol] == "0") gen = 0;
              else{
                if(sti[SNPcol] == "AB" || sti[SNPcol] == "ab" || sti[SNPcol] == "1") gen = 1;
                else{
                  if(sti[SNPcol] == "BB" || sti[SNPcol] == "bb" || sti[SNPcol] == "2") gen = 2;
                  else emsg("SNP encoding wrong");
                }
              }
            }
            else gen = -1;

            Itmi = trialtmin[z]; Itma = trialtmax[z]; Ipos = unknownI; noIinrange = 0;
            Rtmi = trialtmin[z]; Rtma = big; noRinrange = 0; noRinrange = 0;

            if(statecol >= 0){
              stringstream ss3(sti[statecol] );
              vector <string> sti2;
              while(getline(ss3, li3, ']')) {
                i = 0; while(i < li3.length() && li3.substr(i,1) != "[") i++;
                if(i == li3.length()) emsg("Error reading data");
                li3 = li3.substr(i+1);

                i = 0; while(i < li3.length() && li3.substr(i,1) != ",") i++;
                tt = atof(li3.substr(i+1).c_str());

                if(li3.substr(0,i) == "S"){
                  if(Itmi < tt) Itmi = tt;
                  if(Rtmi < tt) Rtmi = tt;
                }
                if(li3.substr(0,i) == "I"){
                  if(Itma > tt) Itma = tt;
                  if(Rtmi < tt) Rtmi = tt;
                  Ipos = defI;
                }
                if(li3.substr(0,i) == "R"){
                  if(Itma > tt) Itma = tt;
                  if(Rtma > tt) Rtma = tt;
                  Ipos = defI;
                }
              }
            }

            for(diat = 0; diat < ndiagtest; diat++){
              tlist[diat].clear(); reslist[diat].clear();

              stringstream ss3(sti[diagtestcols[diat]] );
              vector <string> sti2;
              while(getline(ss3, li3, ']')) {
                i = 0; while(i < li3.length() && li3.substr(i,1) != "[") i++;
                if(i == li3.length()) emsg("Error reading data");
                li3 = li3.substr(i+1);

                i = 0; while(i < li3.length() && li3.substr(i,1) != ",") i++;
                tlist[diat].push_back(atof(li3.substr(i+1).c_str()));
                reslist[diat].push_back(atoi(li3.substr(0,i).c_str()));
              }
            }

            if(Itcol >= 0){
              if(sti[Itcol] != "."){
                if(sti[Itcol] == "no"){
                  if(obstmin[z] == trialtmin[z] && obstmax[z] == trialtmax[z]){ Itmi = -big; Itma = -big; Ipos = defnotI;}
                  else{
                    if(obstmin[z] == trialtmin[z]){ 
                      if(obstmax[z] > Itmi) Itmi = obstmax[z];
                    }
                    else{
                      if(obstmax[z] == trialtmax[z]){
                        if(obstmin[z] < Itma) Itma = obstmin[z];
                      }
                      else noIinrange = 1;
                    }
                  }
                }
                else{
                  Iti = atof(sti[Itcol].c_str()); if(isnan(Iti)) emsg("Infection time not recognised");
                  if(Iti < trialtmin[z] || Iti > trialtmax[z]) emsg("Infection time outside inference period");
                  if(Iti == trialtmax[z]) Iti -= 0.0000001;
                  if(Iti != trialtmin[z]) Iti += 0.00000001*ran();

                  Itmi = Iti; Itma = Iti;
                  Ipos = defI;
                  if(Iti > Rtmi) Rtmi = Iti; 
                }
              }
            }

            if(Rtcol >= 0){ 
              if(sti[Rtcol] != "."){
                if(sti[Rtcol] == "no"){
                  noRinrange = 1;
                  if(Ipos == defI){ if(obstmax[z] > Rtmi) Rtmi = obstmax[z];}
                  else noRinrange = 1;
                }
                else{
                  Rti = atof(sti[Rtcol].c_str()); if(isnan(Rti)) emsg("Recovery time not recognised");
                  if(Rti < trialtmin[z] || Rti > trialtmax[z]) emsg("Recovery time outside observation period");
                  Rti += 0.00001*ran();
                  Rtmi = Rti; Rtma = Rti;
                  if(Rtma < Itma) Itma = Rtma;
                  Ipos = defI;
                }
              }
            }

            for(fi = 0; fi < nfi; fi++) Xt[fi] = atof(sti[Xcols[fi]].c_str());

            indid.push_back(sti[0]);
            indtrial.push_back(z);
            geno.push_back(gen);
            X.push_back(Xt);

            for(diat = 0; diat < ndiagtest; diat++){
              ninddtest[diat].push_back(reslist[diat].size());
              inddtest[diat].push_back(reslist[diat]);
              inddtestt[diat].push_back(tlist[diat]);
            }

            if(Itmi == trialtmax[z]){ Itmi = -big; Itma = -big; Rtmi = -big; Rtma = -big; Ipos = defnotI;}  // no infection

            if(Itmi > Itma) emsg("Cannot get a consistent state");
            if(Rtmi > Rtma) emsg("Cannot get a consistent state");

            Itmin.push_back(Itmi); Itmax.push_back(Itma); Iposst.push_back(Ipos); noIinrangest.push_back(noIinrange);
            Rtmin.push_back(Rtmi); Rtmax.push_back(Rtma); noRinrangest.push_back(noRinrange);
          }
        }
      }
    }
  }
  if(indtrial.size() != N) emsg("The number of individuals in the data do not match the model");

  initevents();

  if(nfi > 0){
    Xmagmax.resize(nfi);
    for(fi = 0; fi < nfi; fi++){
      su = 0; for(j = 0; j < N; j++) su += X[j][fi];
      su /= N;
      for(j = 0; j < N; j++) X[j][fi] -= su;

      Xmagmax[fi] = 0.000000001;
      for(j = 0; j < N; j++){
        if(X[j][fi] > Xmagmax[fi]) Xmagmax[fi] = X[j][fi];
        if(-X[j][fi] > Xmagmax[fi]) Xmagmax[fi] = -X[j][fi];
      }
    }
  }

  Ainvdiag.resize(N); for(j = 0; j < N; j++) Ainvdiag[j] = 1;
  nAinvlist.resize(N); Ainvlist.resize(N); Ainvlistval.resize(N); nAinvlist2.resize(N); Ainvlist2.resize(N); Ainvlistval2.resize(N);
  for(j = 0; j < N; j++){ nAinvlist[j] = 0; nAinvlist2[j] = 0;}

  for(child = root->FirstChild(); child; child = child->NextSibling()){
    s1 = child->Value();
    if(s1.compare("A") == 0){  // relationship matrix
      randon = 1;
      A.resize(N); Ainv.resize(N);
      for(child2 = child->FirstChild(); child2; child2 = child2->NextSibling()){
        s2 = child2->Value();
        stringstream ss (s2);

        A.resize(N); Ainv.resize(N);
        for(j = 0; j < N; j++){
          A[j].resize(N); Ainv[j].resize(N);
          for(jj = 0; jj < N; jj++){
            ss >> A[j][jj];
          }
        }
        cout << "z|Inverting relationship matrix...\n";
        invertmatrix();

        for(j = 0; j < N; j++){ 
          for(jj = 0; jj < N; jj++){
            if(jj == j) Ainvdiag[j] = Ainv[j][j];
            if(jj != j && Ainv[j][jj] != 0){ Ainvlist[j].push_back(jj); Ainvlistval[j].push_back(Ainv[j][jj]); nAinvlist[j]++;}
            if(jj != j && Ainv[j][jj] != 0 && jj < j){ Ainvlist2[j].push_back(jj); Ainvlistval2[j].push_back(Ainv[j][jj]); nAinvlist2[j]++;}
          }
        }
      }
    }

    if(s1.compare("AINV") == 0){  // inverse relationship matrix
      randon = 1;
      Ainv.resize(N);
      for(child2 = child->FirstChild(); child2; child2 = child2->NextSibling()){
        s2 = child2->Value();
        stringstream ss (s2);

        Ainv.resize(N);
        for(j = 0; j < N; j++){
          Ainv[j].resize(N);
          for(jj = 0; jj < N; jj++) ss >> Ainv[j][jj];
        }
        for(j = 0; j < N; j++){
          for(jj = j+1; jj < N; jj++) if(Ainv[j][jj] != Ainv[jj][j]) emsg("Not symmetrical");
        }

        for(j = 0; j < N; j++){ 
          for(jj = 0; jj < N; jj++){
            if(jj == j) Ainvdiag[j] = Ainv[j][j];
            if(jj != j && Ainv[j][jj] != 0){ Ainvlist[j].push_back(jj); Ainvlistval[j].push_back(Ainv[j][jj]); nAinvlist[j]++;}
            if(jj != j && Ainv[j][jj] != 0 && jj < j){ Ainvlist2[j].push_back(jj); Ainvlistval2[j].push_back(Ainv[j][jj]); nAinvlist2[j]++;}
          }
        }
      }
    }

    if(s1.compare("AINVLIST") == 0){  // inverse relationship matrix
      randon = 1;
      for(child2 = child->FirstChild(); child2; child2 = child2->NextSibling()){
        s2 = child2->Value();
        stringstream ss (s2);

        while(getline(ss, li)){
          if(li.length() > 3){
            stringstream ss2(li);
            ss2 >> j >> jj >> val;
            if(j != jj){
              Ainvlist[j].push_back(jj); Ainvlistval[j].push_back(val); nAinvlist[j]++; Ainvlist[jj].push_back(j); Ainvlistval[jj].push_back(val); nAinvlist[jj]++;
              Ainvlist2[j].push_back(jj); Ainvlistval2[j].push_back(val); nAinvlist2[j]++;
            }
            else Ainvdiag[j] = val;
          }
        }
      }
    }
  }

  priorinit();

  finame.resize(3); finame[0].resize(nfi); finame[1].resize(nfi); finame[2].resize(nfi);
  for(child = root->FirstChild(); child; child = child->NextSibling()){
    s1 = child->Value();
    if(s1.compare("prior") == 0){    // priors
      if(exi(child,"parameter")){
        pr = -1;
        if(get(child,"parameter") == "β") pr = prior_beta;
        if(get(child,"parameter") == "γ") pr = prior_gama;
        if(get(child,"parameter") == "R_0") pr = prior_R0;
        if(get(child,"parameter") == "k") pr = prior_k;

        if(get(child,"parameter") == "a_g") pr = prior_a_g;
        if(get(child,"parameter") == "a_f") pr = prior_a_f;
        if(get(child,"parameter") == "a_r") pr = prior_a_r;
        if(get(child,"parameter") == "Δ_g") pr = prior_delta_g;
        if(get(child,"parameter") == "Δ_f") pr = prior_delta_f;
        if(get(child,"parameter") == "Δ_r") pr = prior_delta_r;

        if(get(child,"parameter") == "G") pr = prior_G;
        if(get(child,"parameter") == "σ_G") pr = prior_siggeff_g ;

        if(get(child,"parameter") == "ε_g") pr = prior_e_g;
        if(get(child,"parameter") == "ε_f") pr = prior_e_f;
        if(get(child,"parameter") == "ε_r") pr = prior_e_r;
        if(get(child,"parameter") == "Σ_gg") pr = prior_vare_gg;
        if(get(child,"parameter") == "Σ_ff") pr = prior_vare_ff;
        if(get(child,"parameter") == "Σ_rr") pr = prior_vare_rr;
        if(get(child,"parameter") == "Σ_gf") pr = prior_vare_gf;
        if(get(child,"parameter") == "Σ_gr") pr = prior_vare_gr;
        if(get(child,"parameter") == "Σ_fr") pr = prior_vare_fr;

        if(get(child,"parameter") == "q_g") pr = prior_q_g;
        if(get(child,"parameter") == "q_f") pr = prior_q_f;
        if(get(child,"parameter") == "q_r") pr = prior_q_r;
        if(get(child,"parameter") == "Ω_gg") pr = prior_vara_gg;
        if(get(child,"parameter") == "Ω_ff") pr = prior_vara_ff;
        if(get(child,"parameter") == "Ω_rr") pr = prior_vara_rr;
        if(get(child,"parameter") == "Ω_gf") pr = prior_vara_gf;
        if(get(child,"parameter") == "Ω_gr") pr = prior_vara_gr;
        if(get(child,"parameter") == "Ω_fr") pr = prior_vara_fr;

        if(get(child,"parameter") == "b_g"){
          fi = long(getnum(child,"number"))-1;
          if(fi < 0 || fi >= nfi) emsg("Fixed number out of range");
          finame[0][fi] = get(child,"name");
          pr = prior_fixed_g[fi];
        }
        if(get(child,"parameter") == "b_f"){
          fi = long(getnum(child,"number"))-1;
          if(fi < 0 || fi >= nfi) emsg("Fixed number out of range");
          finame[1][fi] = get(child,"name");
          pr = prior_fixed_f[fi];
        }
        if(get(child,"parameter") == "b_r"){
          fi = long(getnum(child,"number"))-1;
          if(fi < 0 || fi >= nfi) emsg("Fixed number out of range");
          finame[2][fi] = get(child,"name");
          pr = prior_fixed_r[fi];
        }

        if(pr == -1) emsg("Prior must have parameter");

        if(exi(child,"type")){
          fl = 0;
          if(get(child,"type") == "Flat"){
            priorty[pr] = UNIFORM;
            if(exi(child,"val1")){
              if(get(child,"val1") == "∞") priorval1[pr] = big;
              else{
                if(get(child,"val1") == "-∞") priorval1[pr] = -big;
                else priorval1[pr] = getnum(child,"val1");
              }
            }
            else emsg("Uniform prior must have a min value");

            if(exi(child,"val2")){
              if(get(child,"val2") == "∞") priorval2[pr] = big;
              else{
                if(get(child,"val2") == "-∞") priorval2[pr] = -big;
                else priorval2[pr] = getnum(child,"val2");
              }
            }
            else emsg("Uniform prior must have a max value");
            fl = 1;
          }

          if(get(child,"type") == "Fix"){
            priorty[pr] = FIX;
            if(exi(child,"val1")){ priorval1[pr] = getnum(child,"val1");}
            else emsg("Fixed value not set");
            fl = 1;
          }

          if(get(child,"type") == "Gamma"){
            priorty[pr] = GAMMA;
            mean = getnum(child,"val1");
            var = getnum(child,"val2");

            priorval1[pr] = mean*mean/var;
            priorval2[pr] = priorval1[pr]/mean;
            fl = 1;
          }

          if(get(child,"type") == "Normal"){
            priorty[pr] = NORMAL;
            priorval1[pr] = getnum(child,"val1");
            priorval2[pr] = getnum(child,"val2");
            fl = 1;
          }

          if(get(child,"type") == "Log-Normal"){
            priorty[pr] = LOGNORMAL;
            priorval1[pr] = getnum(child,"val1");
            priorval2[pr] = getnum(child,"val2");
            fl = 1;
          }

          if(fl == 0) emsg("Prior not recognised");

          copy = 1;
          if(geffon == 1 && pr == prior_G) copy = Z;
          if(envon == 1 && (pr == prior_e_g || pr == prior_e_f || pr == prior_e_r)) copy = N;
          if(randon == 1 && (pr == prior_q_g || pr == prior_q_f || pr == prior_q_r)) copy = N;
          for(pr2 = pr+1; pr2 < pr+copy; pr2++){
            priorty[pr2] = priorty[pr]; priorval1[pr2] = priorval1[pr]; priorval2[pr2] = priorval2[pr];
          }
        }
        else emsg("Prior must have a type");
      }
    }
  }
}

void invertmatrix()                                           // Inverts the relationship matrix
{
  long i, j, ii, jj;
  double r, sum;
  vector< vector <double> > A2;

  A2.resize(N);
  for(i = 0; i < N; i++){
    A2[i].resize(N);
    for(j = 0; j < N; j++){
      A2[i][j] = A[i][j];
      if(i == j) Ainv[i][j] = 1; else Ainv[i][j] = 0;
    }
  }

  for(ii = 0; ii < N; ii++){
    r = A2[ii][ii];
    for(i = 0; i < N; i++){
      A2[ii][i] /= r; Ainv[ii][i] /= r;
    }

    for(jj = ii+1; jj < N; jj++){
      r = A2[jj][ii];
      if(r != 0){
        for(i = 0; i < N; i++){ 
          A2[jj][i] -= r*A2[ii][i];
          Ainv[jj][i] -= r*Ainv[ii][i];
        }
      }
    }
  }

  for(ii = N-1; ii > 0; ii--){
    for(jj = ii-1; jj >= 0; jj--){
      r = A2[jj][ii];
      if(r != 0){
        for(i = 0; i < N; i++){ 
          A2[jj][i] -= r*A2[ii][i];
          Ainv[jj][i] -= r*Ainv[ii][i];
        }
      }
    }
  }

  // for(j = 0; j < N; j++){ for(i = 0; i < N; i++){ sum = 0; for(ii = 0; ii < N; ii++) sum += A[j][ii]*Ainv[ii][i]; cout << sum << "";} cout << " kk\n";} // check
}


void initevents()                                         // Generates the initial set of infection and recovery times
{
  long z, j, fl, S, I, R, e, ee, loop, loop2, loopmax = 10, diat, k, npos, nn, i;
  double nav, av, av2, Rtsd, Itsd, nRtsd, nItsd, sd, Rti, Iti, tmi, tma, tmi2, tma2, val, Sp, sum, mi, ma, tprob, pval;
  vector <EVV> evl;
  vector <double> Itav;
  vector <short> epioccur;

  It.resize(N); Rt.resize(N);

  Rtsd = 0; nRtsd = 0;
  Itsd = 0; nItsd = 0;
  Itav.resize(Z);
  for(z = 0; z < Z; z++){
    nav = 0; av = 0; av2 = 0;
    for(j = 0; j < N; j++){
      if(indtrial[j] == z){
        if(Rtmax[j] <= trialtmax[z] && Rtmin[j] >= trialtmin[z]){
          Rti = (Rtmin[j] + Rtmax[j])/2;
          av += Rti; av2 += Rti*Rti; nav++;
        }
      }
    }
    if(nav > 1){
      av /= nav; av2 /= nav;
      Rtsd += sqrt(av2 - av*av); nRtsd++;
    }

    nav = 0; av = 0; av2 = 0;
    for(j = 0; j < N; j++){
      if(indtrial[j] == z){
        if(Itmax[j] <= trialtmax[z] && Itmax[j] >= trialtmin[z] && Itmin[j] <= trialtmax[z] && Itmin[j] > trialtmin[z]){
          Iti = (Itmin[j] + Itmax[j])/2;
          av += Iti; av2 += Iti*Iti; nav++; 
        }
        else{
          if(diagtestfl == 1){
            for(diat = 0; diat < ndiagtest; diat++){
              k = 0; while(k < ninddtest[diat][j] && inddtest[diat][j][k] != 1) k++;
              if(k < ninddtest[diat][j]){
                Iti = inddtestt[diat][j][k];
                av += Iti; av2 += Iti*Iti; nav++;
                break;
              }
            }
          }
        }
      }
    }

    if(nav >= 1){
      av /= nav; av2 /= nav;
      Itav[z] = av;
      if(nav > 1){ Itsd += sqrt(av2 - av*av); nItsd++;}
    }
    else{
      Itav[z] = (trialtmin[z]+trialtmax[z])/2;
    }
  }
  if(nRtsd == 0) Rtsd = big; else Rtsd /= nRtsd;
  if(nItsd == 0) Itsd = big; else Itsd /= nItsd;

  if(nRtsd > nItsd) sd = Rtsd; else sd = Itsd;

  epioccur.resize(Z);
  if(diagtestfl == 1){  // In the case of diagnostics tests assesses if epidemic has occured or not based on a pvalue
    for(z = 0; z < Z; z++){
      pval = 1;
      for(diat = 0; diat < ndiagtest; diat++){
        Sp = exp(diagtest_logSp[diat]);
        npos = 0; nn = 0;
        for(j = 0; j < N; j++){
          if(indtrial[j] == z){
            for(k = 0; k < ninddtest[diat][j]; k++){ if(inddtest[diat][j][k] == 1) npos++; nn++;}
          }
        }
        sum = 0;  for(k = npos; k <= nn; k++) sum += binomialprob(1-Sp,nn,k);
        pval *= sum;
      }
      if(pval < 0.05) epioccur[z] = 1; else epioccur[z] = 0;
    }
  }

  for(j = 0; j < N; j++){                                                              // infection times
    z = indtrial[j];
    if(Iposst[j] == defI){
      if(Itmin[j] == Itmax[j]) It[j] = Itmin[j];
      else{
        if(sd == big) emsg("Initialisation problem");
        loop = 0; do{ It[j] = Itmax[j] + log(ran())*sd; loop++;}while(loop < 1000 && (It[j] < Itmin[j] || It[j] > Rtmax[j]));
        if(loop == 1000){ stringstream ss; ss << "Cannot find initial condition for individual " << indid[j]; emsg(ss.str());}
      }
    }
    else{
      It[j] = -big;
      if(diagtestfl == 1 && epioccur[z] == 1){  // Using diagnostic test estimates when individual first became infected
        for(diat = 0; diat < ndiagtest; diat++){
          for(k = 0; k < ninddtest[diat][j]; k++){
            if(inddtest[diat][j][k] == 1 && inddtestt[diat][j][k] > Rtmin[j]){
              if(k > 0){
                mi = inddtestt[diat][j][k-1]; if(mi < Rtmin[j]) mi = Rtmin[j];
                ma = inddtestt[diat][j][k]; if(ma > Rtmax[j]) ma = Rtmax[j];
                if(mi < ma){ It[j] = mi + ran()*(ma-mi); break;}
              }
              else{
                ma = inddtestt[diat][j][k]; if(ma > Rtmax[j]) ma = Rtmax[j];
                It[j] = ma-tiny;
                break;
              }
            }
          }
        }
      }
      if(It[j] == -big && mod == SI && Itmin[j] < Itmax[j]){
        It[j] = Itmin[j] + ran()*(Itmax[j]-Itmin[j]);
      }
    }
  }

  for(j = 0; j < N; j++){                                                              // recovery times
    z = indtrial[j];
    if(It[j] == -big) Rt[j] = -big;
    else{
      if(mod == SI) Rt[j] = big;
      else{
        if(Rtmin[j] == Rtmax[j]) Rt[j] = Rtmin[j];
        else{
          mi = Rtmin[j]; if(It[j] > mi) mi = It[j]; if(mi > Rtmax[j]) emsg("Cannot get recovery time");
          if(Rtmax[j] < trialtmax[z]){
            Rt[j] = mi +ran()*(Rtmax[j] - mi);;
          }
          else{
            if(sd == big) emsg("Initialisation problem");
            loop = 0; do{ Rt[j] = mi - log(ran())*sd; loop++;}while(loop < 1000 && Rt[j] > Rtmax[j]);
            if(loop == 1000) emsg("Cannot get recovery time");
          }
        }
      }
      if(Rt[j] < It[j]) emsg("Wrong order");
    }
  }

  // Makes sure last infections occur when other individuals are infected (apart from at the beginning of the epidemic

  for(z = 0; z < Z; z++){
    loop = 0;
    do{
      fl = 0;

      S = 0; I = 0; R = 0;

      evl.clear();
      for(j = 0; j < N; j++){
        if(indtrial[j] == z){
          S++;
          if(It[j] != -big){
            EVV evnew; evnew.ty = INF; evnew.t = It[j]; evnew.i = j; evl.push_back(evnew);
            if(Rt[j] == -big){ emsg("Recovery time not set");}
            if(mod == SIR){ EVV evnew2; evnew2.ty = REC; evnew2.t = Rt[j]; evnew2.i = j; evl.push_back(evnew2);}
          }
        }
        sort(evl.begin(),evl.end(),compare);
      }

      if(S == 0) emsg("No individuals in contact group");

      if(evl.size() > 0) tmi = evl[0].t;

      for(e = 0; e < evl.size(); e++){
        switch(evl[e].ty){
          case INF: S--; I++; break;
          case REC: I--; R++; break;
        }
        if(I == 0){ tma = evl[e].t; break;}
      }

      if(e < evl.size()){
        for(ee = e+1; ee < evl.size(); ee++){
          if(evl[ee].ty == INF){ tprob = evl[ee].t; fl = 1; break;}
        }

        if(fl == 1){  // Tries to make recovery time later
          for(ee = 0; ee < e; ee++){
            if(evl[ee].ty == INF){
              j = evl[ee].i;
              if(Rtmax[j] > tprob){
                if(sd == big) emsg("Initialisation problem");
                loop2 = 0; do{ Rt[j] = tprob - log(ran())*sd; loop2++;}while(loop2 < 1000 && Rt[j] > Rtmax[j]);
                if(loop2 == 1000) emsg("Convergence problem");
                fl = 2; break;
              }
            }
          }
        }

        if(fl == 1){ // Tries to make infection time earlier
          for(ee = e+1; ee < evl.size(); ee++){
            if(evl[ee].ty == INF){
              j = evl[ee].i;
              tmi2 = tmi; tma2 = tma; if(Itmin[j] > tmi2) tmi2 = Itmin[j]; if(Itmax[j] < tma2) tma2 = Itmax[j];
              if(tmi2 < tma2) It[j] = tmi2+ran()*(tma2-tmi2);
            }
          }
        }
      }
      loop++;
    }while(loop < loopmax && fl > 0);
    if(loop == loopmax) emsg("Cannot get initial state");
  }

  nItsampav.resize(N); Itsampav.resize(N); Itsampav2.resize(N);   // Sets up the sampler for creating / removing infections
  for(j = 0; j < N; j++){
    z = indtrial[j];
    if(Iposst[j] == unknownI){
      nItsampav[j] = 0; Itsampav[j] = 0; Itsampav2[j] = 0;
      for(k = 0; k < 100; k++){
        if(It[j] != -big){
          if(sd == big) emsg("Initialisation problem");
          val = It[j] + normal(0,sd);
        }
        else{
          if(Itmin[j] != -big &&  Itmax[j] != -big) val = (Itmin[j]+Itmax[j])/2 + normal(0,(Itmax[j]-Itmin[j])/2);
          else{
            if(sd == big) emsg("Initialisation problem");
            val = Itav[z] + normal(0,sd);
          }
        }
        Itsampav[j] += val; Itsampav2[j] += val*val; nItsampav[j]++;
      }
    }
  }

  trialunknownI.resize(Z); for(j = 0; j < N; j++){ if(Iposst[j] == unknownI){ unknownIfl = 1; trialunknownI[indtrial[j]].push_back(j);}}

  for(j = 0; j < N; j++){
    z = indtrial[j];
    if(It[j] != -big){
      if(It[j] >= Rt[j]) emsg("Infection time greater and recovery time");
      if(It[j] >= trialtmax[z]) emsg("Infection tiem out of range");
      if(It[j] < Itmin[j] || It[j] > Itmax[j]) emsg("Infection time out or range");
      if(Rt[j] < Rtmin[j] || Rt[j] > Rtmax[j]) emsg("Recovery time out or range");
    }
  }

  //for(j = 0; j < N; j++) cout  << Itmin[j] << " " << Itmax[j] << " " << Rtmin[j] << " " << Rtmax[j] <<"  "<< Iposst[j] <<   " check\n";
}
