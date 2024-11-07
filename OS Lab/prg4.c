#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>
#include<sys/wait.h>

int main()
{
    pid_t childPid;
    char ch[3];

    childPid = fork();

    if (childPid == -1)
    {
        perror("fork");
        exit(EXIT_FAILURE);
    }

    if (childPid == 0)
    {
        printf("child Process (PID: %d) is running.\n",getpid());
        abort();
        // or 
        return (-1);
        // ro
        execl("/bin/date","date",NULL);
        exit(0);
    }else
    {
        printf("Parent Process (PID: %d) is waiting for the chid to terminate: ",getpid());
        int status;
        wait(&status);
        printf("Parent Resumes\n");

        if (WIFEXITED(status))
        {
            printf("child process (PID: %d) terminated with status %d",childPid,WEXITSTATUS(status));
        }else if (WIFSIGNALED(status))
        {
            printf("\nChild process (PID: %d) terminated due to signal %d.\n", child_pid, WTERMSIG(status));
        }else
        {
            printf("\nChild process (PID: %d) terminated abnormally.\n", child_pid);
        }
        
    }
}
