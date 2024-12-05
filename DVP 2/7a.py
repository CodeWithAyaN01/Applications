import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("iris")
sns.lineplot(x = "sepal_length" , y ="sepal_width",data = df)
sns.set_style("darkgrid")
plt.show()