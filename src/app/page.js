"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BtnWhite from "./components/Button/BtnWhite";
import AnimatedBlock from "./components/AnimatedBlock/AnimatedBlock";
import BlurredEllipse from "./components/BlurredEllipse/BlurredEllipse";
import BlobComposition from "./components/BlobComposition/BlobComposition";
import TextHighlightScroll from "./components/TextHighlight/TextHighlightScroll";
import ApproachSection from "./components/ApproachSection/ApproachSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  // State for testimonials slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Refs for benefits section animation
  const benefitsSectionRef = useRef(null);
  const benefitsContentWrapperRef = useRef(null);

  // Project cards data
  const projectCards = {
    left: [
      {
        icon: true,
        heading: "E-commerce Platform Redesign",
        description:
          "Transformed a slow, outdated online store into a lightning-fast, conversion-optimized platform using modern frameworks and performance techniques.",
        list: [
          "40% faster load times",
          "25% increase in conversions",
          "Mobile-first responsive design",
        ],
      },
      {
        icon: true,
        heading: "Corporate Website Overhaul",
        description:
          "Rebuilt a bloated corporate site with clean, maintainable code and modern design principles.",
      },
      {
        icon: true,
        heading: "SaaS Dashboard Development",
        description:
          "Created a complex, data-heavy dashboard with smooth animations and real-time updates using React and custom APIs.",
      },
    ],
    right: [
      {
        icon: true,
        heading: "Multi-language Travel Site",
        description:
          "Built a scalable travel booking platform with multi-language support, dynamic pricing, and seamless user experience.",
      },
      {
        icon: true,
        heading: "Healthcare Portal",
        description:
          "Developed a HIPAA-compliant patient portal with secure authentication, appointment booking, and medical records management.",
      },
    ],
  };

  const cardsWrapperRef = useRef(null);
  const cards2WrapperRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const cardsWrapper = cardsWrapperRef.current;
      const cards2Wrapper = cards2WrapperRef.current;
      if (!cardsWrapper || !cards2Wrapper) return;

      const cardsHeight = cardsWrapper.offsetHeight;
      const wrapperHeight = cards2Wrapper.offsetHeight;

      // Pin cards2-wrapper, translate cards-wrapper, then unpin before next section
      gsap
        .timeline({
          scrollTrigger: {
            trigger: cards2Wrapper,
            start: "top top",
            end: `+=${cardsHeight}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            pinSpacing: true,
          },
        })
        .to(cardsWrapper, {
          y: -cardsHeight + wrapperHeight,
          ease: "none",
        });
    });

    return () => ctx.revert();
  }, []);

  // Benefits section scroll animation
  useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  let ctx = gsap.context(() => {
    const benefitsSection = benefitsSectionRef.current;
    const benefitsContentWrapper = benefitsContentWrapperRef.current;
    const mockupWrapper = benefitsSection?.querySelector('.iphone-mockup-wrapper');
    
    if (!benefitsSection || !benefitsContentWrapper || !mockupWrapper) return;

    // Create the scroll trigger animation
    gsap.timeline({
      scrollTrigger: {
        trigger: benefitsSection,
        start: "bottom bottom",
        end: "+=1500vh", // Extended for longer scroll duration
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        pinSpacing: true,
        onUpdate: (self) => {
          if (self.isActive) {
            benefitsSection.classList.add("pinning-active");
          } else {
            benefitsSection.classList.remove("pinning-active");
          }
        }
      }
    })
    // Phase 1: Content wrapper initial movement
    .to(benefitsContentWrapper, {
      y: "40%",
      ease: "none",
      duration: 2
    })
    // Phase 2.1: First expand height and width with immediate border radius change
    .to(mockupWrapper, {
      width: "30vw",
      height: "100vh",
      borderRadius: 0,
      duration: 34,
      ease: "power2.out"
    })
    // Heading stage 1: 30px + opacity 0.3 when mockup reaches 30vw
    .to(benefitsContentWrapper.querySelector('.benefits__content-wrapper-title'), {
      opacity: 0.3,
      y: 0,
      fontSize: "30px",
      duration: 34,
      ease: "power2.out"
    }, "<")
    // Phase 2.2: Width expansion to 60vw
    .to(mockupWrapper, {
      width: "60vw",
      duration: 12,
      ease: "power2.out"
    })
    // Heading stage 2: 40px + opacity 0.7 when mockup reaches 60vw
    .to(benefitsContentWrapper.querySelector('.benefits__content-wrapper-title'), {
      fontSize: "40px",
      opacity: 0.7,
      duration: 12,
      ease: "power2.out"
    }, "<")
    .to(benefitsContentWrapper, {
      y: "0%",
      duration: 8,
      ease: "power2.out"
    }, "<0.5")
    // Smooth border-radius transition for content wrapper after reaching final position
    .to(benefitsContentWrapper, {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      duration: 1,
      ease: "power2.out"
    }, ">") // Start 0.5 into the previous animation
    // Phase 3: iPhone mockup full width expansion
    .to(mockupWrapper, {
      width: "100vw",
      duration: 40,
      ease: "power2.out"
    })
    // Heading stage 3: 100px + opacity 1 when mockup reaches 100vw
    .to(benefitsContentWrapper.querySelector('.benefits__content-wrapper-title'), {
      fontSize: "100px",
      opacity: 1,
      duration: 40,
      ease: "power2.out"
    }, "<")
    // Scale the mock-up-img to 1.5x on X-axis after reaching 100vw
    .to(mockupWrapper.querySelector('.mock-up-img'), {
      scaleX: 1.5,
      duration: 5,
      ease: "power2.out"
    });
  });

  return () => ctx.revert();
}, []);

  useEffect(() => {
    const initializeGSAP = async () => {
      const { initGSAP, refreshScrollTriggers } = await import(
        "./utils/gsapManager"
      );

      // Initialize GSAP once for the entire app
      await initGSAP();

      // Handle window resize
      const handleResize = () => {
        refreshScrollTriggers();
      };

      window.addEventListener("resize", handleResize);

      // Initial refresh
      setTimeout(() => {
        refreshScrollTriggers();
      }, 100);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanup = initializeGSAP();

    return () => {
      if (cleanup) cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, []);

  // Example testimonials data
  const originalTestimonials = [
    {
      name: "John Doe",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it",
      image: "/person1.jpg"
    },
    {
      name: "Jane Smith",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it",
      image: "/person2.jpg"
    },
    {
      name: "Mike Lee",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it",
      image: "/person3.jpg"
    },
    {
      name: "Sarah Johnson",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it",
      image: "/person4.jpg"
    },
    {
      name: "David Wilson",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it",
      image: "/person5.jpg"
    },
  ];

  // Create duplicated testimonials for seamless infinite loop
  const testimonials = [
    ...originalTestimonials,
    ...originalTestimonials,
    ...originalTestimonials
  ];

  return (
    <>
      <main>
        <section className="intro">
          <div className="bg-blocks-wrapper">
            <div className="bg-blocks-wrapper-inner">
              {/* Blurred ellipse background */}
              <BlurredEllipse
                top="-12%"
                left="-5%"
                width="1000px"
                height="300px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />
              <BlurredEllipse
                top="48%"
                left="-10%"
                width="1100px"
                height="400px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />
              <BlurredEllipse
                top="-3%"
                right="-7%"
                width="50%"
                height="500px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />
              <BlurredEllipse
                top="55%"
                right="-10%"
                width="1100px"
                height="400px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />

              {/* <BlurredEllipse
             top="0%"
              right="0%"
              width="50%"
              height="400px"
              background="#fffff"
              blur="100px"
              zIndex={999999}
            /> */}

              {/* Top-left animated block */}
              <AnimatedBlock
                top="0%"
                left="0%"
                width="50%"
                height="60%"
                blockSize={70}
                color="#ff751b"
                opacity={1}
                zIndex={1}
                borderColor="#ff751b"
              />

              {/* Top-right animated block (slightly down) */}
              <AnimatedBlock
                top="15%"
                right="-3%"
                width="55%"
                height="55%"
                blockSize={74}
                color="#ff751b"
                borderColor="#ff751b"
                opacity={1}
              />
            </div>
          </div>
          <BlobComposition />
          <div className="intro__inner">
            <div className="intro__title-wrapper">
              <h1 className="intro__title">
                Websites That
                <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  delay={0}
                  width="110%"
                >
                  Work
                </TextHighlightScroll>
                <span className="comma">,</span>{" "}
                <span className="black-bold">Scale,</span>
                and
                <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  delay={0.3}
                  width="109%"
                >
                  Impress
                </TextHighlightScroll>
              </h1>
            </div>
            <div className="intro__content-grid">
              <div className="intro__content-wrapper">
                <div className="intro__content">
                  <div className="intro__content-heading-wrapper">
                    <h3 className="intro__content-heading">
                      I&apos;m <span className="bold">Hazim ZamaN</span>
                    </h3>
                  </div>
                  <div className="intro__content-description-wrapper">
                    <p className="intro__content-description">
                      I don&apos;t just build websites—I fix, optimize, and deliver
                      scalable sites using Bricks Builder, ACSS, and custom
                      frameworks that keep your clients happy and your agency
                      ahead.
                    </p>
                    <p className="intro__content-description">
                      No bloated code. No plugin overload. Just lean, mean,
                      fast, future-proof websites built for growth. Whether
                      you&apos;re a Bricks agency owner tired of patching broken
                      builds or a business leader who wants a future-proof
                      solution, I deliver.
                    </p>
                  </div>
                </div>
                <BtnWhite text="Outsource Development Now" />
              </div>
              <div className="intro__image-wrapper">
                <figure className="intro__image">
                  <Image width={710} height={667} src={"/men.png"} alt="img" />
                </figure>
                <div className="btn--tools-wrapper">
                  <button className="btn--tools">
                    <div className="btn--tools-bullet"></div>
                    Bricks Builder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pro-solutions">
          <div className="bg-blocks-wrapper">
            <div className="bg-blocks-wrapper-inner">
              {/* Blurred linear gradient background */}
              <BlurredEllipse
                top="-10%"
                right="-10%"
                width="500px"
                height="1000px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />

              <BlurredEllipse
                top="-15%"
                right="-5%"
                width="1200px"
                height="500px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />
              <BlurredEllipse
                top="30%"
                right="-5%"
                width="800px"
                height="500px"
                background="#000000"
                blur="100px"
                zIndex={999999}
              />

              {/* Top-left animated block */}
              <AnimatedBlock
                top="0%"
                right="-1%"
                width="40%"
                height="40%"
                blockSize={74}
                color="#ff751b"
                borderColor="#ff751b"
                opacity={0.7}
                zIndex={1}
              />
            </div>
          </div>
          <div className="pro-solutions__media-wrapper">
            <div className="pro-solution__media">
              <Image
                className="pro-solution__media-image"
                width={1192}
                height={950}
                src={"/laptop.png"}
                alt="laptop-image"
              />
              <div className="left-gradient"></div>
              <div className="right-gradient"></div>
              <div className="top-gradient"></div>
              <div className="bottom-gradient"></div>
            </div>
          </div>
          <div className="pro-solutions__inner">
            <div className="pro-solutions__title-wrapper">
              <h2 className="pro-solutions__title">
                Why {""}
                <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  width="106%"
                  delay={0}
                >
                  Most Websites
                </TextHighlightScroll>
                {""} Fail (And How{" "}
                <span className="black-bold">I Make Sure</span>
                <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  delay={0.3}
                  width="111%"
                >
                  Yours Won&apos;t
                </TextHighlightScroll>
                )
              </h2>
            </div>
            <div className="pro-solution__content-wrapper">
              <div className="pro-solution__content">
                <h4 className="pro-solution__content-heading">
                  Let&apos;s be blunt—too many chumps churn out bloated websites
                  with:
                </h4>
                <ul className="pro-solution__problems-list">
                  <li className="pro-solution__item">
                    <div className="pro-solution__item-icon-wrapper">
                      <Image
                        width={24}
                        height={24}
                        src={"/tick.svg"}
                        className="pro-solution__item-icon"
                        alt="tick-image"
                      />
                    </div>
                    <div className="pro-solution__item-content">
                      <h5 className="pro-solution__item-heading">
                        Bloated Code:{" "}
                      </h5>
                      <p className="pro-solution__item-description">
                        Too many unnecessary classes and scripts. Slows
                        everything down.
                      </p>
                    </div>
                  </li>
                  <li className="pro-solution__item">
                    <div className="pro-solution__item-icon-wrapper">
                      <Image
                        width={24}
                        height={24}
                        src={"/tick.svg"}
                        className="pro-solution__item-icon"
                        alt="tick-image"
                      />
                    </div>
                    <div className="pro-solution__item-content">
                      <h5 className="pro-solution__item-heading">
                        Bloated Code:{" "}
                      </h5>
                      <p className="pro-solution__item-description">
                        Too many unnecessary classes and scripts. Slows
                        everything down.
                      </p>
                    </div>
                  </li>
                  <li className="pro-solution__item">
                    <div className="pro-solution__item-icon-wrapper">
                      <Image
                        width={24}
                        height={24}
                        src={"/tick.svg"}
                        className="pro-solution__item-icon"
                        alt="tick-image"
                      />
                    </div>
                    <div className="pro-solution__item-content">
                      <h5 className="pro-solution__item-heading">
                        Bloated Code:{" "}
                      </h5>
                      <p className="pro-solution__item-description">
                        Too many unnecessary classes and scripts. Slows
                        everything down.
                      </p>
                    </div>
                  </li>
                  <li className="pro-solution__item">
                    <div className="pro-solution__item-icon-wrapper">
                      <Image
                        width={24}
                        height={24}
                        src={"/tick.svg"}
                        className="pro-solution__item-icon"
                        alt="tick-image"
                      />
                    </div>
                    <div className="pro-solution__item-content">
                      <h5 className="pro-solution__item-heading">
                        Bloated Code:{" "}
                      </h5>
                      <p className="pro-solution__item-description">
                        Too many unnecessary classes and scripts. Slows
                        everything down.
                      </p>
                    </div>
                  </li>
                  <li className="pro-solution__item">
                    <div className="pro-solution__item-icon-wrapper">
                      <Image
                        width={24}
                        height={24}
                        src={"/tick.svg"}
                        className="pro-solution__item-icon"
                        alt="tick-image"
                      />
                    </div>
                    <div className="pro-solution__item-content">
                      <h5 className="pro-solution__item-heading">
                        Bloated Code:{" "}
                      </h5>
                      <p className="pro-solution__item-description">
                        Too many unnecessary classes and scripts. Slows
                        everything down.
                      </p>
                    </div>
                  </li>
                </ul>
                <p>
                  I don&apos;t cut corners. I solve these problems head-on with
                  clean, maintainable code and a performance-first approach.
                </p>
              </div>
              <button className="btn-primary">Get Scalable Sites</button>
            </div>
          </div>
        </section>
        <ApproachSection />
        <div style={{ height: "100vh" }}></div>
        <section className="benefits" ref={benefitsSectionRef}>
          <div className="benefits__inner">
            <div className="iphone-mockup-wrapper">
              {/* <video
                autoPlay
                muted
                loop
                playsInline
                className="iphone-mockup-video"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              >
                <source src="/mobile.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
              <div className="benefits__content-wrapper" ref={benefitsContentWrapperRef}>
                <div className="benefits__content-wrapper-inner">
                <h2 className="benefits__content-wrapper-title">What <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  delay={0}
                  width="102%"
                >
                  YOU GET 
                </TextHighlightScroll> WHEN  <span className="black-bold">YOU WORK</span>  <TextHighlightScroll
                  color="orange"
                  opacity={0.3}
                  delay={0}
                  width="102%"
                >
                  with me 
                </TextHighlightScroll></h2>
                <div className="benefits__content-wrapper-description">
              
                </div>
                </div>
              </div>
              
             
            <img
              src={"/iphone-mockup.png"}
              alt="iphone-mockup-image"
              className="mock-up-img"
            />
            </div>
          </div>
        </section>
        <section className="tech-stack">
          <div className="tech-stack__inner">
            <div className="tect-stack__content-wrapper">
              <div className="tech-stack__content">
                <h2 className="tech-stack__title">
                  My Tech Stack (Built to Perform)
                </h2>
                <p className="tech-stack__description">
                  This isn’t just a list of fancy tools. This is the arsenal I
                  use to build websites that dominate:
                </p>
                <div className="tech-stack__tags-wrapper">
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">Bricks Builder</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">LiteSpeed / WP Rocket</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">WS Form</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">WPCodebox</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">WP Grid Builder</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">Templates: Brixies, Frames</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">
                      Advanced Custom Fields (ACF) / Metabox
                    </span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">MotionPage</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">Bricks Extras / Brickforge</span>
                  </div>
                  <div className="tag">
                    <div className="tag-dot"></div>
                    <span className="tag-text">ACSS</span>
                  </div>
                </div>
                <p className="tech-stack__description">
                  These tools, combined with my expertise, ensure every website
                  I deliver is fast, scalable, and maintainable.
                </p>
                <button className="btn-primary"> Get Scalable Sites</button>
              </div>
            </div>
            <div className="bg-media-wrapper">
              <Image
                src={"/bg-laptop.png"}
                width={1833}
                height={1204}
                alt="bg-laptop"
              />
            </div>
          </div>
        </section>
        <section className="projects-sec">
          <div className="project-sec__inner">
            <div className="project-sec__title-wrapper">
              <h2 className="project-sec__title">RECENT PROJECTS</h2>
              <p className="project-sec__subtitle">
                See how I turned underperforming, bloated sites into sleek,
                high-performing powerhouses.
              </p>
            </div>
            <div className="cards2-wrapper" ref={cards2WrapperRef}>
              <div className="cards2-inner">
                <div
                  className="project-sec__cards-wrapper"
                  ref={cardsWrapperRef}
                >
                  <div className="card2">
                    <div className="card2__image-wrapper"></div>
                    <div className="card2__content">
                      <h5 className="card2__title">
                        Lorem Ipsum is simply dummy text
                      </h5>
                      <p className="card2__description">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s
                      </p>
                      <div className="card2__tags-wrapper">
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card2">
                    <div className="card2__image-wrapper"></div>
                    <div className="card2__content">
                      <h5 className="card2__title">
                        Lorem Ipsum is simply dummy text
                      </h5>
                      <p className="card2__description">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s
                      </p>
                      <div className="card2__tags-wrapper">
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card2">
                    <div className="card2__image-wrapper"></div>
                    <div className="card2__content">
                      <h5 className="card2__title">
                        Lorem Ipsum is simply dummy text
                      </h5>
                      <p className="card2__description">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s
                      </p>
                      <div className="card2__tags-wrapper">
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card2">
                    <div className="card2__image-wrapper"></div>
                    <div className="card2__content">
                      <h5 className="card2__title">
                        Lorem Ipsum is simply dummy text
                      </h5>
                      <p className="card2__description">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s
                      </p>
                      <div className="card2__tags-wrapper">
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card2">
                    <div className="card2__image-wrapper"></div>
                    <div className="card2__content">
                      <h5 className="card2__title">
                        Lorem Ipsum is simply dummy text
                      </h5>
                      <p className="card2__description">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s
                      </p>
                      <div className="card2__tags-wrapper">
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                        <div className="card2__tag">
                          <div className="card2__tag-dot"></div>
                          <span className="card2__tag-text">Lorem ipsum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BtnWhite text="Outsource Development Now" />
          </div>
        </section>
        <section className="testimonials">
          <div className="testimonials__inner">
            <div className="testimonials__title-wrapper">
              <h2 className="testimonials__title">What My Clients Say</h2>
              <p className="testimonials__subtitle">
                Real testimonials from Bricks agency owners and businesses who
                now sleep better at night.
              </p>
            </div>
          
            <div className="testimonials__slider-wrapper">
            <div className="testimonials__navigation">
              {originalTestimonials.map((testimonial, idx) => (
                <button
                  key={idx}
                  className={`testimonials__nav-tab ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(idx);
                    // Go to the middle set of slides (5-9) to ensure smooth infinite loop
                    sliderRef.current?.slickGoTo(idx + 5, true);
                  }}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="testimonials__nav-image"
                  />
                </button>
              ))}
            </div>
              <Slider
                ref={sliderRef}
                dots={false}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={false}
                autoplaySpeed={3500}
                arrows={false}
                pauseOnHover={false}
                pauseOnFocus={false}
                initialSlide={5}
                beforeChange={(oldIndex, newIndex) => {
                  // Handle infinite loop for custom navigation
                  const originalLength = originalTestimonials.length;
                  const normalizedIndex = newIndex % originalLength;
                  setCurrentSlide(normalizedIndex);
                }}
                afterChange={(currentIndex) => {
                  // Reset to middle set when reaching edges for seamless loop
                  const originalLength = originalTestimonials.length;
                  if (currentIndex < originalLength) {
                    // If we're in the first set, jump to middle set
                    setTimeout(() => {
                      sliderRef.current?.slickGoTo(currentIndex + originalLength, false);
                    }, 500);
                  } else if (currentIndex >= originalLength * 2) {
                    // If we're in the third set, jump to middle set
                    setTimeout(() => {
                      sliderRef.current?.slickGoTo(currentIndex - originalLength, false);
                    }, 500);
                  }
                }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="testimonials__slider-slide">
                    <div className="review-wrapper">
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                    <div className="info-wrapper">
                      <span className="testimonial-name name">{testimonial.name}</span>
                      <div className="stars">★★★★★</div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>
        <section className="community-solutions">
          <div className="community-solutions__inner">
            <div className="community-solutions__content">
              <h2 className="community-solutions__title">
                Community Solutions
              </h2>
              <p className="community-solutions__description">
                I don’t just build websites—I actively contribute to the Bricks
                and developer community. From custom scripts to performance
                hacks, I’ve shared solutions that help others build better
                websites.
              </p>
              <button className="btn-primary">Get Scalable Sites</button>
            </div>
            <div className="community-solutions__media">
              <Image
                src={"/community-solutions.svg"}
                alt="community-solutions"
                width={678}
                height={678}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
