"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const CardsSection = ({ title, subtitle, cards, className = "cards-section" }) => {
  const cardsWrapperRef = useRef(null);
  const cardsInnerRef = useRef(null);

  useEffect(() => {
    let animationCleanup = null;
    
    const initAnimation = async () => {
      const { initApproachAnimation } = await import("../../utils/gsapManager");
      
      // Wait for DOM to be ready
      setTimeout(() => {
        animationCleanup = initApproachAnimation(cardsWrapperRef, cardsInnerRef);
      }, 300);
    };
    
    initAnimation();
    
    return () => {
      if (animationCleanup) {
        animationCleanup.cleanup();
      }
    };
  }, []);

  return (
    <section className={className}>
      <div className={`${className}__inner`}>
        {(title || subtitle) && (
          <div className={`${className}__title-wrapper`}>
            {title && <h2 className={`${className}__title`}>{title}</h2>}
            {subtitle && <p className={`${className}__subtitle`}>{subtitle}</p>}
          </div>
        )}
        <div className="cards-wrapper" ref={cardsWrapperRef}>
          <div className="bg-logo-wrapper">
            <div className="bg-logo">
              <Image
                src={"/bg-logo.png"}
                width={410}
                height={480}
                alt="bg-logo"
                className="bg-logo-image"
              />
            </div>
            <div className="bg-logo__blob-primary"></div>
            <div className="bg-logo__blob-black"></div>
          </div>
          <div className="cards-inner" ref={cardsInnerRef}>
            <div className="cards-left">
              {cards.left.map((card, index) => (
                <div key={index} className="card">
                  {card.icon && (
                    <svg
                      width="45"
                      height="47"
                      viewBox="0 0 45 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="card-svg"
                    >
                      <path
                        d="M43.125 23.2736L32.9062 35.7319L30 33.2594L38.2312 23.2736L30 13.2878L32.9062 10.8153L43.125 23.2736ZM15 13.2878L12.0938 10.8153L1.875 23.2736L12.0938 35.7319L15 33.2594L6.76875 23.2736L15 13.2878ZM15.8438 41.2903L19.4625 42.2869L29.1562 5.25692L25.5375 4.26025L15.8438 41.2903Z"
                        fill="#FF751B"
                      />
                    </svg>
                  )}
                  <h5 className="card-heading">{card.heading}</h5>
                  <p className="card-description">{card.description}</p>
                  {card.list && (
                    <ul className="card-list">
                      {card.list.map((item, idx) => (
                        <li key={idx} className="card-list-item">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="cards-right">
              {cards.right.map((card, index) => (
                <div key={index} className="card">
                  {card.icon && (
                    <svg
                      width="45"
                      height="47"
                      viewBox="0 0 45 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="card-svg"
                    >
                      <path
                        d="M43.125 23.2736L32.9062 35.7319L30 33.2594L38.2312 23.2736L30 13.2878L32.9062 10.8153L43.125 23.2736ZM15 13.2878L12.0938 10.8153L1.875 23.2736L12.0938 35.7319L15 33.2594L6.76875 23.2736L15 13.2878ZM15.8438 41.2903L19.4625 42.2869L29.1562 5.25692L25.5375 4.26025L15.8438 41.2903Z"
                        fill="#FF751B"
                      />
                    </svg>
                  )}
                  <h5 className="card-heading">{card.heading}</h5>
                  <p className="card-description">{card.description}</p>
                  {card.list && (
                    <ul className="card-list">
                      {card.list.map((item, idx) => (
                        <li key={idx} className="card-list-item">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSection;