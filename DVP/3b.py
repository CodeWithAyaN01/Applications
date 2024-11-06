str1 = input("Enter String 1: \n")
str2 = input("Enter String 2: \n")
if len(str1) < len(str2):
    short = len(str1)
    long = len(str2)
else:
    short = len(str2)
    long = len(str1)
match = 0
for i in range (short):
    if str1[i] == str2[i]:
        match += 1
print("Simmalarity between is ", match/long)