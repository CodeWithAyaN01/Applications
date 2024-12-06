#include<stdio.h>
int main()
{
    int n,m[10], min = 1 , rs[10] , flag[10],count[10],frames,next = 1,pf = 0;
    printf("\nEnter the string len: ");
    scanf("%d",&n);
    printf("\nEnter the Strig: ");
    for (int i = 0 ; i< n ; i++)
    {
        scanf("%d",&rs[i]);
        flag[i] = 0;
    }
    printf("Enter the number of frames");
    scanf("%d",&frames);
    for (int j = 0 ; j<frames ; j++)
    {
        m[j] = -1;
        count[j] = 0;
    }
    printf("The page replace process is : ");
    for (int i = 0 ; i<n ; i++)
    {
        for (int k = 0 ; k<frames ; k++)
        {
            if(m[k] == rs[i])
            {
                flag[i] = 0;
                count[i] = next;
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
                for (int j = 1 ; j<frames ; j++)
                    if(count[min] > count[j])
                        min = j;
                m[min] = rs[i];
                count[min] = next;next++;
            }
            pf++;
        }
        for (int k = 0 ; k<frames ; k++)
        {
            printf("%d\t",m[k]);
        }
        if (flag[i] == 0)
        {
            printf("Pf is --%d",pf);
        }
        printf("\n");
    }
    printf('The result is %d',pf);
}