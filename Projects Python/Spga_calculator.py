print("*************************WELCOME TO OUR SPGA CALCULATOR MADE BY MR.AYAN GUPTA***************************")
name = input("Enter name of The student: ")
sub_list = ["Maths[4]" , "Chemistry[4]" , "CAED[3]" , "ESC[3]" , "Pyhton[3]" , "English[1]" , "ICO[1]" , "SFH[1]"]
subject_cred = (4,4,3,3,3,1,1,1)  # predefine list for Creds of all subjects
creds_sum = sum(subject_cred)
MarksList , grade_list , final_score = [] , [] , []     # Marks obtained by Students
for i in range (len(sub_list)):
    marks = int(input(f"enter the Marks in {sub_list[i]} :"))
    MarksList.append(marks)
for sub in range(len(sub_list)): # here marks are converted into grades
    if MarksList[sub] >= 90:
        sub_gread = 10
        grade_list.append(sub_gread)
    elif MarksList[sub] < 90 and MarksList[sub] >= 80 :
        sub_gread = 9
        grade_list.append(sub_gread)
    elif MarksList[sub] < 80 and MarksList[sub] >= 70 :
        sub_gread = 8
        grade_list.append(sub_gread)
    elif MarksList[sub] < 70 and MarksList[sub] >= 60 :
        sub_gread = 7
        grade_list.append(sub_gread)
    elif MarksList[sub] < 60 and MarksList[sub] >= 50 :
        sub_gread = 6
        grade_list.append(sub_gread)
    elif MarksList[sub] < 50 and MarksList[sub] >= 40 :
        sub_gread = 5
        grade_list.append(sub_gread)
    elif MarksList[sub] < 40 and MarksList[sub] >= 30 :
        sub_gread = 4
        grade_list.append(sub_gread)
    elif MarksList[sub] < 30 and MarksList[sub] >= 20 :
        sub_gread = 3
        grade_list.append(sub_gread)
    elif MarksList[sub] < 20 and MarksList[sub] >= 10 :
        sub_gread = 2
        grade_list.append(sub_gread)
    elif MarksList[sub] < 10 and MarksList[sub] >= 0 :
        sub_gread = 1
        grade_list.append(sub_gread)
for i in range (8):
    score = subject_cred[i] * grade_list[i]  #here score is {cred * Gread}
    final_score.append(score)
final = sum(final_score)
gpa = final/creds_sum
print(f"{name}'s SGPA is {gpa} ")
print("="*100)
print(final_score , grade_list , MarksList )