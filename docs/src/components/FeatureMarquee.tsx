import React from "react";
import Marquee from "react-fast-marquee";

const featureList = [
  "Supports all Major Browsers",
  "Works on Mobile Devices",
  "Highly Customizable",
  "Light-weight",
  "No dependencies",
  "Feature Rich",
  "MIT Licensed",
  "Written in TypeScript",
  "Vanilla JavaScript",
  "Easy to use",
  "Accessible",
  "Frameworks Ready",
];

export function FeatureMarquee() {
  return (
    <Marquee autoFill>
      <p className="py-4 text-2xl whitespace-nowrap">
        { featureList.map((featureItem, index) => (
          <React.Fragment key={index}>
            { featureItem }<span className="mx-3">&middot;</span>
          </React.Fragment>
        ))}
      </p>
    </Marquee>
  );
}
