// PROGRAM 10: Develop a C program to simulate SCAN disk scheduling algorithm

// head movement towards left 
#include<stdio.h> 
int main() 
{ 
    int tracks[20], d[20], head , i, j, n, temp, k, atr[20], tot, p, sum=0; 
    printf("enter the no of tracks to be traveresed"); 
    scanf("%d'",&n); 
    printf("enter the position of head"); 
    scanf("%d",&head); 
    
    tracks[0]=0; 
    tracks[1]=head; 

    printf("enter the tracks"); 
    for(i=2 ; i<n+2 ; i++) 
        scanf("%d",&tracks[i]); 

    for(i=0;i<n+2;i++) 
    { 
        for(j=0;j<(n+2)-i-1;j++) 
        { 
            if(tracks[j]>tracks[j+1]) 
            { 
                temp=tracks[j]; 
                tracks[j]=tracks[j+1]; 
                tracks[j+1]=temp; 
            } 
        } 
    } 

    for(i=0;i<n+2;i++) 
        if(tracks[i]==head) 
        { 
            j=i; 
            k=i; 
            p=0; 
        } 

    while(tracks[j]!=0) 
    { 
        atr[p]=tracks[j]; 
        j--; 
        p++; 
    }

    atr[p]=tracks[j]; 
    for(p=k+1;p<n+2;p++,k++) 
        atr[p]=tracks[k+1]; 

    printf("seek sequence is:"); 

    for(j=0;j<n+1;j++) 
    { 
        if(atr[j]>atr[j+1]) 
            d[j]=atr[j]-atr[j+1]; 
        else 
            d[j]=atr[j+1]-atr[j]; 
        sum+=d[j]; 
        printf("\n%d", atr[j]); 
    } 
    printf("\nTotal head movements:%d",sum); 
}
