#10a)

import pandas as pd
import plotly.express as px
tsla = pd.read_csv('C:/Users/Student/Documents/tesla.csv')
tsla.head()
fig = px.line(tsla, x='Date', y="Close")
fig.show()
tesla.csv 👇🏻

Date,Open,High,Low,Close,Adj Close,Volume
2013-01-02,35.061111,36.004444,34.463333,35.524445,35.524445,2767500
2013-01-03,35.645557,36.296667,35.251112,35.718888,35.718888,1821100
2013-01-04,35.881111,36.218888,3

places.csv 👇🏻

Date,Open,High,Low,Close,Adj Close,Volume
2013-01-02,35.061111,36.004444,34.463333,35.524445,35.524445,2767500
2013-01-03,35.645557,36.296667,35.251112,35.718888,35.718888,1821100
2013-01-04,35.881111,36.218888,35.396667,36.021111,36.021111,2266500
2013-01-07,35.944443,36.203334,35.655556,35.904445,35.904445,1445500
2013-01-08,35.651111,35.745556,35.058888,35.227222,35.227222,1800700


#10b)

import plotly.graph_objects as go
import plotly.express as px
url = 'C:/Users/Student/Documents/places.csv'
data = pd.read_csv(url, header='infer')
data.head()
data = data.rename(columns = {'POIs':'Place'})
data.head()
fig = px.scatter_mapbox(data, lat="LATITUDE", lon="LONGITUDE", hover_name="Place",
hover_data=["Place"], color_discrete_sequence=["darkmagenta"], zoom=5.5, height=300)
fig.update_layout(mapbox_style="open-street-map")
fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
fig.show()

places csv 👇🏻
Place,LATITUDE,LONGITUDE
Place1,34.052235,-118.243683
Place2,40.712776,-74.005974
Place3,51.507351,-0.127758
Place4,48.856613,2.352222
Place5,-33.868820,151.209290
