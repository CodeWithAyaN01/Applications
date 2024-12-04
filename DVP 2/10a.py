# importing all modules 
import pandas as pd
import plotly.express as px

# code
tsla = pd.read_csv(r'D:\Download\tesla.csv')
tsla.head()
fig = px.line(tsla, x='Date', y="Close")
fig.show()
fig = px.line(tsla, x='Date', y="Close")
fig.show()