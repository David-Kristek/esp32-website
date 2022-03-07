import React, { useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";

export default function LineChart() {
  const canvasEl = useRef(null);

  const colors = {
    purple: {
      default: "rgba(126, 173, 117, 1)",
      half: "rgba(126, 173, 117, 0.5)",
      quarter: "rgba(126, 173, 117, 0.25)",
      zero: "rgba(126, 173, 117, 0)",
    },
    indigo: {
      default: "rgba(80, 102, 120, 1)",
      quarter: "rgba(80, 102, 120, 0.25)",
    },
  };
  const hidePoints = (labels) => {
    let arr = [];
    let j = 0;
    const numberOfVisibleLabels = 10;
    const num = labels.length / numberOfVisibleLabels;
    if (labels.length <= numberOfVisibleLabels) return [];
    for (let i = 0; i < labels.length; i++) {
      if (Math.round(j) === i) {
        continue;
      }
      j += num;
    }
  };
  useEffect(() => {
    const ctx = canvasEl.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const tempValues = [];
    const labels = [];
    const dataLength = 150;
    const heating = []; 
    for (let i = 0; i < dataLength; i++) {
      const randomValue = Math.floor(Math.random() * 4) + 19; 
      tempValues.push(randomValue);
      labels.push("10:22");
      heating.push(randomValue > 20 ? undefined : 20); 
    }
    hidePoints(tempValues);
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Teplota",
          data: tempValues,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3,
          fill: true,

        },
        {
          backgroundColor: "red", 
          label: "Topení", 
          data: heating,
          borderWidth: 2,
          pointRadius: 4,
          lineTension: 0.2,
          fill: true,
          // pointBackgroundColor: colors.purple.red,

        }
      ],
    };
    const config = {
      type: "line",
      data: data,
      options: {
        scales: {
          xAxis: {
            ticks: {
              maxTicksLimit: 10,
            },
          },
        },
      },
    };
    const myLineChart = new Chart(ctx, config);

    return function cleanup() {
      myLineChart.destroy();
    };
  });

  return (
    <div className="App w-full h-[150px]">
      <canvas id="myChart" ref={canvasEl} height="50"/>
    </div>
  );
}
