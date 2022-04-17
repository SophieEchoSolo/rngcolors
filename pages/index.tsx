import { LargeNumberLike } from "crypto";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

type ColorCell = { r: number; g: number; b: number; a: number };
const width = 10;
const height = width;
const size = 30;

function download(filename: string, text: string) {
  var pom = document.createElement("a");
  pom.setAttribute("href", "data:image/svg+xml," + encodeURIComponent(text));
  pom.setAttribute("download", filename);

  //let clickEvent = new Event("click");
  //pom.dispatchEvent(clickEvent);
  pom.click()
}

function randomStepClampRange(
  cur: number,
  stepSize: number = 10,
  min: number = 0,
  max: number = 255
) {
  let randomMovement = Math.random() * stepSize * 2 - stepSize;

  return Math.floor(Math.max(Math.min(max, cur + randomMovement), min));
}

function randomRange(min: number = 0, max: number = 256) {
  return Math.floor(min + Math.random() * (max - min));
}

function generateGrid(){
  let colorGridInner: ColorCell[][] = [];
    let prevR = randomRange(),
      prevG = randomRange(),
      prevB = randomRange();

    for (let i = 0; i < size; i++) {
      let row: ColorCell[] = [];
      colorGridInner.push(row);

      for (let j = 0; j < size; j++) {
        let r: number, g: number, b: number, a: number;

        prevR = r = randomStepClampRange(prevR);
        prevG = g = randomStepClampRange(prevG);
        prevB = b = randomStepClampRange(prevB);
        a = 1;
        const cell: ColorCell = { r, g, b, a };
        row.push(cell);
      }

      if (i % 2 != 0) {
        row.reverse();
      }
    }
    return colorGridInner;
}

const Home: NextPage = () => {
  const [colorGrid,setColorGrid] = useState(() => generateGrid());

  const svgRef = useRef<SVGSVGElement>(null);
  const save = useCallback(() => {
    if (svgRef.current == null) {
      return
    }
    download("image.svg", `<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${svgRef.current.outerHTML}`);
  }, []);

  return (
    <div className={styles.container}>
      <button type="button" onClick={save}>
        Save
      </button>
      <button type="button" onClick={()=>setColorGrid(generateGrid())}>
        Regenerate
      </button>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" ref={svgRef} viewBox="0 0 300 300">
        {colorGrid.map((row, i) =>
          row.map((cell, j) => (
            <rect
              strokeWidth={1}
              stroke={`rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a})`}
              x={width * j}
              y={height * i}
              width={width}
              height={height}
              fill={`rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a})`}
            />
          ))
        )}
      </svg>
    </div>
  );
};

export default Home;
