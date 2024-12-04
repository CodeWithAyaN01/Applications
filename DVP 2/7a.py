import seaborn as sns
import matplotlib.pyplot as plt
data = sns.load_dataset("iris")
sns.lineplot(x = "sepal_length" , y ="sepal_width",data = data)
sns.set_style("darkgrid")
plt.show()
