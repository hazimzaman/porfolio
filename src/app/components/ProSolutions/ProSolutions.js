"use client";

import TextHighlightScroll from "../TextHighlight/TextHighlightScroll";

const ProSolutions = () => {
  return (
    <section className="pro-solutions">
      <div className="pro-solutions__inner">
        <div className="pro-solutions__header">
          <h2 className="pro-solutions__title">
            <TextHighlightScroll color="orange" delay={0} width="108%">
              Most Websites
            </TextHighlightScroll>{" "}
            Like{" "}
            <TextHighlightScroll color="blue" delay={0.3} width="106%">
              Yours Won&apos;t
            </TextHighlightScroll>
          </h2>
          <p className="pro-solutions__subtitle">
            Professional solutions that make the difference
          </p>
        </div>

        {/* Add your pro-solutions content here */}
        <div className="pro-solutions__content">
          {/* Your solutions grid, cards, etc. */}
        </div>
      </div>
    </section>
  );
};

export default ProSolutions;
