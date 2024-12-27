from bokeh.plotting import figure, output_file as OF, show
OF("8aoutput.html")
graph = figure(title="Bokeh Line Graph")
x = [1, 2, 3, 4, 5]
y = [5, 4, 3, 2, 1]
graph.line(x, x, legend_label="Line 1")
graph.line(y, x, legend_label="Line 2", line_color="green")
show(graph)