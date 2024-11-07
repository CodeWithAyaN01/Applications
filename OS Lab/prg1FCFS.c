#include<stdio.h>
int main()
{
    int bt[20] , wt[20] , tat[20],i,n;
    float wtavg,tatavg;
    printf("\n Enter the number of process -- ");
    scanf("%d",&n);

    for (i = 0 ; i < n ; i++)
    {
        printf("\nEnter the burst time for process %d -- ",i);
        scanf("%d",&bt[i]);
    }
    wt[0] = wtavg = 0;
    tat[0] = tatavg = bt[0];
    for (i = 1; i < n ; i++) // 0th index already assigned 
    {
        wt[i] = wt[i-1] + bt[i-1];
        tat[i] = tat[i-1] + bt[i];
        wtavg = wtavg + wt[i]; // taking out avg of wait time and turnaround time : 
        tatavg = tatavg + tat[i];
    }

    printf("\t Process \t Burst Time \t Waiting Time \t Turnaround Time\n");
    for (i = 0 ; i<n ; i++)
    {
        printf("\n\t p%d \t\t %d \t\t %d \t\t %d",i,bt[i],wt[i],tat[i]);
    }
    printf("\nAvg Wait time is : %3f",wtavg/n);
    printf("\nAvg Turn Around time is : %3f",tatavg/n);
}