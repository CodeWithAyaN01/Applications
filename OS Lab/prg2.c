#include<stdio.h>
#include<stdlib.h>
int mutex = 1;
int full = 0;
int empty = 3;
int x = 0;

void producer()
{
    --mutex;
    ++full;
    --empty;
    x++;
    printf("\n producers produces item %d",x);
    ++mutex;
}

void comsumer()
{
    --mutex;
    --full;
    ++empty;
    printf("Comsumer Consumes: item %d",x);
    x--;
    ++mutex;
}

int main()
{
    int n,i;
    printf("\n1. Press 1 for Producer" "\n2. Press 2 for Consumer" "\n3. Press 3 for Exit"); 

    for (i = 1;i>0;i++)
    {
        printf("\nEnter your choice : ");
        scanf("%d",&n);

        switch(n)
        {
            case 1: 
                if ((mutex == 1) && (empty != 0))
                {
                    producer();
                }else
                {
                    printf("Buffer is Full: ");
                }
                break;

            case 2: 
                if ((mutex == 1) && (full != 0))
                {
                    comsumer();
                }
                else
                {
                    printf("Buffer is empty: ");
                }break;
            case 3: 
                exit(0);
                break;
        }
    }
}