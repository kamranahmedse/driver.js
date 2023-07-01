import type { Config, DriveStep } from "driver.js";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type CodeSampleProps = {
  heading: string;

  config?: Config;
  highlight?: DriveStep;
  tour?: DriveStep[];

  id?: string;
  className?: string;
  children: any;
};

export function CodeSample(props: CodeSampleProps) {
  const { heading, id, children, className, config, highlight, tour } = props;

  function onClick() {
    if (highlight) {
      const driverObj = driver({
        ...config
      });
      driverObj.highlight(highlight);
    } else if (tour) {
      const driverObj = driver({
        ...config,
        steps: tour,
      });
      driverObj.drive();
    }
  }

  return (
    <div id={id} className={className}>
      <p className="text-lg -mt-0 font-medium text-black -mb-3 rounded-md">{ heading }</p>
      <div className="-mb-4">{children}</div>
      <button onClick={onClick} className="w-full rounded-md bg-black p-2 text-white">
        Show me an Example
      </button>
    </div>
  );
}
