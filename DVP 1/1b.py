val = int(input("Enter the number: "))
String = str(val)
if String == String[::-1]:
    print("Palendrome : ")
else:
    print("Not palendrome: ")
for i in range(10):
    if String.count(str(i)) > 0:
        print(f"{str(i)} occurs {String.count(str(i))} Times ")