#include <stdio.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <fcntl.h> 
#include <unistd.h> 

int write()
{
    int fd;
    char buf[1024] = "ghello ";
    char *myfifo = "edfwefwe";
    mkfifo(myfifo,0666);
    fd = open(myfifo,O_WRONLY);
    write(fd,buf,sizeof(buf));
    close(fd);
    unlink(fd);

}   
#define max 1024
int read()
{
    int fd;
    char *myfifo = "Address/sdfwe/fwef/w";
    char buf[max];
    fd = open(myfifo,O_RDONLY);
    read(fd,buf,max);
    close(fd);
}