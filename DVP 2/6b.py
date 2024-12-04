import matplotlib.pyplot as plt
import random as r
Student_USN = ["01","02","03","04","05","06","07","08","09","10"]
marks = []
for i in range(0,(len(Student_USN))):
    marks.append(r.randint(0,101))
plt.xlabel("Students")
plt.ylabel("Marks")
plt.title("Class Record")
plt.plot(Student_USN,marks,color = 'Green',linestyle ="solid",marker = 'o',markerfacecolor = 'red',markersize =15)
plt.show()