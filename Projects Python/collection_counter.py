def collection(x,final = []):
    List1 = []
    final = []
    #x = str(x)
    global total
    total=0
    list2 = x.split()
    #print(list2)
    for i in range (len(list2)):
        List1.append(int(list2[i]))
    final.append(List1[1])
    total+= sum(final)
        
no_of_shoes = int(input("Enter the Amount of shooes: "))
Store = {}
a = input("Shoes stock: ")
shoe_temp = a.split()
shoe_list = []
for i in shoe_temp:
    shoe_list.append(int(i))
print(shoe_list)
#total_earning = []
No_of_customers = int(input("Enter the no of Customers: "))

for cus in range(No_of_customers):
    ask = input("Enter the size and prize: ")
    bill=collection(ask)
    
print(total)
shoelist=[]
a=int(input("enter the number of shoe"))
for i in range(a):
    shoelist.append(int(input()))
    