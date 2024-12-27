from bokeh.io import output_file as of ,show
from bokeh.layouts import row
from bokeh.plotting import figure
of("hello.html")
fig1 = figure(width = 400 , height = 400 , title = "plot 1")
fig1.line([1,2,3,4,5,6],[1,2,3,4,5,6],line_width = 4)
x = y = list(range(10))

fig2 = figure(width = 400 , height = 400 , title = "plot 2")
fig2.circle(x,y,size = 5)
show(row(fig1,fig2))