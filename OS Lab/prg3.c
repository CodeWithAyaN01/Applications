#include <stdio.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <fcntl.h> 
#include <unistd.h> 

// reader coder 
int read()
{
    int fd;
    char buf[1024] = "Hello RNSIT";
    char *myfifo = "C:/Users/ayank/OneDrive/Desktop/CAED";
    mkfifo(myfifo,0666);
    printf("Run Reader Process to creat the fifo  File \n");
    fd = open(myfifo,O_WRONLY);
    write(fd,buf,sizeof(buf));
    close(fd);
    unlink(myfifo);
    return 0; 
}

//  Riter code
#define max 1024
int Write()
{
    int fd;
    char *myfifo = "C:/Users/ayank/OneDrive/Desktop/CAED";
    char buf[max];
    fd = open(myfifo,O_RDONLY);
    read(fd,buf,max);
    printf("Reader process has red: %s\n",buf);
    close(fd);
    return 0;
}

int main()
{
    read();
    Write();
}