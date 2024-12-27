# from bokeh.io import show
from bokeh.io import output_file as OF,show
from bokeh.layouts import row
from bokeh.plotting import figure as figs
# code
OF("plot.html")
fig1 = figs(width = 400,height = 400, title = "Plot 1")
fig1.line([2, 1, 5, 3, 4, 7, 6],[1, 4, 3, 5, 2, 7, 7],line_width = 4)

x = y = list(range(10)) #systum

fig2 = figs(width = 400,height = 400, title = "Plot 2")
fig2.circle(x, y, size = 5)
show(row(fig1, fig2))