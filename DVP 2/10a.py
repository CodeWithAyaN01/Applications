# importing all modules 
import pandas as pd
import plotly.express as px

# code
tsla = pd.read_csv(r'D:\\Download\\tesla-stock-price.csv')
tsla.head()
fig = px.line(tsla, x='date', y="close")
fig.show()
fig = px.line(tsla, x='date', y="close")
fig.show()