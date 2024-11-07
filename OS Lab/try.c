#include<stdio.h>
int main()
{
    int bt[20],wt[20],tat[20],i,n,k,temp,p[20],pri[20];
    float wtavg , tatavg;
    printf("\nEnter the number of Process: ");scanf("%d",&n);
    for (i = 0 ; i<n ; i++)
    {
        p[i] = i;
        printf("Enter the brust time and pri : of P%d: ",i);
        scanf("%d%d",&bt[i],&pri[i]);
    }

    for (i = 0 ; i<n; i++)
    for (k = i+1 ; k< n ;k++)
        if (pri[i] > pri[k])
        {
            temp = p[i];
            p[i] = p[k];
            p[k] = temp;

            temp = bt[i];
            bt[i] = bt[k];
            bt[k] = temp;

            temp = pri[i];
            pri[k] = pri[i];
            pri[i] = temp;
        }
    
    wt[0] = wtavg = 0;
    tat[0] = tatavg = bt[0];
    
    for (i = 1 ; i<n ; i++)
    {
        wt[i] = wt[i-1] + bt[i-1];
        tat[i] = tat[i-1] + bt[i];
        wtavg += wt[i];
        tatavg += tat[i];
    }
    printf("\nProcess\t\tBrustTime\t\tWaitingTime\t\tTurnaroungTime\t\n");
    for(i = 0 ; i < n ;i++)
    {
        printf("\nP%d\t\t\t%d\t\t\t%d\t\t\t%d",i,bt[i],wt[i],tat[i]);
    }
    printf("\nAvg waiting time is : %f",wtavg/n); 
    printf("\nAvg Turn time is : %f",tatavg/n); 

}