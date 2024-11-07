#include<stdio.h>
int main()
{
    int bt[20] , wt[20] , tat[20],i,n;
    int p[20],temp,k; // chnage
    float wtavg,tatavg;
    printf("\n Enter the number of process -- ");
    scanf("%d",&n);

    for (i = 0 ; i< n ; i++)
    {
        p[i] = i; // change
        printf("Enter the Burst time for Process %d",i);
        scanf("%d",&bt[i]);
    }
// Change 
    for (i = 0; i<n; i++)
        for (k = i+1 ; k<n ; k++)
        if (bt[i] > bt[k])
        {
            temp = bt[i];
            bt[i] = bt[k];
            bt[k] = temp;

            temp = p[i];
            p[i] = p[k];
            p[k] = temp;
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
    
    printf("\t Process \t Burst Time \t Waiting Time \t Turnaround Time\n");
    for (i = 0 ; i<n ; i++)
    {
        printf("\n\t p%d \t\t %d \t\t %d \t\t %d",i,bt[i],wt[i],tat[i]);
    }
    printf("\nAvg Wait time is : %3f",wtavg/n);
    printf("\nAvg Turn Around time is : %3f",tatavg/n);
}