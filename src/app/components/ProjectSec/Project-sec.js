"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const ProjectSec = () => {
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
    <section className="projects-sec">
      <div className="project-sec__inner">
        <div className="project-sec__title-wrapper">
          <h2 className="project-sec__title">RECENT PROJECTS</h2>
          <p className="project-sec__subtitle">
            See how I turned underperforming, bloated sites into sleek, high-performing powerhouses.
          </p>
        </div>
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
              <div className="card">
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
                <h5 className="card-heading">
                  Maintainable Code That Saves You Money
                </h5>
                <p className="card-description">
                  I follow BEM and ACSS principles like a religion. Why?
                  Because structured, modular code saves you time and money in
                  the long run. You get:
                </p>
                <ul className="card-list">
                  <li className="card-list-item">Faster updates.</li>
                  <li className="card-list-item">Lower long-term costs.</li>
                  <li className="card-list-item">
                    A rock-solid foundation for adding new features without
                    tearing your hair out.
                  </li>
                </ul>
              </div>   
              <div className="card">
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
                <h5 className="card-heading">
                  Performance That Leaves Competitors in the Dust
                </h5>
                <p className="card-description">
                  Slow websites kill conversions. I don&apos;t let that happen.
                  Using tools like LiteSpeed and WP Rocket, I ensure your site
                  loads in under 2 seconds—even with complex functionality.
                </p>
              </div>
              <div className="card">
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
                <h5 className="card-heading">
                  Custom, Dynamic Solutions Beyond Drag-and-Drop
                </h5>
                <p className="card-description">
                  Why rely on plugins when you can have tailored solutions? I
                  use Advanced Custom Fields (ACF), Metabox, and WPCodebox to
                  build exactly what you need. And when it comes to advanced
                  forms? WS Form handles even the most complex logic with
                  ease.
                </p>
              </div>
            </div>
            <div className="cards-right">
              <div className="card">
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
                <h5 className="card-heading">
                  Scalable Designs That Grow With You
                </h5>
                <p className="card-description">
                  With deep expertise in query loops, dynamic content, and
                  custom frameworks, I build sites designed to scale without
                  breaking. Whether you&apos;re adding features or handling traffic
                  spikes, you&apos;re covered.
                </p>
              </div>    
              <div className="card">
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
                <h5 className="card-heading">
                  Accessibility & Semantic HTML That Matters
                </h5>
                <p className="card-description">
                  Compliance isn&apos;t optional
                  <br /> - it&apos;s essential. I deliver fully accessible websites
                  with proper semantic elements, ARIA roles, and
                  WCAG-compliant designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSec;