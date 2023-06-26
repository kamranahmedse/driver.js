import { useEffect } from "react";
import type { DriveStep } from "driver.js";

type SimpleHighlightProps = {
  popover: DriveStep.Popover;
}

export function SimpleHighlight() {
  useEffect(() => {
    console.log('in browser');
  }, []);
  return (
    <button onClick={() => alert('sup')} className='w-full rounded-md bg-black p-2 text-white'>Highlight Something</button>
  );
}