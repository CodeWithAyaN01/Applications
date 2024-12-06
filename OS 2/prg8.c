#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#define Max_File 10 
#define Name_length 10 
char directoryName[Name_length]; 
char totalFiles[Max_File][Name_length]; 
int fileCount = 0; 
void createFile() 
{ 
    if (fileCount < Max_File) 
    { 
        char filename[Name_length]; 
        printf("Enter the name of the file: "); 
        scanf("%s", filename); 
        strcpy(totalFiles[fileCount], filename); 
        fileCount++; 
        printf("File %s created.\n", filename); 
    } else 
    { 
        printf("Directory is full, cannot create more files.\n"); 
    } 
} 

void deleteFile() 
{ 
    if (fileCount == 0) 
    { 
        printf("Directory is empty, nothing to delete.\n"); 
        return; 
    } 
    char filename[Name_length]; 
    printf("Enter the name of the file to delete: "); 
    scanf("%s", filename); 
    int found = 0; 
    for (int i = 0; i < fileCount; i++) 
    { 
        if (strcmp(filename, totalFiles[i]) == 0) 
        { 
            found = 1; 
            printf("File %s is deleted.\n", filename); 
            strcpy(totalFiles[i], totalFiles[fileCount - 1]); 
            fileCount--; 
            break; 
        } 
    } 
    if (!found) 
    { 
        printf("File %s not found.\n", filename); 
    } 
} 
void displayFiles() 
{ 
    if (fileCount == 0) { 
        printf("Directory is empty.\n"); 
    } else { 
        printf("Files in the directory %s:\n", directoryName); 
        for (int i = 0; i < fileCount; i++) 
        { 
            printf("\t%s\n", totalFiles[i]); 
        } 
    } 
} 
int main() 
{ 
    printf("Enter the name of the directory: "); 
    scanf("%s", directoryName); 
    while (1) 
    { 
        printf("\n1. Create File\t2. Delete File\t3. Search File\n4. Display Files\t5. Exit\nEnter your choice:"); 
        int choice; 
        scanf("%d", &choice); 
        switch (choice) 
        { 
            case 1: 
                createFile(); 
                break; 
            case 2: 
                deleteFile(); 
                break; 
            case 3: 
                printf("Enter the name of the file: "); 
                char Search[Name_length]; 
                scanf("%s", Search); 
                int found = 0; 
                for (int i = 0; i < fileCount; i++) 
                { 
                    if (strcmp(Search, totalFiles[i]) == 0) 
                    { 
                        found = 1; 
                        printf("File %s is found.\n", Search); 
                        break; 
                    } 
                } 
                if (!found) 
                { 
                    printf("File %s not found.\n", Search); 
                } 
                break; 
            case 4: 
                displayFiles(); 
                break; 
            case 5: 
                exit(0); 
            default:
                printf("Invalid choice, please try again.\n"); 
        } 
    } 
    return 0; 
} 
