import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Offcanvas,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "../css/HelpPage.css"; // Import your CSS styles

export default function HelpCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Payments",
    description: "",
  });
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  // Load session user
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/session-user", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const go = (path) => {
    if (user) navigate(path);
    else navigate("/Auth");
  };

  // FAQ data
  const faqs = useMemo(
    () => [
      {
        key: "faq-apply",
        question: "How do I apply for a loan?",
        answer:
          "Go to Services → Apply Now. Choose the loan type (car/home/student), fill the details, then upload required documents. You’ll receive an Application ID on success.",
        action: () => go("/services"),
        chip: "Applications",
      },
      {
        key: "faq-docs",
        question: "Which documents are required?",
        answer:
          "Documents vary by loan type. Student: previous study certificate + college acceptance + government ID. Car: driving license + car model document + government ID. Home: property papers + permission letter + government ID.",
        action: () => go("/services"),
        chip: "Documents",
      },
      {
        key: "faq-status",
        question: "Where can I see my application status?",
        answer:
          "Open Services → Track Loan Status. You’ll see a table with your Application ID, loan type, amount, date, and current status.",
        action: () => go("/userapplications"),
        chip: "Status",
      },
      {
        key: "faq-payments",
        question: "How do I pay my installment?",
        answer:
          "Once your application is approved, go to Services → Payments. You’ll see your loan summary and due installment. Proceed to pay from there.",
        action: () => go("/Allapprovedapplications"),
        chip: "Payments",
      },
      {
        key: "faq-security",
        question: "Is my data secure?",
        answer:
          "Yes. We use authenticated sessions and server-side validation. Documents are stored securely and linked to your Application ID for verification.",
        chip: "Security",
      },
    ],
    [user]
  );

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.chip || "").toLowerCase().includes(q)
    );
  }, [faqs, search]);

  const submitTicket = (e) => {
    e.preventDefault();
    // Here you’d POST to your backend if/when you add a support endpoint.
    // For now, just show a toast.
    setShowTicket(false);
    setToast({ show: true, msg: "Thanks! Your request has been submitted." });
    setTicketForm({ subject: "", category: "Payments", description: "" });
  };

  return (
    <main className="help-wrap container py-5">
      <header className="help-hero card shadow-sm p-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="mb-2">Help Center</h1>
            <p className="text-muted mb-0">
              Find answers fast, or reach us for support. {user ? (
                <Badge bg="success" className="ms-2">Signed in</Badge>
              ) : (
                <Badge bg="secondary" className="ms-2">Guest</Badge>
              )}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => go("/services")}>
              Go to Services
            </Button>
            <Button variant="outline-primary" onClick={() => setShowTicket(true)}>
              Submit a Request
            </Button>
          </div>
        </div>

        <InputGroup className="mt-4">
          <InputGroup.Text>🔎</InputGroup.Text>
          <Form.Control
            placeholder="Search (e.g., payments, documents, apply, status)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="light" onClick={() => setShowQuickHelp(true)}>
            Quick Help
          </Button>
        </InputGroup>
      </header>

      {/* Quick Actions */}
      <section className="mb-4">
        <Row className="g-3">
          <Col md={3} sm={6}>
            <Card className="help-tile h-100" onClick={() => go("/services")} role="button">
              <Card.Body>
                <div className="tile-icon">📝</div>
                <Card.Title>Apply for a Loan</Card.Title>
                <Card.Text className="text-muted">
                  Start a new application and upload required documents.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="help-tile h-100" onClick={() => go("/userapplications")} role="button">
              <Card.Body>
                <div className="tile-icon">📄</div>
                <Card.Title>My Applications</Card.Title>
                <Card.Text className="text-muted">
                  View status and documents linked to your Application ID.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="help-tile h-100" onClick={() => go("/payments")} role="button">
              <Card.Body>
                <div className="tile-icon">💳</div>
                <Card.Title>Payments</Card.Title>
                <Card.Text className="text-muted">
                  See your loan summary and pay installments securely.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="help-tile h-100" onClick={() => go("/services")} role="button">
              <Card.Body>
                <div className="tile-icon">🧭</div>
                <Card.Title>All Services</Card.Title>
                <Card.Text className="text-muted">
                  Explore everything available after signing in.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Guided Section */}
      <section className="mb-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">New to Dhriti? Start here</h5>
            <Row className="g-3">
              <Col md={4}>
                <div className="guide-step">
                  <div className="step-num">1</div>
                  <div>
                    <h6>Create your account</h6>
                    <p className="text-muted mb-1">Sign up with your name, email, and phone.</p>
                    <Button size="sm" variant="outline-primary" onClick={() => go("/Auth")}>
                      Sign Up / Sign In
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="guide-step">
                  <div className="step-num">2</div>
                  <div>
                    <h6>Apply & upload documents</h6>
                    <p className="text-muted mb-1">Choose a loan type and attach the required files.</p>
                    <Button size="sm" variant="outline-primary" onClick={() => go("/services")}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="guide-step">
                  <div className="step-num">3</div>
                  <div>
                    <h6>Track & pay</h6>
                    <p className="text-muted mb-1">Watch your status and pay installments once approved.</p>
                    <Button size="sm" variant="outline-primary" onClick={() => go("/userapplications")}>
                      Track Application
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-5">
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="mb-0">Frequently Asked Questions</h5>
              <Badge bg="info">{filteredFaqs.length} results</Badge>
            </div>
            <Accordion alwaysOpen>
              {filteredFaqs.map((f, idx) => (
                <Accordion.Item eventKey={String(idx)} key={f.key}>
                  <Accordion.Header>
                    <span className="me-2">{f.question}</span>
                    {f.chip && <Badge bg="secondary">{f.chip}</Badge>}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-2">{f.answer}</p>
                    {f.action && (
                      <Button size="sm" variant="primary" onClick={f.action}>
                        Go
                      </Button>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </section>

      {/* Contact/Support */}
      <section className="mb-5">
        <Row className="g-3">
          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h5>Can’t find what you need?</h5>
                <p className="text-muted">
                  Submit a request and our team will get back to you.
                </p>
                <Button variant="outline-primary" onClick={() => setShowTicket(true)}>
                  Submit a Request
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h5>Tips</h5>
                <ul className="help-tips">
                  <li>Keep your Application ID handy for faster support.</li>
                  <li>Upload clear scans/photos (PDF/PNG/JPG).</li>
                  <li>For payments, ensure your application is approved first.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Ticket Modal */}
      <Modal show={showTicket} onHide={() => setShowTicket(false)} centered>
        <Form onSubmit={submitTicket}>
          <Modal.Header closeButton>
            <Modal.Title>Submit a Support Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                value={ticketForm.subject}
                onChange={(e) =>
                  setTicketForm((t) => ({ ...t, subject: e.target.value }))
                }
                placeholder="e.g., Payment failed but amount deducted"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={ticketForm.category}
                onChange={(e) =>
                  setTicketForm((t) => ({ ...t, category: e.target.value }))
                }
              >
                <option>Payments</option>
                <option>Applications</option>
                <option>Documents</option>
                <option>Profile</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm((t) => ({ ...t, description: e.target.value }))
                }
                placeholder="Tell us what happened…"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTicket(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quick Help Drawer */}
      <Offcanvas show={showQuickHelp} onHide={() => setShowQuickHelp(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Quick Help</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={() => go("/services")}>
              Start a New Application
            </Button>
            <Button variant="outline-primary" onClick={() => go("/userapplications")}>
              Check My Status
            </Button>
            <Button variant="outline-primary" onClick={() => go("/payments")}>
              Pay an Installment
            </Button>
            <Button variant="outline-secondary" onClick={() => go("/services")}>
              Open Services Hub
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          show={toast.show}
          delay={2500}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">{toast.msg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
}
