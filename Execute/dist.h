// Functions related to mathematical distributions

double ran()                                                                // Random uniform sample between 0 and 1 inclussive
{
  return 0.999999999*double(rand())/RAND_MAX;
}

double ranin()                                                              // Random uniform sample between 0 and 1 exclussive
{
  double val;
  do{ val = double(rand())/RAND_MAX;}while(val == 0 || val == 1);
  return val;
}

double gammaprob(double x, double a, double b)                                      // The log of the probability from the gamma distribution
{
  if(x < 0 || a < 0 || b < 0) emsg("Cannot have negative values for gamma distribution");
  return (a-1)*log(x) - b*x + a*log(b) - lgamma(a);
}

double gammasamp(double a, double b)                                                // Draws a sample from the gamma distribution x^(a-1)*exp(-b*x)
{
  if(a < 1){
    double u = ran();
    return gammasamp(1.0 + a, b) * pow (u, 1.0 / a);
  }
  else{
    double x, v, u;
    double d = a - 1.0 / 3.0;
    double c = (1.0 / 3.0) / sqrt (d);
 
    while(1 == 1){
      do{
        x = sqrt(-2*log(ran()))*cos(2*3.141592654*ran());
        v = 1.0 + c * x;
      }while (v < 0);

      v = v*v*v;
      u = ran();

     // if (u < 1 - 0.0331*x*x*x*x) break;

      if (log(u) < 0.5*x*x + d*(1 - v + log(v))) break;
    }

    return d*v/b;
  }
}

double normalprob(double x, double mean, double var)                         // The log of the probability from the normal distribution
{
  return -0.5*log(2*3.141592654*var)  - (x-mean)*(x-mean)/(2*var);
}

double lognormalprob(double x, double mean, double var)                      // The log of the probability from the lognormal distribution
{
  double lx = log(x);
  return -0.5*log(2*3.141592654*var) - lx - (lx-mean)*(lx-mean)/(2*var);
}

double betaprob(double x, double a, double b)                                // The log of the probability from the beta distribution
{
  return (a-1)*log(x) + (b-1)*log(1-x) + lgamma(a+b) - lgamma(a) - lgamma(b);
}

double binomialprob(double p, int N, int k)                                 // The log of the probability from the bonomial distribution
{
  return exp(lgamma(N + 1.0) - lgamma(k + 1.0) - lgamma(N-k + 1.0) + k*log(p) + (N-k)*log(1-p));
}

double normal(float mu, double  sd)                                     // Draws a sample from the normal distribution
{ 
  return mu + sd*sqrt(-2*log(ranin()))*cos(2*3.141592654*ran());
}

double normal_var(double var)                                           // Draws a normally distributed sample with zero mean
{
  unsigned long v1, v2;

  if(var < 0){ emsg("Cannot have negative variance"); return -1;}
  else{
    if(var == 0) return 0;
    else{
      v1 = rand(); v2 = rand();
      return sqrt(-2*var*log(ranin()))*cos(2*3.141592654*double(v2)/RAND_MAX);
    }
  }
}
