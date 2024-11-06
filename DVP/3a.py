sectance = input("Enter the sentance ")
wordlist = sectance.split(" ")
uppercase = lowercase = digits = 0
for ch in sectance:
    if '0' <= ch <= '9':
        digits += 1
    elif 'A' <= ch <= 'Z':
        uppercase += 1
    elif 'a' <= ch <= 'z':
        lowercase += 1
        
    