import React from "react";
import Marquee from "react-fast-marquee";

const featureList = [
  "Open Source",
  "Written in TypeScript",
  "No dependencies",
  "Vanilla JavaScript",
  "Light-weight",
  "Feature Rich",
  "Highly Customizable",
  "Easy to use",
  "Accessible",
  "Frameworks Ready",
  "MIT Licensed",
];

export function FeatureMarquee() {
  return (
    <Marquee autoFill>
      <p className="py-4 text-2xl whitespace-nowrap">
        { featureList.map((featureItem, index) => (
          <React.Fragment key={index}>
            { featureItem } <span className="mx-3">&middot;</span>
          </React.Fragment>
        ))}
      </p>
    </Marquee>
  );
}
