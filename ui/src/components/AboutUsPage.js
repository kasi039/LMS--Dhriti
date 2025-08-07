import React from "react";
import "../css/AboutUsPage.css";

import { Row, Col, Card, Button } from "react-bootstrap";

/* ─── HERO-card icons ─── */
import { ReactComponent as DownloadIcon } from "../assets/download-icon.svg";
import { ReactComponent as SmileIcon    } from "../assets/smile-icon.svg";
import { ReactComponent as DollarIcon   } from "../assets/dollar-icon.svg";
import { ReactComponent as RatingIcon   } from "../assets/googleplay-icon.svg";

/* ─── “Why Us?” icons ─── */
import { ReactComponent as OnlineIcon     } from "../assets/online-icon.svg";
import { ReactComponent as ApprovalIcon   } from "../assets/approvalemail-icon.svg";
import { ReactComponent as BankIcon       } from "../assets/bank1-icon.svg";
import { ReactComponent as TenureIcon     } from "../assets/tenure-icon.svg";
import { ReactComponent as BorrowIcon     } from "../assets/borrow-icon.svg";
import { ReactComponent as TrustedIcon    } from "../assets/trusted-icon.svg";
import { ReactComponent as CollateralIcon } from "../assets/collateral-icon.svg";
import { ReactComponent as AiIcon         } from "../assets/ai-icon.svg";

export default function AboutUsPage() {
  /* ───────── stats for hero card ───────── */
  const stats = [
    { value: "3 M+",    label: "App Downloads",    Icon: DownloadIcon, colorClass: "stat-blue" },
    { value: "200 K+",  label: "Happy Users",      Icon: SmileIcon,    colorClass: "stat-blue" },
    { value: "100 M+",  label: "Loan Distributed", Icon: DollarIcon,   colorClass: "stat-blue" },
    { value: "★★★★★",   label: "Rating on Google Play", Icon: RatingIcon, colorClass: "stat-blue" },
  ];

  /* ───────── timeline data ───────── */
  const journey = [
    { year: 2016, text: "Dhriti was established and disbursing loans" },
    { year: 2018, text: "Secure NBFC License" },
    { year: 2020, text: "Crossed $40 million annual disbursement" },
    { year: 2021, text: "3 M+ App installation" },
    { year: 2023, text: "500 K+ Registered customers" },
  ];

  /* ───────── why-us grid data ───────── */
  const why = [
    { text: "100% online process",       Icon: OnlineIcon     },
    { text: "Approval in 10 minutes",    Icon: ApprovalIcon   },
    { text: "Direct bank transfer",      Icon: BankIcon       },
    { text: "Flexible tenure",           Icon: TenureIcon     },
    { text: "Borrow as you need",        Icon: BorrowIcon     },
    { text: "Trusted by 200 K+ Users",   Icon: TrustedIcon    },
    { text: "Collateral-free loans",     Icon: CollateralIcon },
    { text: "AI-based user empowerment", Icon: AiIcon         },
  ];

  return (
    <div className="about-wrapper">

      {/* ─── HERO CARD ─── */}
      <section className="hero-card container">
        <Row>
          <Col md={8}>
            <h4>About Us</h4>
            <p>
              Welcome to Dhriti — the financial-empowerment FinTech company for today’s
              youth! As an RBI-registered NBFC, we offer instant loans to college
              students, salaried and self-employed up to $1 000. More than a lending
              platform, we are an ecosystem that also solves youth needs for insurance,
              jobs and upskilling.
            </p>
            <Button class="apply_btn" size="sm">Apply for Loan</Button>
          </Col>

          <Col md={4} className="stats-col">
            {stats.map(({ Icon, value, label, colorClass }) => (
              <Card className="stat-card" key={label}>
                <Card.Body className="text-center">
                  <Icon className="stat-icon" />
                  <div className={`stat-value ${colorClass}`}>{value}</div>
                  <div className="stat-label">{label}</div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </section>

      {/* ─── JOURNEY TIMELINE ─── */}
      <section className="journey container">
        <h4>Journey so far</h4>

        <div className="timeline">
          {journey.map((j) => (
            <div className="timeline-item" key={j.year}>
              <div className="pill-year">{j.year}</div>
              <div className="dot" />
             <p>{j.text}</p>
           </div>
          ))}
        <div className="tail-dot" />
        </div>
      </section>

      {/* ─── WHY-US GRID ─── */}
      <section className="why-us container">
        <h4>Why Us?</h4>
        <Row xs={1} md={4} className="g-4">
          {why.map(({ text, Icon }) => (
            <Col key={text}>
              <Card className="why-card text-center">
                <Card.Body>
                  <div className="why-icon-wrap">
                    <Icon className="why-icon" />
                  </div>
                  <div>{text}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}
