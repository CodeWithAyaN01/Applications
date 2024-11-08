#include<stdio.h>
#define max 25
int main()
{
    int b[max] , f[max] , frag[max] , nb , nf , i , j , temp , higest = 0;
    static int bf[max] , ff[max];

    printf("\nEnter the number of Blocks:");
    scanf("%d",&nb);

    printf("\nEnter the number of files:");
    scanf("%d",&nf);

    printf("Enter size of blocks: ");
    for (i = 1 ; i< nb ; i++)
    {
        printf("blocks %d: ",i);
        scanf("%d",&b[i]);
    }

    printf("Enter size of files: ");
    for (i = 1 ; i< nb ; i++)
    {
        printf("files %d: ",i);
        scanf("%d",&f[i]);
    }

    for (i = 1 ; i< nf ; i++)
    {
        for (j = 1 ; j< nb ; j++)
        {
            if (bf[i] != 1)
            {
                temp = b[j] - f[i];
                if (temp>=0)
                    if (higest<temp)
                    {
                        ff[i] = j;
                        higest = temp;
                    }
            }

        }
        frag[i] = higest;
        bf[ff[i]] = 1;
        higest = 0;
    }

    printf("File no , file size , block no , block size , fragment");
    for (i = 1 ; i<nf ; i++)
    {
    printf("%d%d%d%d%d",i,f[i],ff[i],b[ff[i]],frag[i])
    }
}