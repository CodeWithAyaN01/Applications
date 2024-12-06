#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#define max_file 10
#define max_len 10
char dir[max_len];
char totalfile[max_file][max_len];
int filecount = 0;
void creatfile()
{
    if (filecount <max_len)
    {
        char filename[max_len];
        printf("Enter file name");
        scanf("%d",filename);
        strcpy(totalfile[filecount] , filename);
        filecount++;
        printf("file created");
    }
    else
    {
        printf("directory is full");
    }
    
}
void delFile()
{
    char filename[max_len];
    printf("Enter the file you want to del: ");
    scanf("%s",filename);
    int found = 0;
    for (int i = 0 ; i< filecount ; i++)
    {   
        found = 1;
        if (strcmp(totalfile[i], filename))
        {
            strcpy(totalfile[i],totalfile[filecount-1]);
            filecount--;
            break;
        }

    }
    if (!found)
    {
        printf("file not here");
    }
}