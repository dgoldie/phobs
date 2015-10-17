import {Socket, LongPoller} from "phoenix"

class GraphApp {
  var data = [];

  static init(){
    let socket = new Socket("/phobs", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    // XXX What is user?  Do I need it?
    socket.connect({user_id: "123"})
    var $top_container  = $("#top")

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("phobs:graph", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))


    chan.on("graph:update", graph => { 
      // $graph_container.html(this.graphTemplate(graph.graph))
      this.data = graph.graph;
      // console.log(links);
      this.links = this.buildlist(data);
    })
  }

  static buildList(data) {
    var links = [];
    data.forEach(function(entry) {
      entry.links.forEach(function(link) {
        links.push({"source": entry.pid, "target" : link})
      })
    })
    console.log(links[0]);
    // console.log('name = ' + links[0].source.name + ', pid - ' + links[0].source.pid);
    return links;
  }

}


$( () => GraphApp.init() )

export default GraphApp


// d3
// http://bl.ocks.org/mbostock/2706022
// data is links

var links = GraphApp.buildList();

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  // console.log(link);
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", this.tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
  .enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", this.mouseover)
    .on("mouseout", this.mouseout)
    .call(force.drag);

node.append("circle")
    .attr("r", 8);

node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
}

function mouseout() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 8);
}

