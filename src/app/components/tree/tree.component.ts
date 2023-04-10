import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  data: any = {};
  constructor(dataService:DataService) {
    this.data = dataService.getData();
  }

  ngOnInit(): void {
    const root: any = d3.hierarchy(this.data);
const width = 800;
const height = 800;
const dy = 100
const dx = 60
const tree = d3.tree().nodeSize([dx, dy])
const diagonal = d3.linkVertical().x((d:any)=> d.x).y((d:any) => d.y)
const margin = ({top: 10, right: 120, bottom: 10, left: 200})
root.x0 = 0;
root.y0 = dx / 2;
console.log(root.descendants())
root.descendants().forEach((d:any, i: any) => {
    d.id = i;
    d._children = d.children;
//   if (d.depth && d.data.name.length !== 7) d.children = null;
});
console.log(root.descendants())

const svg = d3.select('body').append("svg")
    .attr("viewBox", [-margin.left, -margin.top, height, dx])
    .style("font", "10px sans-serif")
    .style("user-select", "none");

const gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

const gNode = svg.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

function update(source:any) {
    const duration = 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore((node:any) => {
    if (node.y < left.y) left = node;
    if (node.y > right.y) right = node;
    });

    const height = right.y - left.y + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height] as any)
        // .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
    .data(nodes, (d:any) => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.x0},${source.y0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (d) => {
        d.children = d.children ? null : d._children;
        console.log(d.children,d._children)
        update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 4)
        .attr("fill", (d:any) => d._children ? "#FF00FF" : "#00FF00")
        .attr("stroke-width", 10);

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", (d:any) => d._children ? 35 : -35)
        .attr("text-anchor", (d:any) => d._children ? "end" : "start")
        .text((d:any) => d.data.name.length>5? d.data.name.slice(0,5)+'...': d.data.name)
        .on('mouseenter',function(this,event, d){

          d3.select(this).text((d:any) => d.data.name)
        // e.text((d:any) => d.data.name)

        }).on('mouseleave',function(this,event,d){
          d3.select(this).text((d:any)=>d.data.name.length>5? d.data.name.slice(0,5)+'...': d.data.name)
        })
    // .clone(true).lower()
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-width", 3)
    //   .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter as any).transition(transition as any)
        .attr("transform", (d:any) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
    .data(links, (d:any) => d.target.id);


    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
        const o = {x: source.x0, y: source.y0};
        return diagonal({source: o as any, target: o as any});
        })


    // Transition links to their new position.
    link.merge(linkEnter as any).transition(transition as any)
        .attr("d", diagonal as any);



    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition as any).remove()
        .attr("d", d => {
            console.log(d)
        const o = {x: source.x, y: source.y};
        return diagonal({source: o as any, target: o as any}) as any;
        });

	const label = gLink.selectAll("text")
    .data(links, (d:any) => d.target.id);


    // Enter any new links at the parent's previous position.
    const labelEnter = label.enter().append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("fill", "Blue")
    .style("font", "solid 7px Arial")
    .attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x + d.target.x)/2) + "," +
            ((d.source.y + d.target.y)/2) + ")";
    })
    .attr("dx", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d:any) {
        console.log(d)
         return d.target.data.rule;
    });


    // Transition links to their new position.
    label.merge(labelEnter as any).transition(transition as any).attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x + d.target.x)/2) + "," +
            ((d.source.y + d.target.y)/2) + ")";
    })
    .attr("dx", ".35em")
    .attr("text-anchor", "middle")




    // Transition exiting nodes to the parent's new position.
    label.exit().transition(transition as any).remove()
        .attr("transform", function(d:any) {
        return "translate(" +
            ((d.source.x)) + "," +
            ((d.source.y)) + ")";
    })
    // Stash the old positions for transition.
    root.eachBefore((d:any) => {
    d.x0 = d.x;
    d.y0 = d.y;
    });
}
update(root);
  }

}
