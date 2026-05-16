function AlertBanner({ risk }) {
  if (risk !== "HIGH") return null;

  return (
    <div className="alert-banner">
      ⚠ HIGH RISK DETECTED – Immediate Action Required
    </div>
  );
}

export default AlertBanner;
