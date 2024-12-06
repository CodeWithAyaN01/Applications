// PROGRAM 7:  Develop a C program to simulate page replacement algorithms: a) FIFO

//FIFO 
#include<stdio.h> 
void main() 
{ 
    int i, j, k, frames, pf=0, count=0, rs[25], m[10], n; 

    printf("\n Enter the length of reference string -- "); 
    scanf("%d",&n); 

    printf("\n Enter the reference string -- "); 
    for(i=0;i<n;i++) 
        scanf("%d",&rs[i]); 

    printf("\n Enter no. of frames -- "); 
    scanf("%d",&frames); 

    for(i=0;i<frames;i++) 
        m[i]=-1; 

    printf("\n The Page Replacement Process is -- \n"); 
    for(i=0;i<n;i++) 
    { 
        for(k=0;k<frames;k++) 
        { 
            if(m[k]==rs[i]) 
                break; 
        }


        if(k==frames) 
        { 
            m[count++]=rs[i]; 
            pf++; 
        } 

        for(j=0;j<frames;j++) 
            printf("\t%d",m[j]); 

        if(k==frames) 
            printf("\tPF No. %d",pf); 

        printf("\n"); 
        if(count==frames) 
            count=0; 
    } 
    printf("\n The number of Page Faults using FIFO are %d",pf); 
}