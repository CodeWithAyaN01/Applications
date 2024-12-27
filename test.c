#include <stdio.h>
#include <string.h>

void main()
{
    char name[30];
    char revName[30];
    printf("Enter the String: ");
    gets(name);

    int length = strlen(name);
    int j = 0;
    for (int i = length - 1; i >= 0; i--)
    {
        revName[j] = name[i];
        j++;
    }
    revName[j] = '\0';

    int match = 1;
    for (int i = 0; i < length; i++)
    {
        if (name[i] != revName[i])
        {
            match = 0;
            break;
        }
    }

    if (match)
    {
        printf("It's a palindrome.\n");
    }
    else
    {
        printf("It's not a palindrome.\n");
    }
}
