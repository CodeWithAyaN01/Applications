# import math as mh
import sys
import math as mh
def calc():
    print("1.Add,2.sub,3.mul,4.dvd")
    op = int(input("Enter The Operation form 1,2,3,4: "))
    if (op!= 1 and op!= 2 and op!= 3 and op!= 4):
        raise ValueError("Kya kr rahe ho bhai galat value ")
    x = int(input("Enter the number: "))
    y = int(input("Enter the number: "))
    def add(a,b):
        print(f"The Sum of the number {a} and {b} is [{(float(a+b))}] ")
    def sub(a,b):
        print(f"The Sub of the number {a} and {b} is [{float(a-b)}] ")
    def mul(a,b):
        print(f"The mul of the number {a} and {b} is [{float(a*b)}) ")
    def dvd(a,b):
        if (a==0):
            print("ans is zero [0]")
            sys.exit(0)
        if (b==0):
            raise ZeroDivisionError("b cannot be \'0\'")
        print(f"The ded of the number {a} and {b} is [{float(a/b)}] ")
    if (op == 1):
        add(x,y)
    elif(op == 2):
        sub(x,y)
    elif(op == 3):
        mul(x,y)  
    else:
        dvd(x,y)  
    
calc()