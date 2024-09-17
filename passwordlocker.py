Locker = {}
while True:
    userID = input("Enter your user ID (should be alpha numberic): ")
    if userID.isalnum():
        passW = input("enter your Password : ")
        if len(passW) < 8:
            raise ValueError ("what is this Your Username should be alphanumeric")
        if passW.isalnum():
            Locker.setdefault(userID , passW)
            break
        else:
            continue 
print("Your USerID and PAssword is saved succesfully ",Locker)
