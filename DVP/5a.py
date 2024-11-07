# Histogram 
from matplotlib import pyplot as plt 
import numpy as np
a = np.array([12,23,34,45,56,67,78,89,90])
fix,ax = plt.subplots(figsize = (10,7))
ax.hist(a,bins = [0,25,50,75,100])
plt.show()