export function SuccessCard() {
  return (
    <div className="card">
      <div className="icon-circle success-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 className="card-title">Application Submitted!</h2>
      <p className="card-description">
        Thank you for your interest in partnering with us. We'll review your application and get back to you within 3-5 business days.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="btn-primary"
      >
        Go Home
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </div>
  );
}
