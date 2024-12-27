import pandas as pd
import plotly.express as px

data = pd.read_csv(r'https://raw.githubusercontent.com/plotly/datasets/master/gapminder_with_codes.csv')

fig = px.choropleth(data, locations = "iso_alpha" , color = "gdpPercap" , hover_name = "country" , projection= "natural earth" , title = "Hello bro")
fig.show()