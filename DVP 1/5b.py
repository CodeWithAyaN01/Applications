from matplotlib import pyplot as plt
import numpy as np
cars = ['AUDI', 'BMW', 'FORD','TESLA', 'JAGUAR', 'MERCEDES']
data = [23, 17, 35, 29, 12, 41]
fig = plt.figure(figsize = (10,7)) # ye wala
plt.pie(data,labels=cars)
plt.show()