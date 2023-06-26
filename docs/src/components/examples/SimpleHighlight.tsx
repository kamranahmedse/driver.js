import { useEffect } from "react";
import { Config, driver } from "driver.js";
import "driver.js/dist/driver.css";

import type { DriveStep } from "driver.js";

type SimpleHighlightProps = {
  config?: Config;
  step: DriveStep;
};

export function SimpleHighlight(props: SimpleHighlightProps) {
  const { config, step } = props;

  function onClick() {
    const driverObj = driver(config);
    driverObj.highlight(step);
  }

  return (
    <button onClick={onClick} className="w-full rounded-md bg-black p-2 text-white">
      Highlight Something
    </button>
  );
}
