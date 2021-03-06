import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { HeaderContainer } from "../resusable-components/styledComponents";
import * as d3 from "d3";
import styled from "styled-components";

// const makeYLines = () => d3.axisLeft(y);
// svg
//     .append("g")
//     .attr("class", "grid")
//     .call(
//         makeYLines()
//             .tickSize(-WIDTH, 0, 0)
//             .tickFormat("")
//     );

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    const WIDTH = 800;
    const HEIGHT = 500;

    const numPlacement = n => {
      if (n > 100) return 2.4;
      if (n > 10) return 2.3;
      return 2.16;
    };

    const svg = d3
      .select(svgRef.current)
      .attr("HEIGHT", HEIGHT)
      .attr("WIDTH", WIDTH);

    /*SCALES AND AXES*/
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.stage))
      .range([0, WIDTH]);
    const y = d3
      .scaleLinear()
      .domain([0, Math.ceil(data[0].number / 10) * 10])
      .range([HEIGHT, 0]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    const yAxisGrid = d3
      .axisLeft(y)
      .tickSize(-WIDTH, 0, 0)
      .tickFormat("");

    /*RENDER*/
    //Create Grid first
    svg
      .append("g")
      .attr("class", "grid")
      .call(yAxisGrid);

    //create Axes
    svg
      .select(".x-axis")
      .style("transform", `translateY(${HEIGHT}px)`)
      .call(xAxis)
      .selectAll("text")
      .attr("y", "20")
      .attr("font-size", "15");

    svg.select(".y-axis").call(yAxis);

    //labels
    //bottom
    svg
      .append("text")
      .attr("class", "d3-label")
      .attr("y", HEIGHT + 70)
      .attr("x", WIDTH / 2)
      .attr("font-size", "25px")
      .attr("text-anchor", "middle")
      .text("Stages");

    //top
    svg
      .append("text")
      .attr("class", "d3-label")
      .attr("y", -15)
      .attr("x", WIDTH / 2)
      .attr("font-size", "30px")
      .attr("text-anchor", "middle")
      .text("Job Hunt Progress");

    //y label
    svg
      .append("text")
      .attr("class", "d3-label")
      .attr("y", -60)
      .attr("x", -(HEIGHT / 2))
      .attr("font-size", "25px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Number of Companies");

    //bars
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", d => x(d.stage) + x.bandwidth() / 4)
      .attr("y", -HEIGHT)
      .attr("width", x.bandwidth() / 2)
      .transition()
      .attr("height", d => HEIGHT - y(d.number))
      .attr("fill", "#80cbc4 !important");
  }, [data]);

  return (
    <HeaderContainer>
      <ChartArea>
        <SVG ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </SVG>
      </ChartArea>
    </HeaderContainer>
  );
};

const SVG = styled.svg`
  background: #eee;
  overflow: visible;
  margin-bottom: 100px;
  background-color: #2f4a6d;
  @media screen and (prefers-color-scheme: light) {
    background-color: #2f4a6d;
  }
`;

const ChartArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50px
  HEIGHT: 650px;
  WIDTH: 1000px;
  margin-bottom: 100px;
  background-color: #2F4A6D;
  color: white;
  @media screen and (prefers-color-scheme: light) {
    background-color: #2f4a6d;
  }
`;

const mapStateToProps = state => ({ data: state.job.jobsProgress });

export default connect(mapStateToProps)(BarChart);

//todo - does the d3 fetch really need to be in any other component than this?
