#include<stdio.h>
int main()
{
    int i,j,k,rs[10],pf = 0,count[10],m[10],n,frames,min,next = 1,flag[10];
    printf("Enter the length of string ");
    scanf("%d",&n);

    printf("enter string");
    for (i = 0 ; i<n ; i++)
    {
        scanf("%d",&rs[i]);
        flag[i] = 0;
    }

    printf("Enter number of frames");
    scanf("%d",&frames);

    for(i = 0 ; i<frames ; i++)
    {
        m[i] = -1;
        count[i] = 0;
    }

    printf("the process is\n");

    for (i = 0 ; i<n ; i++)
    {
        for (j = 0 ; j<frames ; j++)
        {
            if (m[j] == rs[i])
            {
                flag[i] = 1;
                count[j] = next;
                next++;                 
            }
        }

        if (flag[i] == 0)
        {
            if (i<frames)
            {
                m[i] = rs[i];
                count[i] = next;
                next++;
            }
            else
            {
                min = 0;
                for (j = 1 ;j<frames;j++)
                {
                    if (count[min] > count[j])
                    {
                        min = j;
                    }
                }
                m[min] = rs[i];
                count[min] = next;
                next++;
            }
            pf++;
        }

        
        for(k = 0 ; i<frames ; i++)
        {
            printf("%d\t",m[k]);
        }
        if (flag[i] == 0)
        {
            printf("PF is --  %d",pf);
        }
        printf("\n");
        
    }
    printf("the result is %d",pf);
}