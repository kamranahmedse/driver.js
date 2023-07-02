import type { Config, DriveStep } from "driver.js";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useState } from "react";

type CodeSampleProps = {
  heading: string;

  config?: Config;
  highlight?: DriveStep;
  tour?: DriveStep[];

  id?: string;
  className?: string;
  children: any;
};

function removeDummyElement() {
  const el = document.querySelector(".dynamic-el");
  if (el) {
    el.remove();
  }
}

function mountDummyElement() {
  const newDiv = (document.querySelector(".dynamic-el") || document.createElement("div")) as HTMLElement;

  newDiv.innerHTML = "This is a new Element";
  newDiv.style.display = "block";
  newDiv.style.padding = "20px";
  newDiv.style.backgroundColor = "black";
  newDiv.style.color = "white";
  newDiv.style.fontSize = "14px";
  newDiv.style.position = "fixed";
  newDiv.style.top = `${Math.random() * (500 - 30) + 30}px`;
  newDiv.style.left = `${Math.random() * (500 - 30) + 30}px`;
  newDiv.className = "dynamic-el";

  document.body.appendChild(newDiv);
}

export function CodeSample(props: CodeSampleProps) {
  const [driverObj, setDriverObj] = useState<any>(null);
  const { heading, id, children, className, config, highlight, tour } = props;

  function onClick() {
    if (highlight) {
      const driverObj = driver({
        ...config,
      });
      driverObj.highlight(highlight);

      setDriverObj(driverObj);
    } else if (tour) {
      if (tour?.[2]?.popover?.title === "Next Step is Async") {
        tour[2].popover.onNextClick = () => {
          mountDummyElement();
          driverObj.moveNext();
        };

        if (tour?.[3]?.element === ".dynamic-el") {
          tour[3].onDeselected = () => {
            removeDummyElement();
          };

          // @ts-ignore
          tour[4].popover.onPrevClick = () => {
            mountDummyElement();
            driverObj.movePrevious();
          }

          // @ts-ignore
          tour[3].popover.onPrevClick = () => {
            removeDummyElement();
            driverObj.movePrevious();
          };
        }
      }

      const driverObj = driver({
        ...config,
        steps: tour,
      });

      driverObj.drive();
      setDriverObj(driverObj);
    }
  }

  return (
    <div id={id} className={className}>
      <p className="text-lg -mt-0 font-medium text-black -mb-3 rounded-md">{heading}</p>
      <div className="-mb-4">{children}</div>
      <button onClick={onClick} className="w-full rounded-md bg-black p-2 text-white">
        Show me an Example
      </button>
    </div>
  );
}
